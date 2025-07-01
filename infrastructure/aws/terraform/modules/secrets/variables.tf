# Secrets Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "aws_bedrock_region" {
  description = "AWS Bedrock region"
  type        = string
  default     = "us-east-1"
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  type        = string
  default     = ""
}

variable "cognito_client_id" {
  description = "Cognito Client ID"
  type        = string
  default     = ""
}

variable "cognito_region" {
  description = "Cognito region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 