const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_HOST?.includes('rds.amazonaws.com') ? { rejectUnauthorized: false } : false
});

// Scalable email domain validation (database-driven)
const isEmailAllowedForTenant = async (email, tenantId) => {
  if (!email || typeof email !== 'string') return false;
  
  const tenant = await pool.query(
    'SELECT allowed_email_domains FROM tenants WHERE id = $1',
    [tenantId]
  );
  
  if (tenant.rows.length === 0) return false;
  
  const allowedDomains = tenant.rows[0].allowed_email_domains;
  
  // If no domain restrictions, allow any email
  if (!allowedDomains || allowedDomains.length === 0) return true;
  
  const emailDomain = email.toLowerCase().split('@')[1];
  return allowedDomains.includes(emailDomain);
};

// Simple JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Decode JWT payload (basic verification for now)
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    console.log('Decoded JWT token:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error decoding JWT:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== INVITATION SYSTEM =====

// Verify invitation token (public endpoint)
app.get('/api/invitations/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const invitation = await pool.query(`
      SELECT i.*, t.name as company_name, t.plan
      FROM tenant_invitations i
      JOIN tenants t ON i.tenant_id = t.id
      WHERE i.invitation_token = $1 
      AND i.expires_at > NOW() 
      AND i.used_at IS NULL
    `, [token]);
    
    if (invitation.rows.length === 0) {
      return res.json({ valid: false, error: 'Invalid or expired invitation' });
    }
    
    res.json({ 
      valid: true, 
      invitation: {
        tenant_id: invitation.rows[0].tenant_id,
        company_name: invitation.rows[0].company_name,
        plan: invitation.rows[0].plan,
        role: invitation.rows[0].role,
        email: invitation.rows[0].email
      }
    });
  } catch (error) {
    console.error('Error verifying invitation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept invitation (requires authentication)
app.post('/api/invitations/:token/accept', verifyToken, async (req, res) => {
  try {
    const { token } = req.params;
    const userSub = req.user.sub;
    const userEmail = req.user.email;
    
    console.log('Accept invitation attempt:', { userSub, userEmail, token });
    
    // Validate that we have user email
    if (!userEmail) {
      return res.status(400).json({ 
        error: 'User email not found in authentication token. Please sign in again.' 
      });
    }
    
    // Get invitation details
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
    
    // Verify email matches invitation
    if (inv.email.toLowerCase() !== userEmail.toLowerCase()) {
      return res.status(400).json({ 
        error: 'Email mismatch. Please sign in with the email that received the invitation.' 
      });
    }
    
    // Scalable tenant email domain validation
    const emailAllowed = await isEmailAllowedForTenant(userEmail, inv.tenant_id);
    if (!emailAllowed) {
      const tenant = await pool.query(
        'SELECT name, allowed_email_domains FROM tenants WHERE id = $1',
        [inv.tenant_id]
      );
      
      const allowedDomains = tenant.rows[0]?.allowed_email_domains || [];
      return res.status(403).json({ 
        error: `Access to ${tenant.rows[0]?.name || 'this tenant'} is restricted to emails from: ${allowedDomains.join(', ')}` 
      });
    }
    
    // Add user to tenant (or update if exists)
    await pool.query(`
      INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
      VALUES ($1, $2, $3, ARRAY['all'])
      ON CONFLICT (tenant_id, user_sub) 
      DO UPDATE SET role = $3, permissions = ARRAY['all']
    `, [inv.tenant_id, userSub, inv.role]);
    
    // Mark invitation as used
    await pool.query(`
      UPDATE tenant_invitations 
      SET used_at = NOW() 
      WHERE id = $1
    `, [inv.id]);
    
    res.json({ 
      success: true, 
      tenant_id: inv.tenant_id,
      role: inv.role 
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== TENANT MANAGEMENT =====

// Get tenant info (requires access)
app.get('/api/tenants/:tenantId', verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const userSub = req.user.sub;
    
    // Check if user has access to this tenant
    const userAccess = await pool.query(
      'SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
      [tenantId, userSub]
    );
    
    if (userAccess.rows.length === 0) {
      return res.status(403).json({ error: 'Access denied to this tenant' });
    }
    
    // Get tenant info
    const tenant = await pool.query(
      'SELECT id, name, plan, status, trial_ends_at, allowed_email_domains, created_at FROM tenants WHERE id = $1',
      [tenantId]
    );
    
    if (tenant.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json(tenant.rows[0]);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== ADMIN FUNCTIONS =====

// Create invitation (admin only)
app.post('/api/admin/invitations', async (req, res) => {
  try {
    const { tenant_id, email, role = 'user' } = req.body;
    
    // Scalable email domain validation for invitations
    const emailAllowed = await isEmailAllowedForTenant(email, tenant_id);
    if (!emailAllowed) {
      const tenant = await pool.query(
        'SELECT name, allowed_email_domains FROM tenants WHERE id = $1',
        [tenant_id]
      );
      
      const allowedDomains = tenant.rows[0]?.allowed_email_domains || [];
      return res.status(400).json({ 
        error: `${tenant.rows[0]?.name || 'This tenant'} only allows invitations to emails from: ${allowedDomains.join(', ')}` 
      });
    }
    
    // Generate secure token
    const token = `invite_${crypto.randomBytes(16).toString('hex')}`;
    
    // Create invitation
    await pool.query(`
      INSERT INTO tenant_invitations (tenant_id, email, role, invitation_token, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
    `, [tenant_id, email.toLowerCase(), role, token]);
    
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:8084'}/invite/${token}`;
    
    res.json({ 
      success: true, 
      invitation_token: token,
      invite_url: inviteUrl,
      expires_in: '7 days'
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create tenant (admin only)
app.post('/api/admin/tenants', async (req, res) => {
  try {
    const { id, name, plan = 'free', status = 'active', allowed_email_domains = [] } = req.body;
    
    await pool.query(`
      INSERT INTO tenants (id, name, plan, status, allowed_email_domains)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, name, plan, status, allowed_email_domains]);
    
    res.json({ success: true, tenant_id: id });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update tenant email restrictions (admin only)
app.put('/api/admin/tenants/:tenantId/email-domains', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { allowed_email_domains } = req.body;
    
    await pool.query(`
      UPDATE tenants 
      SET allowed_email_domains = $1, updated_at = NOW()
      WHERE id = $2
    `, [allowed_email_domains, tenantId]);
    
    res.json({ success: true, tenant_id: tenantId, allowed_email_domains });
  } catch (error) {
    console.error('Error updating tenant email domains:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Blue Pine API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});