
################################################################################
#                             1. NETWORK LAYER                                 #
#     This section creates the VPC, Internet Gateway, Subnets, Route Tables,   #
#     and their associations for the Grand Cineplex environment.               #
################################################################################

# Virtual Private Cloud for all resources
resource "aws_vpc" "grand_cineplex_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = { Name = "grand_cineplex-vpc" }
}

# Internet Gateway for Internet access from the VPC
resource "aws_internet_gateway" "grand_cineplex_igw" {
  vpc_id = aws_vpc.grand_cineplex_vpc.id
  tags   = { Name = "grand_cineplex-igw" }
}

# Public Subnet (for application/load balancer, with public IPs)
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.grand_cineplex_vpc.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "${var.aws_region}a"
  tags                   = { Name = "grand_cineplex-public-subnet" }
}

# Private Subnet 1 (for internal resources e.g., RDS)
resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.grand_cineplex_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}a"
  tags             = { Name = "grand_cineplex-private-subnet-1" }
}

# Private Subnet 2 (for redundancy, separate AZ)
resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.grand_cineplex_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "${var.aws_region}b"
  tags             = { Name = "grand_cineplex-private-subnet-2" }
}

# Main Route Table for public subnet traffic to IGW
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.grand_cineplex_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.grand_cineplex_igw.id
  }
}

# Association of route table with public subnet
resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}


################################################################################
#                            2. DATABASE LAYER                                 #
#     This section provisions the security group for DB, DB subnet group, and   #
#     the actual Postgres RDS instance.                                        #
################################################################################

# Security Group for RDS (allow DB access from within the VPC only)
resource "aws_security_group" "rds_sg" {
  name   = "grand_cineplex-rds-sg"
  vpc_id = aws_vpc.grand_cineplex_vpc.id
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.grand_cineplex_vpc.cidr_block] 
  }
}

# RDS Subnet Group (group of private subnets)
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "grand_cineplex-db-subnet-group"
  subnet_ids = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
}

# Managed PostgreSQL DB instance in the subnets/security group above
resource "aws_db_instance" "grand_cineplex_db" {
  identifier             = "grand_cineplex-postgres-db"
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