# Blue Pine AI - Terraform Variables
# Define all input variables for the infrastructure

# Project Configuration
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "blue-pine-ai"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# Domain Configuration
variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "bluepineai.com"
}

# Network Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS instance (GB)"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum allocated storage for RDS instance (GB)"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "blue_pine_ai"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

# Container Images
variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
  default     = "blue-pine-ai/frontend:latest"
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
  default     = "blue-pine-ai/backend:latest"
}

variable "python_image" {
  description = "Docker image for Python services"
  type        = string
  default     = "blue-pine-ai/python-services:latest"
}

# Application Configuration
variable "environment_variables" {
  description = "Environment variables for the application"
  type        = map(string)
  default = {
    NODE_ENV = "production"
    PORT     = "3000"
  }
}

# ECS Task Configuration
variable "task_cpu" {
  description = "CPU units for ECS tasks"
  type        = number
  default     = 256
}

variable "task_memory" {
  description = "Memory for ECS tasks (MB)"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 1
}

# Secrets Configuration
variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
  default     = "us-west-1_ZRp04bdAf"
}

variable "cognito_client_id" {
  description = "Cognito Client ID"
  type        = string
  default     = "3cqsdhk7qmhvdvt4n9lpvni40q"
}

variable "cognito_client_secret" {
  description = "Cognito Client Secret"
  type        = string
  sensitive   = true
  default     = "13ufeqd70tidrhrgnu9agb46118sb85b48p59lh7ac4jk95m3k3m"
}

# SSL Configuration
variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate (optional, will create if not provided)"
  type        = string
  default     = ""
}

# Backup Configuration
variable "backup_retention_period" {
  description = "Backup retention period in days"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Security Configuration
variable "enable_deletion_protection" {
  description = "Enable deletion protection for RDS"
  type        = bool
  default     = true
}

variable "multi_az" {
  description = "Enable Multi-AZ for RDS"
  type        = bool
  default     = true
}

# Logging Configuration
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

# Cost Optimization
variable "enable_spot_instances" {
  description = "Enable spot instances for ECS (cost optimization)"
  type        = bool
  default     = false
}

# Development/Testing Configuration
variable "enable_public_access" {
  description = "Enable public access to RDS (for development only)"
  type        = bool
  default     = false
}

variable "skip_final_snapshot" {
  description = "Skip final snapshot when destroying RDS (for development)"
  type        = bool
  default     = false
}

# Tags
variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "blue-pine-ai"
    ManagedBy   = "terraform"
  }
}

# Additional variables referenced in staging.tfvars
variable "enable_s3_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "ecs_min_capacity" {
  description = "Minimum ECS capacity for auto scaling"
  type        = number
  default     = 1
}

variable "ecs_max_capacity" {
  description = "Maximum ECS capacity for auto scaling"
  type        = number
  default     = 10
}

variable "ecs_cpu" {
  description = "CPU units for ECS tasks (alias for task_cpu)"
  type        = number
  default     = 256
}

variable "ecs_memory" {
  description = "Memory for ECS tasks in MB (alias for task_memory)"
  type        = number
  default     = 512
}

variable "ecs_desired_count" {
  description = "Desired number of ECS tasks (alias for desired_count)"
  type        = number
  default     = 1
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = "admin@example.com"
} 