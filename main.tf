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

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  environment        = var.environment
  vpc_cidr          = var.vpc_cidr
  availability_zones = data.aws_availability_zones.available.names
  
  tags = var.tags
}

# Secrets Manager for sensitive configuration
module "secrets" {
  source = "./modules/secrets"
  
  environment = var.environment
  
  # Database credentials
  db_password = var.db_password
  
  # JWT secrets
  jwt_secret = var.jwt_secret
  
  # Cognito configuration
  cognito_user_pool_id = var.cognito_user_pool_id
  cognito_client_id = var.cognito_client_id
  cognito_client_secret = var.cognito_client_secret
  
  tags = var.tags
}

# RDS PostgreSQL Database
module "rds" {
  source = "./modules/rds"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  
  # Database configuration
  db_instance_class = var.db_instance_class
  db_allocated_storage = var.db_allocated_storage
  db_max_allocated_storage = var.db_max_allocated_storage
  db_name = var.db_name
  db_username = var.db_username
  db_password_secret_arn = module.secrets.db_password_secret_arn
  
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
  
  tags = var.tags
}

# ECS Cluster for containerized applications
module "ecs" {
  source = "./modules/ecs"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  ecs_security_group_id = module.vpc.ecs_security_group_id
  
  # Application configuration
  frontend_image = var.frontend_image
  backend_image  = var.backend_image
  
  # Task configuration
  task_cpu = var.task_cpu
  task_memory = var.task_memory
  desired_count = var.desired_count
  
  # Database and secrets configuration
  database_secret_arn = module.secrets.db_password_secret_arn
  jwt_secret_arn = module.secrets.jwt_secret_arn
  cognito_user_pool_id_secret_arn = module.secrets.cognito_user_pool_id_secret_arn
  cognito_client_id_secret_arn = module.secrets.cognito_client_id_secret_arn
  cognito_client_secret_arn = module.secrets.cognito_client_secret_arn
  
  # Target groups from ALB
  backend_target_group_arn = module.alb.backend_target_group_arn
  frontend_target_group_arn = module.alb.frontend_target_group_arn
  alb_listener_arn = module.alb.https_listener_arn
  
  aws_region = var.aws_region
  
  tags = var.tags
}

# CloudFront CDN
module "cloudfront" {
  source = "./modules/cloudfront"
  
  providers = {
    aws.us_east_1 = aws.us_east_1
  }
  
  environment = var.environment
  domain_name = var.domain_name
  
  # ALB as origin
  alb_domain_name = module.alb.alb_dns_name
  ssl_certificate_arn = module.alb.ssl_certificate_arn
  
  tags = var.tags
}

# Route 53 DNS
module "route53" {
  source = "./modules/route53"
  
  domain_name = var.domain_name
  
  # CloudFront distribution
  cloudfront_domain_name = module.cloudfront.distribution_domain_name
  cloudfront_zone_id     = module.cloudfront.distribution_hosted_zone_id
  
  tags = var.tags
}

# S3 Buckets for file storage
module "s3" {
  source = "./modules/s3"
  
  environment = var.environment
  
  tags = var.tags
}

# Monitoring and Logging
module "monitoring" {
  source = "./modules/monitoring"
  
  environment = var.environment
  
  # Resources to monitor
  ecs_cluster_name = module.ecs.cluster_name
  rds_instance_id  = module.rds.instance_id
  alb_arn_suffix   = module.alb.alb_arn_suffix
  
  tags = var.tags
}

# WAF for security
module "waf" {
  source = "./modules/waf"
  
  providers = {
    aws.us_east_1 = aws.us_east_1
  }
  
  environment = var.environment
  
  # CloudFront distribution to protect
  cloudfront_distribution_arn = module.cloudfront.distribution_arn
  
  tags = var.tags
} 