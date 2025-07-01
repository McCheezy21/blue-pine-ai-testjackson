# Monitoring Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "ecs_cluster_name" {
  description = "ECS cluster name to monitor"
  type        = string
  default     = ""
}

variable "rds_instance_id" {
  description = "RDS instance ID to monitor"
  type        = string
  default     = ""
}

variable "alb_arn_suffix" {
  description = "ALB ARN suffix for monitoring"
  type        = string
  default     = ""
}

variable "alert_email" {
  description = "Email address for alerts"
  type        = string
  default     = ""
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 