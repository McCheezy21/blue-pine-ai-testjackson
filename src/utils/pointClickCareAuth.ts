// PointClickCare OAuth Authentication Utilities
import { config } from './config';
import { toast } from 'sonner';

export interface PointClickCareUser {
  firstName: string;
  lastName: string;
  email: string;
  sub: string;
  picture?: string;
}

export interface PointClickCareTenantMapping {
  tenantId: string;
  facilityName: string;
  facilityId: string;
  accessLevel: 'full' | 'limited';
}

export const pointClickCareConfig = {
  clientId: import.meta.env.VITE_POINTCLICKCARE_CLIENT_ID || 'your_pcc_client_id',
  baseUrl: 'https://api.pointclickcare.com',
  authUrl: 'https://auth.pointclickcare.com/oauth2/authorize',
  tokenUrl: 'https://auth.pointclickcare.com/oauth2/token',
  scope: 'openid profile email facility_read resident_read', // Adjust scopes as needed
  demoMode: import.meta.env.VITE_POINTCLICKCARE_DEMO_MODE === 'true' || import.meta.env.VITE_POINTCLICKCARE_CLIENT_ID === 'your_pcc_client_id_here',
  get redirectUri() {
    return `${window.location.origin}/auth/pointclickcare/callback`;
  }
};

// Generate a secure random state parameter for OAuth security
const generateState = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Demo mode - simulate PointClickCare authentication
const simulatePointClickCareAuth = async (): Promise<void> => {
  console.log('🧪 DEMO MODE: Simulating PointClickCare authentication');
  
  // Simulate delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  const mockUser: PointClickCareUser = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@demofacility.com',
    sub: '550e8400-e29b-41d4-a716-446655440000', // Proper UUID format for Supabase
    picture: undefined
  };
  
  // Mock tenant mapping
  const mockTenantMapping: PointClickCareTenantMapping = {
    tenantId: 'pcc-demo-skilled-nursing-facility',
    facilityName: 'Demo Skilled Nursing Facility',
    facilityId: 'demo-facility-123',
    accessLevel: 'full'
  };
  
  // 🔐 SECURITY: Generate mock JWT token for demo
  const mockJwtPayload = {
    sub: mockUser.sub,
    email: mockUser.email,
    given_name: mockUser.firstName,
    family_name: mockUser.lastName,
    name: `${mockUser.firstName} ${mockUser.lastName}`,
    'cognito:username': `pcc-${mockUser.sub}`,
    provider: 'pointclickcare',
    iss: 'blue-pine-api',
    aud: 'blue-pine-frontend',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    auth_time: Math.floor(Date.now() / 1000),
    token_use: 'id'
  };
  
  // For demo, create a JWT-like token that will work with our backend verification
  // Using the same secret as the backend for demo consistency
  const demoSecret = 'blue-pine-secure-jwt-secret-change-in-production-2024';
  
  // Create a simple HMAC-like signature for demo purposes
  const headerPayload = JSON.stringify({ alg: 'HS256', typ: 'JWT' }) + '.' + JSON.stringify(mockJwtPayload);
  const demoSignature = btoa(demoSecret + headerPayload); // Simple demo signature
  
  const headerB64 = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payloadB64 = btoa(JSON.stringify(mockJwtPayload));
  const signatureB64 = demoSignature.substring(0, 32); // Truncate for demo
  
  const mockJwtToken = `${headerB64}.${payloadB64}.${signatureB64}`;
  
  // Store authentication data
  localStorage.setItem('pcc_access_token', 'demo-access-token');
  localStorage.setItem('pcc_user_info', JSON.stringify(mockUser));
  localStorage.setItem('pcc_tenant_mapping', JSON.stringify(mockTenantMapping));
  localStorage.setItem('pcc_authenticated', 'true');
  // 🔐 SECURITY: Store our JWT token for API calls
  localStorage.setItem('idToken', mockJwtToken);
  
  console.log('🧪 DEMO: Mock PointClickCare authentication complete');
  
  toast.success('Demo authentication successful!', {
    description: 'Redirecting to your facility dashboard...',
  });
};

// Initiate PointClickCare OAuth flow
export const initiatePointClickCareLogin = async (): Promise<void> => {
  console.log('🏥 Starting PointClickCare OAuth flow');
  
  // Check if we have real credentials (not just any value)
  const clientId = import.meta.env.VITE_POINTCLICKCARE_CLIENT_ID;
  const hasRealCredentials = clientId && 
    clientId !== 'your_pcc_client_id_here' && 
    clientId !== 'your_pcc_client_id' &&
    !clientId.includes('placeholder') &&
    !clientId.includes('demo') &&
    clientId.length > 10; // Real client IDs are typically longer
  
  if (!hasRealCredentials) {
    console.log('🧪 DEMO MODE: No real PointClickCare credentials found, using simulated authentication');
    console.log(`🔍 Client ID: "${clientId || 'undefined'}"`);
    await simulatePointClickCareAuth();
    
    // Redirect to callback with demo flag
    window.location.href = '/auth/pointclickcare/callback?demo=true';
    return;
  }
  
  // Real PointClickCare OAuth flow
  console.log('🔐 PRODUCTION MODE: Using real PointClickCare OAuth flow');
  const redirectUri = `${window.location.origin}/auth/pointclickcare/callback`;
  const state = crypto.randomUUID();
  localStorage.setItem('pcc_oauth_state', state);
  
  const authUrl = new URL('https://auth.pointclickcare.com/oauth2/authorize');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'read');
  authUrl.searchParams.set('state', state);
  
  window.location.href = authUrl.toString();
};

// Handle OAuth callback
export const handlePointClickCareCallback = async (
  code?: string,
  state?: string,
  isDemo?: boolean
): Promise<{ success: boolean; tenantId?: string; error?: string }> => {
  try {
    if (isDemo) {
      console.log('🧪 DEMO: Processing demo callback');
      return { success: true, tenantId: 'pcc-demo-skilled-nursing-facility' };
    }
    
    if (!code) {
      return { success: false, error: 'No authorization code received' };
    }
    
    // Verify state parameter
    const storedState = localStorage.getItem('pcc_oauth_state');
    if (state !== storedState) {
      return { success: false, error: 'Invalid state parameter' };
    }
    
    // Exchange code for tokens
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const redirectUri = `${window.location.origin}/auth/pointclickcare/callback`;
    
    const response = await fetch(`${API_BASE}/api/auth/pointclickcare/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Authentication failed' };
    }
    
    const data = await response.json();
    
    // 🔐 SECURITY: Store the Blue Pine JWT token for API authentication
    if (data.blue_pine_jwt) {
      localStorage.setItem('idToken', data.blue_pine_jwt);
      console.log('✅ Stored Blue Pine JWT token for API authentication');
    }
    
    // Store authentication data
    localStorage.setItem('pcc_access_token', data.access_token);
    localStorage.setItem('pcc_id_token', data.id_token || '');
    localStorage.setItem('pcc_refresh_token', data.refresh_token || '');
    localStorage.setItem('pcc_authenticated', 'true');
    
    if (data.userInfo) {
      const userInfo: PointClickCareUser = {
        firstName: data.userInfo.firstName || data.userInfo.first_name || '',
        lastName: data.userInfo.lastName || data.userInfo.last_name || '',
        email: data.userInfo.email || `${data.userInfo.username}@pointclickcare.com`,
        sub: `pcc-${data.userInfo.id || data.userInfo.userId || data.userInfo.username}`,
        picture: data.userInfo.picture
      };
      localStorage.setItem('pcc_user_info', JSON.stringify(userInfo));
    }
    
    if (data.tenantMapping) {
      localStorage.setItem('pcc_tenant_mapping', JSON.stringify(data.tenantMapping));
    }
    
    // Clean up OAuth state
    localStorage.removeItem('pcc_oauth_state');
    
    return { 
      success: true, 
      tenantId: data.tenantMapping?.tenantId 
    };
    
  } catch (error) {
    console.error('PointClickCare callback error:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

// Get PointClickCare user info
export const getPointClickCareUserInfo = (): PointClickCareUser | null => {
  try {
    const userInfo = localStorage.getItem('pcc_user_info');
    if (!userInfo) return null;
    return JSON.parse(userInfo);
  } catch (error) {
    console.error('Error parsing PointClickCare user info:', error);
    return null;
  }
};

// Check if user is authenticated with PointClickCare
export const isPointClickCareAuthenticated = (): boolean => {
  return localStorage.getItem('pcc_authenticated') === 'true';
};

// Logout from PointClickCare
export const logoutPointClickCare = (): void => {
  // Clear all PointClickCare-related storage
  localStorage.removeItem('pcc_access_token');
  localStorage.removeItem('pcc_id_token');
  localStorage.removeItem('pcc_refresh_token');
  localStorage.removeItem('pcc_user_info');
  localStorage.removeItem('pcc_tenant_mapping');
  localStorage.removeItem('pcc_authenticated');
  localStorage.removeItem('pcc_oauth_state');
  
  // 🔐 SECURITY: Clear JWT token for PointClickCare users
  const currentToken = localStorage.getItem('idToken');
  if (currentToken) {
    try {
      // Decode the JWT payload to check if it's a PointClickCare token
      const parts = currentToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.provider === 'pointclickcare' || payload.iss === 'blue-pine-api') {
          localStorage.removeItem('idToken');
          console.log('🔐 Cleared PointClickCare JWT token');
        }
      }
    } catch (error) {
      // If token is malformed or our old demo format, clear it anyway
      if (currentToken.startsWith('demo-jwt-') || currentToken.includes('blue-pine-api')) {
        localStorage.removeItem('idToken');
        console.log('🔐 Cleared malformed PointClickCare token');
      }
    }
  }
  
  console.log('🏥 PointClickCare user logged out');
};

// Get PointClickCare access token for API calls
export const getPointClickCareAccessToken = () => {
  return localStorage.getItem('pcc_access_token');
}; 