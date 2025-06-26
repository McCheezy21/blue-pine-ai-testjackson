# S3 Module Outputs

output "bucket_names" {
  description = "Map of S3 bucket names"
  value = {
    main      = aws_s3_bucket.main.bucket
    documents = aws_s3_bucket.documents.bucket
    backups   = aws_s3_bucket.backups.bucket
  }
}

output "bucket_arns" {
  description = "Map of S3 bucket ARNs"
  value = {
    main      = aws_s3_bucket.main.arn
    documents = aws_s3_bucket.documents.arn
    backups   = aws_s3_bucket.backups.arn
  }
}

output "main_bucket_name" {
  description = "Main application bucket name"
  value       = aws_s3_bucket.main.bucket
}

output "documents_bucket_name" {
  description = "Documents bucket name"
  value       = aws_s3_bucket.documents.bucket
}

output "backups_bucket_name" {
  description = "Backups bucket name"
  value       = aws_s3_bucket.backups.bucket
} 