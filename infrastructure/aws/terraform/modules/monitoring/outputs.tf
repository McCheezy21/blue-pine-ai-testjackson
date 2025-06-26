# Monitoring Module Outputs

output "sns_topic_arns" {
  description = "SNS topic ARNs for alerts"
  value = {
    alerts = aws_sns_topic.alerts.arn
  }
}

output "dashboard_url" {
  description = "CloudWatch dashboard URL"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${data.aws_region.current.name}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}

output "log_group_names" {
  description = "CloudWatch log group names"
  value       = []  # Placeholder - would be populated with actual log groups
} 