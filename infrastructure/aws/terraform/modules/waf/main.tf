# WAF Module for Blue Pine AI
# Basic Web Application Firewall

terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# WAF Web ACL (must be in us-east-1 for CloudFront)
resource "aws_wafv2_web_acl" "main" {
  provider = aws.us_east_1
  name     = "${var.name_prefix}-waf"
  scope    = "CLOUDFRONT"

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                 = "${var.name_prefix}-CommonRuleSetMetric"
      sampled_requests_enabled    = true
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                 = "${var.name_prefix}-KnownBadInputsMetric"
      sampled_requests_enabled    = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                 = "${var.name_prefix}-WAFMetric"
    sampled_requests_enabled    = true
  }

  tags = var.tags
}

 