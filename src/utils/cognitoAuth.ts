// Utility functions for AWS Cognito authentication
export const cognitoConfig = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_p6qGk8fQ3',
  clientId: 'lg92qnkko2jl523bffuumh7pb',
  get redirectUri() {
    return window.location.origin + '/dashboard';
  },
  scope: 'phone openid email profile',
  region: 'us-west-1',
  userPoolId: 'us-west-1_p6qGk8fQ3',
  domain: 'us-west-1p6qgk8fq3.auth.us-west-1.amazoncognito.com'
};

export const handleCognitoCallback = async () => {
  console.log('🔄 handleCognitoCallback called');
  console.log('🌐 Current URL:', window.location.href);
  console.log('🔍 URL Search params:', window.location.search);
  
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  
  console.log('📋 Extracted params:');
  console.log('- Code:', code ? code.substring(0, 10) + '...' : 'NULL');
  console.log('- Error:', error);
  console.log('- Error Description:', errorDescription);
  
  // Check for OAuth errors first
  if (error) {
    console.error('❌ OAuth Error:', error);
    console.error('❌ Error Description:', decodeURIComponent(errorDescription || ''));
    throw new Error(`OAuth Error: ${error} - ${decodeURIComponent(errorDescription || '')}`);
  }
  
  if (!code) {
    console.log('❌ No authorization code found in URL');
    return null;
  }

  try {
    console.log('🔄 Starting token exchange...');
    console.log('📋 Code:', code.substring(0, 10) + '...');
    console.log('📋 Redirect URI:', cognitoConfig.redirectUri);
    console.log('📋 Client ID:', cognitoConfig.clientId);
    
    // Prepare token exchange request
    const tokenEndpoint = `${cognitoConfig.authority}/oauth2/token`;
    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: cognitoConfig.clientId,
      code: code,
      redirect_uri: cognitoConfig.redirectUri,
    });
    
    console.log('🌐 Token endpoint:', tokenEndpoint);
    console.log('📤 Request body:', requestBody.toString());
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    console.log('📥 Token response status:', tokenResponse.status);
    console.log('📥 Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token exchange failed:');
      console.error('Status:', tokenResponse.status);
      console.error('Error text:', errorText);
      throw new Error(`Failed to exchange authorization code for tokens: ${tokenResponse.status} ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    console.log('✅ Token exchange successful');
    console.log('🔑 Received tokens:', Object.keys(tokens));
    
    // Validate that we received the expected tokens
    if (!tokens.access_token || !tokens.id_token) {
      console.error('❌ Invalid token response: missing required tokens');
      console.error('Received tokens:', Object.keys(tokens));
      throw new Error('Invalid token response: missing required tokens');
    }
    
    // Store tokens in localStorage (you might want to use more secure storage in production)
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refreshToken', tokens.refresh_token);
    }
    
    console.log('✅ Successfully stored authentication tokens');
    console.log('💾 Stored in localStorage:');
    console.log('- accessToken length:', tokens.access_token.length);
    console.log('- idToken length:', tokens.id_token.length);
    console.log('- refreshToken:', tokens.refresh_token ? 'present' : 'not provided');
    
    return tokens;
  } catch (error) {
    console.error('❌ Error handling Cognito callback:', error);
    console.error('❌ Error stack:', error.stack);
    
    // Clear any potentially invalid tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    
    throw error;
  }
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

// Social provider login functions
export const initiateGoogleLogin = () => {
  console.log('🔵 initiateGoogleLogin called');
  
  const redirectUri = cognitoConfig.redirectUri;
  const googleScopes = 'openid email';
  
  // Build URL using URLSearchParams for proper encoding
  const params = new URLSearchParams({
    identity_provider: 'Google', // Make sure this matches your Cognito identity provider name
    redirect_uri: redirectUri,
    response_type: 'code',
    client_id: cognitoConfig.clientId,
    scope: googleScopes
  });
  
  const cognitoUrl = `https://${cognitoConfig.domain}/oauth2/authorize?${params.toString()}`;
  
  console.log('🌐 Generated URL:', cognitoUrl);
  
  try {
    console.log('🚀 Redirecting to Google login...');
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
export const initiateSocialLogin = (provider: 'Google' | 'Microsoft') => {
  console.log(`⚡ initiateSocialLogin called with provider: ${provider}`);
  if (provider === 'Google') {
    initiateGoogleLogin();
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
  
  // Show URL for debugging
  alert(`Generated URL:\n\n${cognitoUrl}`);
  
  console.log('🔵 Redirecting to Cognito Hosted UI:', cognitoUrl);
  window.location.href = cognitoUrl;
};
