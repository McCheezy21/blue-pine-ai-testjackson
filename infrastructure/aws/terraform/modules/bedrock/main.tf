# Bedrock Module for Blue Pine AI
# Basic AWS Bedrock configuration

# IAM policy for Bedrock access
resource "aws_iam_policy" "bedrock_access" {
  name        = "${var.name_prefix}-bedrock-access"
  description = "Policy for accessing AWS Bedrock services"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
          "bedrock:GetFoundationModel",
          "bedrock:ListFoundationModels"
        ]
        Resource = "*"
      }
    ]
  })

  tags = var.tags
}

# Attach Bedrock policy to ECS task role
resource "aws_iam_role_policy_attachment" "bedrock_access" {
  role       = basename(var.ecs_task_role_arn)
  policy_arn = aws_iam_policy.bedrock_access.arn
} 