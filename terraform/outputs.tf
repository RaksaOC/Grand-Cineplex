output "db_endpoint" {
  description = "The connection endpoint for the RDS database"
  value       = aws_db_instance.grand_cineplex_db.endpoint
}

output "alb_dns_name" {
  description = "The DNS name of the load balancer"
  value       = aws_lb.grand_cineplex_alb.dns_name
}

output "s3_website_endpoint" {
  description = "The website endpoint for the frontend"
  value       = aws_s3_bucket_website_configuration.frontend_web.website_endpoint
}

output "rds_endpoint" {
  description = "The connection endpoint for the database"
  value       = aws_db_instance.grand_cineplex_db.endpoint
}