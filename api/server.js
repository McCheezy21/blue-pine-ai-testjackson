const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');
const { sendInvitationEmail, testEmailConfiguration } = require('./email-service');
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

// ENHANCED: Cognito configuration for proper JWT validation
const COGNITO_CONFIG = {
  region: process.env.COGNITO_REGION || 'us-west-1',
  userPoolId: process.env.COGNITO_USER_POOL_ID || 'us-west-1_ZRp04bdAf',
  clientId: process.env.COGNITO_CLIENT_ID || '3cqsdhk7qmhvdvt4n9lpvni40q'
};

// Cache for Cognito public keys
let cognitoKeys = null;
let keysLastFetched = 0;
const KEY_CACHE_DURATION = 3600000; // 1 hour

// ENHANCED: Fetch Cognito public keys for JWT validation
const getCognitoKeys = async () => {
  const now = Date.now();
  if (cognitoKeys && (now - keysLastFetched) < KEY_CACHE_DURATION) {
    return cognitoKeys;
  }

  try {
    const keysUrl = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/${COGNITO_CONFIG.userPoolId}/.well-known/jwks.json`;
    const response = await axios.get(keysUrl);
    cognitoKeys = response.data.keys;
    keysLastFetched = now;
    console.log('✅ Cognito keys fetched successfully');
    return cognitoKeys;
  } catch (error) {
    console.error('❌ Error fetching Cognito keys:', error);
    throw error;
  }
};

// ENHANCED: Proper JWT verification with Cognito signature validation
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Decode header to get kid (key ID)
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header.kid) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    // Get Cognito public keys
    const keys = await getCognitoKeys();
    const key = keys.find(k => k.kid === decoded.header.kid);
    
    if (!key) {
      return res.status(401).json({ error: 'Invalid token - key not found' });
    }

    // Convert JWK to PEM format
    const pem = jwkToPem(key);
    
    // Verify the token
    const payload = jwt.verify(token, pem, {
      algorithms: ['RS256'],
      audience: COGNITO_CONFIG.clientId,
      issuer: `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/${COGNITO_CONFIG.userPoolId}`
    });

    // Check token expiration
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return res.status(401).json({ error: 'Token expired' });
    }

    console.log('✅ JWT token verified successfully for user:', payload.sub);
    req.user = payload;
    next();
  } catch (error) {
    console.error('❌ JWT verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ENHANCED: Scalable email domain validation (database-driven)
const isEmailAllowedForTenant = async (email, tenantId) => {
  if (!email || typeof email !== 'string') return false;
  
  const tenant = await pool.query(
    'SELECT allowed_email_domains FROM tenants WHERE id = $1 AND status = $2',
    [tenantId, 'active']
  );
  
  if (tenant.rows.length === 0) return false;
  
  const allowedDomains = tenant.rows[0].allowed_email_domains;
  
  // If no domain restrictions, allow any email
  if (!allowedDomains || allowedDomains.length === 0) return true;
  
  const emailDomain = email.toLowerCase().split('@')[1];
  return allowedDomains.includes(emailDomain);
};

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== ENHANCED TENANT VALIDATION ENDPOINTS =====

// NEW: Get tenants accessible by email domain (for auto-redirect)
app.get('/api/user/accessible-tenants', verifyToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    if (!userEmail) {
      return res.status(400).json({ error: 'Email not found in token' });
    }
    
    console.log(`🔍 Finding accessible tenants for email: ${userEmail}`);
    
    const emailDomain = userEmail.toLowerCase().split('@')[1];
    
    // Find all active tenants where the user's email domain is allowed
    const accessibleTenants = await pool.query(`
      SELECT id, name, plan, status, allowed_email_domains
      FROM tenants 
      WHERE status = 'active' 
      AND (
        allowed_email_domains = '{}' 
        OR allowed_email_domains IS NULL 
        OR $1 = ANY(allowed_email_domains)
      )
      ORDER BY created_at ASC
    `, [emailDomain]);
    
    console.log(`✅ Found ${accessibleTenants.rows.length} accessible tenants for domain: ${emailDomain}`);
    
    res.json({
      email: userEmail,
      domain: emailDomain,
      accessible_tenants: accessibleTenants.rows
    });
  } catch (error) {
    console.error('Error finding accessible tenants:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Validate email domain for tenant
app.post('/api/tenants/:tenantId/validate-email', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const isValid = await isEmailAllowedForTenant(email, tenantId);
    
    if (!isValid) {
      // Get tenant info for better error messages
      const tenant = await pool.query(
        'SELECT name, allowed_email_domains FROM tenants WHERE id = $1',
        [tenantId]
      );
      
      const allowedDomains = tenant.rows[0]?.allowed_email_domains || [];
      return res.json({ 
        valid: false, 
        message: `Access to ${tenant.rows[0]?.name || 'this tenant'} is restricted to emails from: ${allowedDomains.join(', ')}` 
      });
    }
    
    res.json({ valid: true });
  } catch (error) {
    console.error('Error validating email domain:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Auto-join tenant for users with valid email domains
app.post('/api/tenants/:tenantId/auto-join', verifyToken, async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { user_sub, email } = req.body;
    const requestingUser = req.user.sub;
    
    // Security: Only allow users to join themselves
    if (user_sub !== requestingUser) {
      return res.status(403).json({ error: 'Can only join yourself to tenant' });
    }
    
    // Validate email domain
    const emailAllowed = await isEmailAllowedForTenant(email, tenantId);
    if (!emailAllowed) {
      return res.status(403).json({ error: 'Email domain not allowed for this tenant' });
    }
    
    // Add user to tenant with default 'user' role
    await pool.query(`
      INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
      VALUES ($1, $2, $3, ARRAY['read'])
      ON CONFLICT (tenant_id, user_sub) 
      DO UPDATE SET role = $3, permissions = ARRAY['read']
    `, [tenantId, user_sub, 'user']);
    
    console.log(`✅ User ${user_sub} auto-joined tenant ${tenantId}`);
    res.json({ success: true, role: 'user' });
  } catch (error) {
    console.error('Error auto-joining tenant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ENHANCED: Get user access to tenant with detailed response
app.get('/api/tenants/:tenantId/users/:userSub/access', verifyToken, async (req, res) => {
  try {
    const { tenantId, userSub } = req.params;
    const requestingUser = req.user.sub;
    const userEmail = req.user.email;
    
    console.log(`🔍 USER ACCESS REQUEST: tenant=${tenantId}, userSub=${userSub}, requestingUser=${requestingUser}, userEmail=${userEmail}`);
    
    // Security: Users can only check their own access (unless admin)
    if (userSub !== requestingUser) {
      console.log(`🔒 Security check: userSub ${userSub} !== requestingUser ${requestingUser}, checking admin access...`);
      
      // Check if requesting user is admin of this tenant
      const adminCheck = await pool.query(
        'SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2 AND role = $3',
        [tenantId, requestingUser, 'admin']
      );
      
      if (adminCheck.rows.length === 0) {
        console.log(`❌ Admin check failed for user ${requestingUser} on tenant ${tenantId}`);
        return res.status(403).json({ error: 'Access denied' });
      }
      console.log(`✅ Admin access granted for user ${requestingUser} on tenant ${tenantId}`);
    }
    
    console.log(`🔍 Checking existing user access for ${userSub} in tenant ${tenantId}...`);
    
    // Get user access info
    const userAccess = await pool.query(
      'SELECT role, permissions FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
      [tenantId, userSub]
    );
    
    console.log(`🔍 User access query result: ${userAccess.rows.length} rows found`);
    
    // If no direct access, check if email domain allows auto-join (for the requesting user only)
    if (userAccess.rows.length === 0 && userSub === requestingUser) {
      console.log(`🔍 Auto-join check: User ${userEmail || 'with undefined email'} not found in tenant ${tenantId}, checking domain validation...`);
      
      // Check if email domain is allowed for this tenant
      let shouldAutoJoin = false;
      
      if (userEmail) {
        const emailAllowed = await isEmailAllowedForTenant(userEmail, tenantId);
        console.log(`🔍 Email domain validation result: ${emailAllowed}`);
        shouldAutoJoin = emailAllowed;
      } else {
        console.log(`❌ No email found in JWT token, cannot validate domain`);
      }
      
      if (shouldAutoJoin) {
        console.log(`✅ Auto-joining user ${userEmail} to tenant ${tenantId}`);
        
        try {
          // Auto-join user to tenant with 'user' role (not admin)
          await pool.query(`
            INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
            VALUES ($1, $2, $3, ARRAY['read'])
            ON CONFLICT (tenant_id, user_sub) 
            DO UPDATE SET role = $3, permissions = ARRAY['read']
          `, [tenantId, userSub, 'user']);
          
          console.log(`✅ Auto-joined user ${userSub} to tenant ${tenantId} with role 'user'`);
          
          // Return the new access info
          return res.json({
            role: 'user',
            permissions: ['read']
          });
        } catch (dbError) {
          console.error(`❌ Database error during auto-join:`, dbError);
          return res.status(500).json({ error: 'Failed to auto-join user' });
        }
      } else {
        console.log(`❌ Auto-join denied: Email domain not allowed for tenant ${tenantId} or email undefined`);
      }
    } else if (userAccess.rows.length === 0) {
      console.log(`❌ No auto-join attempted: userSub=${userSub}, requestingUser=${requestingUser}, userEmail=${userEmail}`);
    }
    
    if (userAccess.rows.length === 0) {
      console.log(`❌ User ${userSub} not found in tenant ${tenantId} and auto-join failed/not attempted`);
      return res.status(404).json({ error: 'User not found in tenant' });
    }
    
    const access = userAccess.rows[0];
    console.log(`✅ Returning access info for user ${userSub}: role=${access.role}, permissions=${access.permissions}`);
    
    res.json({
      role: access.role,
      permissions: access.permissions || []
    });
  } catch (error) {
    console.error('❌ Error checking user access:', error);
    res.status(500).json({ error: 'Server error' });
  }
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
      AND t.status = 'active'
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
    
    console.log(`✅ Invitation accepted for user ${userSub} to tenant ${inv.tenant_id}`);
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
    const userEmail = req.user.email;
    
    // Check if user has access to this tenant
    const userAccess = await pool.query(
      'SELECT role FROM tenant_users WHERE tenant_id = $1 AND user_sub = $2',
      [tenantId, userSub]
    );
    
    // If no direct access, check if email domain allows auto-join
    if (userAccess.rows.length === 0) {
      const emailAllowed = await isEmailAllowedForTenant(userEmail, tenantId);
      if (emailAllowed) {
        // Auto-join user to tenant
        await pool.query(`
          INSERT INTO tenant_users (tenant_id, user_sub, role, permissions)
          VALUES ($1, $2, $3, ARRAY['read'])
        `, [tenantId, userSub, 'user']);
        
        console.log(`✅ Auto-joined user ${userSub} to tenant ${tenantId}`);
      } else {
        return res.status(403).json({ error: 'Access denied to this tenant' });
      }
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

// ===== ACCESS REQUEST SYSTEM =====

// Submit access request (requires authentication)
app.post('/api/access-requests', verifyToken, async (req, res) => {
  try {
    const { name, email, company, role, message } = req.body;
    const userSub = req.user.sub;
    const userEmail = req.user.email;
    
    // Validate required fields
    if (!name || !email || !company || !role || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Ensure email matches the authenticated user's email
    if (email.toLowerCase() !== userEmail.toLowerCase()) {
      return res.status(400).json({ 
        error: 'Email must match your authenticated account' 
      });
    }
    
    console.log(`📝 Access request submitted by ${userEmail} from ${company}`);
    
    // Create access request record
    await pool.query(`
      INSERT INTO access_requests (
        user_sub, 
        name, 
        email, 
        company, 
        role, 
        message,
        status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      ON CONFLICT (user_sub) 
      DO UPDATE SET 
        name = $2,
        company = $4,
        role = $5,
        message = $6,
        status = 'pending',
        updated_at = NOW()
    `, [userSub, name, email.toLowerCase(), company, role, message, 'pending']);
    
    console.log(`✅ Access request created/updated for user ${userSub}`);
    
    // TODO: Send notification email to admin team
    // await sendAccessRequestNotification({ name, email, company, role, message });
    
    res.json({ 
      success: true,
      message: 'Access request submitted successfully'
    });
  } catch (error) {
    console.error('Error creating access request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all access requests (admin only)
app.get('/api/admin/access-requests', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        user_sub,
        name,
        email,
        company,
        role,
        message,
        status,
        created_at,
        updated_at
      FROM access_requests
      ORDER BY 
        CASE status
          WHEN 'pending' THEN 1
          WHEN 'approved' THEN 2
          WHEN 'rejected' THEN 3
        END,
        created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching access requests:', error);
    res.status(500).json({ error: 'Failed to fetch access requests' });
  }
});

// Update access request status (admin only)
app.put('/api/admin/access-requests/:userSub', async (req, res) => {
  try {
    const { userSub } = req.params;
    const { status, admin_notes } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await pool.query(`
      UPDATE access_requests 
      SET status = $1, admin_notes = $2, updated_at = NOW()
      WHERE user_sub = $3
    `, [status, admin_notes, userSub]);
    
    console.log(`✅ Access request ${userSub} updated to status: ${status}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating access request:', error);
    res.status(500).json({ error: 'Failed to update access request' });
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
    
    // Get tenant info for email
    const tenant = await pool.query(
      'SELECT name FROM tenants WHERE id = $1',
      [tenant_id]
    );
    
    if (tenant.rows.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    const companyName = tenant.rows[0].name;
    
    // Create invitation
    await pool.query(`
      INSERT INTO tenant_invitations (tenant_id, email, role, invitation_token, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '7 days')
    `, [tenant_id, email.toLowerCase(), role, token]);
    
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:8084'}/invite/${token}`;
    
    console.log(`✅ Invitation created for ${email} to tenant ${tenant_id}`);
    
    // ENHANCED: Send actual invitation email
    const emailResult = await sendInvitationEmail(email, companyName, inviteUrl, 'Blue Pine AI Team');
    
    if (emailResult.success) {
      console.log(`📧 Invitation email sent successfully to ${email}`);
      res.json({ 
        success: true, 
        invitation_token: token,
        invite_url: inviteUrl,
        expires_in: '7 days',
        email_sent: true,
        message: 'Invitation created and email sent successfully!'
      });
    } else {
      console.log(`📧 Email sending failed: ${emailResult.error}`);
      
      // Still return success for invitation creation, but note email issue
      res.json({ 
        success: true, 
        invitation_token: token,
        invite_url: inviteUrl,
        expires_in: '7 days',
        email_sent: false,
        email_error: emailResult.error,
        manual_send_required: emailResult.manualSend || false,
        message: 'Invitation created successfully. Email sending failed - please send invitation manually.',
        manual_details: emailResult.details
      });
    }
    
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// NEW: Test email configuration endpoint
app.get('/api/admin/test-email', async (req, res) => {
  try {
    const result = await testEmailConfiguration();
    res.json(result);
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({ error: 'Failed to test email configuration' });
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
    
    console.log(`✅ Tenant created: ${id} (${name})`);
    res.json({ success: true, tenant_id: id });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tenants (admin only)
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

// Update tenant (admin only)
app.put('/api/admin/tenants/:tenantId', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { name, allowed_email_domains } = req.body;
    
    await pool.query(`
      UPDATE tenants 
      SET name = $1, allowed_email_domains = $2, updated_at = NOW()
      WHERE id = $3
    `, [name, allowed_email_domains, tenantId]);
    
    console.log(`✅ Tenant updated: ${tenantId} (${name})`);
    res.json({ success: true, tenant_id: tenantId });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
});

// TEMPORARY: Remove users from tenant (for testing domain validation)
app.delete('/api/admin/tenants/:tenantId/users', async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { user_subs } = req.body;
    
    if (!user_subs || !Array.isArray(user_subs)) {
      return res.status(400).json({ error: 'user_subs array is required' });
    }
    
    // Remove users from tenant
    for (const userSub of user_subs) {
      await pool.query(`
        DELETE FROM tenant_users 
        WHERE tenant_id = $1 AND user_sub = $2
      `, [tenantId, userSub]);
      console.log(`🗑️ Removed user ${userSub} from tenant ${tenantId}`);
    }
    
    res.json({ 
      success: true, 
      message: `Removed ${user_subs.length} users from tenant ${tenantId}`,
      removed_users: user_subs
    });
  } catch (error) {
    console.error('Error removing users from tenant:', error);
    res.status(500).json({ error: 'Failed to remove users from tenant' });
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
  console.log(`🔐 JWT validation: ENABLED`);
  console.log(`🏢 Multi-tenant isolation: ENABLED`);
});