# Bedrock Module Outputs
 
output "bedrock_policy_arn" {
  description = "Bedrock access policy ARN"
  value       = aws_iam_policy.bedrock_access.arn
} 