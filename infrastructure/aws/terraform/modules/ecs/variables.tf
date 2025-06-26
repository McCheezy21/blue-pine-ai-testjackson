# ECS Module Variables

variable "environment" {
  description = "Environment name (staging, production)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ECS will be deployed"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

# Security group is created by this module

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
}

variable "backend_image" {
  description = "Docker image for backend"
  type        = string
}

variable "database_secret_arn" {
  description = "ARN of the secret containing database credentials"
  type        = string
}

variable "jwt_secret_arn" {
  description = "ARN of the JWT secret"
  type        = string
}

variable "app_config_secret_arn" {
  description = "ARN of the application configuration secret"
  type        = string
}

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

variable "backend_target_group_arn" {
  description = "ARN of the backend target group"
  type        = string
}

variable "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  type        = string
}

variable "alb_listener_arn" {
  description = "ARN of the ALB listener"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

# Auto scaling configuration
variable "ecs_max_capacity" {
  description = "Maximum ECS capacity for auto scaling"
  type        = number
  default     = 10
}

variable "ecs_min_capacity" {
  description = "Minimum ECS capacity for auto scaling"
  type        = number
  default     = 1
} 