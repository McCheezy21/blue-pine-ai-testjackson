export const config = {
  cognito: {
    userPoolId: 'us-west-1_ZRp04bdAf',
    clientId: '3cqsdhk7qmhvdvt4n9lpvni40q',
    domain: 'us-west-1zrp04bdaf.auth.us-west-1.amazoncognito.com',
    region: 'us-west-1',
    // Client secret - in production, this should come from a secure backend endpoint
    clientSecret: '13ufeqd70tidrhrgnu9agb46118sb85b48p59lh7ac4jk95m3k3m'
  },
  redirectUri: getRedirectUri(),
  signOutUri: getSignOutUri()
};

function getRedirectUri(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production domains
    if (hostname === 'www.bluepineai.com' || hostname === 'bluepineai.com') {
      return 'https://www.bluepineai.com/dashboard';
    }
    
    // Development
    if (hostname === 'localhost') {
      return `http://localhost:${window.location.port}/dashboard`;
    }
  }
  
  // Fallback
  return 'http://localhost:8084/dashboard';
}

function getSignOutUri(): string {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production domains
    if (hostname === 'www.bluepineai.com' || hostname === 'bluepineai.com') {
      return 'https://www.bluepineai.com/';
    }
    
    // Development
    if (hostname === 'localhost') {
      return `http://localhost:${window.location.port}/`;
    }
  }
  
  // Fallback
  return 'http://localhost:8084/';
} 