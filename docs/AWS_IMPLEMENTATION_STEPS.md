# AWS Multi-Tenant Implementation Steps
## Get Your SaaS Running on AWS (Step-by-Step)

Since you're already using AWS Cognito and ECS, here's exactly what to do next:

## 🎯 **Phase 1: Backend API (Start Here - Week 1)**

### Step 1: Create AWS RDS PostgreSQL Database (Today)
```bash
# 1. Go to AWS RDS Console
# 2. Click "Create database"
# 3. Choose PostgreSQL
# 4. Select "Free tier" template for testing
# 5. Settings:
#    - DB instance identifier: bluepine-multi-tenant-db
#    - Master username: postgres
#    - Auto generate password (save it!)
# 6. Connect to VPC where your ECS runs
# 7. Create database
```

### Step 2: Set Up Database Schema (Day 2)
Use AWS RDS Query Editor or connect via pgAdmin:

```sql
-- Run this in your new PostgreSQL database
CREATE TABLE tenants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'suspended', 'trial')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tenant_users (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'viewer')),
    permissions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_sub)
);

-- Create a test tenant
INSERT INTO tenants (id, name, plan, status) 
VALUES ('demo-tenant', 'Demo Company', 'free', 'active');

-- Add yourself as admin (replace with your Cognito sub)
INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
VALUES ('demo-tenant', 'google_115880709094631836487', 'admin', ARRAY['all']);
```

### Step 3: Create Simple Node.js API (Day 3-4)
Create a new API service that you'll deploy alongside your React app:

```bash
# In your project root, create API folder
mkdir api
cd api
npm init -y
npm install express cors pg dotenv jsonwebtoken aws-sdk
```

Create `api/server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST,     // Your RDS endpoint
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

// Simple JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  
  // For now, just decode without verification (you can enhance this)
  try {
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// API Routes
app.get('/api/tenants/:tenantId', verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;
    
    // Check if user has access to this tenant
    const userAccess = await pool.query(
      'SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
      [tenantId, req.user.sub]
    );
    
    if (userAccess.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Get tenant info
    const tenant = await pool.query(
      'SELECT * FROM tenants WHERE id = $1',
      [tenantId]
    );
    
    if (tenant.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(tenant.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/tenants/:tenantId/users/:userSub/access', verifyToken, async (req, res) => {
  try {
    const { tenantId, userSub } = req.params;
    
    const result = await pool.query(
      'SELECT role, permissions FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
      [tenantId, userSub]
    );
    
    if (result.rows.length === 0) {
      return res.json({ hasAccess: false });
    }
    
    res.json({
      hasAccess: true,
      role: result.rows[0].role,
      permissions: result.rows[0].permissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(3001, () => {
  console.log('API server running on port 3001');
});
```

## 🎯 **Phase 2: Deploy to AWS (Week 1 continued)**

### Step 4: Update Your ECS Setup
Since you already have ECS deployment, update your `Dockerfile` to run both frontend and API:

```dockerfile
# Add this to your existing Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy and build frontend (your existing setup)
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Copy and setup API
COPY api ./api
WORKDIR /app/api
RUN npm install

# Install nginx to serve both
RUN apk add nginx

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8084
CMD ["sh", "-c", "cd /app/api && node server.js & nginx -g 'daemon off;'"]
```

Create `nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream api {
        server localhost:3001;
    }

    server {
        listen 8084;
        root /app/dist;
        index index.html;

        # Serve API requests
        location /api/ {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Serve React app (catch-all for client-side routing)
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Step 5: Add Environment Variables to ECS
In your ECS task definition, add these environment variables:
```json
{
  "environment": [
    {
      "name": "DB_HOST",
      "value": "your-rds-endpoint.region.rds.amazonaws.com"
    },
    {
      "name": "DB_NAME", 
      "value": "postgres"
    },
    {
      "name": "DB_USER",
      "value": "postgres"
    },
    {
      "name": "DB_PASSWORD",
      "value": "your-db-password"
    }
  ]
}
```

## 🎯 **Phase 3: Update Frontend (Days 5-7)**

### Step 6: Test Multi-Tenant URLs
Update your React routing to handle tenant paths. You can start by manually testing:

1. Go to `http://localhost:8084/tenant/demo-tenant/dashboard`
2. The `getCurrentTenant()` function should return `'demo-tenant'`
3. The `getUserWithTenant()` should verify your access

### Step 7: Create Simple Tenant Selector Page
Create `src/pages/TenantSelector.tsx`:
```typescript
import React from 'react';
import { setDevelopmentTenant } from '../utils/tenantAuth';

export const TenantSelector: React.FC = () => {
  const handleSelectTenant = (tenantId: string) => {
    setDevelopmentTenant(tenantId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">Select Your Organization</h1>
        
        <button 
          onClick={() => handleSelectTenant('demo-tenant')}
          className="w-full p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="text-left">
            <div className="font-medium">Demo Company</div>
            <div className="text-sm text-gray-500">Free Plan</div>
          </div>
        </button>
      </div>
    </div>
  );
};
```

## 🎯 **What You Can Do RIGHT NOW:**

### Today (30 minutes):
1. **Create RDS Database** - Go to AWS Console and set this up
2. **Run the SQL schema** - Create your tenant tables

### Tomorrow (2 hours):
1. **Create the API folder** and basic Express server
2. **Test locally** - Run API on port 3001, frontend on 8084

### This Week:
1. **Deploy to ECS** with your updated Docker setup
2. **Test tenant URLs** like `/tenant/demo-tenant/dashboard`
3. **Add yourself as a tenant admin** in the database

## 🔧 **Quick Commands to Get Started:**

```bash
# 1. Create API
mkdir api && cd api
npm init -y
npm install express cors pg dotenv

# 2. Test local setup
cd api && node server.js &    # API on :3001
cd .. && npm run dev          # Frontend on :8084

# 3. Test tenant URL
open http://localhost:8084/tenant/demo-tenant/dashboard
```

Would you like me to help you with any specific step? I recommend starting with **Step 1 (RDS database)** today! 