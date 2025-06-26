# Blue Pine AI - Production Environment Configuration
# Terraform variables for production deployment

# Project Configuration
project_name = "blue-pine-ai"
environment  = "production"
aws_region   = "us-east-1"

# Domain Configuration
domain_name = "bluepineai.com"

# Network Configuration
vpc_cidr = "10.0.0.0/16"

# Database Configuration - Production Ready
db_instance_class     = "db.t3.small"
db_allocated_storage  = 100
db_name              = "blue_pine_ai"
db_username          = "postgres"
# db_password should be set via environment variable or secrets manager

# Container Images - Production Tags
frontend_image = "blue-pine-ai/frontend:v1.0.0"
backend_image  = "blue-pine-ai/backend:v1.0.0"
python_image   = "blue-pine-ai/python-services:v1.0.0"

# ECS Configuration - Production Scale
ecs_cpu           = 512
ecs_memory        = 1024
ecs_desired_count = 3

# Auto Scaling Configuration
ecs_min_capacity = 2
ecs_max_capacity = 20

# Security Configuration - Production Hardened
enable_deletion_protection = true
multi_az                  = true
enable_public_access      = false
skip_final_snapshot       = false

# Backup Configuration
backup_retention_period = 30
backup_window          = "03:00-04:00"
maintenance_window     = "sun:04:00-sun:05:00"

# S3 Configuration
enable_s3_versioning = true

# Monitoring Configuration
alert_email         = "alerts@bluepineai.com"
log_retention_days  = 90

# Cost Optimization
enable_spot_instances = false

# Environment Variables
environment_variables = {
  NODE_ENV = "production"
  PORT     = "3000"
  
  # Database
  DB_HOST = "managed-by-terraform"
  DB_PORT = "5432"
  DB_NAME = "blue_pine_ai"
  
  # AWS Services
  AWS_REGION = "us-east-1"
  
  # Application
  FRONTEND_URL = "https://bluepineai.com"
  API_URL      = "https://api.bluepineai.com"
  
  # Features
  ENABLE_SSO = "true"
  ENABLE_BEDROCK = "true"
  ENABLE_MONITORING = "true"
  
  # Security
  SECURE_COOKIES = "true"
  TRUST_PROXY = "true"
} 