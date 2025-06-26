# Blue Pine AI - Terraform Outputs
# Export important infrastructure values

# Domain and URLs
output "domain_name" {
  description = "Domain name of the application"
  value       = var.domain_name
}

output "application_url" {
  description = "Main application URL"
  value       = "https://${var.domain_name}"
}

output "api_url" {
  description = "API endpoint URL"
  value       = "https://api.${var.domain_name}"
}

# CloudFront Distribution
output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.cloudfront.distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = module.cloudfront.distribution_domain_name
}

# Load Balancer
output "alb_dns_name" {
  description = "Application Load Balancer DNS name"
  value       = module.alb.alb_dns_name
}

output "alb_zone_id" {
  description = "Application Load Balancer zone ID"
  value       = module.alb.alb_zone_id
}

# Database
output "database_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "database_port" {
  description = "RDS instance port"
  value       = module.rds.port
}

output "database_name" {
  description = "Database name"
  value       = var.db_name
}

# ECS Cluster
output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = module.ecs.cluster_arn
}

# VPC Information
output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "vpc_cidr" {
  description = "VPC CIDR block"
  value       = module.vpc.vpc_cidr
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Private subnet IDs"
  value       = module.vpc.private_subnet_ids
}

# Security Groups
output "ecs_security_group_id" {
  description = "ECS security group ID"
  value       = module.ecs.security_group_id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = module.rds.security_group_id
}

output "alb_security_group_id" {
  description = "ALB security group ID"
  value       = module.alb.alb_security_group_id
}

# S3 Buckets
output "s3_bucket_names" {
  description = "S3 bucket names"
  value       = module.s3.bucket_names
}

output "s3_bucket_arns" {
  description = "S3 bucket ARNs"
  value       = module.s3.bucket_arns
}

# IAM Roles
output "ecs_task_role_arn" {
  description = "ECS task role ARN"
  value       = module.ecs.task_role_arn
}

output "ecs_execution_role_arn" {
  description = "ECS execution role ARN"
  value       = module.ecs.execution_role_arn
}

# Secrets Manager
output "secrets_manager_arns" {
  description = "Secrets Manager secret ARNs"
  value       = module.secrets.secret_arns
  sensitive   = true
}

# Monitoring
output "cloudwatch_log_groups" {
  description = "CloudWatch log group names"
  value       = module.monitoring.log_group_names
}

output "sns_topic_arns" {
  description = "SNS topic ARNs for alerts"
  value       = module.monitoring.sns_topic_arns
}

# SSL Certificate
output "ssl_certificate_arn" {
  description = "SSL certificate ARN"
  value       = module.alb.certificate_arn
}

# WAF
output "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = module.waf.web_acl_arn
}

# Route 53
output "route53_zone_id" {
  description = "Route 53 hosted zone ID"
  value       = module.route53.zone_id
}

output "route53_name_servers" {
  description = "Route 53 name servers"
  value       = module.route53.name_servers
}

# Bedrock Configuration
output "bedrock_region" {
  description = "AWS Bedrock region"
  value       = var.aws_region
}

# Environment Information
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "aws_region" {
  description = "AWS region"
  value       = var.aws_region
}

output "aws_account_id" {
  description = "AWS account ID"
  value       = data.aws_caller_identity.current.account_id
}

# Container Registry
output "ecr_repository_urls" {
  description = "ECR repository URLs"
  value = {
    frontend = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/blue-pine-ai/frontend"
    backend  = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/blue-pine-ai/backend"
    python   = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/blue-pine-ai/python-services"
  }
}

# Cost Tracking
output "resource_tags" {
  description = "Common resource tags"
  value       = local.common_tags
} 