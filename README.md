# Blue Pine AI - Healthcare AI Platform

A modern monorepo for Blue Pine AI's healthcare automation platform, featuring React frontend and Express.js backend with AWS Bedrock integration.

## 🏗️ Architecture

This monorepo follows modern software engineering best practices with clear separation of concerns:

```
blue-pine-ai/
├── packages/
│   ├── frontend/          # React + TypeScript + Vite
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   └── backend/           # Express.js + Node.js API
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── utils/
│       │   └── middleware/
│       └── package.json
├── infrastructure/        # Docker, AWS, deployment configs
│   ├── docker/
│   ├── aws/
│   └── nginx/
├── docs-consolidated/     # All documentation
├── scripts/              # Development and deployment scripts
└── package.json          # Root workspace manager
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL (for local development)
- AWS CLI configured (for production features)

### Development Setup

1. **Clone and setup:**
```bash
git clone <your-repo>
cd blue-pine-ai
npm install
```

2. **Environment Configuration:**
```bash
# Copy backend environment template
cp packages/backend/env.example packages/backend/.env
# Edit with your configuration
```

3. **Start Development Servers:**
```bash
# Option 1: Use the dev script (recommended)
./scripts/dev.sh

# Option 2: Manual start
npm run dev:all

# Option 3: Start individually
npm run dev:frontend  # Frontend on http://localhost:8084
npm run dev:backend   # Backend on http://localhost:3001
```

## 📦 Package Management

This monorepo uses npm workspaces for efficient dependency management:

```bash
# Install dependencies for all packages
npm install

# Install for specific package
npm install <package> --workspace=packages/frontend
npm install <package> --workspace=packages/backend

# Run scripts in specific packages
npm run build --workspace=packages/frontend
npm run test --workspace=packages/backend
```

## 🔧 Available Scripts

### Root Level Commands
- `npm run dev` - Start frontend development server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build both packages for production
- `npm run lint` - Lint all packages
- `npm run clean` - Clean all node_modules and build artifacts

### Frontend Commands
```bash
cd packages/frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

### Backend Commands
```bash
cd packages/backend
npm run dev          # Development with nodemon
npm run start        # Production start
npm run setup        # Database setup
npm run setup:bedrock # AWS Bedrock setup
```

## 🏭 Tech Stack

### Frontend (`packages/frontend`)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **UI Library:** ShadCN UI (Radix UI + Tailwind CSS)
- **State Management:** React Query + React Context
- **Routing:** React Router v6
- **Authentication:** AWS Cognito + PointClickCare OAuth
- **Charts:** Recharts
- **Styling:** Tailwind CSS

### Backend (`packages/backend`)
- **Framework:** Express.js + Node.js
- **Database:** PostgreSQL with native pg driver
- **Authentication:** JWT + AWS Cognito + PointClickCare OAuth
- **AI Integration:** AWS Bedrock
- **Email:** AWS SES + Nodemailer
- **Testing:** Jest + Supertest

### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Cloud Platform:** AWS (Fargate, RDS, Bedrock, SES)
- **Web Server:** Nginx (reverse proxy)
- **Deployment:** AWS Fargate with ECS

## 🔐 Environment Configuration

### Backend Environment Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blue_pine_ai
DB_USER=postgres
DB_PASSWORD=your_password

# AWS Services
AWS_REGION=us-west-1
COGNITO_USER_POOL_ID=us-west-1_xxxxx
COGNITO_CLIENT_ID=xxxxx

# PointClickCare OAuth
POINTCLICKCARE_CLIENT_ID=your_client_id
POINTCLICKCARE_CLIENT_SECRET=your_client_secret

# Security
JWT_SECRET=your-jwt-secret-change-in-production

# Email (Optional)
EMAIL_SERVICE=AWS_SES
EMAIL_USER=noreply@yourdomain.com
```

## 🐳 Docker Deployment

### Local Development with Docker
```bash
cd infrastructure/docker
docker-compose up --build
```

### Production Build
```bash
# Build production image
docker build -f infrastructure/docker/Dockerfile -t blue-pine-ai .

# Run production container
docker run -p 3001:3001 --env-file packages/backend/.env blue-pine-ai
```

## 🚀 Production Deployment

### AWS Fargate
1. **Build and push to ECR:**
```bash
aws ecr get-login-password --region us-west-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-west-1.amazonaws.com
docker build -f infrastructure/docker/Dockerfile -t blue-pine-ai .
docker tag blue-pine-ai:latest <account>.dkr.ecr.us-west-1.amazonaws.com/blue-pine-ai:latest
docker push <account>.dkr.ecr.us-west-1.amazonaws.com/blue-pine-ai:latest
```

2. **Deploy using task definition:**
```bash
aws ecs update-service --cluster blue-pine-cluster --service blue-pine-service --task-definition infrastructure/aws/task-definition.json
```

## 📊 Features

### Frontend Features
- ✅ Multi-tenant dashboard
- ✅ PointClickCare OAuth integration
- ✅ Real-time chat interface with AI
- ✅ Insurance card processing automation
- ✅ Analytics and reporting
- ✅ Responsive design with dark/light mode
- ✅ Protected routes and role-based access

### Backend Features
- ✅ Multi-tenant architecture
- ✅ RESTful API with proper authentication
- ✅ AWS Bedrock AI integration
- ✅ PointClickCare API integration
- ✅ Email automation with SES
- ✅ Database migrations and seeding
- ✅ Health checks and monitoring
- ✅ JWT token validation

## 🧪 Testing

```bash
# Run all tests
npm run test

# Frontend tests
npm run test --workspace=packages/frontend

# Backend tests
npm run test --workspace=packages/backend

# Watch mode
npm run test:watch --workspace=packages/backend
```

## 📖 Documentation

Comprehensive documentation is available in the `docs-consolidated/` directory:

- [Quick Start Guide](docs-consolidated/QUICK_START.md)
- [Deployment Guide](docs-consolidated/DEPLOYMENT_GUIDE.md)
- [AWS Implementation](docs-consolidated/AWS_IMPLEMENTATION_STEPS.md)
- [Multi-Tenant Setup](docs-consolidated/MULTI_TENANT_IMPLEMENTATION.md)
- [Customer Onboarding](docs-consolidated/CUSTOMER_ONBOARDING_GUIDE.md)

## 🤝 Contributing

1. **Development Workflow:**
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run dev:all
npm run lint
npm run test

# Commit and push
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

2. **Code Standards:**
- Follow TypeScript/ESLint rules
- Write tests for new features
- Update documentation as needed
- Follow conventional commit messages

## 🔧 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Kill processes on ports
lsof -ti:8084 | xargs kill
lsof -ti:3001 | xargs kill
```

**Dependency issues:**
```bash
# Clean install
npm run clean
npm install
```

**Database connection:**
```bash
# Check PostgreSQL status
brew services list | grep postgresql
# Restart if needed
brew services restart postgresql
```

## 📝 License

This project is proprietary software owned by Blue Pine AI. All rights reserved.

## 📞 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `docs-consolidated/`

---

**Built with ❤️ by the Blue Pine AI Team**
