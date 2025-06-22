# 📧 Quick Email Setup (No AWS Required!)

## 🚀 Option 1: Gmail SMTP (Easiest - 2 minutes)

### Step 1: Enable App Passwords in Gmail
1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Go to **App passwords** (you'll see this after enabling 2FA)
4. Generate an app password for "Mail"
5. **Copy the 16-character password** (you'll need this)

### Step 2: Add to Environment Variables
Create or update your `api/.env` file:

```env
# Gmail SMTP Configuration (EASIEST OPTION)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password

# Required for testing
TEST_EMAIL=your-email@gmail.com

# Your existing database config
DB_HOST=your-rds-endpoint.amazonaws.com
DB_PASSWORD=your-db-password

# Your existing Cognito config  
COGNITO_USER_POOL_ID=us-west-1_ZRp04bdAf
COGNITO_CLIENT_ID=3cqsdhk7qmhvdvt4n9lpvni40q

# App config
PORT=3001
FRONTEND_URL=http://localhost:8084
NODE_ENV=development
```

### Step 3: Test It!
```bash
# Start your API server
npm run dev

# Test email in another terminal
curl http://localhost:3001/api/admin/test-email
```

**Expected Response:**
```json
{
  "success": true,
  "provider": "Gmail SMTP"
}
```

---

## 🚀 Option 2: SendGrid (Free Tier - 3 minutes)

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com/
2. Sign up for free account (100 emails/day free)
3. Verify your email address

### Step 2: Get API Key
1. Go to **Settings** → **API Keys**
2. Create API Key with **Full Access**
3. **Copy the API key** (starts with `SG.`)

### Step 3: Add to Environment
```env
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
TEST_EMAIL=your-email@gmail.com
```

---

## 🚀 Option 3: Console Logging (Instant Testing)

### For Development Only
If you don't want to set up email right now, the system will log invitation URLs to console:

```bash
npm run dev
# When you create invitations, you'll see:
# 🎯 ===== MANUAL INVITATION REQUIRED =====
# 📧 To: user@company.com
# 🔗 Invitation URL: http://localhost:8084/invite/invite_abc123...
```

Just copy the invitation URL and paste it in your browser to test!

---

## 🧪 Test Your Setup

### 1. Test Email Configuration
```bash
curl http://localhost:3001/api/admin/test-email
```

### 2. Send a Real Invitation
1. Go to http://localhost:8084/admin
2. Click "📧 Send Invitations"
3. Create a tenant with your email domain
4. Send invitation to yourself
5. Check your email! 📧

### 3. Test Multi-Tenant Flow
1. Create tenant: `test-company` with domain `gmail.com`
2. Send invitation to your Gmail address
3. Click invitation link in email
4. Sign in with Google
5. Get redirected to `/tenant/test-company/dashboard`

---

## 🐛 Troubleshooting

### Gmail Issues:
- **"Username and Password not accepted"**: You need an App Password, not your regular password
- **"Less secure app access"**: This is old - use App Passwords instead
- **2FA required**: You must enable 2-Factor Authentication to get App Passwords

### SendGrid Issues:
- **"Forbidden"**: Check your API key is correct and has full access
- **"Single sender verification"**: Verify your sender email in SendGrid dashboard

### General Issues:
- **No emails arriving**: Check spam/junk folder
- **"Invalid token"**: JWT validation is working correctly (this is good!)
- **"Domain not allowed"**: Make sure your email domain matches the tenant's allowed domains

---

## 💡 Recommended Approach

**For Development**: Use Gmail SMTP (easiest)
**For Production**: Use SendGrid or AWS SES (more reliable)

The system automatically detects which email service you've configured and uses it. You can even set up multiple services as fallbacks!

---

## ✅ What You Get

After setup, your admin panel will:
- ✅ **Send professional branded emails** automatically
- ✅ **Show email delivery status** (success/failure)
- ✅ **Test email configuration** with one click
- ✅ **Handle failures gracefully** with manual fallback

Your invitation emails will look professional with:
- 🌲 Blue Pine AI branding
- ✨ Modern HTML design
- 🔗 Clear call-to-action button
- ⏰ Expiration warning
- 📱 Mobile-responsive design

**Ready to test?** Follow Option 1 (Gmail) and you'll have emails working in 2 minutes! 🚀 