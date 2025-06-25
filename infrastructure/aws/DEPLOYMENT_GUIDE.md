# Blue Pine AI - AWS Infrastructure Deployment Guide

## 🚀 Complete Infrastructure Deployment

Your Blue Pine AI platform now has a **production-ready AWS infrastructure** with Terraform. This guide will walk you through deploying everything from scratch.

## 📋 Prerequisites

### 1. Required Tools
```bash
# Install Terraform
brew install terraform  # macOS
# or download from https://terraform.io

# Install AWS CLI
brew install awscli     # macOS
# or download from https://aws.amazon.com/cli/

# Verify installations
terraform --version     # Should be >= 1.0
aws --version          # Should be >= 2.0
```

### 2. AWS Account Setup
```bash
# Configure AWS credentials
aws configure

# Verify access
aws sts get-caller-identity
```

### 3. Domain Prerequisites
- **Own a domain** (e.g., `bluepineai.com`)
- **Create Route 53 hosted zone** for your domain in AWS
- **Update nameservers** at your domain registrar to point to Route 53

## 🏗️ Infrastructure Overview

Your Terraform configuration will create:

### Core Infrastructure
- **VPC** with public/private subnets across 3 AZs
- **Application Load Balancer** with SSL termination
- **ECS Fargate** cluster for containerized apps
- **RDS PostgreSQL** database with Multi-AZ
- **CloudFront CDN** for global performance
- **S3 buckets** for file storage
- **Secrets Manager** for credentials
- **CloudWatch** monitoring and alerts

### Security & Compliance
- **WAF** protection against common attacks
- **Private subnets** for database and application
- **Security groups** with least-privilege access
- **Encrypted storage** for database and S3
- **SSL certificates** managed by ACM

### Cost Estimates
- **Staging**: ~$50-100/month
- **Production**: ~$200-500/month

## 🚀 Deployment Steps

### Step 1: Set Environment Variables
```bash
# Required secrets (generate strong passwords)
export TF_VAR_db_password="your-super-secure-database-password-32-chars"
export TF_VAR_jwt_secret="your-jwt-secret-key-for-authentication"

# Optional: Set your domain
export TF_VAR_domain_name="bluepineai.com"
export TF_VAR_alert_email="alerts@bluepineai.com"
```

### Step 2: Initialize Terraform
```bash
cd infrastructure/aws/terraform

# Initialize Terraform
terraform init

# Review the plan
terraform plan -var-file="environments/staging.tfvars"
```

### Step 3: Deploy Staging Environment
```bash
# Deploy staging infrastructure
terraform apply -var-file="environments/staging.tfvars"

# This will create:
# - staging.bluepineai.com domain
# - Cost-optimized resources
# - Single-AZ RDS for testing
```

### Step 4: Initialize Database
```bash
# Get database endpoint from Terraform output
DB_ENDPOINT=$(terraform output -raw database_endpoint)

# Connect and initialize database
psql -h $DB_ENDPOINT -U postgres -d blue_pine_ai_staging < ../../database/init-rds-database.sql
```

### Step 5: Build and Push Docker Images
```bash
# Build your application images
cd ../../../

# Backend image
docker build -t blue-pine-ai/backend:staging -f infrastructure/docker/Dockerfile .

# Push to ECR (you'll need to create ECR repos first)
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

docker tag blue-pine-ai/backend:staging YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/blue-pine-ai/backend:staging
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/blue-pine-ai/backend:staging
```

### Step 6: Deploy Production (When Ready)
```bash
# Deploy production infrastructure
terraform apply -var-file="environments/production.tfvars"

# Initialize production database
DB_ENDPOINT=$(terraform output -raw database_endpoint)
psql -h $DB_ENDPOINT -U postgres -d blue_pine_ai < ../../database/init-rds-database.sql
```

## 🔧 Configuration Details

### Environment Files

**Staging** (`environments/staging.tfvars`):
- Cost-optimized settings
- Single AZ deployment
- Relaxed security for testing
- `db.t3.micro` instance
- Spot instances enabled

**Production** (`environments/production.tfvars`):
- High availability (Multi-AZ)
- Enhanced security
- `db.t3.small` instance
- Deletion protection enabled
- 30-day backup retention

### Key Terraform Modules

1. **VPC Module** (`modules/vpc/`)
   - Creates isolated network
   - Public/private subnets
   - NAT gateways for outbound access

2. **RDS Module** (`modules/rds/`)
   - PostgreSQL 15.4
   - Encrypted storage
   - Automated backups
   - Performance Insights

3. **ECS Module** (`modules/ecs/`)
   - Fargate cluster
   - Auto-scaling configuration
   - CloudWatch logging
   - Health checks

4. **ALB Module** (`modules/alb/`)
   - SSL termination
   - Path-based routing
   - Health checks

## 🗄️ Database Schema

Your RDS database will be initialized with:

### Core Tables
- `tenants` - Multi-tenant organizations
- `users` - User accounts (Cognito + SSO)
- `tenant_users` - User-tenant relationships

### SSO Tables
- `sso_configurations` - Enterprise SSO providers
- `sso_domains` - Email domain routing
- `sso_sessions` - SSO session management

### AI/Bedrock Tables
- `ai_conversations` - Chat sessions
- `chat_messages` - Individual messages
- `bedrock_usage` - Usage tracking and billing

### Document Tables
- `documents` - File storage metadata
- `automation_workflows` - Document processing

## 🔐 Security Features

### Network Security
- Private subnets for database and application
- Security groups with minimal required access
- VPC endpoints for AWS services

### Data Security
- Database encryption at rest
- S3 bucket encryption
- Secrets Manager for credentials
- SSL/TLS for all communications

### Access Control
- IAM roles with least privilege
- Multi-factor authentication support
- Audit logging with CloudTrail

## 📊 Monitoring & Alerting

### CloudWatch Dashboards
- ECS service metrics (CPU, memory)
- RDS performance metrics
- Application Load Balancer metrics

### Automated Alerts
- High CPU/memory usage
- Database connection issues
- Application health check failures
- SSL certificate expiration

### Log Aggregation
- Application logs in CloudWatch
- Database query logs
- Load balancer access logs

## 🚨 Troubleshooting

### Common Issues

1. **Domain Validation Fails**
   ```bash
   # Ensure Route 53 hosted zone exists
   aws route53 list-hosted-zones-by-name --dns-name bluepineai.com
   ```

2. **Database Connection Issues**
   ```bash
   # Check security group rules
   aws ec2 describe-security-groups --group-ids sg-xxxxx
   ```

3. **ECS Tasks Not Starting**
   ```bash
   # Check ECS service events
   aws ecs describe-services --cluster blue-pine-ai-staging-cluster --services blue-pine-ai-staging-backend
   ```

### Useful Commands

```bash
# View Terraform outputs
terraform output

# Check infrastructure status
terraform state list

# Destroy staging environment (if needed)
terraform destroy -var-file="environments/staging.tfvars"
```

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy infrastructure
        run: |
          cd infrastructure/aws/terraform
          terraform init
          terraform apply -auto-approve -var-file="environments/production.tfvars"
```

## 📈 Scaling Considerations

### Auto Scaling
- ECS services auto-scale based on CPU/memory
- RDS can be scaled vertically
- CloudFront provides global edge caching

### Performance Optimization
- Use RDS read replicas for read-heavy workloads
- Implement application-level caching
- Optimize Docker images for faster startup

### Cost Optimization
- Use Spot instances for non-critical workloads
- Set up S3 lifecycle policies
- Monitor and right-size resources

## 🎯 Next Steps

1. **Deploy staging environment** and test thoroughly
2. **Set up monitoring dashboards** in CloudWatch
3. **Configure backup strategies** for critical data
4. **Implement CI/CD pipelines** for automated deployments
5. **Set up log aggregation** and alerting
6. **Plan disaster recovery** procedures

## 📞 Support

For infrastructure issues:
1. Check CloudWatch logs and metrics
2. Review Terraform state and outputs
3. Consult AWS documentation
4. Use AWS Support if needed

Your Blue Pine AI platform is now ready for enterprise-scale deployment! 🚀 