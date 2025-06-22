const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import AWS SDK for account ID detection
const { STSClient, GetCallerIdentityCommand } = require('@aws-sdk/client-sts');

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_HOST?.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false
});

async function getAWSAccountId() {
  try {
    const stsClient = new STSClient({ region: process.env.AWS_REGION || 'us-east-1' });
    const command = new GetCallerIdentityCommand({});
    const response = await stsClient.send(command);
    return response.Account;
  } catch (error) {
    console.log('⚠️  Could not detect AWS account ID:', error.message);
    return null;
  }
}

async function setupBedrockDatabase() {
  try {
    console.log('🔧 Setting up Bedrock database tables...');
    
    // Read and execute the SQL file
    const sqlFile = path.join(__dirname, 'create_chat_logs_table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Chat logs table created successfully');
    
    // Test the table
    const testResult = await pool.query('SELECT COUNT(*) FROM chat_logs');
    console.log('✅ Table test successful - current chat logs count:', testResult.rows[0].count);
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  }
}

async function testBedrockConnection() {
  try {
    console.log('🧪 Testing Bedrock service...');
    
    // Check which authentication method will be used
    console.log('\n🔐 Credential Configuration Check:');
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      console.log('   📋 Method: Explicit Access Keys');
      console.log('   ⚠️  Warning: Access keys are not recommended for production');
    } else if (process.env.AWS_BEDROCK_ROLE_ARN) {
      console.log('   📋 Method: IAM Role Assumption');
      console.log('   ✅ Role ARN:', process.env.AWS_BEDROCK_ROLE_ARN);
      console.log('   ✅ Recommended for production');
    } else if (process.env.AWS_EXECUTION_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.log('   📋 Method: AWS Execution Environment (EC2/ECS/Lambda)');
      console.log('   ✅ Recommended for AWS deployments');
    } else if (process.env.AWS_PROFILE) {
      console.log('   📋 Method: AWS Profile');
      console.log('   ✅ Profile:', process.env.AWS_PROFILE);
      console.log('   ✅ Recommended for development');
    } else {
      console.log('   📋 Method: Default AWS Credential Chain');
      console.log('   💡 Will try: Environment → Profile → Instance Profile → ECS');
    }
    
    console.log('   🌍 Region:', process.env.AWS_REGION || 'us-east-1');
    
    const BedrockService = require('./bedrock-service');
    const bedrockService = new BedrockService();
    
    console.log('\n🤖 Testing Claude 3.5 Sonnet connection...');
    const testResult = await bedrockService.testConnection();
    
    if (testResult) {
      console.log('✅ Bedrock connection test successful');
      console.log('✅ Claude 3.5 Sonnet is accessible');
    } else {
      console.log('❌ Bedrock connection test failed');
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check AWS Bedrock model access in AWS Console');
      console.log('2. Verify your credentials have bedrock:InvokeModel permission');
      console.log('3. Ensure Claude 3.5 Sonnet model access is approved');
      console.log('4. Check your AWS region supports Bedrock');
    }
    
  } catch (error) {
    console.error('❌ Bedrock test failed:', error);
    console.log('\n🔧 Common solutions:');
    
    if (error.name === 'AccessDeniedException') {
      console.log('• Request model access in AWS Bedrock Console');
      console.log('• Check IAM permissions for bedrock:InvokeModel');
    } else if (error.name === 'ValidationException') {
      console.log('• Verify the model ID is correct');
      console.log('• Check if the model is available in your region');
    } else if (error.code === 'CredentialsError') {
      console.log('• Configure AWS credentials using one of these methods:');
      console.log('  - IAM Role: Set AWS_BEDROCK_ROLE_ARN');
      console.log('  - AWS Profile: Set AWS_PROFILE');
      console.log('  - Access Keys: Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
    } else {
      console.log('• Check network connectivity to AWS');
      console.log('• Verify AWS region configuration');
    }
  }
}

async function main() {
  console.log('🚀 Blue Pine AI - Bedrock Setup');
  console.log('================================');
  
  try {
    // Detect AWS Account ID for role setup
    console.log('\n🔍 Detecting AWS Account Information...');
    const accountId = await getAWSAccountId();
    if (accountId) {
      console.log('✅ AWS Account ID:', accountId);
      console.log('\n📋 For IAM Role setup, use this trust policy:');
      console.log('```json');
      console.log(JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "AWS": `arn:aws:iam::${accountId}:root`
            },
            "Action": "sts:AssumeRole"
          }
        ]
      }, null, 2));
      console.log('```');
      console.log('\n💡 No external ID needed for same-account role assumption!');
      console.log(`📝 Role ARN will be: arn:aws:iam::${accountId}:role/BluePineAI-Bedrock-Role`);
    }
    
    // Setup database
    await setupBedrockDatabase();
    
    // Test Bedrock connection
    await testBedrockConnection();
    
    console.log('\n✅ Setup complete!');
    console.log('\nNext steps:');
    if (accountId && !process.env.AWS_BEDROCK_ROLE_ARN) {
      console.log('1. Create IAM role using the trust policy above');
      console.log('2. Add to .env: AWS_BEDROCK_ROLE_ARN=arn:aws:iam::' + accountId + ':role/BluePineAI-Bedrock-Role');
      console.log('3. Start the server: npm run dev');
    } else {
      console.log('1. Make sure your .env file has AWS credentials');
      console.log('2. Start the server: npm run dev');
    }
    console.log('4. Test the chat: http://localhost:3001/api/admin/bedrock/test');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupBedrockDatabase, testBedrockConnection }; 