// Multi-tenant authentication utilities (Path-Based + Shared DB)
import { getUserInfo as getBasicUserInfo } from './cognitoAuth';

export interface TenantInfo {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  allowed_email_domains: string[];
  trialEndsAt?: Date;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithTenant {
  firstName: string;
  lastName: string;
  email: string;
  sub: string;
  provider: string;
  picture?: string;
  tenant: TenantInfo;
  role: 'admin' | 'user' | 'viewer';
  tenantPermissions: string[];
}

// ENHANCED: Path-based tenant identification with validation
export const getCurrentTenant = (): string | null => {
  const pathParts = window.location.pathname.split('/');
  
  // Check for /tenant/{tenant-id} pattern
  if (pathParts[1] === 'tenant' && pathParts[2]) {
    return pathParts[2];
  }
  
  // Fallback for development/testing
  return localStorage.getItem('currentTenant');
};

// ENHANCED: Tenant information with proper error handling
export const getTenantInfo = async (tenantId: string): Promise<TenantInfo | null> => {
  try {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/tenants/${tenantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`, // Use idToken instead of accessToken
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Tenant not found');
      }
      if (response.status === 403) {
        throw new Error('Access denied to tenant');
      }
      throw new Error('Failed to fetch tenant info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tenant info:', error);
    return null;
  }
};

// ENHANCED: Domain validation for tenant access
export const validateEmailDomainForTenant = async (email: string, tenantId: string): Promise<boolean> => {
  try {
    console.log(`🔍 DOMAIN VALIDATION: Checking email "${email}" against tenant "${tenantId}"`);
    
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_BASE}/api/tenants/${tenantId}/validate-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    console.log(`🔍 DOMAIN VALIDATION RESULT:`, result);
    
    if (!response.ok) {
      console.error(`❌ DOMAIN VALIDATION FAILED: HTTP ${response.status}`, result);
      return false;
    }
    
    console.log(`✅ DOMAIN VALIDATION SUCCESS: ${result.valid ? 'ALLOWED' : 'DENIED'}`);
    return result.valid;
  } catch (error) {
    console.error('❌ DOMAIN VALIDATION ERROR:', error);
    return false;
  }
};

// ENHANCED: Tenant access verification with domain checking
export const verifyTenantAccess = async (tenantId: string, userSub: string, userEmail?: string): Promise<{
  hasAccess: boolean;
  role?: 'admin' | 'user' | 'viewer';
  permissions?: string[];
  reason?: string;
}> => {
  try {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    // First check if user has direct tenant access
    const response = await fetch(`${API_BASE}/api/tenants/${tenantId}/users/${userSub}/access`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const accessInfo = await response.json();
      return {
        hasAccess: true,
        role: accessInfo.role as 'admin' | 'user' | 'viewer',
        permissions: accessInfo.permissions || []
      };
    }
    
    // If no direct access, check domain validation for new users
    if (userEmail) {
      const isDomainValid = await validateEmailDomainForTenant(userEmail, tenantId);
      if (!isDomainValid) {
        return { 
          hasAccess: false, 
          reason: 'Email domain not allowed for this tenant'
        };
      }
    }
    
    return { hasAccess: false, reason: 'No access found' };
  } catch (error) {
    console.error('Error verifying tenant access:', error);
    return { hasAccess: false, reason: 'Verification failed' };
  }
};

// ENHANCED: Complete user authentication with tenant validation
export const getUserWithTenant = async (): Promise<UserWithTenant | null> => {
  console.log('🔄 getUserWithTenant: Starting tenant authentication process');
  
  const basicUser = getBasicUserInfo();
  if (!basicUser) {
    console.log('❌ getUserWithTenant: No authenticated user found');
    return null;
  }
  
  console.log(`✅ getUserWithTenant: Found authenticated user - ${basicUser.email}`);
  
  const tenantId = getCurrentTenant();
  if (!tenantId) {
    console.log('❌ getUserWithTenant: No tenant specified in URL');
    // Redirect to tenant selection page
    window.location.href = '/select-tenant';
    return null;
  }
  
  console.log(`🔍 getUserWithTenant: Checking access to tenant "${tenantId}"`);
  
  // SECURITY: Verify user has access to this tenant with domain validation
  const accessCheck = await verifyTenantAccess(tenantId, basicUser.sub, basicUser.email);
  if (!accessCheck.hasAccess) {
    console.error(`❌ getUserWithTenant: User ${basicUser.email} does not have access to tenant: ${tenantId}`);
    console.error(`❌ getUserWithTenant: Access denied reason: ${accessCheck.reason}`);
    
    // Provide specific error page based on reason
    if (accessCheck.reason?.includes('domain')) {
      window.location.href = '/unauthorized?reason=domain';
    } else {
      window.location.href = '/unauthorized';
    }
    return null;
  }
  
  console.log(`✅ getUserWithTenant: Access granted with role: ${accessCheck.role}`);
  
  // Get tenant information
  const tenantInfo = await getTenantInfo(tenantId);
  if (!tenantInfo) {
    console.error('❌ getUserWithTenant: Tenant not found:', tenantId);
    window.location.href = '/tenant-not-found';
    return null;
  }
  
  console.log(`✅ getUserWithTenant: Tenant info retrieved for: ${tenantInfo.name}`);
  
  // SECURITY: Check subscription status
  if (tenantInfo.status === 'suspended') {
    console.error('❌ getUserWithTenant: Tenant is suspended');
    window.location.href = '/account-suspended';
    return null;
  }
  
  if (tenantInfo.status !== 'active' && tenantInfo.status !== 'trial') {
    console.error('❌ getUserWithTenant: Tenant status not active/trial:', tenantInfo.status);
    window.location.href = '/subscription-required';
    return null;
  }
  
  console.log(`🎉 getUserWithTenant: Complete! User ${basicUser.email} authenticated for tenant ${tenantInfo.name}`);
  
  return {
    ...basicUser,
    tenant: tenantInfo,
    role: accessCheck.role || 'viewer',
    tenantPermissions: accessCheck.permissions || []
  };
};

// ENHANCED: Auto-join tenant for new users with valid domains
export const autoJoinTenant = async (tenantId: string, userEmail: string, userSub: string): Promise<boolean> => {
  try {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    const response = await fetch(`${API_BASE}/api/tenants/${tenantId}/auto-join`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_sub: userSub,
        email: userEmail
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error auto-joining tenant:', error);
    return false;
  }
};

// Helper function to check if user has specific permission
export const hasPermission = (user: UserWithTenant, permission: string): boolean => {
  return user.tenantPermissions.includes(permission) || user.role === 'admin';
};

// Helper function to check if user is admin of current tenant
export const isAdmin = (user: UserWithTenant): boolean => {
  return user.role === 'admin';
};

// Set tenant for development/testing
export const setDevelopmentTenant = (tenantId: string) => {
  localStorage.setItem('currentTenant', tenantId);
  // For development, navigate to tenant URL
  window.location.href = `/tenant/${tenantId}/dashboard`;
};

// ENHANCED: Create tenant-aware API request helper with proper authentication
export const tenantApiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const tenantId = getCurrentTenant();
  if (!tenantId) {
    throw new Error('No tenant context available');
  }
  
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const url = endpoint.startsWith('/') ? `${API_BASE}${endpoint}` : `${API_BASE}/${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
      'X-Tenant-ID': tenantId, // Custom header for backend to identify tenant
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}; 