// Utility functions for AWS Cognito authentication
export const cognitoConfig = {
  authority: 'https://cognito-idp.us-west-1.amazonaws.com/us-west-1_CHWkkt0Oh',
  clientId: '5nrb8a78t44mpek2rn77p9vhgq',
  redirectUri: window.location.origin + '/dashboard',
  scope: 'phone openid email',
  region: 'us-west-1',
  userPoolId: 'us-west-1_CHWkkt0Oh'
};

export const handleCognitoCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  if (code) {
    try {
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

      if (tokenResponse.ok) {
        const tokens = await tokenResponse.json();
        
        // Store tokens in localStorage (you might want to use more secure storage in production)
        localStorage.setItem('accessToken', tokens.access_token);
        localStorage.setItem('idToken', tokens.id_token);
        localStorage.setItem('refreshToken', tokens.refresh_token);
        
        // Clear the URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return tokens;
      } else {
        throw new Error('Failed to exchange authorization code for tokens');
      }
    } catch (error) {
      console.error('Error handling Cognito callback:', error);
      throw error;
    }
  }
  
  return null;
};

export const getUserInfo = () => {
  const idToken = localStorage.getItem('idToken');
  if (idToken) {
    try {
      // Decode JWT token to get user info (basic decoding, in production use a proper JWT library)
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return {
        firstName: payload.given_name || payload.name?.split(' ')[0] || 'User',
        lastName: payload.family_name || payload.name?.split(' ').slice(1).join(' ') || '',
        email: payload.email || 'user@example.com'
      };
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  // Return mock data if no token
  return {
    firstName: "Sarah",
    lastName: "Johnson", 
    email: "sarah.johnson@example.com"
  };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('idToken');
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('refreshToken');
  
  // Redirect to Cognito logout
  const logoutUrl = `${cognitoConfig.authority}/logout?` +
    `client_id=${cognitoConfig.clientId}&` +
    `logout_uri=${encodeURIComponent(window.location.origin)}`;
  
  window.location.href = logoutUrl;
};
