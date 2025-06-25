# Backend Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.environment}-backend-v2"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn           = aws_iam_role.ecs_task_role.arn

// ... existing code ...
} 