#!/bin/bash

# Deploy Frontend to AWS ECS
# This script builds the frontend Docker image and pushes it to ECR

set -e

# Configuration
AWS_REGION="us-west-1"
AWS_ACCOUNT_ID="841283904924"
AWS_PROFILE="AdministratorAccess-841283904924"
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
FRONTEND_REPO="blue-pine-ai/frontend"
IMAGE_TAG="staging"

echo "🚀 Starting frontend deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity --profile ${AWS_PROFILE} > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured for profile ${AWS_PROFILE}. Please run 'aws configure --profile ${AWS_PROFILE}' first."
    exit 1
fi

# Create ECR repository if it doesn't exist
echo "📦 Creating ECR repository if needed..."
aws ecr describe-repositories --repository-names ${FRONTEND_REPO} --region ${AWS_REGION} --profile ${AWS_PROFILE} > /dev/null 2>&1 || {
    echo "Creating ECR repository: ${FRONTEND_REPO}"
    aws ecr create-repository --repository-name ${FRONTEND_REPO} --region ${AWS_REGION} --profile ${AWS_PROFILE}
}

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region ${AWS_REGION} --profile ${AWS_PROFILE} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Build frontend image
echo "🏗️  Building frontend Docker image..."
cd packages/frontend
docker build -t ${FRONTEND_REPO}:${IMAGE_TAG} .

# Tag for ECR
echo "🏷️  Tagging image for ECR..."
docker tag ${FRONTEND_REPO}:${IMAGE_TAG} ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}

# Push to ECR
echo "📤 Pushing image to ECR..."
docker push ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}

echo "✅ Frontend image successfully pushed to ECR!"
echo "📍 Image URI: ${ECR_REGISTRY}/${FRONTEND_REPO}:${IMAGE_TAG}"

# Update ECS service (optional)
echo ""
echo "To update the ECS service, run:"
echo "cd infrastructure/aws/terraform && terraform apply -var-file=environments/staging.tfvars" 