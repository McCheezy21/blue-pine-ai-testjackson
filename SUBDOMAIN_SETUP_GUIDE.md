# Subdomain Architecture Setup Guide

## Overview
This guide explains how to set up the Blue Pine AI application with subdomain separation:
- **Main Site**: `bluepineai.com` (customer-facing application)
- **Admin Panel**: `admin.bluepineai.com` (separate admin-only application)

## Architecture Benefits
✅ **Enhanced Security**: Admin panel completely isolated from customer app  
✅ **Better Performance**: Smaller bundle sizes for each application  
✅ **Easier Maintenance**: Independent deployments and updates  
✅ **Professional Separation**: Clear boundary between admin and customer features  

## Current Setup

### Main Application (`bluepineai.com`)
- **Location**: Root directory of this project
- **Routes**: All customer-facing pages (home, waitlist, signin, dashboard, etc.)
- **Admin Access**: Discrete "Admin Panel" button in footer that opens `admin.bluepineai.com`
- **Port**: localhost:8084 (development)

### Admin Application (`admin.bluepineai.com`)
- **Location**: `admin-app/` directory (separate mini-app)
- **Content**: Only the admin panel for tenant/user management
- **Port**: localhost:3000 (development)
- **API**: Still uses the same API server at localhost:3001

## Development Setup

### 1. Main Application (Current)
```bash
# Terminal 1: Run main app
npm run dev
# Runs on http://localhost:8084
```

### 2. Admin Application (New)
```bash
# Terminal 2: Run admin app
cd admin-app
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. API Server (Same as before)
```bash
# Terminal 3: Run API
cd api
node simple-server.js
# Runs on http://localhost:3001
```

## Production Deployment

### Option 1: Vercel Deployment (Recommended)
Deploy both applications to Vercel with custom domains:

**Main App Deployment:**
```bash
# Deploy main app to bluepineai.com
vercel --prod
# Configure custom domain: bluepineai.com
```

**Admin App Deployment:**
```bash
# Deploy admin app to admin.bluepineai.com
cd admin-app
vercel --prod
# Configure custom domain: admin.bluepineai.com
```

### Option 2: AWS/Other Cloud Provider
- Deploy main app to `bluepineai.com`
- Deploy admin app to `admin.bluepineai.com`
- Both can share the same RDS database and API endpoints

## DNS Configuration (Squarespace)

### Current CNAME Setup
You already have these CNAMEs configured:
- `admin.bluepineai.com` → `bluepineai.com` (temporary redirect)

### Update After Deployment
Once deployed, update the CNAME records:
- `admin` → `your-admin-vercel-deployment.vercel.app`
- Or point directly to your hosting provider's URL

## Security Considerations

### Admin Panel Access Control
The admin panel should have additional security:

```javascript
// Add to admin-app/src/main.tsx
const AdminApp = () => {
  // Check if user is Blue Pine AI employee
  const checkAdminAccess = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail?.endsWith('@bluepineai.com')) {
      window.location.href = 'https://bluepineai.com';
      return;
    }
  };

  useEffect(() => {
    checkAdminAccess();
  }, []);
  
  // ... rest of component
};
```

### Environment-Based Access
```javascript
// Only allow admin access in production from specific domains
if (window.location.hostname !== 'admin.bluepineai.com' && 
    process.env.NODE_ENV === 'production') {
  window.location.href = 'https://bluepineai.com';
}
```

## Testing the Setup

### 1. Development Testing
- Visit `http://localhost:8084` (main site)
- Scroll to footer and click "Admin Panel" button
- Should open `http://localhost:3000` in new tab
- Verify admin panel works independently

### 2. Production Testing
- Visit `bluepineai.com`
- Click "Admin Panel" in footer
- Should redirect to `admin.bluepineai.com`
- Verify both sites work independently

## API Configuration

Both applications share the same API server. Update API URLs based on environment:

```javascript
// In both apps, use environment-aware API URLs
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com/api'  // Your deployed API
  : 'http://localhost:3001/api';       // Local development
```

## File Structure
```
blue-pine-ai/
├── src/                    # Main customer app
├── admin-app/              # Separate admin app
│   ├── src/
│   │   └── main.tsx       # Admin app entry point
│   ├── index.html         # Admin HTML template
│   ├── package.json       # Admin dependencies
│   └── vite.config.ts     # Admin build config
├── api/                   # Shared API server
└── SUBDOMAIN_SETUP_GUIDE.md
```

## Next Steps

1. **Test Development Setup**: Run all three services and verify the subdomain flow
2. **Deploy Admin App**: Deploy the admin-app to your hosting provider
3. **Update DNS**: Point admin.bluepineai.com to the deployed admin app
4. **Add Security**: Implement Blue Pine AI email verification for admin access
5. **Environment Variables**: Configure API URLs for production

## Benefits Achieved

✅ **Zero Code Changes**: Add new tenants without touching code  
✅ **Security Separation**: Admin and customer apps completely isolated  
✅ **Professional Architecture**: Industry-standard subdomain separation  
✅ **Scalable**: Each app can be scaled independently  
✅ **Maintainable**: Clear separation of concerns 