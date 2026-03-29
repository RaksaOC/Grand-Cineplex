################################################################################
#                             1. NETWORK LAYER                                 #
################################################################################

resource "aws_vpc" "grand_cineplex_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags                 = { Name = "grand_cineplex-vpc" }
}

resource "aws_internet_gateway" "grand_cineplex_igw" {
  vpc_id = aws_vpc.grand_cineplex_vpc.id
  tags   = { Name = "grand_cineplex-igw" }
}

resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.grand_cineplex_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags                    = { Name = "grand_cineplex-public-subnet" }
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.grand_cineplex_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}a"
  tags              = { Name = "grand_cineplex-private-subnet-1" }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.grand_cineplex_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "${var.aws_region}b"
  tags              = { Name = "grand_cineplex-private-subnet-2" }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.grand_cineplex_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.grand_cineplex_igw.id
  }
}

resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# EC2 / ALB security group must exist before RDS SG so RDS can allow Postgres only from app instances.
resource "aws_security_group" "ec2_sg" {
  name   = "grand-cineplex-ec2-sg"
  vpc_id = aws_vpc.grand_cineplex_vpc.id

  ingress {
    description = "HTTP from internet (ALB and direct)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH (restrict to your IP in production)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "grand-cineplex-ec2-sg" }
}

################################################################################
#                            2. DATABASE LAYER                                 #
################################################################################

resource "aws_security_group" "rds_sg" {
  name   = "grand_cineplex-rds-sg"
  vpc_id = aws_vpc.grand_cineplex_vpc.id

  ingress {
    description     = "PostgreSQL from EC2 application instances only"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "grand-cineplex-rds-sg" }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "grand_cineplex-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

resource "aws_db_instance" "grand_cineplex_db" {
  identifier             = "grand-cineplex-db"
  allocated_storage      = 20
  engine                 = "postgres"
  instance_class         = "db.t3.micro"
  db_name                = "grand_cineplex_db"
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot    = true
  publicly_accessible    = false
}

################################################################################
#                   3. COMPUTE & SECURITY LAYER (BACKEND)                      #
################################################################################

resource "aws_iam_role" "ec2_s3_role" {
  name = "grand-cineplex-ec2-s3-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "s3_full" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role_policy_attachment" "cw_logs" {
  role       = aws_iam_role.ec2_s3_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "grand-cineplex-ec2-profile"
  role = aws_iam_role.ec2_s3_role.name
}

resource "aws_launch_template" "grand_cineplex_lt" {
  name_prefix   = "grand-cineplex-lt-"
  image_id      = "ami-060e277c0d4cce553"
  key_name      = "grand-cineplex-kp"
  instance_type = "t3.micro"

  iam_instance_profile { name = aws_iam_instance_profile.ec2_profile.name }

  network_interfaces {
    associate_public_ip_address = true
    security_groups             = [aws_security_group.ec2_sg.id]
  }

  user_data = base64encode(<<-EOF
              #!/bin/bash
              sudo apt-get update -y
              curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
              sudo apt-get install -y nodejs git

              # Setup App
              git clone https://github.com/RaksaOC/Grand-Cineplex.git /home/ubuntu/app
              cd /home/ubuntu/app/src/server
              
              # DYNAMIC ENV INJECTION (JWT via base64 decode — safe for $, quotes, etc.)
              echo "PORT=80" > .env
              echo "DATABASE_URL=postgresql://${var.db_username}:${urlencode(var.db_password)}@${aws_db_instance.grand_cineplex_db.endpoint}/grand_cineplex_db" >> .env
              echo "S3_BUCKET=${aws_s3_bucket.media_bucket.id}" >> .env
              echo "AWS_REGION=${var.aws_region}" >> .env
              echo "JWT_SECRET=$(echo '${base64encode(var.jwt_secret)}' | base64 -d)" >> .env

              npm install
              sudo npm install -g pm2
              pm2 start server.ts
              EOF
  )
}

resource "aws_autoscaling_group" "grand_cineplex_asg" {
  desired_capacity    = 2
  max_size            = 2
  min_size            = 1
  vpc_zone_identifier = [aws_subnet.public_subnet.id]

  launch_template {
    id      = aws_launch_template.grand_cineplex_lt.id
    version = "$Latest"
  }

  depends_on = [aws_db_instance.grand_cineplex_db]
}

################################################################################
#                            4. LOAD BALANCER (ALB)                            #
################################################################################

resource "aws_lb" "grand_cineplex_alb" {
  name               = "grand-cineplex-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ec2_sg.id]
  subnets            = [aws_subnet.public_subnet.id, aws_subnet.private_subnet_2.id]
}

resource "aws_lb_target_group" "grand_cineplex_tg" {
  name     = "grand-cineplex-tg"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.grand_cineplex_vpc.id

  health_check {
    path = "/health"
  }
}

resource "aws_lb_listener" "grand_cineplex_listener" {
  load_balancer_arn = aws_lb.grand_cineplex_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.grand_cineplex_tg.arn
  }
}

resource "aws_autoscaling_attachment" "grand_cineplex_asg_attachment" {
  autoscaling_group_name = aws_autoscaling_group.grand_cineplex_asg.id
  lb_target_group_arn    = aws_lb_target_group.grand_cineplex_tg.arn
}

################################################################################
#                                5. S3 STORAGE                                 #
################################################################################

# --- FRONTEND BUCKET (Static Hosting) ---
resource "aws_s3_bucket" "frontend_bucket" {
  bucket = "grand-cineplex-frontend" # REPLACE XYZ WITH UNIQUE ID
}

resource "aws_s3_bucket_website_configuration" "frontend_web" {
  bucket = aws_s3_bucket.frontend_bucket.id
  index_document { suffix = "index.html" }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.frontend_bucket.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read_policy" {
  bucket     = aws_s3_bucket.frontend_bucket.id
  depends_on = [aws_s3_bucket_public_access_block.public_access]
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicReadGetObject"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
    }]
  })
}

# --- MEDIA BUCKET (Application Uploads) ---
resource "aws_s3_bucket" "media_bucket" {
  bucket = "grand-cineplex-media" # REPLACE XYZ WITH UNIQUE ID
}

# Allow a bucket policy for public GET on poster prefix; block ACL-based public access
resource "aws_s3_bucket_public_access_block" "media_access" {
  bucket = aws_s3_bucket.media_bucket.id

  block_public_acls       = true
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = false
}

# Browser uploads via presigned PUT; tighten allowed_origins in production
resource "aws_s3_bucket_cors_configuration" "media_cors" {
  bucket = aws_s3_bucket.media_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "HEAD"]
    allowed_origins = var.cors_allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }

  depends_on = [aws_s3_bucket_public_access_block.media_access]
}

# Public read for uploaded poster objects only (prefix matches s3PosterService key layout)
resource "aws_s3_bucket_policy" "media_posters_public_read" {
  bucket = aws_s3_bucket.media_bucket.id

  depends_on = [aws_s3_bucket_public_access_block.media_access]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadMoviePosters"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.media_bucket.arn}/movie-posters/*"
      }
    ]
  })
}

################################################################################
#                        6. CLOUDWATCH ALERTING                                #
################################################################################

resource "aws_cloudwatch_metric_alarm" "grand_cineplex_high_cpu_alarm" {
  alarm_name          = "grand-cineplex-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "70"

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.grand_cineplex_asg.name
  }
}

