# Blue Pine AI - Staging Environment Configuration
# Terraform variables for staging deployment

# Project Configuration
project_name = "blue-pine-ai"
environment  = "staging"
aws_region   = "us-west-1"

# Domain Configuration
domain_name = "staging.chaseblueai.com"

# Network Configuration
vpc_cidr = "10.1.0.0/16"

# Database Configuration - Cost Optimized
db_instance_class     = "db.t3.micro"
db_allocated_storage  = 20
db_max_allocated_storage = 100
db_name              = "blue_pine_ai_staging"
db_username          = "postgres"
# db_password should be set via environment variable

# Container Images - Latest for testing
frontend_image = "841283904924.dkr.ecr.us-west-1.amazonaws.com/blue-pine-ai/frontend:staging"
backend_image  = "841283904924.dkr.ecr.us-west-1.amazonaws.com/blue-pine-ai/backend:staging"
python_image   = "python:3.11-slim"

# ECS Configuration - Minimal for staging
ecs_cpu           = 256
ecs_memory        = 512
ecs_desired_count = 1

# Auto Scaling Configuration
ecs_min_capacity = 1
ecs_max_capacity = 3

# Security Configuration - Relaxed for testing
enable_deletion_protection = false
multi_az                  = false
enable_public_access      = true  # For easier database access during development
skip_final_snapshot       = true

# Backup Configuration
backup_retention_period = 7
backup_window          = "03:00-04:00"
maintenance_window     = "sun:04:00-sun:05:00"

# S3 Configuration
enable_s3_versioning = false

# Monitoring Configuration
alert_email         = "dev@chaseblueai.com"
log_retention_days  = 14

# Cost Optimization
enable_spot_instances = true

# Environment Variables
environment_variables = {
  NODE_ENV = "staging"
  PORT     = "3001"
  
  # Database
  DB_HOST = "managed-by-terraform"
  DB_PORT = "5432"
  DB_NAME = "blue_pine_ai_staging"
  
  # AWS Services
  AWS_REGION = "us-west-1"
  
  # Application
  FRONTEND_URL = "https://staging.chaseblueai.com"
  API_URL      = "https://api-staging.chaseblueai.com"
  
  # Features
  ENABLE_SSO = "true"
  ENABLE_BEDROCK = "true"
  ENABLE_MONITORING = "false"
  
  # Security - Relaxed for testing
  SECURE_COOKIES = "false"
  TRUST_PROXY = "true"
  
  # Debug
  DEBUG = "true"
  LOG_LEVEL = "debug"
}

# Tags
tags = {
  Environment = "staging"
  Project     = "blue-pine-ai"
  ManagedBy   = "terraform"
} 