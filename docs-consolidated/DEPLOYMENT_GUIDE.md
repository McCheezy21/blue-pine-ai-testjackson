# 🚀 Multi-Tenant SaaS Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Install New Dependencies
```bash
# Frontend (no new dependencies needed)
cd /

# Backend
cd api/
npm install jsonwebtoken jwk-to-pem axios @aws-sdk/client-ses
```

### 2. Create Environment File
Create `api/.env` with the following variables:

```env
# Database Configuration
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-secure-password

# AWS Cognito Configuration
COGNITO_REGION=us-west-1
COGNITO_USER_POOL_ID=us-west-1_ZRp04bdAf
COGNITO_CLIENT_ID=3cqsdhk7qmhvdvt4n9lpvni40q

# AWS SES Email Configuration
AWS_REGION=us-west-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
SES_FROM_EMAIL=noreply@bluepineai.com
TEST_EMAIL=your-test-email@example.com

# Application Configuration
PORT=3001
FRONTEND_URL=http://localhost:8084
NODE_ENV=development
```

### 3. Database Schema Updates
Run the following SQL to ensure your database has the latest schema:

```sql
-- Ensure allowed_email_domains column exists
ALTER TABLE tenants 
ADD COLUMN IF NOT EXISTS allowed_email_domains TEXT[] DEFAULT '{}';

-- Update existing tenants to have proper domain restrictions
UPDATE tenants 
SET allowed_email_domains = ARRAY['bluepineai.com'] 
WHERE id = 'blue-pine' AND allowed_email_domains IS NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_tenants_domains ON tenants USING GIN (allowed_email_domains);
```

## 🔧 Testing the Enhanced System

### 1. Start the Services
```bash
# Terminal 1: Start API Server
cd api/
npm run dev

# Terminal 2: Start Frontend
cd /
npm run dev
```

### 2. Test Email Configuration
```bash
curl http://localhost:3001/api/admin/test-email
```

Expected response:
```json
{
  "success": true
}
```

### 3. Test Multi-Tenant Flow

#### Step 1: Create a Test Tenant
1. Go to http://localhost:8084/admin
2. Click "Manage Tenants" tab
3. Create a new tenant:
   - **Tenant ID**: `test-clinic`
   - **Company Name**: `Test Medical Clinic`
   - **Plan**: `pro`
   - **Allowed Domains**: `testclinic.com, test.com`

#### Step 2: Send an Invitation
1. Click "📧 Send Invitations" tab
2. Test email configuration first
3. Send invitation:
   - **Tenant**: `Test Medical Clinic (test-clinic)`
   - **Email**: `user@testclinic.com`
   - **Role**: `user`

#### Step 3: Test Domain Validation
Try sending invitation to unauthorized domain:
- **Email**: `user@unauthorized.com`
- Should receive error about domain restrictions

### 4. Test Authentication Flow

#### With Valid Domain:
1. User receives invitation email
2. Clicks invitation link
3. Signs in with Google/Microsoft
4. Gets redirected to `/tenant/test-clinic/dashboard`
5. System validates email domain
6. User gets access

#### With Invalid Domain:
1. User tries to access tenant directly
2. System checks email domain
3. Access denied with specific error message

## 🔒 Security Enhancements Deployed

### ✅ Fixed Issues:

1. **JWT Validation**: Now properly validates Cognito JWT signatures
2. **Domain Isolation**: Enforces email domain restrictions per tenant
3. **Auto-Join**: Users with valid domains automatically join tenants
4. **Proper Routing**: Tenant-specific URLs with access control
5. **Email Invitations**: Professional email templates with AWS SES

### 🛡️ Security Features:

- **Row-Level Security (RLS)**: Database-level tenant isolation
- **JWT Signature Verification**: Cryptographic token validation
- **Domain Whitelist**: Email-based access control
- **Role-Based Access**: Admin/User/Viewer permissions
- **Invitation Expiry**: 7-day expiration on invitations
- **Audit Trail**: All access attempts logged

## 📧 Email Configuration

### Option 1: AWS SES (Recommended)
1. **Verify Domain**: Add and verify your domain in AWS SES
2. **Create IAM User**: With `AmazonSESFullAccess` permissions
3. **Request Production Access**: To send to any email address
4. **Update Environment**: Add AWS credentials to `.env`

### Option 2: Development Mode
- Without AWS SES, invitations will be logged to console
- Copy invitation URLs manually for testing
- Perfect for development and testing

## 🚀 Production Deployment

### 1. Environment Variables for Production
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
DB_HOST=production-rds-endpoint.amazonaws.com
# ... other production values
```

### 2. Security Checklist
- [ ] Enable HTTPS everywhere
- [ ] Set up proper CORS policies
- [ ] Configure database security groups
- [ ] Enable AWS SES production access
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies

### 3. Monitoring
Key metrics to monitor:
- **Authentication Success Rate**: Track login failures
- **Tenant Access Violations**: Monitor unauthorized access attempts
- **Email Delivery Rate**: Track invitation email success
- **Database Performance**: Monitor RLS query performance

## 🐛 Troubleshooting

### Common Issues:

1. **"Invalid token" errors**
   - Check Cognito configuration
   - Verify JWT signature validation is working
   - Ensure user pool ID and client ID are correct

2. **"Email domain not allowed"**
   - Check tenant's `allowed_email_domains` setting
   - Verify domain validation logic
   - Test with correct domain

3. **Email sending failures**
   - Verify AWS SES configuration
   - Check IAM permissions
   - Ensure sender email is verified

4. **Database connection issues**
   - Verify RDS endpoint and credentials
   - Check security groups
   - Test database connectivity

### Debug Commands:
```bash
# Test API health
curl http://localhost:3001/api/health

# Test email configuration
curl http://localhost:3001/api/admin/test-email

# Check tenant info
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/api/tenants/test-clinic

# Validate email domain
curl -X POST -H "Content-Type: application/json" \
     -d '{"email":"user@testclinic.com"}' \
     http://localhost:3001/api/tenants/test-clinic/validate-email
```

## 📊 Expected Results

After deployment, you should have:

1. **✅ Secure Multi-Tenancy**: Users can only access their designated tenants
2. **✅ Email Invitations**: Professional invitation emails sent automatically
3. **✅ Domain Isolation**: Email domain restrictions enforced
4. **✅ Auto-Join**: Valid users automatically join their tenants
5. **✅ Proper Authentication**: JWT tokens validated cryptographically
6. **✅ Tenant Routing**: URLs like `/tenant/clinic-name/dashboard` working

## 🎯 Next Steps

1. **Test thoroughly** with real email addresses
2. **Configure AWS SES** for production email sending
3. **Set up monitoring** for security events
4. **Add more tenant-specific features** as needed
5. **Scale** by adding more tenants through admin panel

Your multi-tenant SaaS platform is now production-ready! 🎉 