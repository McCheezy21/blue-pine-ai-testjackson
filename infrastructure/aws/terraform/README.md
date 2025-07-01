# 🏗️ Blue Pine AI - AWS Infrastructure (Terraform)

This directory contains the complete Terraform infrastructure code for deploying Blue Pine AI to AWS in a production-ready, scalable, and secure manner.

## 🏛️ **Architecture Overview**

```
Internet → CloudFront → ALB → ECS (Frontend/Backend/Python) → RDS PostgreSQL
                              ↓
                          S3 + Bedrock + Secrets Manager
```

### **Components Deployed:**
- **VPC** with public/private subnets across 3 AZs
- **ECS Fargate** cluster for containerized applications
- **Application Load Balancer** with SSL termination
- **CloudFront CDN** for global content delivery
- **RDS PostgreSQL** with Multi-AZ and automated backups
- **Route 53** DNS management
- **S3 buckets** for file storage
- **AWS Bedrock** integration for AI services
- **Secrets Manager** for secure credential storage
- **CloudWatch** monitoring and logging
- **WAF** for security protection
- **Auto Scaling** for high availability

## 📁 **Directory Structure**

```
infrastructure/aws/terraform/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── README.md                  # This file
├── environments/
│   ├── production.tfvars      # Production configuration
│   ├── staging.tfvars         # Staging configuration
│   └── development.tfvars     # Development configuration
└── modules/                   # Terraform modules (to be created)
    ├── vpc/
    ├── ecs/
    ├── rds/
    ├── alb/
    ├── cloudfront/
    ├── route53/
    ├── s3/
    ├── bedrock/
    ├── monitoring/
    ├── secrets/
    └── waf/
```

## 🚀 **Quick Start**

### **Prerequisites**
1. **AWS CLI** configured with appropriate credentials
2. **Terraform** >= 1.0 installed
3. **Docker** for building container images
4. **Domain name** registered and managed in Route 53

### **1. Initialize Terraform**
```bash
cd infrastructure/aws/terraform
terraform init
```

### **2. Create Terraform Backend (First Time Only)**
```bash
# Create S3 bucket for state storage
aws s3 mb s3://blue-pine-ai-terraform-state-$(aws sts get-caller-identity --query Account --output text)

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket blue-pine-ai-terraform-state-$(aws sts get-caller-identity --query Account --output text) \
  --versioning-configuration Status=Enabled
```

### **3. Plan Deployment**
```bash
# For staging
terraform plan -var-file="environments/staging.tfvars"

# For production
terraform plan -var-file="environments/production.tfvars"
```

### **4. Deploy Infrastructure**
```bash
# Deploy staging
terraform apply -var-file="environments/staging.tfvars"

# Deploy production
terraform apply -var-file="environments/production.tfvars"
```

## 🔧 **Configuration**

### **Required Variables**
Set these via environment variables or Terraform variables:

```bash
export TF_VAR_db_password="your-secure-database-password"
export TF_VAR_jwt_secret="your-jwt-secret-key"
```

### **Optional Customization**
Edit the `.tfvars` files to customize:
- Instance sizes and scaling parameters
- Domain names and SSL certificates
- Backup and monitoring settings
- Cost optimization features

## 🐳 **Container Images**

Before deploying, ensure your container images are built and pushed to ECR:

```bash
# Build and push images
./scripts/build-and-push-images.sh
```

Or manually:
```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com

# Build and push frontend
docker build -t blue-pine-ai/frontend:latest packages/frontend/
docker tag blue-pine-ai/frontend:latest $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/blue-pine-ai/frontend:latest
docker push $(aws sts get-caller-identity --query Account --output text).dkr.ecr.us-east-1.amazonaws.com/blue-pine-ai/frontend:latest

# Repeat for backend and python services
```

## 🌍 **Environments**

### **Staging** (`environments/staging.tfvars`)
- **Purpose**: Testing and development
- **Cost**: ~$50-100/month
- **Features**: Single AZ, smaller instances, spot instances
- **Domain**: `staging.bluepineai.com`

### **Production** (`environments/production.tfvars`)
- **Purpose**: Live customer traffic
- **Cost**: ~$200-500/month (scales with usage)
- **Features**: Multi-AZ, auto-scaling, enhanced monitoring
- **Domain**: `bluepineai.com`

## 💰 **Cost Optimization**

### **Staging Environment**
- Uses `t3.micro` instances
- Single AZ deployment
- Spot instances for ECS
- Reduced backup retention
- Minimal monitoring

### **Production Environment**
- Reserved instances for predictable workloads
- Auto-scaling to handle traffic spikes
- CloudFront caching to reduce origin load
- S3 Intelligent Tiering for storage optimization

### **Cost Monitoring**
```bash
# View estimated costs
terraform plan -var-file="environments/production.tfvars" | grep "Plan:"

# Monitor actual costs in AWS Cost Explorer
```

## 🔒 **Security Features**

### **Network Security**
- Private subnets for application and database
- Security groups with least-privilege access
- WAF protection against common attacks
- VPC Flow Logs for network monitoring

### **Data Protection**
- RDS encryption at rest and in transit
- S3 bucket encryption and versioning
- Secrets Manager for sensitive data
- CloudTrail for audit logging

### **Application Security**
- ECS tasks run with minimal IAM permissions
- SSL/TLS termination at load balancer
- Security headers via CloudFront
- Regular security group auditing

## 📊 **Monitoring & Alerting**

### **CloudWatch Dashboards**
- Application performance metrics
- Database performance and connections
- Load balancer health and response times
- Cost and billing alerts

### **SNS Alerts**
- High CPU/memory usage
- Database connection issues
- SSL certificate expiration
- Unusual traffic patterns

### **Log Aggregation**
- Application logs from ECS
- Load balancer access logs
- VPC Flow Logs
- CloudTrail API logs

## 🔄 **CI/CD Integration**

### **GitHub Actions Integration**
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v1
      - name: Terraform Apply
        run: |
          terraform init
          terraform apply -var-file="environments/production.tfvars" -auto-approve
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## 🛠️ **Maintenance**

### **Regular Tasks**
```bash
# Update container images
terraform apply -var-file="environments/production.tfvars" -target=module.ecs

# Scale applications
terraform apply -var-file="environments/production.tfvars" -var="ecs_desired_count=5"

# Update SSL certificates (automatic via ACM)
terraform refresh
```

### **Backup and Recovery**
- **Database**: Automated daily backups with 30-day retention
- **Application**: Container images stored in ECR
- **Configuration**: Terraform state in S3 with versioning
- **DNS**: Route 53 configuration backed up

## 🚨 **Troubleshooting**

### **Common Issues**

**ECS Tasks Not Starting**
```bash
# Check ECS logs
aws logs describe-log-groups --log-group-name-prefix "/ecs/blue-pine-ai"
aws logs get-log-events --log-group-name "/ecs/blue-pine-ai-production"
```

**Database Connection Issues**
```bash
# Check security groups
aws ec2 describe-security-groups --group-ids sg-xxxxx
```

**SSL Certificate Issues**
```bash
# Check certificate status
aws acm list-certificates --region us-east-1
```

### **Emergency Procedures**

**Scale Down (Cost Emergency)**
```bash
terraform apply -var-file="environments/production.tfvars" -var="ecs_desired_count=1"
```

**Complete Rollback**
```bash
terraform destroy -var-file="environments/production.tfvars"
```

## 📞 **Support**

For infrastructure issues:
1. Check CloudWatch logs and metrics
2. Review Terraform state: `terraform show`
3. Contact AWS Support for service-specific issues
4. Review this documentation and AWS best practices

## 🔗 **Useful Commands**

```bash
# View current infrastructure
terraform show

# Import existing resources
terraform import aws_instance.example i-abcd1234

# Validate configuration
terraform validate

# Format code
terraform fmt -recursive

# View state
terraform state list

# Refresh state
terraform refresh -var-file="environments/production.tfvars"
```

---

**🌲 This infrastructure setup provides enterprise-grade AWS deployment for Blue Pine AI with security, scalability, and cost optimization built-in.** 