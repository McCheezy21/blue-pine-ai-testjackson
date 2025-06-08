# Blue Pine AI - Updated Multi-Tenant Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                   INTERNET                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              ROUTE 53 (DNS)                                        │
│                            bluepineai.com                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              CLOUDFLARE                                            │
│                         (CDN + DDoS Protection)                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                        APPLICATION LOAD BALANCER                                   │
│                              (AWS ALB)                                             │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
        ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
        │   ECS CONTAINER  │ │   ECS CONTAINER  │ │   ECS CONTAINER  │
        │    (Fargate)     │ │    (Fargate)     │ │    (Fargate)     │
        └──────────────────┘ └──────────────────┘ └──────────────────┘
                    │                   │                   │
        ┌───────────┼───────────────────┼───────────────────┼───────────┐
        │           │                   │                   │           │
        ▼           ▼                   ▼                   ▼           ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  FRONTEND   │ │ MULTI-TENANT│ │    MAIN     │ │   COGNITO   │ │   RDS       │
│   (React)   │ │     API     │ │   AI API    │ │  (OAuth)    │ │ PostgreSQL  │
│             │ │  (Node.js)  │ │  (Node.js)  │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
                        │                   │                           │
                        │                   │                           │
                        └───────────────────┼───────────────────────────┘
                                            │
                                            ▼
                                 ┌─────────────────┐
                                 │   API GATEWAY   │
                                 │      (AWS)      │
                                 └─────────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        ▼                   ▼                   ▼
                ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
                │   LAMBDA     │   │   LAMBDA     │   │   LAMBDA     │
                │  FUNCTION    │   │  FUNCTION    │   │  FUNCTION    │
                └──────────────┘   └──────────────┘   └──────────────┘
                        │                   │                   │
                        └───────────────────┼───────────────────┘
                                            ▼
                                 ┌─────────────────┐
                                 │   AMAZON S3     │
                                 │   (Storage)     │
                                 └─────────────────┘
```

## Request Flow Patterns

### **1. Multi-Tenant Customer Onboarding**
```
1. Admin creates invitation    → POST /api/admin/invitations
2. Customer gets email         → Email with invitation link
3. Customer clicks link        → GET /invite/{token}
4. Customer signs up           → OAuth with Cognito + tenant assignment
5. Customer accesses app       → GET /tenant/{id}/dashboard
```

### **2. Tenant-Specific API Calls**
```
User Request → ALB → ECS Container → Multi-Tenant API → PostgreSQL
                                  ↓
                            Tenant validation & isolation
                                  ↓
                            Forward to Main AI API → Lambda Functions
```

### **3. Public Marketing Site**
```
User Request → ALB → ECS Container → Frontend (React) → Static content
```

## Key Components

### **ECS Containers (Multi-Service)**
Each container runs multiple services:
- **Frontend**: React app for marketing + tenant dashboards
- **Multi-Tenant API**: Handles tenant isolation, user management
- **Main AI API**: Your existing Blue Pine AI functionality
- **Authentication**: Integration with Cognito for OAuth

### **PostgreSQL RDS**
- **Tables**: tenants, tenant_users, tenant_invitations
- **Security**: Row-level security for tenant isolation
- **Connection**: Private within VPC (make private after setup!)

### **Updated Route Structure**
```
bluepineai.com/                    → Marketing site
bluepineai.com/invite/{token}      → Invitation landing page
bluepineai.com/tenant/{id}/        → Tenant-specific dashboard
bluepineai.com/api/admin/          → Admin endpoints
bluepineai.com/api/tenants/        → Tenant management
bluepineai.com/api/invitations/    → Invitation system
bluepineai.com/api/v1/             → Your existing AI API
```

## Security Layers

1. **CloudFlare**: DDoS protection, rate limiting
2. **ALB**: SSL termination, load balancing
3. **Cognito**: OAuth authentication
4. **Multi-Tenant API**: JWT validation, tenant isolation
5. **PostgreSQL**: Row-level security, encrypted connections
6. **VPC**: Network isolation for database

## Deployment Strategy

### **GitHub Actions → Docker → ECS**
1. Code push to GitHub
2. GitHub Actions builds Docker image
3. Push to Amazon ECR
4. Deploy to ECS Fargate
5. Auto-scaling based on demand

### **Database Deployment**
- **Development**: Temporarily public for schema setup
- **Production**: Private, only accessible from ECS containers
- **Migrations**: Run via ECS tasks or Lambda functions

## Multi-Tenant Isolation

### **URL-Based Tenancy**
- Each customer gets: `bluepineai.com/tenant/pacs-corp/dashboard`
- Tenant ID extracted from URL path
- All API calls validated against tenant ownership

### **Database Isolation**
- Row-level security ensures tenant data separation
- Every query automatically filtered by tenant_id
- Impossible for one tenant to see another's data

## Production Considerations

- **Make RDS private** after initial setup
- **Use least-privilege IAM roles**
- **Enable CloudTrail** for audit logging
- **Set up monitoring** with CloudWatch
- **Implement backup strategy** for RDS
- **Use secrets manager** for database credentials 