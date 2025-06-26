# WAF Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN to protect"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 