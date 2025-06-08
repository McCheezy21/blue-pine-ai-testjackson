# Multi-Tenant SaaS Implementation Guide
## Easiest + Secure Approach

This guide implements **path-based routing** with **shared database + row-level security** for maximum simplicity while maintaining strong security.

## 🏗️ Architecture Overview

- **URLs**: `/tenant/acme-corp/dashboard`, `/tenant/acme-corp/settings`
- **Database**: Single shared database with `tenant_id` columns
- **Security**: PostgreSQL Row-Level Security (RLS) policies
- **Auth**: Single Cognito User Pool with custom attributes

## 📊 Database Schema

```sql
-- Core tenant table
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

-- User-tenant relationships (many-to-many)
CREATE TABLE tenant_users (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
    user_sub VARCHAR(255) NOT NULL, -- Cognito user sub
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'viewer')),
    permissions TEXT[], -- Array of permission strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, user_sub)
);

-- Example business data table (all tables need tenant_id)
CREATE TABLE automation_configs (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    config_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row-Level Security on all tenant-specific tables
ALTER TABLE automation_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy (users can only see their tenant's data)
CREATE POLICY tenant_isolation_policy ON automation_configs
    FOR ALL
    TO authenticated_users
    USING (tenant_id = current_setting('app.current_tenant_id'));
```

## 🔐 Backend API Endpoints

### Tenant Management
```
GET /api/tenants/{tenant_id}
- Returns tenant info if user has access
- Security: Verify user is member of tenant

GET /api/tenants/{tenant_id}/users/{user_sub}/access  
- Returns user's role and permissions for tenant
- Used by frontend for access control

POST /api/tenants
- Create new tenant (for signup flow)
- Automatically makes creator an admin
```

### Example API Middleware (Node.js/Express)

```javascript
// Tenant context middleware
const tenantContext = async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }
  
  // Verify user has access to tenant
  const userSub = req.user.sub; // From JWT middleware
  const access = await checkTenantAccess(tenantId, userSub);
  if (!access.hasAccess) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Set tenant context for RLS
  await db.query('SET app.current_tenant_id = $1', [tenantId]);
  
  req.tenant = { id: tenantId, userRole: access.role };
  next();
};

// Apply to all tenant-specific routes
app.use('/api/tenants/:tenantId/*', tenantContext);
```

## 🔄 Frontend Integration

### 1. Update your routing to handle tenant paths:

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getUserWithTenant } from './utils/tenantAuth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignIn />} />
        
        {/* Tenant-specific routes */}
        <Route path="/tenant/:tenantId/*" element={<TenantApp />} />
        
        {/* Utility routes */}
        <Route path="/select-tenant" element={<TenantSelector />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

// Protected tenant app component
function TenantApp() {
  const [user, setUser] = useState<UserWithTenant | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getUserWithTenant().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" />;
  
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="/settings" element={<Settings user={user} />} />
      {/* More tenant routes */}
    </Routes>
  );
}
```

### 2. Use the tenant-aware API helper:

```typescript
// Example: Fetch tenant-specific data
import { tenantApiRequest, hasPermission } from './utils/tenantAuth';

const fetchAutomationConfigs = async () => {
  const response = await tenantApiRequest('/api/automation-configs');
  return response.json();
};

// Example: Permission-based UI
const Dashboard = ({ user }: { user: UserWithTenant }) => {
  return (
    <div>
      <h1>Welcome to {user.tenant.name}</h1>
      
      {hasPermission(user, 'create_automations') && (
        <button>Create New Automation</button>
      )}
      
      {isAdmin(user) && (
        <Link to={`/tenant/${user.tenant.id}/settings`}>
          Manage Tenant
        </Link>
      )}
    </div>
  );
};
```

## 🚀 Implementation Steps

### Phase 1: Basic Multi-Tenancy (Week 1)
1. ✅ Frontend tenant utilities (already done)
2. Create tenant database tables
3. Build basic tenant API endpoints
4. Update frontend routing for `/tenant/{id}/*` paths
5. Test with 2-3 demo tenants

### Phase 2: Security & Polish (Week 2)
1. Implement Row-Level Security policies
2. Add comprehensive access control
3. Create tenant selection/signup flow
4. Add subscription status checking

### Phase 3: Production Ready (Week 3)
1. Add payment integration (Stripe)
2. Implement proper tenant onboarding
3. Add admin dashboard for tenant management
4. Performance optimization and monitoring

## 🛡️ Security Benefits

- **Data Isolation**: RLS ensures tenants cannot see each other's data
- **Access Control**: Every API call verifies tenant membership
- **JWT Validation**: Existing Cognito auth provides user identity
- **Audit Trail**: All tenant access is logged and trackable

## 💡 Why This Approach?

- **Simplest Setup**: No DNS management, works immediately
- **Cost Effective**: Single database, single app instance
- **Secure**: Database-level isolation with RLS
- **Scalable**: Can handle thousands of tenants
- **Familiar**: Uses your existing tech stack

This approach gives you enterprise-grade multi-tenancy with minimal complexity! 