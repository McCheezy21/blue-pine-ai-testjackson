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
  
  console.error('🔍🔍🔍 DEBUGGING COGNITO CALLBACK - START 🔍🔍🔍');
  console.error('- Current URL:', window.location.href);
  console.error('- Redirect URI we will use:', cognitoConfig.redirectUri);
  console.error('- Authorization code:', code);
  console.error('- Client ID:', cognitoConfig.clientId);
  console.error('- Domain:', cognitoConfig.domain);
  
  // Check for OAuth errors first
  if (error) {
    console.error('❌ OAuth Error:', error);
    console.error('❌ Error Description:', decodeURIComponent(errorDescription || ''));
    throw new Error(`OAuth Error: ${error} - ${decodeURIComponent(errorDescription || '')}`);
  }
  
  if (!code) {
    console.error('❌ No authorization code found in URL');
    return null;
  }

  console.error('✅ Authorization code received, attempting token exchange...');
  
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
    
    console.error('🔄🔄🔄 MAKING TOKEN EXCHANGE REQUEST 🔄🔄🔄');
    console.error('- Endpoint:', tokenEndpoint);
    console.error('- Grant type: authorization_code');
    console.error('- Client ID:', cognitoConfig.clientId);
    console.error('- Client Secret (first 10 chars):', clientSecret.substring(0, 10) + '...');
    console.error('- Redirect URI:', cognitoConfig.redirectUri);
    console.error('- Code (first 10 chars):', code.substring(0, 10) + '...');
    console.error('- Full request body:', requestBody.toString());

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    console.error('🔍🔍🔍 TOKEN RESPONSE DETAILS 🔍🔍🔍');
    console.error('- Status:', tokenResponse.status);
    console.error('- Status Text:', tokenResponse.statusText);
    console.error('- Headers:', Object.fromEntries(tokenResponse.headers.entries()));

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌❌❌ TOKEN EXCHANGE FAILED ❌❌❌');
      console.error('- Status:', tokenResponse.status);
      console.error('- Full Error Response:', errorText);
      
      // Try to parse error details
      try {
        const errorJson = JSON.parse(errorText);
        console.error('- Parsed Error Details:', JSON.stringify(errorJson, null, 2));
        
        // If invalid_client, try without client secret as fallback
        if (errorJson.error === 'invalid_client') {
          console.error('🔄 Trying without client secret as fallback...');
          return await tryWithoutClientSecret(code);
        }
      } catch (e) {
        console.error('- Error response is not JSON, raw text:', errorText);
      }
      
      throw new Error(`Token exchange failed: ${tokenResponse.status} - ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    console.error('✅✅✅ REAL COGNITO TOKEN EXCHANGE SUCCESSFUL! ✅✅✅');
    console.error('- Access token received:', !!tokens.access_token);
    console.error('- ID token received:', !!tokens.id_token);
    console.error('- Refresh token received:', !!tokens.refresh_token);
    
    // Store real Cognito tokens
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refreshToken', tokens.refresh_token);
    }
    
    return tokens;
    
  } catch (error) {
    console.error('❌❌❌ TOKEN EXCHANGE ERROR ❌❌❌', error);
    // Clear any potentially invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    
    throw error;
  }
};

// Fallback function to try token exchange without client secret
const tryWithoutClientSecret = async (code: string) => {
  console.error('🔄 Attempting token exchange WITHOUT client secret...');
  
  const tokenEndpoint = `https://${cognitoConfig.domain}/oauth2/token`;
  
  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: cognitoConfig.clientId,
    code: code,
    redirect_uri: cognitoConfig.redirectUri,
  });
  
  console.error('- Request without client secret:', requestBody.toString());
  
  const tokenResponse = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  });
  
  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error('❌ Fallback also failed:', tokenResponse.status, errorText);
    throw new Error(`Both attempts failed: ${tokenResponse.status} - ${errorText}`);
  }
  
  const tokens = await tokenResponse.json();
  console.error('✅ SUCCESS with fallback method (no client secret)!');
  
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
      const firstName = payload.given_name || payload.name?.split(' ')[0] || payload['cognito:username'] || 'User';
      const lastName = payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '';
      const email = payload.email || payload['cognito:username'] || 'user@example.com';
      
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
  
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  
  // Redirect to Cognito logout
  const logoutUrl = `https://${cognitoConfig.domain}/logout?` +
    `client_id=${cognitoConfig.clientId}&` +
    `logout_uri=${encodeURIComponent(window.location.origin)}`;
  
  window.location.href = logoutUrl;
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
    redirect_uri: cognitoConfig.redirectUri
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
