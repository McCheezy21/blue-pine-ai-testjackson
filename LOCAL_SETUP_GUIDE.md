# 🚀 Blue Pine AI - Local Development Setup Guide

This guide will help you set up and run the Blue Pine AI platform on your local machine.

## 📋 Prerequisites

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v14 or higher) - [Download](https://postgresql.org/download/)
- **Python** (v3.9 or higher) - [Download](https://python.org/downloads/)
- **Git** - [Download](https://git-scm.com/)

### AWS Account (Optional for AI features)
- AWS account with Bedrock access
- AWS CLI configured - [Setup Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

## 🔧 Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd blue-pine-ai
```

### 2. Install Dependencies
```bash
# Install all workspace dependencies
npm install

# This will install dependencies for:
# - Root workspace
# - packages/frontend
# - packages/backend
# - packages/python-services
```

### 3. Database Setup

#### Option A: Local PostgreSQL
```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Ubuntu: sudo systemctl start postgresql
# Windows: Start from Services or pgAdmin

# Create database
psql -U postgres -c "CREATE DATABASE blue_pine_ai;"

# Run database schema
psql -U postgres -d blue_pine_ai -f infrastructure/database/schema.sql
```

#### Option B: Docker PostgreSQL
```bash
# Start PostgreSQL in Docker
docker run --name blue-pine-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=blue_pine_ai \
  -p 5432:5432 \
  -d postgres:14

# Wait for container to start, then run schema
sleep 10
docker exec -i blue-pine-postgres psql -U postgres -d blue_pine_ai < infrastructure/database/schema.sql
```

### 4. Environment Configuration

#### Backend Environment
Create `packages/backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blue_pine_ai
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# AWS Bedrock (Optional - for AI features)
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# AWS Cognito (Optional - for authentication)
COGNITO_REGION=us-west-1
COGNITO_USER_POOL_ID=us-west-1_YourPoolId
COGNITO_CLIENT_ID=your-cognito-client-id

# PointClickCare OAuth (Optional)
POINTCLICKCARE_CLIENT_ID=your-pcc-client-id
POINTCLICKCARE_CLIENT_SECRET=your-pcc-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:8084

# Email Configuration (Optional)
EMAIL_FROM=noreply@yourdomain.com
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

#### Frontend Environment
Create `packages/frontend/.env`:
```env
# API Configuration
VITE_API_URL=http://localhost:3001

# AWS Cognito (Optional)
VITE_COGNITO_REGION=us-west-1
VITE_COGNITO_USER_POOL_ID=us-west-1_YourPoolId
VITE_COGNITO_CLIENT_ID=your-cognito-client-id

# PointClickCare OAuth (Optional)
VITE_POINTCLICKCARE_CLIENT_ID=your-pcc-client-id
VITE_POINTCLICKCARE_REDIRECT_URI=http://localhost:8084/auth/pointclickcare/callback
```

#### Python Services Environment
Create `packages/python-services/.env`:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/blue_pine_ai

# AWS Configuration
AWS_REGION=us-west-2
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

### 5. Python Services Setup (Optional)
```bash
cd packages/python-services

# Create virtual environment
python -m venv venv

# Activate virtual environment
# macOS/Linux: source venv/bin/activate
# Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

## 🚀 Running the Application

### Quick Start (All Services)
```bash
# From project root
npm run dev
```

### Individual Services

#### Frontend Only
```bash
npm run dev:frontend
# Runs on: http://localhost:8084
```

#### Backend Only
```bash
npm run dev:backend  
# Runs on: http://localhost:3001
```

#### Python Services Only
```bash
npm run dev:python
# Runs on: http://localhost:8000
```

## 🔍 Verification

### Check Services
```bash
# Backend health check
curl http://localhost:3001/api/health

# Frontend
open http://localhost:8084

# Python services (if running)
curl http://localhost:8000/health
```

### Expected Response
- **Frontend**: Beautiful Blue Pine AI website loads
- **Backend**: `{"status":"ok","timestamp":"..."}`
- **Python**: `{"status":"healthy"}`

## 🎯 What You'll See

When everything is running, you'll have access to:

- **🌐 Main Website** (http://localhost:8084)
  - Landing page with features and testimonials
  - User authentication and registration
  - Multi-tenant dashboard
  
- **🤖 AI Features** (if AWS configured)
  - Chat interface with AWS Bedrock
  - Document processing automation
  - Insurance card OCR
  
- **👤 Admin Features**
  - Tenant management
  - User invitation system
  - Analytics and reporting

## 🛠️ Development Commands

```bash
# Frontend development
cd packages/frontend
npm run build          # Production build
npm run preview        # Preview production build
npm run lint           # Run ESLint

# Backend development  
cd packages/backend
npm run dev            # Development with nodemon
npm start              # Production mode
npm run test           # Run tests (if configured)

# Python services
cd packages/python-services
python main.py         # Direct run
uvicorn main:app --reload  # With auto-reload
```

## 🔧 Troubleshooting

### Port Conflicts
- Frontend default: 8084 (Vite will auto-increment if busy)
- Backend default: 3001
- Python services: 8000

### Database Connection Issues
```bash
# Check PostgreSQL status
# macOS: brew services list | grep postgresql
# Linux: sudo systemctl status postgresql
# Windows: Check Services panel

# Test database connection
psql -U postgres -d blue_pine_ai -c "SELECT version();"
```

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json
npm install
```

### AWS/Bedrock Issues
- Ensure AWS CLI is configured: `aws configure`
- Check AWS region supports Bedrock
- Verify IAM permissions for Bedrock access

## 🎉 You're Ready!

Once everything is running, you'll have a fully functional local development environment for Blue Pine AI with:

- ✅ Modern React frontend with TypeScript
- ✅ Express.js backend API
- ✅ PostgreSQL database
- ✅ Optional Python ML services
- ✅ Optional AWS Bedrock AI integration
- ✅ Multi-tenant architecture
- ✅ Production-ready code structure

Happy coding! 🌲🚀

## 📚 Additional Resources

- [Frontend Documentation](docs-consolidated/FRONTEND_GUIDE.md)
- [Backend API Reference](docs-consolidated/API_REFERENCE.md)
- [Database Schema](infrastructure/database/schema.sql)
- [Deployment Guide](docs-consolidated/DEPLOYMENT_GUIDE.md) 