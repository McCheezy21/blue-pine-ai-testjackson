const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== ADMIN ENDPOINTS =====

// Get all tenants
app.get('/api/admin/tenants', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, plan, status, allowed_email_domains, created_at
      FROM tenants
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
});

// Create tenant
app.post('/api/admin/tenants', async (req, res) => {
  try {
    const { id, name, plan = 'pro', status = 'active', allowed_email_domains = [] } = req.body;
    
    if (!id || !name) {
      return res.status(400).json({ error: 'Tenant ID and name are required' });
    }

    await pool.query(`
      INSERT INTO tenants (id, name, plan, status, allowed_email_domains)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, name, plan, status, allowed_email_domains]);
    
    res.json({ success: true, tenant_id: id });
  } catch (error) {
    console.error('Error creating tenant:', error);
    if (error.code === '23505') { // Duplicate key
      res.status(400).json({ error: 'Tenant ID already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create tenant' });
    }
  }
});

// Add user to tenant
app.post('/api/admin/users', async (req, res) => {
  try {
    const { tenant_id, email, role = 'user' } = req.body;
    
    if (!tenant_id || !email) {
      return res.status(400).json({ error: 'Tenant ID and email are required' });
    }

    // Check if tenant exists
    const tenant = await pool.query('SELECT id, allowed_email_domains FROM tenants WHERE id = $1', [tenant_id]);
    if (tenant.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Validate email domain if restrictions exist
    const allowedDomains = tenant.rows[0].allowed_email_domains;
    if (allowedDomains && allowedDomains.length > 0) {
      const emailDomain = email.toLowerCase().split('@')[1];
      if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({ 
          error: `Email domain not allowed. Allowed domains: ${allowedDomains.join(', ')}` 
        });
      }
    }

    // Create a simple user_sub from email (for demo purposes)
    const user_sub = `user_${email.replace('@', '_').replace(/\./g, '_')}`;

    await pool.query(`
      INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
      VALUES ($1, $2, $3, ARRAY['all'])
      ON CONFLICT (tenant_id, user_sub) 
      DO UPDATE SET role = $3, permissions = ARRAY['all']
    `, [tenant_id, user_sub, role]);
    
    res.json({ success: true, user_sub, message: 'User added to tenant successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// Get users for a tenant
app.get('/api/admin/tenants/:tenantId/users', async (req, res) => {
  try {
    const { tenantId } = req.params;
    
    const result = await pool.query(`
      SELECT user_sub, role, permissions, created_at
      FROM tenant_users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
    `, [tenantId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Delete tenant
app.delete('/api/admin/tenants/:tenantId', async (req, res) => {
  // DISABLED FOR DATA PROTECTION - Use suspend instead
  return res.status(403).json({ 
    error: 'Tenant deletion is disabled for data protection. Use suspend/disable instead.' 
  });
  
  /*
  try {
    const { tenantId } = req.params;
    
    const result = await pool.query('DELETE FROM tenants WHERE id = $1', [tenantId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
  */
});

// Update tenant status (enable/disable)
app.patch('/api/admin/tenants/:tenantId/status', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { status } = req.body;
    
    if (!status || !['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "active" or "suspended"' });
    }
    
    const result = await pool.query(
      'UPDATE tenants SET status = $1 WHERE id = $2 RETURNING id, name, status',
      [status, tenantId]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json({ 
      success: true, 
      message: `Tenant ${status === 'active' ? 'enabled' : 'disabled'} successfully`,
      tenant: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating tenant status:', error);
    res.status(500).json({ error: 'Failed to update tenant status' });
  }
});

// Remove user from tenant
app.delete('/api/admin/tenants/:tenantId/users/:userSub', async (req, res) => {
  try {
    const { tenantId, userSub } = req.params;
    
    const result = await pool.query(
      'DELETE FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
      [tenantId, userSub]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found in tenant' });
    }
    
    res.json({ success: true, message: 'User removed from tenant' });
  } catch (error) {
    console.error('Error removing user:', error);
    res.status(500).json({ error: 'Failed to remove user' });
  }
});

// ===== CLIENT ACCESS ENDPOINTS =====

// Simple user login check (email-based)
app.post('/api/auth/check', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user's tenant based on email domain
    const emailDomain = email.toLowerCase().split('@')[1];
    
    // First, try to find tenant by email domain restriction
    const tenantByDomain = await pool.query(`
      SELECT id, name, plan, status FROM tenants 
      WHERE $1 = ANY(allowed_email_domains)
      AND status = 'active'
    `, [emailDomain]);

    if (tenantByDomain.rows.length > 0) {
      const tenant = tenantByDomain.rows[0];
      
      // Double-check tenant is active
      if (tenant.status !== 'active') {
        return res.json({ 
          hasAccess: false, 
          message: 'This organization account has been disabled. Please contact your administrator.' 
        });
      }
      
      // Check if user exists in this tenant
      const user_sub = `user_${email.replace('@', '_').replace(/\./g, '_')}`;
      const userAccess = await pool.query(
        'SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
        [tenant.id, user_sub]
      );

      if (userAccess.rows.length > 0) {
        return res.json({
          hasAccess: true,
          tenant: tenant,
          role: userAccess.rows[0].role,
          redirectUrl: `/tenant/${tenant.id}/dashboard`
        });
      }
    }

    res.json({ hasAccess: false, message: 'No access found for this email' });
  } catch (error) {
    console.error('Error checking auth:', error);
    res.status(500).json({ error: 'Failed to check authentication' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Blue Pine Admin API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🛠️  Admin panel: http://localhost:8084/admin`);
}); 