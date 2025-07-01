# Route53 Module for Blue Pine AI
# Basic DNS management

# Route 53 records for CloudFront
resource "aws_route53_record" "main" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_zone_id
    evaluate_target_health = false
  }
}

# Additional domain records
resource "aws_route53_record" "additional_domains" {
  for_each = toset(var.additional_domain_names)
  
  zone_id = data.aws_route53_zone.main.zone_id
  name    = each.value
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_zone_id
    evaluate_target_health = false
  }
}

# Data source for existing hosted zone
data "aws_route53_zone" "main" {
  name         = replace(var.domain_name, "/^[^.]+\\./", "")  # Get parent domain for subdomains
  private_zone = false
} 