# 🔐 Hybrid Authentication: Google Auth + Enterprise SSO

## Overview: Best of Both Worlds

### Individual Users
- ✅ **Google Sign-In** (existing)
- ✅ **Email/Password** (Cognito)  
- ✅ **Magic Links** (optional)

### Enterprise Customers  
- ✅ **Azure Active Directory**
- ✅ **Google Workspace** 
- ✅ **Okta**
- ✅ **Auth0**
- ✅ **Custom SAML/OIDC**

## 🚀 **Implementation Strategy**

### Phase 1: Enhanced Login Screen
```jsx
// Login component with multiple options
const LoginScreen = () => {
  const [loginMethod, setLoginMethod] = useState('consumer');
  const [orgDomain, setOrgDomain] = useState('');

  return (
    <div className="login-container">
      <h1>Sign in to Blue Pine AI</h1>
      
      {/* Method Selection */}
      <div className="auth-method-selector">
        <button 
          onClick={() => setLoginMethod('consumer')}
          className={loginMethod === 'consumer' ? 'active' : ''}
        >
          Individual Account
        </button>
        <button 
          onClick={() => setLoginMethod('enterprise')}
          className={loginMethod === 'enterprise' ? 'active' : ''}
        >
          Enterprise SSO
        </button>
      </div>

      {loginMethod === 'consumer' && (
        <ConsumerAuth />
      )}

      {loginMethod === 'enterprise' && (
        <EnterpriseAuth orgDomain={orgDomain} setOrgDomain={setOrgDomain} />
      )}
    </div>
  );
};

const ConsumerAuth = () => (
  <div className="consumer-auth">
    {/* Your existing Google auth */}
    <button onClick={signInWithGoogle} className="google-btn">
      <GoogleIcon /> Continue with Google
    </button>
    
    {/* Cognito email/password */}
    <EmailPasswordForm />
    
    <div className="divider">or</div>
    
    <MagicLinkForm />
  </div>
);

const EnterpriseAuth = ({ orgDomain, setOrgDomain }) => (
  <div className="enterprise-auth">
    <input
      type="text"
      placeholder="Enter your company domain (e.g., acme-corp)"
      value={orgDomain}
      onChange={(e) => setOrgDomain(e.target.value)}
      className="domain-input"
    />
    
    <button 
      onClick={() => initiateSSO(orgDomain)}
      disabled={!orgDomain}
      className="sso-btn"
    >
      Continue with SSO
    </button>
    
    <div className="sso-help">
      Your IT admin configured single sign-on for your organization
    </div>
  </div>
);
```

### Phase 2: SSO Configuration Database
```sql
-- Add SSO configuration to organizations
CREATE TABLE sso_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    provider VARCHAR(50) NOT NULL, -- 'azure-ad', 'google-workspace', 'okta', 'saml'
    
    -- OIDC/OAuth2 fields
    client_id VARCHAR(255),
    client_secret VARCHAR(255), -- encrypted
    authority_url VARCHAR(500),
    
    -- SAML fields  
    saml_entity_id VARCHAR(255),
    saml_sso_url VARCHAR(500),
    saml_certificate TEXT,
    
    -- Configuration
    auto_provision BOOLEAN DEFAULT true,
    default_role VARCHAR(50) DEFAULT 'member',
    domain_hint VARCHAR(100), -- e.g., 'acme-corp.com'
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Domain-based SSO discovery
CREATE TABLE sso_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sso_config_id UUID REFERENCES sso_configurations(id),
    domain VARCHAR(100) NOT NULL, -- e.g., 'acme-corp.com'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(domain)
);
```

### Phase 3: SSO Initiation Flow
```javascript
// Backend: SSO initiation endpoint
app.post('/api/auth/sso/initiate', async (req, res) => {
  try {
    const { orgDomain, email } = req.body;
    
    let ssoConfig;
    
    if (orgDomain) {
      // Domain-based lookup (e.g., "acme-corp")
      ssoConfig = await findSSOByOrgDomain(orgDomain);
    } else if (email) {
      // Email domain-based lookup (e.g., "user@acme-corp.com")
      const emailDomain = email.split('@')[1];
      ssoConfig = await findSSOByEmailDomain(emailDomain);
    }
    
    if (!ssoConfig) {
      return res.status(404).json({ 
        error: 'SSO not configured for this organization',
        fallback: 'consumer_auth' // Fall back to Google/Cognito
      });
    }
    
    // Generate SSO redirect URL
    const redirectUrl = await generateSSORedirect(ssoConfig, req.body);
    
    res.json({
      provider: ssoConfig.provider,
      redirect_url: redirectUrl,
      organization: ssoConfig.organization.name
    });
    
  } catch (error) {
    console.error('SSO initiation error:', error);
    res.status(500).json({ error: 'SSO initiation failed' });
  }
});

const generateSSORedirect = async (ssoConfig, params) => {
  switch (ssoConfig.provider) {
    case 'azure-ad':
      return generateAzureADRedirect(ssoConfig, params);
    case 'google-workspace':
      return generateGoogleWorkspaceRedirect(ssoConfig, params);
    case 'okta':
      return generateOktaRedirect(ssoConfig, params);
    case 'saml':
      return generateSAMLRedirect(ssoConfig, params);
    default:
      throw new Error(`Unsupported SSO provider: ${ssoConfig.provider}`);
  }
};
```

### Phase 4: Azure AD Integration Example
```javascript
// Azure AD OIDC implementation
const generateAzureADRedirect = (ssoConfig, params) => {
  const authUrl = new URL(`${ssoConfig.authority_url}/oauth2/v2.0/authorize`);
  
  authUrl.searchParams.set('client_id', ssoConfig.client_id);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', `${process.env.FRONTEND_URL}/auth/sso/callback`);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', generateState(ssoConfig));
  
  if (ssoConfig.domain_hint) {
    authUrl.searchParams.set('domain_hint', ssoConfig.domain_hint);
  }
  
  return authUrl.toString();
};

// SSO callback handler
app.post('/api/auth/sso/callback', async (req, res) => {
  try {
    const { code, state } = req.body;
    
    // Validate state and get SSO config
    const ssoConfig = await validateStateAndGetConfig(state);
    
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(ssoConfig, code);
    
    // Validate and decode tokens
    const userInfo = await validateAndDecodeTokens(ssoConfig, tokens);
    
    // Auto-provision user if needed
    const user = await findOrCreateUser(userInfo, ssoConfig);
    
    // Generate your own JWT
    const jwtToken = generateJWT(user, ssoConfig.organization);
    
    res.json({
      access_token: jwtToken,
      user: user,
      organization: ssoConfig.organization
    });
    
  } catch (error) {
    console.error('SSO callback error:', error);
    res.status(400).json({ error: 'SSO authentication failed' });
  }
});
```

## 🎯 **Smart Login Flow**

### Auto-Detection Based on Email
```javascript
// Frontend: Smart login detection
const handleEmailInput = async (email) => {
  if (!email.includes('@')) return;
  
  const domain = email.split('@')[1];
  
  // Check if organization has SSO configured
  const ssoCheck = await fetch('/api/auth/sso/discover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  if (ssoCheck.ok) {
    const ssoInfo = await ssoCheck.json();
    
    // Show SSO option
    setShowSSO(true);
    setSSOProvider(ssoInfo.provider);
    setOrgName(ssoInfo.organization);
  } else {
    // Show consumer auth options
    setShowSSO(false);
  }
};

// Smart login component
const SmartLoginForm = () => {
  const [email, setEmail] = useState('');
  const [showSSO, setShowSSO] = useState(false);
  const [ssoProvider, setSSOProvider] = useState('');
  
  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          handleEmailInput(e.target.value);
        }}
      />
      
      {showSSO ? (
        <div className="sso-detected">
          <div className="sso-banner">
            <Shield className="icon" />
            <span>SSO detected for your organization</span>
          </div>
          
          <button 
            onClick={() => initiateSSO({ email })}
            className="sso-btn primary"
          >
            Continue with {ssoProvider}
          </button>
          
          <button 
            onClick={() => setShowSSO(false)}
            className="fallback-btn"
          >
            Use personal account instead
          </button>
        </div>
      ) : (
        <div className="consumer-auth">
          <button onClick={() => signInWithGoogle(email)} className="google-btn">
            <Google className="icon" />
            Continue with Google
          </button>
          
          <div className="divider">or</div>
          
          <CognitoEmailPasswordForm email={email} />
        </div>
      )}
    </div>
  );
};
```

## 🏢 **Enterprise Admin Panel**

### SSO Configuration Interface
```jsx
const SSOConfigPanel = ({ organization }) => {
  const [provider, setProvider] = useState('azure-ad');
  
  return (
    <div className="sso-config">
      <h2>Single Sign-On Configuration</h2>
      
      <div className="provider-selector">
        <label>Identity Provider</label>
        <select value={provider} onChange={(e) => setProvider(e.target.value)}>
          <option value="azure-ad">Microsoft Azure AD</option>
          <option value="google-workspace">Google Workspace</option>
          <option value="okta">Okta</option>
          <option value="auth0">Auth0</option>
          <option value="saml">Generic SAML 2.0</option>
        </select>
      </div>
      
      {provider === 'azure-ad' && <AzureADConfig />}
      {provider === 'google-workspace' && <GoogleWorkspaceConfig />}
      {provider === 'okta' && <OktaConfig />}
      {provider === 'saml' && <SAMLConfig />}
      
      <div className="sso-settings">
        <label>
          <input type="checkbox" defaultChecked />
          Auto-provision new users
        </label>
        
        <label>
          Default Role:
          <select>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      
      <button onClick={saveSSOConfig} className="save-btn">
        Save SSO Configuration
      </button>
    </div>
  );
};
```

## 🔄 **Migration Strategy**

### Step 1: Keep Existing Auth
- ✅ Don't touch your current Google/Cognito setup
- ✅ Add SSO as an additional option
- ✅ Both can coexist perfectly

### Step 2: Add SSO Infrastructure
```javascript
// Add to your existing auth flow
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  try {
    // Try to validate as your existing JWT first
    const user = await validateExistingJWT(token);
    req.user = user;
    return next();
  } catch (error) {
    // Fallback to SSO token validation
    try {
      const ssoUser = await validateSSOToken(token);
      req.user = ssoUser;
      return next();
    } catch (ssoError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
};
```

### Step 3: Gradual Enterprise Rollout
1. **Pilot customers** → Configure their SSO
2. **Self-service** → Admin panel for SSO setup
3. **Enterprise sales** → SSO as a selling point

## 🎯 **Immediate Implementation**

Want me to help you add the **SSO login button** to your existing auth flow? We can:

1. **Keep your Google auth** exactly as-is
2. **Add "Enterprise SSO" option** alongside it  
3. **Auto-detect** when users enter corporate emails
4. **Start with Azure AD** (most common enterprise request)

This approach gives you **enterprise credibility** while keeping the **simple consumer experience**! 🚀 