const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class SSOService {
  constructor(pool) {
    this.pool = pool;
  }

  // Discover SSO configuration by email domain
  async discoverSSO(email) {
    try {
      if (!email || !email.includes('@')) {
        return null;
      }

      const domain = email.toLowerCase().split('@')[1];
      
      const result = await this.pool.query(`
        SELECT 
          sc.*,
          o.name as organization_name,
          o.subdomain as organization_subdomain
        FROM sso_configurations sc
        JOIN sso_domains sd ON sc.id = sd.sso_config_id
        JOIN organizations o ON sc.organization_id = o.id
        WHERE sd.domain = $1 AND sc.is_active = true
        LIMIT 1
      `, [domain]);

      if (result.rows.length === 0) {
        return null;
      }

      const config = result.rows[0];
      
      return {
        hasSSO: true,
        provider: config.provider,
        organization: {
          id: config.organization_id,
          name: config.organization_name,
          subdomain: config.organization_subdomain
        },
        config: {
          id: config.id,
          provider: config.provider,
          client_id: config.client_id,
          authority_url: config.authority_url,
          domain_hint: config.domain_hint
        }
      };
    } catch (error) {
      console.error('SSO discovery error:', error);
      return null;
    }
  }

  // Initiate SSO login
  async initiateSSOLogin(ssoConfigId, redirectUri, state) {
    try {
      const config = await this.pool.query(`
        SELECT * FROM sso_configurations WHERE id = $1 AND is_active = true
      `, [ssoConfigId]);

      if (config.rows.length === 0) {
        throw new Error('SSO configuration not found');
      }

      const ssoConfig = config.rows[0];

      switch (ssoConfig.provider) {
        case 'azure-ad':
          return this.generateAzureADRedirect(ssoConfig, redirectUri, state);
        case 'google-workspace':
          return this.generateGoogleWorkspaceRedirect(ssoConfig, redirectUri, state);
        case 'okta':
          return this.generateOktaRedirect(ssoConfig, redirectUri, state);
        default:
          throw new Error(`Unsupported SSO provider: ${ssoConfig.provider}`);
      }
    } catch (error) {
      console.error('SSO initiation error:', error);
      throw error;
    }
  }

  // Generate Azure AD redirect URL
  generateAzureADRedirect(ssoConfig, redirectUri, state) {
    const authUrl = new URL(`${ssoConfig.authority_url}/oauth2/v2.0/authorize`);
    
    authUrl.searchParams.set('client_id', ssoConfig.client_id);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('response_mode', 'query');
    
    if (ssoConfig.domain_hint) {
      authUrl.searchParams.set('domain_hint', ssoConfig.domain_hint);
    }
    
    return authUrl.toString();
  }

  // Generate Google Workspace redirect URL
  generateGoogleWorkspaceRedirect(ssoConfig, redirectUri, state) {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    authUrl.searchParams.set('client_id', ssoConfig.client_id);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('state', state);
    
    if (ssoConfig.domain_hint) {
      authUrl.searchParams.set('hd', ssoConfig.domain_hint); // Google Workspace domain
    }
    
    return authUrl.toString();
  }

  // Generate Okta redirect URL
  generateOktaRedirect(ssoConfig, redirectUri, state) {
    const authUrl = new URL(`${ssoConfig.authority_url}/oauth2/v1/authorize`);
    
    authUrl.searchParams.set('client_id', ssoConfig.client_id);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('state', state);
    
    return authUrl.toString();
  }

  // Handle SSO callback and exchange code for tokens
  async handleSSOCallback(code, state) {
    try {
      // Validate state and get SSO config
      const stateData = this.validateState(state);
      const ssoConfigId = stateData.configId;
      
      const config = await this.pool.query(`
        SELECT * FROM sso_configurations WHERE id = $1 AND is_active = true
      `, [ssoConfigId]);

      if (config.rows.length === 0) {
        throw new Error('Invalid SSO configuration');
      }

      const ssoConfig = config.rows[0];

      // Exchange code for tokens
      const tokens = await this.exchangeCodeForTokens(ssoConfig, code, stateData.redirectUri);
      
      // Validate and decode tokens
      const userInfo = await this.validateAndDecodeTokens(ssoConfig, tokens);
      
      // Find or create user
      const user = await this.findOrCreateUser(userInfo, ssoConfig);
      
      // Generate our own JWT
      const jwtToken = this.generateJWT(user, ssoConfig);
      
      return {
        success: true,
        access_token: jwtToken,
        user: user,
        organization: {
          id: ssoConfig.organization_id
        }
      };
    } catch (error) {
      console.error('SSO callback error:', error);
      throw error;
    }
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(ssoConfig, code, redirectUri) {
    const tokenUrl = this.getTokenUrl(ssoConfig.provider, ssoConfig.authority_url);
    
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: ssoConfig.client_id,
      client_secret: ssoConfig.client_secret,
      code: code,
      redirect_uri: redirectUri
    };

    const response = await axios.post(tokenUrl, new URLSearchParams(tokenData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    return response.data;
  }

  // Get token URL for different providers
  getTokenUrl(provider, authorityUrl) {
    switch (provider) {
      case 'azure-ad':
        return `${authorityUrl}/oauth2/v2.0/token`;
      case 'google-workspace':
        return 'https://oauth2.googleapis.com/token';
      case 'okta':
        return `${authorityUrl}/oauth2/v1/token`;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  // Validate and decode tokens
  async validateAndDecodeTokens(ssoConfig, tokens) {
    // Decode ID token (JWT) to get user info
    const idToken = tokens.id_token;
    
    if (!idToken) {
      throw new Error('No ID token received from SSO provider');
    }

    // For production, you should validate the token signature
    // For now, we'll just decode it (unsafe for production)
    const decodedToken = jwt.decode(idToken);
    
    if (!decodedToken) {
      throw new Error('Invalid ID token');
    }

    return {
      id: decodedToken.sub,
      email: decodedToken.email,
      name: decodedToken.name,
      given_name: decodedToken.given_name,
      family_name: decodedToken.family_name,
      provider: ssoConfig.provider,
      provider_id: decodedToken.sub
    };
  }

  // Find or create user from SSO info
  async findOrCreateUser(userInfo, ssoConfig) {
    try {
      // Check if user exists
      let user = await this.pool.query(`
        SELECT * FROM users WHERE email = $1
      `, [userInfo.email]);

      if (user.rows.length === 0) {
        // Auto-provision user if enabled
        if (ssoConfig.auto_provision) {
          const newUser = await this.pool.query(`
            INSERT INTO users (user_sub, email, given_name, family_name, provider, provider_data)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `, [
            `sso-${userInfo.provider_id}`,
            userInfo.email,
            userInfo.given_name,
            userInfo.family_name,
            userInfo.provider,
            JSON.stringify(userInfo)
          ]);

          user = newUser;

          // Add user to organization
          await this.pool.query(`
            INSERT INTO memberships (user_id, org_id, role, joined_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (user_id, org_id) DO NOTHING
          `, [
            newUser.rows[0].id,
            ssoConfig.organization_id,
            ssoConfig.default_role
          ]);
        } else {
          throw new Error('User not found and auto-provisioning is disabled');
        }
      }

      return user.rows[0];
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  }

  // Generate JWT token
  generateJWT(user, ssoConfig) {
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const currentTime = Math.floor(Date.now() / 1000);
    
    const payload = {
      sub: user.user_sub,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      name: `${user.given_name || ''} ${user.family_name || ''}`.trim(),
      provider: user.provider,
      org_id: ssoConfig.organization_id,
      iss: 'blue-pine-api',
      aud: 'blue-pine-frontend',
      iat: currentTime,
      exp: currentTime + (24 * 60 * 60), // 24 hours
      auth_time: currentTime,
      token_use: 'id'
    };
    
    return jwt.sign(payload, jwtSecret, { algorithm: 'HS256' });
  }

  // Generate and validate state parameter
  generateState(ssoConfigId, redirectUri) {
    const stateData = {
      configId: ssoConfigId,
      redirectUri: redirectUri,
      timestamp: Date.now()
    };
    
    return Buffer.from(JSON.stringify(stateData)).toString('base64url');
  }

  validateState(state) {
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64url').toString());
      
      // Check if state is not too old (5 minutes)
      if (Date.now() - stateData.timestamp > 5 * 60 * 1000) {
        throw new Error('State parameter expired');
      }
      
      return stateData;
    } catch (error) {
      throw new Error('Invalid state parameter');
    }
  }
}

module.exports = SSOService; 