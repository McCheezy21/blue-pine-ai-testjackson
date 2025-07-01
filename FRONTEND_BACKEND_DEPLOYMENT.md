# Frontend and Backend Deployment Guide

This guide will help you deploy both your React frontend and Node.js backend to the AWS infrastructure.

## Current Status

✅ **Infrastructure**: 95% deployed and working
✅ **Backend**: Docker image built and pushed to ECR  
✅ **Frontend**: Docker image built locally
❌ **Frontend**: Not yet pushed to ECR
❌ **ECS Services**: Need to be updated for dual-service architecture

## Quick Deployment Steps

### 1. Fix Local Backend Port Conflict

```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Start backend on different port for testing
cd packages/backend
PORT=3002 npm run dev
```

### 2. Deploy Frontend to ECR

First, ensure your AWS credentials are configured:

```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region (us-west-1)
```

Then deploy the frontend:

```bash
./deploy-frontend.sh
```

### 3. Update Infrastructure

```bash
cd infrastructure/aws/terraform
terraform apply -var-file=environments/staging.tfvars
```

## Detailed Architecture

### Frontend Configuration

The frontend is configured as a React SPA with:
- **Build**: Vite build system
- **Serving**: Nginx with reverse proxy to backend
- **Port**: 80 (internal container port)
- **Routing**: All `/api/*` requests proxied to backend

### Backend Configuration

The backend is configured as a Node.js Express API with:
- **Port**: 3001 (internal container port)
- **Health Check**: `/api/health` endpoint
- **Database**: PostgreSQL via RDS
- **Secrets**: AWS Secrets Manager for credentials

### Load Balancer Routing

The ALB routes traffic as follows:
- **`/api/*`** → Backend service (port 3001)
- **`/*`** → Frontend service (port 80, default)

## Environment Variables

### Frontend (.env.production)
```bash
VITE_API_URL=/api
```

### Backend (via Secrets Manager)
- `DATABASE_URL`
- `JWT_SECRET`
- `COGNITO_USER_POOL_ID`
- `COGNITO_CLIENT_ID`
- `COGNITO_CLIENT_SECRET`

## Docker Images

### Frontend Image
- **Base**: nginx:alpine
- **Build**: Multi-stage build with Node.js 18
- **Size**: ~50MB (optimized)
- **Location**: `841283904924.dkr.ecr.us-west-1.amazonaws.com/blue-pine-ai/frontend:staging`

### Backend Image
- **Base**: node:18-alpine
- **Size**: ~200MB
- **Location**: `841283904924.dkr.ecr.us-west-1.amazonaws.com/blue-pine-ai/backend:staging`

## Testing the Deployment

Once deployed, test the following endpoints:

### ALB Direct Access
```bash
# Test backend health
curl https://staging.chaseblueai.com/api/health

# Test frontend
curl https://staging.chaseblueai.com/
```

### CloudFront (CDN)
```bash
# Test via CloudFront
curl https://d34mbdgpqgp2wv.cloudfront.net/api/health
curl https://d34mbdgpqgp2wv.cloudfront.net/
```

## Troubleshooting

### Common Issues

1. **503 Errors**: ECS tasks are still starting (wait 2-5 minutes)
2. **502 Errors**: Backend health check failing
3. **CORS Issues**: Check frontend API configuration

### Checking ECS Status
```bash
aws ecs describe-services --cluster blue-pine-ai-staging-cluster --services blue-pine-ai-staging-backend-service blue-pine-ai-staging-frontend-service --region us-west-1
```

### Viewing Logs
```bash
# Backend logs
aws logs tail /ecs/blue-pine-ai-staging-backend --follow --region us-west-1

# Frontend logs  
aws logs tail /ecs/blue-pine-ai-staging-frontend --follow --region us-west-1
```

### Health Check Endpoints

- **Backend**: `https://staging.chaseblueai.com/api/health`
- **Frontend**: `https://staging.chaseblueai.com/` (should return HTML)

## Local Development

### Frontend Development
```bash
cd packages/frontend
npm run dev
# Runs on http://localhost:8085
```

### Backend Development
```bash
cd packages/backend
PORT=3002 npm run dev
# Runs on http://localhost:3002
```

### Full Stack Development
```bash
# Terminal 1: Backend
cd packages/backend && PORT=3002 npm run dev

# Terminal 2: Frontend (with API proxy)
cd packages/frontend && VITE_API_URL=http://localhost:3002 npm run dev
```

## Production Checklist

- [ ] Frontend image pushed to ECR
- [ ] Backend image pushed to ECR
- [ ] ECS services updated with new task definitions
- [ ] Target groups health checks passing
- [ ] ALB routing rules configured
- [ ] CloudFront cache invalidated if needed
- [ ] DNS records pointing to CloudFront
- [ ] SSL certificates valid

## Next Steps

1. **Run the frontend deployment script**: `./deploy-frontend.sh`
2. **Apply Terraform changes**: Update infrastructure for dual services
3. **Test the deployment**: Verify both frontend and backend are working
4. **Monitor**: Check CloudWatch logs for any issues

The infrastructure is ready - you just need to push the frontend image and update the ECS services! 