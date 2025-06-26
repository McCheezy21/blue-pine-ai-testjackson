# Route53 Module Outputs

output "zone_id" {
  description = "Route 53 hosted zone ID"
  value       = data.aws_route53_zone.main.zone_id
}

output "name_servers" {
  description = "Route 53 name servers"
  value       = data.aws_route53_zone.main.name_servers
} 