# Customer Onboarding & Access Control Guide
## How to Control Who Becomes Your Customer

## 🎯 **Onboarding Strategy Options**

### **Option 1: Invite-Only (Recommended for Launch)**
Perfect for controlled growth and initial validation.

**How it works:**
1. **You manually create tenants** for approved customers
2. **Send invitation links** with tenant-specific signup URLs
3. **Users sign up via Cognito** but get mapped to pre-created tenant
4. **Immediate access** to their tenant dashboard

**Implementation:**
```sql
-- Pre-create tenant for customer
INSERT INTO tenants (id, name, plan, status) 
VALUES ('acme-corp', 'Acme Corporation', 'pro', 'active');

-- Create invitation token
INSERT INTO tenant_invitations (
    tenant_id, 
    email, 
    role, 
    invitation_token, 
    expires_at
) VALUES (
    'acme-corp', 
    'john@acme.com', 
    'admin', 
    'invite_abc123xyz', 
    NOW() + INTERVAL '7 days'
);
```

**Invitation URL:**
`https://bluepineai.com/invite/invite_abc123xyz`

**Benefits:**
- ✅ **Full control** over who becomes a customer
- ✅ **High-touch onboarding** for early customers
- ✅ **Quality customers** who you've already qualified
- ✅ **No spam signups** or fake accounts

---

### **Option 2: Application Process**
Users apply, you approve, then they get access.

**How it works:**
1. **Public signup form** collecting business details
2. **Manual review process** to approve/reject applications
3. **Email notification** when approved with tenant access
4. **Tenant creation** happens after approval

**Implementation:**
```sql
-- Application table
CREATE TABLE tenant_applications (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    business_description TEXT,
    industry VARCHAR(100),
    expected_users INTEGER,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    submitted_at TIMESTAMP DEFAULT NOW()
);
```

---

### **Option 3: Freemium with Controlled Signup**
Open signup but with verification and trial limits.

**How it works:**
1. **Anyone can sign up** with business email
2. **Email domain verification** (no gmail/yahoo)
3. **Company verification** process
4. **Limited trial access** until verification complete

**Email domain checking:**
```javascript
const businessEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
const isBusinessEmail = (email) => {
  const domain = email.split('@')[1];
  return !businessEmailDomains.includes(domain);
};
```

---

## 🚀 **Recommended Implementation: Invite-Only**

Since you're just starting, I recommend **Option 1 (Invite-Only)**. Here's exactly how to implement it:

### **Step 1: Add Invitation System to Database**

```sql
-- Add to your database schema
CREATE TABLE tenant_invitations (
    id SERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    invitation_token VARCHAR(100) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Step 2: Create Invitation Landing Page**

```typescript
// src/pages/Invite.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../utils/cognitoAuth';

export const Invite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [invitation, setInvitation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify invitation token
    fetch(`/api/invitations/${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setInvitation(data.invitation);
        } else {
          navigate('/invalid-invitation');
        }
        setLoading(false);
      });
  }, [token]);

  const handleAcceptInvitation = async () => {
    // First, sign in with Google
    await signInWithGoogle();
    
    // After successful auth, link user to tenant
    const response = await fetch(`/api/invitations/${token}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    
    if (response.ok) {
      // Redirect to tenant dashboard
      navigate(`/tenant/${invitation.tenant_id}/dashboard`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold">You're Invited!</h1>
        
        <div className="p-6 border rounded-lg">
          <h2 className="text-xl font-semibold">{invitation?.company_name}</h2>
          <p className="text-gray-600 mt-2">
            You've been invited to join {invitation?.company_name}'s workspace.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Role: {invitation?.role}
          </p>
        </div>

        <button
          onClick={handleAcceptInvitation}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Accept Invitation & Sign In
        </button>
      </div>
    </div>
  );
};
```

### **Step 3: API Endpoints for Invitations**

```javascript
// Add to your api/server.js

// Verify invitation token
app.get('/api/invitations/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const invitation = await pool.query(`
      SELECT i.*, t.name as company_name 
      FROM tenant_invitations i
      JOIN tenants t ON i.tenant_id = t.id
      WHERE i.invitation_token = $1 
      AND i.expires_at > NOW() 
      AND i.used_at IS NULL
    `, [token]);
    
    if (invitation.rows.length === 0) {
      return res.json({ valid: false });
    }
    
    res.json({ 
      valid: true, 
      invitation: invitation.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept invitation
app.post('/api/invitations/:token/accept', verifyToken, async (req, res) => {
  try {
    const { token } = req.params;
    const userSub = req.user.sub;
    const userEmail = req.user.email;
    
    // Get invitation
    const invitation = await pool.query(`
      SELECT * FROM tenant_invitations 
      WHERE invitation_token = $1 
      AND expires_at > NOW() 
      AND used_at IS NULL
    `, [token]);
    
    if (invitation.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired invitation' });
    }
    
    const inv = invitation.rows[0];
    
    // Verify email matches
    if (inv.email !== userEmail) {
      return res.status(400).json({ error: 'Email mismatch' });
    }
    
    // Add user to tenant
    await pool.query(`
      INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
      VALUES ($1, $2, $3, ARRAY['all'])
      ON CONFLICT (tenant_id, user_sub) DO NOTHING
    `, [inv.tenant_id, userSub, inv.role]);
    
    // Mark invitation as used
    await pool.query(`
      UPDATE tenant_invitations 
      SET used_at = NOW() 
      WHERE id = $1
    `, [inv.id]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
```

### **Step 4: Admin Tool to Send Invitations**

Create a simple admin interface to send invitations:

```typescript
// Quick admin function (you can build a UI later)
const createInvitation = async (tenantId: string, email: string, role: string) => {
  const token = `invite_${Math.random().toString(36).substr(2, 15)}`;
  
  await pool.query(`
    INSERT INTO tenant_invitations (tenant_id, email, role, invitation_token, expires_at)
    VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
  `, [tenantId, email, role, token]);
  
  // Send email with link: https://bluepineai.com/invite/${token}
  console.log(`Invitation created: https://bluepineai.com/invite/${token}`);
  return token;
};
```

## 🎯 **Your Customer Onboarding Flow**

1. **Prospect reaches out** (via your website, demo, etc.)
2. **You qualify them** as a good fit customer
3. **Create tenant** for their company
4. **Send invitation link** to their admin user
5. **They click link** → sign in with Google → get access
6. **They can invite team members** using the same process

## 💡 **Why This Approach Works:**

- **Quality Control**: Only customers you approve get access
- **Professional**: Feels exclusive and high-value
- **Simple**: Uses your existing Cognito auth
- **Scalable**: Easy to automate later as you grow
- **Secure**: Each customer isolated in their tenant

Want me to help you implement the invitation system first, or would you prefer to start with a different approach? 