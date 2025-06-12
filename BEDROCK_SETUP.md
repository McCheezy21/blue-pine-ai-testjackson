# AWS Bedrock Setup Guide for Blue Pine AI

This guide covers setting up AWS Bedrock with Claude 3.5 Sonnet for the Blue Pine AI chatbot functionality.

## 🚀 Quick Start (5 minutes)

### Option 1: Development IAM User (Recommended for Local Development)

1. **Create Development IAM User**:
   - Go to [IAM Console](https://console.aws.amazon.com/iam/) → Users → Create user
   - Username: `bluepine-dev-user`
   - Select "Programmatic access"
   - Attach policy: `AmazonBedrockFullAccess` (or create custom policy)

2. **Get Access Keys**:
   - After creating user, go to Security credentials tab
   - Create access key → Application running outside AWS
   - Download the credentials

3. **Configure Environment**:
   ```bash
   # Add to your .env file
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   ```

### Option 2: AWS SSO Profile (Current Setup)

1. **Install AWS CLI** (if not already installed):
```bash
# macOS
brew install awscli

# Windows - Download from https://aws.amazon.com/cli/

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### 2. Configure AWS Profile
```bash
aws configure --profile bluepine-dev
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key  
# Enter your region (e.g., us-east-1)
# Enter output format (json)
```

### 3. Set Environment Variables
```bash
# Add to your .env file
echo "AWS_PROFILE=bluepine-dev" >> .env
echo "AWS_REGION=us-east-1" >> .env
```

### 4. Test Setup
```bash
cd api
node setup_bedrock.js
```

This will automatically detect your AWS account ID and provide the exact IAM role trust policy you need!

## Prerequisites

1. AWS Account with appropriate permissions
2. Access to AWS Bedrock service in your region
3. Model access approval for Anthropic Claude models

## Step 1: Enable Bedrock Model Access

1. Go to [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to **Model access** in the left sidebar
3. Click **Request model access**
4. Find **Anthropic** section and request access to:
   - `Claude 3.5 Sonnet v2` (anthropic.claude-3-5-sonnet-20241022-v2:0)
5. Wait for approval (usually takes a few minutes to hours)

## Step 2: Choose Authentication Method

### Option A: IAM Role (RECOMMENDED for Production)

#### Create the IAM Role

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Roles** → **Create role**
3. Select **Custom trust policy** and use:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Note**: Replace `YOUR_ACCOUNT_ID` with your actual AWS account ID (12-digit number).

4. Click **Next** and attach the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
      ]
    }
  ]
}
```

5. Name the role: `BluePineAI-Bedrock-Role`
6. Copy the Role ARN for your `.env` file

#### Configure Environment Variables

```bash
AWS_BEDROCK_ROLE_ARN=arn:aws:iam::123456789012:role/BluePineAI-Bedrock-Role
AWS_BEDROCK_ROLE_SESSION_NAME=BluePineAI-Bedrock-Session
AWS_REGION=us-east-1
```

**Important**: Since this is within your own AWS account, no external ID is required. The role can be assumed by any IAM user/role in your account that has `sts:AssumeRole` permission for this specific role.

### Option B: EC2 Instance Profile (RECOMMENDED for AWS Deployments)

#### Create Instance Profile

1. Create IAM role with the Bedrock policy above
2. Attach role to your EC2 instance
3. No environment variables needed - automatically detected

#### For ECS Tasks

1. Create task role with Bedrock permissions
2. Assign to your ECS task definition
3. No environment variables needed

### Option C: AWS Profile (RECOMMENDED for Development)

#### Setup AWS CLI Profile

```bash
# Configure AWS CLI with your credentials
aws configure --profile bluepine-dev
# Enter your access key, secret key, region, and output format

# Set environment variable
AWS_PROFILE=bluepine-dev
AWS_REGION=us-east-1
```

### Option D: Access Keys (NOT RECOMMENDED)

Only use for testing. Create IAM user with Bedrock permissions:

```bash
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
```

## Step 3: Test Your Setup

### Using the Setup Script

```bash
cd api
node setup_bedrock.js
```

### Manual Testing

```bash
# Test Bedrock connection
curl http://localhost:3001/api/admin/bedrock/test

# Test chat functionality (requires authentication)
curl -X POST http://localhost:3001/api/tenants/your-tenant-id/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{"message": "Hello, can you help me with healthcare billing?"}'
```

## Step 4: Required IAM Permissions

### Minimum Bedrock Permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
      ]
    }
  ]
}
```

### For Role Assumption (if using Option A)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sts:AssumeRole"
      ],
      "Resource": [
        "arn:aws:iam::YOUR_ACCOUNT_ID:role/BluePineAI-Bedrock-Role"
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Access Denied**: Check model access approval in Bedrock console
2. **Invalid Model ID**: Ensure you're using the correct model identifier
3. **Region Mismatch**: Verify Bedrock is available in your region
4. **Role Assumption Failed**: Check trust policy and permissions

### Debug Logging

The service logs credential configuration method on startup:

```
🔐 Configuring AWS credentials for Bedrock...
✅ Using IAM role assumption: arn:aws:iam::123456789012:role/BluePineAI-Bedrock-Role
```

### Testing Different Auth Methods

You can test different authentication methods by setting/unsetting environment variables:

```bash
# Test with IAM role
export AWS_BEDROCK_ROLE_ARN="arn:aws:iam::123456789012:role/BluePineAI-Bedrock-Role"
unset AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_PROFILE

# Test with AWS profile
export AWS_PROFILE="bluepine-dev"
unset AWS_BEDROCK_ROLE_ARN AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY

# Test with access keys (not recommended)
export AWS_ACCESS_KEY_ID="your-key"
export AWS_SECRET_ACCESS_KEY="your-secret"
unset AWS_BEDROCK_ROLE_ARN AWS_PROFILE
```

## Security Best Practices

1. **Use IAM roles** instead of access keys when possible
2. **Principle of least privilege** - only grant necessary Bedrock permissions
3. **Rotate credentials** regularly if using access keys
4. **Monitor usage** through CloudTrail and Bedrock metrics
5. **Use VPC endpoints** for private network access to Bedrock

## Cost Optimization

- Monitor token usage through CloudWatch metrics
- Set up billing alerts for Bedrock usage
- Consider request batching for high-volume scenarios
- Use appropriate model sizes for your use case

## 🚀 Production Deployment (Long-term Solutions)

### AWS EC2 Deployment (Recommended)

1. **Create IAM Role for EC2**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "Service": "ec2.amazonaws.com"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

2. **Attach Bedrock Policy**:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-*"
       }
     ]
   }
   ```

3. **Launch EC2 with Role**:
   - Attach the IAM role to your EC2 instance
   - No environment variables needed!
   - The app automatically uses instance credentials

4. **Environment Configuration**:
   ```bash
   # Only need region - credentials automatic
   AWS_REGION=us-east-1
   ```

### AWS ECS/Fargate Deployment

1. **Create Task Role** (same policy as above)

2. **ECS Task Definition**:
   ```json
   {
     "taskRoleArn": "arn:aws:iam::841283904924:role/BluePineAI-Bedrock-Role",
     "containerDefinitions": [
       {
         "name": "bluepine-api",
         "environment": [
           {
             "name": "AWS_REGION",
             "value": "us-east-1"
           }
         ]
       }
     ]
   }
   ```

### AWS Lambda Deployment

1. **Create Lambda Execution Role** with Bedrock permissions

2. **Deploy Function**:
   ```yaml
   # serverless.yml
   service: bluepine-api
   provider:
     name: aws
     runtime: nodejs18.x
     iamRoleStatements:
       - Effect: Allow
         Action:
           - bedrock:InvokeModel
         Resource: "*"
   ```

## 🔧 Development vs Production

| Environment | Method | Pros | Cons |
|-------------|--------|------|------|
| **Development** | IAM User + Access Keys | Simple, fast setup | Keys can be compromised |
| **Development** | SSO + Role Assumption | Temporary credentials | Complex, sessions expire |
| **Production** | EC2 Instance Role | Secure, automatic | Requires AWS infrastructure |
| **Production** | ECS Task Role | Secure, scalable | Container-based deployment |
| **Production** | Lambda Function | Serverless, secure | Function-based architecture |

## ⚠️ Current Setup Issues

Your current setup (SSO → Role Assumption) has these problems:
- ❌ SSO sessions expire every 8-12 hours
- ❌ Not suitable for production deployment
- ❌ Requires manual session refresh
- ❌ Mixes personal credentials with app infrastructure

## ✅ Recommended Next Steps

1. **For immediate development**: Create IAM user with access keys
2. **For production**: Deploy on EC2/ECS with IAM roles
3. **Remove role assumption**: Once you have direct credentials

## 🚀 Quick Start

### For Development (AWS CLI Profile)

1. **Install AWS CLI** (if not already installed):
   ```bash
   # macOS
   brew install awscli
   
   # Windows
   # Download from https://aws.amazon.com/cli/
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. **Configure AWS Profile**:
   ```bash
   aws configure --profile bluepine-dev
   # Enter your AWS Access Key ID
   # Enter your AWS Secret Access Key  
   # Enter your region (e.g., us-east-1)
   # Enter output format (json)
   ```

3. **Set Environment Variable**:
   ```bash
   # Add to your .env file
   echo "AWS_PROFILE=bluepine-dev" >> .env
   echo "AWS_REGION=us-east-1" >> .env
   ```

4. **Test Setup**:
   ```bash
   cd api
   node setup_bedrock.js
   ```

### For Production (IAM Role)

Follow the detailed IAM Role setup in Step 2 above, then:

```bash
# Add to your .env file
AWS_BEDROCK_ROLE_ARN=arn:aws:iam::123456789012:role/BluePineAI-Bedrock-Role
AWS_REGION=us-east-1
```

### 1. AWS Bedrock Console Setup

1. **Go to AWS Bedrock Console**
   - Navigate to: https://console.aws.amazon.com/bedrock/
   - Select region: `us-east-1` (recommended)

2. **Request Model Access**
   - Go to "Model access" in the left sidebar
   - Click "Request model access"
   - Find "Anthropic" section
   - Request access to:
     - ✅ Claude 3.5 Sonnet v2
     - ✅ Claude 3 Haiku (optional, for faster responses)
   - Submit request (usually approved within minutes)

3. **Create IAM User for Bedrock**
   ```bash
   # Create IAM user with programmatic access
   # Attach policy: AmazonBedrockFullAccess
   # Or create custom policy with minimal permissions:
   ```
   
   **Custom IAM Policy (Recommended):**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "bedrock:InvokeModel",
           "bedrock:InvokeModelWithResponseStream"
         ],
         "Resource": [
           "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0"
         ]
       }
     ]
   }
   ```

### 2. Environment Configuration

1. **Copy and update your `.env` file:**
   ```bash
   cd api
   cp env.example .env
   ```

2. **Add your AWS credentials to `.env`:**
   ```env
   # AWS Bedrock Configuration
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your-access-key-here
   AWS_SECRET_ACCESS_KEY=your-secret-key-here
   
   # Your existing database and Cognito settings...
   DB_HOST=your-database-host
   DB_PASSWORD=your-database-password
   COGNITO_USER_POOL_ID=your-user-pool-id
   # ... etc
   ```

### 3. Database Setup

Run the setup script to create the chat logs table:

```bash
cd api
node setup_bedrock.js
```

This will:
- ✅ Create the `chat_logs` table
- ✅ Test your database connection
- ✅ Test your Bedrock connection

### 4. Start the Application

```bash
# Terminal 1: Start the API server
cd api
npm run dev

# Terminal 2: Start the frontend
cd ..
npm run dev
```

### 5. Test the Integration

1. **Test Bedrock API directly:**
   ```bash
   curl http://localhost:3001/api/admin/bedrock/test
   ```

2. **Test chat in the application:**
   - Sign in to your tenant dashboard
   - Look for the floating chat button (bottom right)
   - Start chatting with the AI assistant!

## 🔧 API Endpoints

### Chat with AI
```