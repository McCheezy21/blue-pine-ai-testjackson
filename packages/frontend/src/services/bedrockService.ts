import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

// Configure your AWS region and Cognito Identity Pool
const AWS_REGION = 'us-east-1'; // Updated to match your Identity Pool region
const COGNITO_IDENTITY_POOL_ID = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || 'your-identity-pool-id';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export class BedrockChatService {
  private client: BedrockRuntimeClient | null = null;
  private isConfigured = false;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      if (COGNITO_IDENTITY_POOL_ID === 'your-identity-pool-id') {
        console.warn('AWS Bedrock not configured. Please set up Cognito Identity Pool ID.');
        return;
      }

      console.log('Initializing Bedrock client with Cognito Identity Pool ID:', COGNITO_IDENTITY_POOL_ID);

      this.client = new BedrockRuntimeClient({
        region: AWS_REGION,
        credentials: fromCognitoIdentityPool({
          client: new CognitoIdentityClient({ region: AWS_REGION }),
          identityPoolId: COGNITO_IDENTITY_POOL_ID,
          logins: this.getCognitoLogins(),
        }),
      });
      
      this.isConfigured = true;
      console.log('AWS Bedrock client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Bedrock client:', error);
      this.isConfigured = false;
    }
  }

  private getCognitoLogins() {
    const idToken = localStorage.getItem('idToken');
    if (idToken) {
      // Replace with your Cognito User Pool provider name
      return {
        'cognito-idp.us-west-1.amazonaws.com/us-west-1_p6qGk8fQ3': idToken
      };
    }
    return undefined;
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // If Bedrock is not configured, return a helpful mock response
    if (!this.isConfigured || !this.client) {
      return this.getMockResponse(message);
    }

    try {
      // Format messages exactly like the playground
      const messages = [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: message
            }
          ]
        }
      ];

      const modelId = 'anthropic.claude-3-7-sonnet-20250219-v1:0';
      
      // Use exact format from AWS playground
      const requestBody = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.999,
        messages: messages,
        system: 'You are a helpful AI assistant for Blue Pine AI, a company that provides AI-powered revenue cycle automation for skilled nursing facilities. Answer questions about our services, pricing, and healthcare AI automation.'
      };

      console.log('Sending request to Bedrock:', { modelId, requestBody });

      const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(requestBody),
      });

      const response = await this.client.send(command);
      
      if (!response.body) {
        throw new Error('No response body from Bedrock');
      }
      
      const responseText = new TextDecoder().decode(response.body);
      console.log('Bedrock response:', responseText);
      
      const responseBody = JSON.parse(responseText);
      
      if (!responseBody.content || !responseBody.content[0] || !responseBody.content[0].text) {
        throw new Error('Invalid response format from Bedrock');
      }
      
      return responseBody.content[0].text;
    } catch (error) {
      console.error('Detailed Bedrock error:', error);
      
      // Return specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('AccessDenied') || error.message.includes('UnauthorizedOperation')) {
          return "I'm having authentication issues with AWS. The permissions might need a few more minutes to propagate, or there's an IAM configuration issue.";
        }
        if (error.message.includes('ValidationException')) {
          return "There's an issue with the API request format. Let me know if this persists.";
        }
        if (error.message.includes('ModelNotFound')) {
          return "The AI model isn't available right now. This might be a temporary AWS issue.";
        }
        
        // Return the actual error message for debugging
        return `Debug: ${error.message}`;
      }
      
      return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.';
    }
  }

  private getMockResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Provide helpful responses about Blue Pine AI based on common questions
    if (lowerMessage.includes('blue pine') || lowerMessage.includes('bluepine')) {
      return "Blue Pine AI provides AI-powered revenue cycle automation specifically for skilled nursing facilities. We help automate claims processing, reduce denials, recover underpayments, and streamline your entire revenue cycle. Would you like to know more about any specific service?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return "Our pricing varies based on your facility size and needs. We offer transparent pricing with no hidden fees, and most clients see ROI within 60-90 days. The service often pays for itself through recovered revenue. Would you like to schedule a consultation to discuss pricing for your specific situation?";
    }
    
    if (lowerMessage.includes('demo') || lowerMessage.includes('trial')) {
      return "We'd be happy to show you how our AI automation works! You can join our waitlist to get early access, or we can schedule a personalized demo. Our team will show you exactly how we can help your facility reduce denials and increase revenue.";
    }
    
    if (lowerMessage.includes('how') && (lowerMessage.includes('work') || lowerMessage.includes('does'))) {
      return "Our AI agents work by automating the most time-consuming parts of revenue cycle management:\n\n• Medical coding with 99% accuracy\n• Automated claims filing in under 5 minutes\n• Real-time denial prediction and prevention\n• Automatic follow-up on unpaid claims\n• Compliance monitoring\n\nThe AI learns your facility's patterns and continuously improves. What specific area would you like to know more about?";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
      return "Our AI agents are designed specifically for skilled nursing facilities. They can replace multiple full-time roles while working 24/7 to:\n\n✓ Reduce claim denials by 30-50%\n✓ Accelerate cash flow by 20+ days\n✓ Cut labor costs by 20%+\n✓ Boost revenue recovery by 3-8%\n\nWhat questions do you have about AI automation for your facility?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm here to help you learn about Blue Pine AI's revenue cycle automation for skilled nursing facilities. I can answer questions about our AI services, pricing, how it works, or schedule a demo. What would you like to know?";
    }
    
    // Default response
    return `Thanks for your question about "${message}". I'm here to help with information about Blue Pine AI's revenue cycle automation for skilled nursing facilities. 

Our AI agents help with:
• Claims processing & medical coding
• Denial management & appeals
• Revenue recovery & cash flow optimization
• Compliance monitoring

What specific aspect would you like to learn more about? (Note: AWS Bedrock is not yet configured - see setup guide)`;
  }
}

export const bedrockChatService = new BedrockChatService(); 