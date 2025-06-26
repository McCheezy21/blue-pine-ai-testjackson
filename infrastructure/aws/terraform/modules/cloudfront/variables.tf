# CloudFront Module Variables

variable "name_prefix" {
  description = "Prefix for resource names"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the distribution"
  type        = string
}

variable "additional_domain_names" {
  description = "Additional domain names to include in the CloudFront distribution and SSL certificate"
  type        = list(string)
  default     = []
}

variable "alb_domain_name" {
  description = "ALB domain name as origin"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
} 