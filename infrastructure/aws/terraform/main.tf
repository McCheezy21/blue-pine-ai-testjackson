# Blue Pine AI - AWS Infrastructure
# Terraform configuration for production deployment

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Uncomment and configure for production
  # backend "s3" {
  #   bucket = "blue-pine-ai-terraform-state"
  #   key    = "production/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = var.tags
  }
}

# Additional provider for us-east-1 (required for CloudFront and WAF)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  
  default_tags {
    tags = var.tags
  }
}

# Data sources
data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Local values
locals {
  name_prefix = "${var.project_name}-${var.environment}"
  
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  name_prefix        = local.name_prefix
  vpc_cidr          = var.vpc_cidr
  availability_zones = data.aws_availability_zones.available.names
  
  tags = var.tags
}

# ECS Cluster for containerized applications
module "ecs" {
  source = "./modules/ecs"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  
  # Application configuration
  frontend_image = var.frontend_image
  backend_image  = var.backend_image
  
  # Task configuration - use the correct variable names
  task_cpu = var.ecs_cpu
  task_memory = var.ecs_memory
  desired_count = var.ecs_desired_count
  
  # Auto scaling configuration
  ecs_max_capacity = var.ecs_max_capacity
  ecs_min_capacity = var.ecs_min_capacity
  
  # Database and secrets configuration
  database_secret_arn = module.secrets.db_password_secret_arn
  jwt_secret_arn = module.secrets.jwt_secret_arn
  app_config_secret_arn = module.secrets.app_config_secret_arn
  
  # Target groups from ALB
  backend_target_group_arn = module.alb.backend_target_group_arn
  frontend_target_group_arn = module.alb.frontend_target_group_arn
  alb_listener_arn = module.alb.https_listener_arn
  
  aws_region = var.aws_region
  
  tags = var.tags
}

# RDS PostgreSQL Database
module "rds" {
  source = "./modules/rds"
  
  name_prefix = local.name_prefix
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
  allowed_security_groups = [module.ecs.security_group_id]
  
  # Database configuration
  db_instance_class = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_name = var.db_name
  db_username = var.db_username
  
  # Configuration from variables
  backup_retention_period = var.backup_retention_period
  backup_window = var.backup_window
  maintenance_window = var.maintenance_window
  multi_az = var.multi_az
  enable_deletion_protection = var.enable_deletion_protection
  skip_final_snapshot = var.skip_final_snapshot
  
  tags = var.tags
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  public_subnet_ids  = module.vpc.public_subnet_ids
  
  # SSL Certificate
  domain_name = var.domain_name
  ssl_certificate_arn = var.ssl_certificate_arn
  enable_deletion_protection = var.enable_deletion_protection
  
  tags = var.tags
}

# CloudFront CDN
module "cloudfront" {
  source = "./modules/cloudfront"
  
  providers = {
    aws.us_east_1 = aws.us_east_1
  }
  
  name_prefix = local.name_prefix
  domain_name = var.domain_name
  
  # Additional domain names for staging
  additional_domain_names = [
    "staging.${var.domain_name}",
    "www.staging.${var.domain_name}"
  ]
  
  # ALB as origin
  alb_domain_name = module.alb.alb_dns_name
  
  tags = var.tags
}

# Route 53 DNS
module "route53" {
  source = "./modules/route53"
  
  domain_name = var.domain_name
  
  # Additional domain names for staging
  additional_domain_names = [
    "staging.${var.domain_name}",
    "www.staging.${var.domain_name}"
  ]
  
  # CloudFront distribution
  cloudfront_domain_name = module.cloudfront.distribution_domain_name
  cloudfront_zone_id     = module.cloudfront.distribution_hosted_zone_id
  
  tags = var.tags
}

# S3 Buckets for file storage
module "s3" {
  source = "./modules/s3"
  
  name_prefix = local.name_prefix
  enable_versioning = var.enable_s3_versioning
  
  tags = var.tags
}

# AWS Bedrock and AI services
module "bedrock" {
  source = "./modules/bedrock"
  
  name_prefix = local.name_prefix
  
  # IAM roles that need Bedrock access
  ecs_task_role_arn = module.ecs.task_role_arn
  
  tags = local.common_tags
}

# Monitoring and Logging
module "monitoring" {
  source = "./modules/monitoring"
  
  name_prefix = local.name_prefix
  
  # Resources to monitor
  ecs_cluster_name = module.ecs.cluster_name
  rds_instance_id  = module.rds.instance_id
  alb_arn_suffix   = module.alb.alb_arn_suffix
  alert_email      = var.alert_email
  
  tags = var.tags
}

# Secrets Manager for sensitive configuration
module "secrets" {
  source = "./modules/secrets"
  
  name_prefix = local.name_prefix
  
  # Database credentials
  db_password = var.db_password
  
  # JWT secrets
  jwt_secret = var.jwt_secret
  
  # Cognito configuration
  cognito_user_pool_id = var.cognito_user_pool_id
  cognito_client_id = var.cognito_client_id
  aws_bedrock_region = var.aws_region
  cognito_region = var.aws_region
  
  tags = var.tags
}

# WAF for security
module "waf" {
  source = "./modules/waf"
  
  providers = {
    aws.us_east_1 = aws.us_east_1
  }
  
  name_prefix = local.name_prefix
  
  # CloudFront distribution to protect
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
  
  tags = var.tags
} 