#!/bin/bash

# Blue Pine AI - AWS Infrastructure Deployment Script
# This script automates the Terraform deployment process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="blue-pine-ai"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_usage() {
    echo "Usage: $0 [ENVIRONMENT] [ACTION]"
    echo ""
    echo "ENVIRONMENT:"
    echo "  staging     Deploy to staging environment"
    echo "  production  Deploy to production environment"
    echo ""
    echo "ACTION:"
    echo "  plan        Show deployment plan (default)"
    echo "  apply       Apply changes"
    echo "  destroy     Destroy infrastructure"
    echo "  init        Initialize Terraform"
    echo "  validate    Validate configuration"
    echo "  output      Show outputs"
    echo ""
    echo "Examples:"
    echo "  $0 staging plan"
    echo "  $0 production apply"
    echo "  $0 staging destroy"
    echo ""
}

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed. Please install Terraform >= 1.0"
        exit 1
    fi
    
    # Check if AWS CLI is installed
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI is not installed. Please install AWS CLI"
        exit 1
    fi
    
    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS credentials not configured. Run 'aws configure'"
        exit 1
    fi
    
    # Check Terraform version
    TF_VERSION=$(terraform version -json | jq -r '.terraform_version')
    log_info "Terraform version: $TF_VERSION"
    
    # Check AWS account
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_REGION=$(aws configure get region)
    log_info "AWS Account: $AWS_ACCOUNT"
    log_info "AWS Region: $AWS_REGION"
    
    log_success "Prerequisites check passed"
}

check_required_variables() {
    local env=$1
    log_info "Checking required variables for $env environment..."
    
    # Check if required environment variables are set
    if [[ -z "${TF_VAR_db_password:-}" ]]; then
        log_error "TF_VAR_db_password environment variable is required"
        log_info "Set it with: export TF_VAR_db_password='your-secure-password'"
        exit 1
    fi
    
    if [[ -z "${TF_VAR_jwt_secret:-}" ]]; then
        log_error "TF_VAR_jwt_secret environment variable is required"
        log_info "Set it with: export TF_VAR_jwt_secret='your-jwt-secret'"
        exit 1
    fi
    
    log_success "Required variables check passed"
}

setup_backend() {
    local env=$1
    log_info "Setting up Terraform backend for $env..."
    
    local bucket_name="blue-pine-ai-terraform-state-$(aws sts get-caller-identity --query Account --output text)"
    local state_key="$env/terraform.tfstate"
    
    # Check if bucket exists, create if not
    if ! aws s3 ls "s3://$bucket_name" &> /dev/null; then
        log_info "Creating S3 bucket for Terraform state: $bucket_name"
        aws s3 mb "s3://$bucket_name"
        
        # Enable versioning
        aws s3api put-bucket-versioning \
            --bucket "$bucket_name" \
            --versioning-configuration Status=Enabled
        
        # Enable encryption
        aws s3api put-bucket-encryption \
            --bucket "$bucket_name" \
            --server-side-encryption-configuration '{
                "Rules": [{
                    "ApplyServerSideEncryptionByDefault": {
                        "SSEAlgorithm": "AES256"
                    }
                }]
            }'
        
        log_success "S3 bucket created and configured"
    else
        log_info "S3 bucket already exists: $bucket_name"
    fi
    
    # Update backend configuration
    cat > backend.tf << EOF
terraform {
  backend "s3" {
    bucket = "$bucket_name"
    key    = "$state_key"
    region = "$(aws configure get region)"
  }
}
EOF
    
    log_success "Backend configuration updated"
}

terraform_init() {
    log_info "Initializing Terraform..."
    terraform init -upgrade
    log_success "Terraform initialized"
}

terraform_validate() {
    log_info "Validating Terraform configuration..."
    terraform validate
    terraform fmt -check=true
    log_success "Configuration is valid"
}

terraform_plan() {
    local env=$1
    log_info "Planning Terraform deployment for $env..."
    
    terraform plan \
        -var-file="environments/$env.tfvars" \
        -out="$env.tfplan"
    
    log_success "Plan completed. Review the changes above."
    log_info "To apply these changes, run: $0 $env apply"
}

terraform_apply() {
    local env=$1
    log_info "Applying Terraform deployment for $env..."
    
    # Check if plan file exists
    if [[ ! -f "$env.tfplan" ]]; then
        log_warning "No plan file found. Creating new plan..."
        terraform_plan "$env"
    fi
    
    # Confirm before applying
    echo ""
    log_warning "This will apply changes to your AWS infrastructure."
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [[ $confirm != "yes" ]]; then
        log_info "Deployment cancelled"
        exit 0
    fi
    
    terraform apply "$env.tfplan"
    
    # Clean up plan file
    rm -f "$env.tfplan"
    
    log_success "Deployment completed successfully!"
    
    # Show important outputs
    log_info "Important outputs:"
    terraform output application_url
    terraform output api_url
}

terraform_destroy() {
    local env=$1
    log_warning "This will DESTROY all infrastructure for $env environment!"
    echo ""
    read -p "Type 'destroy-$env' to confirm: " confirm
    
    if [[ $confirm != "destroy-$env" ]]; then
        log_info "Destruction cancelled"
        exit 0
    fi
    
    log_info "Destroying infrastructure for $env..."
    terraform destroy -var-file="environments/$env.tfvars"
    log_success "Infrastructure destroyed"
}

terraform_output() {
    log_info "Terraform outputs:"
    terraform output
}

main() {
    local env=${1:-}
    local action=${2:-plan}
    
    # Show usage if no arguments
    if [[ -z "$env" ]]; then
        show_usage
        exit 1
    fi
    
    # Validate environment
    if [[ "$env" != "staging" && "$env" != "production" ]]; then
        log_error "Invalid environment: $env"
        log_info "Valid environments: staging, production"
        exit 1
    fi
    
    # Validate action
    case "$action" in
        plan|apply|destroy|init|validate|output)
            ;;
        *)
            log_error "Invalid action: $action"
            log_info "Valid actions: plan, apply, destroy, init, validate, output"
            exit 1
            ;;
    esac
    
    # Change to script directory
    cd "$SCRIPT_DIR"
    
    log_info "Starting Blue Pine AI infrastructure deployment"
    log_info "Environment: $env"
    log_info "Action: $action"
    echo ""
    
    # Run checks
    check_prerequisites
    
    if [[ "$action" != "init" && "$action" != "validate" ]]; then
        check_required_variables "$env"
        setup_backend "$env"
    fi
    
    # Execute action
    case "$action" in
        init)
            terraform_init
            ;;
        validate)
            terraform_validate
            ;;
        plan)
            terraform_init
            terraform_validate
            terraform_plan "$env"
            ;;
        apply)
            terraform_init
            terraform_validate
            terraform_apply "$env"
            ;;
        destroy)
            terraform_destroy "$env"
            ;;
        output)
            terraform_output
            ;;
    esac
    
    log_success "Operation completed successfully!"
}

# Run main function with all arguments
main "$@" 