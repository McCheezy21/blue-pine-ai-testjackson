# Secrets Module Outputs

output "secret_arns" {
  description = "Map of secret ARNs"
  value = {
    db_password    = aws_secretsmanager_secret.db_password.arn
    jwt_secret     = aws_secretsmanager_secret.jwt_secret.arn
    bedrock_config = aws_secretsmanager_secret.bedrock_config.arn
    app_config     = aws_secretsmanager_secret.app_config.arn
  }
  sensitive = true
}

output "db_password_secret_arn" {
  description = "Database password secret ARN"
  value       = aws_secretsmanager_secret.db_password.arn
  sensitive   = true
}

output "jwt_secret_arn" {
  description = "JWT secret ARN"
  value       = aws_secretsmanager_secret.jwt_secret.arn
  sensitive   = true
}

output "bedrock_config_secret_arn" {
  description = "Bedrock configuration secret ARN"
  value       = aws_secretsmanager_secret.bedrock_config.arn
}

output "app_config_secret_arn" {
  description = "Application configuration secret ARN"
  value       = aws_secretsmanager_secret.app_config.arn
} 