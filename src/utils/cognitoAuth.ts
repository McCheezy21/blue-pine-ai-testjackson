// Utility functions for AWS Cognito authentication
export const cognitoConfig = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_p6qGk8fQ3',
  clientId: 'lg92qnkko2jl523bffuumh7pb',
  get redirectUri() {
    return window.location.origin + '/dashboard';
  },
  scope: 'phone openid email',
  region: 'us-west-1',
  userPoolId: 'us-west-1_p6qGk8fQ3'
};

export const handleCognitoCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (!code) {
    console.log('No authorization code found in URL');
    return null;
  }

  try {
    console.log('Exchanging authorization code for tokens...');
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch(`${cognitoConfig.authority}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: cognitoConfig.clientId,
        code: code,
        redirect_uri: cognitoConfig.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      throw new Error(`Failed to exchange authorization code for tokens: ${tokenResponse.status} ${errorText}`);
    }

    const tokens = await tokenResponse.json();
    
    // Validate that we received the expected tokens
    if (!tokens.access_token || !tokens.id_token) {
      throw new Error('Invalid token response: missing required tokens');
    }
    
    // Store tokens in localStorage (you might want to use more secure storage in production)
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    if (tokens.refresh_token) {
      localStorage.setItem('refreshToken', tokens.refresh_token);
    }
    
    console.log('Successfully stored authentication tokens');
    
    return tokens;
  } catch (error) {
    console.error('Error handling Cognito callback:', error);
    
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
      
      return {
        firstName: payload.given_name || payload.name?.split(' ')[0] || 'User',
        lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
        email: payload.email || 'user@example.com',
        sub: payload.sub
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
  const logoutUrl = `${cognitoConfig.authority}/logout?` +
    `client_id=${cognitoConfig.clientId}&` +
    `logout_uri=${encodeURIComponent(window.location.origin)}`;
  
  window.location.href = logoutUrl;
};

export const initiateCognitoLogin = () => {
  const redirectUri = encodeURIComponent(window.location.origin + '/dashboard');
  const cognitoUrl = `https://us-west-1p6qgk8fq3.auth.us-west-1.amazoncognito.com/login?client_id=${cognitoConfig.clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${redirectUri}`;
  
  console.log('Redirecting to Cognito login:', cognitoUrl);
  window.location.href = cognitoUrl;
};
