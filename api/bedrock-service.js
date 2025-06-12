const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { fromInstanceMetadata, fromContainerMetadata, fromIni, fromEnv } = require('@aws-sdk/credential-providers');

class BedrockService {
  constructor() {
    // Configure credentials based on environment
    this.configureCredentials();
    
    this.client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: this.credentials
    });
    
    // Claude 3.5 Sonnet inference profile (required for on-demand access)
    // Using the inference profile instead of direct model ID
    this.modelId = process.env.AWS_BEDROCK_MODEL_ID || 'us.anthropic.claude-3-5-sonnet-20241022-v2:0';
  }

  configureCredentials() {
    // Priority order for credential resolution:
    // 1. Explicit access keys (recommended for development)
    // 2. AWS execution environment (EC2/ECS/Lambda - recommended for production)
    // 3. AWS credentials file profile
    // 4. IAM role assumption (for specific use cases)
    // 5. Default credential chain

    console.log('🔐 Configuring AWS credentials for Bedrock...');

    // Option 1: Explicit access keys (recommended for development)
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('✅ Using explicit AWS access keys (development mode)');
      this.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        ...(process.env.AWS_SESSION_TOKEN && { sessionToken: process.env.AWS_SESSION_TOKEN })
      };
      return;
    }

    // Option 2: AWS execution environment (recommended for production)
    if (process.env.AWS_EXECUTION_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.log('✅ Using AWS execution environment credentials (production mode)');
      if (process.env.AWS_EXECUTION_ENV === 'AWS_ECS_FARGATE' || process.env.AWS_EXECUTION_ENV === 'AWS_ECS_EC2') {
        this.credentials = fromContainerMetadata();
      } else {
        this.credentials = fromInstanceMetadata();
      }
      return;
    }

    // Option 3: IAM Role ARN for assume role (specific use cases)
    if (process.env.AWS_BEDROCK_ROLE_ARN && process.env.AWS_PROFILE) {
      console.log('⚠️  Using IAM role assumption:', process.env.AWS_BEDROCK_ROLE_ARN);
      console.log('⚠️  Note: Role assumption requires base credentials and may not be suitable for production');
      const { fromTemporaryCredentials } = require('@aws-sdk/credential-providers');
      
      this.credentials = fromTemporaryCredentials({
        params: {
          RoleArn: process.env.AWS_BEDROCK_ROLE_ARN,
          RoleSessionName: process.env.AWS_BEDROCK_ROLE_SESSION_NAME || 'BluePineAI-Bedrock-Session'
        },
        clientConfig: {
          region: process.env.AWS_REGION || 'us-east-1'
        }
      });
      return;
    }

    // Option 4: AWS credentials file profile
    if (process.env.AWS_PROFILE) {
      console.log('✅ Using AWS profile:', process.env.AWS_PROFILE);
      this.credentials = fromIni({ profile: process.env.AWS_PROFILE });
      return;
    }

    // Option 5: Default credential chain
    console.log('✅ Using default AWS credential chain');
    this.credentials = undefined; // Let AWS SDK use default credential chain
  }

  /**
   * Enhanced chat method with learning capabilities
   */
  async chatWithClaude(message, conversationHistory = [], tenantId = null, userId = null) {
    const startTime = Date.now();
    
    try {
      // Get tenant-specific knowledge and context
      const tenantContext = await this.getTenantContext(tenantId);
      const recentPatterns = await this.getRecentConversationPatterns(tenantId);
      
      // Detect intent and category
      const messageAnalysis = this.analyzeMessage(message);
      
      // Build enhanced system prompt with learned patterns
      const systemPrompt = this.buildEnhancedSystemPrompt(tenantContext, recentPatterns, messageAnalysis);
      
      const messages = [
        {
          role: "user",
          content: message
        }
      ];

      // Add conversation history if provided
      if (conversationHistory && conversationHistory.length > 0) {
        const historyMessages = conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));
        messages.unshift(...historyMessages);
      }

      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        system: systemPrompt,
        messages: messages,
        temperature: 0.7,
        top_p: 0.9
      };

      console.log('🤖 Sending request to Bedrock Claude...');
      
      const command = new InvokeModelCommand({
        modelId: this.modelId,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify(requestBody)
      });

      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      const responseTime = Date.now() - startTime;
      const aiResponse = responseBody.content[0].text;
      
      // Calculate confidence score based on response characteristics
      const confidenceScore = this.calculateConfidenceScore(aiResponse, messageAnalysis);
      
      // Store enhanced analytics
      if (tenantId && userId) {
        await this.logConversationAnalytics({
          tenantId,
          userId,
          message,
          response: aiResponse,
          category: messageAnalysis.category,
          intent: messageAnalysis.intent,
          confidenceScore,
          responseTime,
          promptTokens: responseBody.usage?.input_tokens || 0,
          completionTokens: responseBody.usage?.output_tokens || 0
        });
      }

      console.log('✅ Received response from Claude');
      
      // Return just the response text for compatibility with existing server code
      return aiResponse;

    } catch (error) {
      console.error('❌ Bedrock Claude Error:', error);
      
      // Log error for analysis
      if (tenantId && userId) {
        await this.logConversationAnalytics({
          tenantId,
          userId,
          message,
          response: 'ERROR: ' + error.message,
          category: 'error',
          intent: 'unknown',
          confidenceScore: 0,
          responseTime: Date.now() - startTime
        });
      }
      
      throw new Error('Sorry, I encountered an error. Please try again later.');
    }
  }

  /**
   * Analyze message to detect intent and category
   */
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Healthcare RCM specific categories and intents
    const categories = {
      'billing': ['bill', 'invoice', 'payment', 'charge', 'cost', 'price', 'fee'],
      'claims': ['claim', 'denial', 'reject', 'appeal', 'authorization', 'prior auth'],
      'eligibility': ['eligible', 'coverage', 'insurance', 'benefit', 'copay', 'deductible'],
      'technical': ['login', 'password', 'access', 'error', 'bug', 'system', 'portal'],
      'general': ['help', 'support', 'question', 'how', 'what', 'when', 'where']
    };
    
    let detectedCategory = 'general';
    let maxMatches = 0;
    
    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedCategory = category;
      }
    }
    
    // Detect specific intents
    let intent = 'information_request';
    if (lowerMessage.includes('how to') || lowerMessage.includes('how do')) {
      intent = 'how_to_guide';
    } else if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error')) {
      intent = 'problem_solving';
    } else if (lowerMessage.includes('status') || lowerMessage.includes('check')) {
      intent = 'status_inquiry';
    }
    
    return {
      category: detectedCategory,
      intent: intent,
      keywords: categories[detectedCategory] || []
    };
  }

  /**
   * Build enhanced system prompt with learned patterns
   */
  buildEnhancedSystemPrompt(tenantContext, recentPatterns, messageAnalysis) {
    let basePrompt = `You are an AI assistant for Blue Pine AI, a healthcare revenue cycle management (RCM) platform. You help healthcare providers optimize their billing, claims processing, and revenue operations.

CORE CAPABILITIES:
- Claims processing and denial management
- Patient eligibility verification
- Prior authorization workflows
- Revenue cycle analytics
- Billing optimization
- Compliance guidance (HIPAA, billing regulations)

COMMUNICATION STYLE:
- Professional yet approachable
- Use healthcare industry terminology appropriately
- Provide specific, actionable guidance
- Always prioritize patient privacy and HIPAA compliance`;

    // Add tenant-specific context
    if (tenantContext && tenantContext.commonQuestions) {
      basePrompt += `\n\nCOMMON QUESTIONS FOR THIS ORGANIZATION:\n${tenantContext.commonQuestions}`;
    }

    // Add recent conversation patterns
    if (recentPatterns && recentPatterns.length > 0) {
      basePrompt += `\n\nRECENT CONVERSATION PATTERNS:\n`;
      recentPatterns.forEach(pattern => {
        basePrompt += `- ${pattern.question} → ${pattern.response}\n`;
      });
    }

    // Add category-specific guidance
    if (messageAnalysis.category !== 'general') {
      const categoryGuidance = {
        'billing': 'Focus on billing processes, payment workflows, and revenue optimization.',
        'claims': 'Emphasize claims processing, denial management, and appeal procedures.',
        'eligibility': 'Prioritize insurance verification, benefit checks, and coverage details.',
        'technical': 'Provide clear technical support and system navigation guidance.'
      };
      
      if (categoryGuidance[messageAnalysis.category]) {
        basePrompt += `\n\nCATEGORY FOCUS: ${categoryGuidance[messageAnalysis.category]}`;
      }
    }

    return basePrompt;
  }

  /**
   * Calculate confidence score based on response characteristics
   */
  calculateConfidenceScore(response, messageAnalysis) {
    let score = 0.5; // Base score
    
    // Higher confidence for longer, detailed responses
    if (response.length > 200) score += 0.2;
    if (response.length > 500) score += 0.1;
    
    // Higher confidence if response contains category-specific keywords
    const categoryKeywords = messageAnalysis.keywords || [];
    const responseWords = response.toLowerCase();
    const keywordMatches = categoryKeywords.filter(keyword => 
      responseWords.includes(keyword)
    ).length;
    
    score += Math.min(keywordMatches * 0.05, 0.2);
    
    // Lower confidence for generic responses
    if (response.includes('I don\'t know') || response.includes('I\'m not sure')) {
      score -= 0.3;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Get tenant-specific context and knowledge
   */
  async getTenantContext(tenantId) {
    if (!tenantId) return null;
    
    try {
      // This would query your knowledge_base table
      // For now, return null - implement based on your database setup
      return null;
    } catch (error) {
      console.error('Error fetching tenant context:', error);
      return null;
    }
  }

  /**
   * Get recent conversation patterns for learning
   */
  async getRecentConversationPatterns(tenantId) {
    if (!tenantId) return [];
    
    try {
      // This would query recent successful conversations
      // For now, return empty array - implement based on your database setup
      return [];
    } catch (error) {
      console.error('Error fetching conversation patterns:', error);
      return [];
    }
  }

  /**
   * Log conversation analytics for training
   */
  async logConversationAnalytics(data) {
    try {
      // This would insert into your enhanced chat_logs table
      // Implementation depends on your database connection
      console.log('📊 Logging conversation analytics:', {
        category: data.category,
        intent: data.intent,
        confidence: data.confidenceScore,
        responseTime: data.responseTime
      });
    } catch (error) {
      console.error('Error logging conversation analytics:', error);
    }
  }

  // Method to get available models (for future use)
  async getAvailableModels() {
    try {
      // This would require additional permissions and SDK methods
      return ['anthropic.claude-3-5-sonnet-20241022-v2:0'];
    } catch (error) {
      console.error('Error getting models:', error);
      return [];
    }
  }

  // Method to validate connection
  async testConnection() {
    try {
      console.log('🧪 Testing Bedrock connection...');
      const testResponse = await this.chatWithClaude('Hello, this is a connection test.');
      console.log('✅ Bedrock connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Bedrock connection test failed:', error);
      return false;
    }
  }
}

module.exports = BedrockService; 