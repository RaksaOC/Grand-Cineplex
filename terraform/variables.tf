variable "aws_region" {
  description = "AWS region for the infrastructure"
  type        = string
  default     = "ap-southeast-1"
}

variable "db_username" {
  description = "Database administrator username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database administrator password"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "Secret for signing JWTs (backend middleware). Written to EC2 src/server/.env; embedded via base64 in user-data so special characters do not break shell quoting."
  type        = string
  sensitive   = true
}

variable "cors_allowed_origins" {
  description = "Allowed Origins for S3 media bucket CORS (browser PUT to presigned URLs + GET for posters). Use [\"*\"] for dev or list explicit origins for production."
  type        = list(string)
  default     = ["*"]
}