// Utility functions for AWS Cognito authentication
export const cognitoConfig = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_ZRp04bdAf',
  clientId: '3cqsdhk7qmhvdvt4n9lpvni40q',
  get redirectUri() {
    return window.location.origin + '/dashboard';
  },
  scope: 'phone openid email profile',
  region: 'us-west-1',
  userPoolId: 'us-west-1_ZRp04bdAf',
  domain: 'us-west-1zrp04bdaf.auth.us-west-1.amazoncognito.com'
};

export const handleCognitoCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  
  // Check for OAuth errors first
  if (error) {
    console.error('OAuth Error:', error, errorDescription);
    throw new Error(`OAuth Error: ${error} - ${decodeURIComponent(errorDescription || '')}`);
  }
  
  if (!code) {
    console.error('No authorization code found in URL');
    return null;
  }

  try {
    // Use proper Cognito token exchange with client secret
    const tokenEndpoint = `https://${cognitoConfig.domain}/oauth2/token`;
    // Real client secret from AWS Cognito console
    const clientSecret = '13ufeqd70tidrhrgnu9agb46118sb85b48p59lh7ac4jk95m3k3m';
    
    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: cognitoConfig.clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: cognitoConfig.redirectUri,
    });

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', tokenResponse.status, errorText);
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText);
        
        // If invalid_client, try without client secret as fallback
        if (errorJson.error === 'invalid_client') {
          console.log('Trying fallback method...');
          return await tryWithoutClientSecret(code);
        }
      } catch (e) {
        // Error response is not JSON
      }
      
      throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    console.log('✅ Token authentication successful');
    
    // Store real Cognito tokens
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refreshToken', tokens.refresh_token);
    }
    
    return tokens;
    
  } catch (error) {
    console.error('Token exchange error:', error);
    // Clear any potentially invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    
    throw error;
  }
};

// Fallback function to try token exchange without client secret
const tryWithoutClientSecret = async (code: string) => {
  const tokenEndpoint = `https://${cognitoConfig.domain}/oauth2/token`;
  
  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: cognitoConfig.clientId,
    code: code,
    redirect_uri: cognitoConfig.redirectUri,
  });
  
  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('Fallback also failed:', tokenResponse.status, errorText);
    throw new Error(`Both attempts failed: ${tokenResponse.status} - ${errorText}`);
  }
  
  const tokens = await tokenResponse.json();
  console.log('✅ Fallback method successful');
  
  // Store tokens
  localStorage.setItem('accessToken', tokens.access_token);
  localStorage.setItem('idToken', tokens.id_token);
  if (tokens.refresh_token) {
    localStorage.setItem('refreshToken', tokens.refresh_token);
  }
  
  return tokens;
};

export const getUserInfo = () => {
  const idToken = localStorage.getItem('idToken');
  if (idToken) {
    try {
      // Decode JWT token to get user info (basic decoding, in production use a proper JWT library)
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token has expired, clearing stored tokens');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('idToken');
        localStorage.removeItem('refreshToken');
        return null;
      }
      
      // Handle different token formats from social providers
      let firstName = 'User';
      let lastName = '';
      let email = 'user@example.com';
      
      // For Google OAuth tokens - check all possible name fields
      if (payload.given_name) {
        firstName = payload.given_name;
        lastName = payload.family_name || '';
      } 
      else if (payload.name && !payload.name.includes('google_')) {
        const nameParts = payload.name.split(' ');
        firstName = nameParts[0] || 'User';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      // Check for other possible name fields from social providers
      else if (payload.first_name) {
        firstName = payload.first_name;
        lastName = payload.last_name || '';
      }
      // For direct Cognito users
      else if (payload['cognito:username'] && !payload['cognito:username'].includes('google_')) {
        firstName = payload['cognito:username'];
      }
      // If we still don't have a real name, extract from email
      else if (payload.email && payload.email !== 'user@example.com') {
        const emailParts = payload.email.split('@')[0];
        if (emailParts.includes('.')) {
          const emailNameParts = emailParts.split('.');
          firstName = emailNameParts[0].charAt(0).toUpperCase() + emailNameParts[0].slice(1);
          lastName = emailNameParts[1] ? emailNameParts[1].charAt(0).toUpperCase() + emailNameParts[1].slice(1) : '';
        } else {
          firstName = emailParts.charAt(0).toUpperCase() + emailParts.slice(1);
        }
      }
      
      // Handle email
      if (payload.email && payload.email !== 'user@example.com') {
        email = payload.email;
      } else if (payload['cognito:username'] && payload['cognito:username'].includes('@')) {
        email = payload['cognito:username'];
      }
      
      // Final fallback for display names
      if (firstName === 'User' || firstName.includes('google_')) {
        // Try to get a better name from the user - in a real app you'd want to prompt for this
        firstName = 'Google User';
        lastName = '';
      }
      
      return {
        firstName,
        lastName,
        email,
        sub: payload.sub,
        provider: payload.identities ? payload.identities[0]?.providerName : 'Cognito',
        picture: payload.picture || null
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      // Clear invalid token
      localStorage.removeItem('idToken');
    }
  }
  
  return null;
};

export const isAuthenticated = () => {
  const idToken = localStorage.getItem('idToken');
  if (!idToken) {
    return false;
  }
  
  try {
    // Check if token is valid and not expired
    const payload = JSON.parse(atob(idToken.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < currentTime) {
      // Token is expired, clear it
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    // Clear invalid token
    localStorage.removeItem('idToken');
    return false;
  }
};

export const logout = () => {
  console.log('Logging out user...');
  
  // Clear all tokens from local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  
  // Clear any other auth-related storage
  localStorage.removeItem('codeVerifier');
  localStorage.removeItem('state');
  
  // For now, just clear tokens and redirect to home
  // This avoids the Cognito logout endpoint configuration issues
  console.log('🏠 Redirecting to home page after clearing tokens');
  window.location.href = window.location.origin;
};

// PKCE helper functions
const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode.apply(null, Array.from(array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const generateCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// Social provider login functions
export const initiateGoogleLogin = async () => {
  const redirectUri = cognitoConfig.redirectUri;
  const googleScopes = 'openid email';
  
  const params = {
    identity_provider: 'Google',
    redirect_uri: redirectUri,
    response_type: 'code',
    client_id: cognitoConfig.clientId,
    scope: googleScopes,
    prompt: 'select_account consent'
  };
  
  console.log('🔐 Initiating Google login with client secret authentication');
  
  // Build URL using URLSearchParams for proper encoding
  const urlParams = new URLSearchParams(params);
  const cognitoUrl = `https://${cognitoConfig.domain}/oauth2/authorize?${urlParams.toString()}`;
  
  try {
    window.location.href = cognitoUrl;
  } catch (error) {
    console.error('❌ Error during redirect:', error);
    throw error;
  }
};

export const initiateMicrosoftLogin = () => {
  console.log('🟦 initiateMicrosoftLogin called');
  const redirectUri = encodeURIComponent(cognitoConfig.redirectUri);
  const cognitoUrl = `https://${cognitoConfig.domain}/oauth2/authorize?` +
    `identity_provider=Microsoft&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=code&` +
    `client_id=${cognitoConfig.clientId}&` +
    `scope=${encodeURIComponent(cognitoConfig.scope)}`;
  
  console.log('🌐 Redirecting to Microsoft login via Cognito:', cognitoUrl);
  window.location.href = cognitoUrl;
};

// Generic social login function
export const initiateSocialLogin = async (provider: 'Google' | 'Microsoft') => {
  console.log(`⚡ initiateSocialLogin called with provider: ${provider}`);
  if (provider === 'Google') {
    await initiateGoogleLogin();
  } else if (provider === 'Microsoft') {
    initiateMicrosoftLogin();
  }
};

// Updated login function (keeping for backward compatibility)
export const initiateCognitoLogin = () => {
  const redirectUri = encodeURIComponent(cognitoConfig.redirectUri);
  const scope = encodeURIComponent('openid email');
  
  // Build URL with proper parameter construction - match AWS example scopes
  const params = new URLSearchParams({
    client_id: cognitoConfig.clientId,
    response_type: 'code',
    scope: 'openid email',  // Remove 'profile' to match app client config
    redirect_uri: cognitoConfig.redirectUri,
    prompt: 'login'  // Force fresh login, don't use cached sessions
  });
  
  const cognitoUrl = `https://${cognitoConfig.domain}/oauth2/authorize?${params.toString()}`;
  
  console.log('🔵 Generated Cognito URL:');
  console.log('========================');
  console.log(cognitoUrl);
  console.log('========================');
  console.log('Client ID:', cognitoConfig.clientId);
  console.log('Redirect URI:', cognitoConfig.redirectUri);
  
  console.log('🔵 Redirecting to Cognito Hosted UI:', cognitoUrl);
  window.location.href = cognitoUrl;
};
