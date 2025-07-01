# Bedrock Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "ecs_task_role_arn" {
  description = "ECS task role ARN that needs Bedrock access"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 