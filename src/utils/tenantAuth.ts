// Multi-tenant authentication utilities (Path-Based + Shared DB)
import { getUserInfo as getBasicUserInfo } from './cognitoAuth';

export interface TenantInfo {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
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

// EASIEST APPROACH: Path-based tenant identification
// URLs: /tenant/acme-corp/dashboard, /tenant/acme-corp/settings, etc.
export const getCurrentTenant = (): string | null => {
  const pathParts = window.location.pathname.split('/');
  
  // Check for /tenant/{tenant-id} pattern
  if (pathParts[1] === 'tenant' && pathParts[2]) {
    return pathParts[2];
  }
  
  // Fallback for development/testing
  return localStorage.getItem('currentTenant');
};

// Get tenant information from your API
export const getTenantInfo = async (tenantId: string): Promise<TenantInfo | null> => {
  try {
    const response = await fetch(`/api/tenants/${tenantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
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

// Verify user has access to specific tenant (SECURITY CHECK)
export const verifyTenantAccess = async (tenantId: string, userSub: string): Promise<{
  hasAccess: boolean;
  role?: 'admin' | 'user' | 'viewer';
  permissions?: string[];
}> => {
  try {
    const response = await fetch(`/api/tenants/${tenantId}/users/${userSub}/access`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      return { hasAccess: false };
    }
    
    const accessInfo = await response.json();
    return {
      hasAccess: true,
      role: accessInfo.role as 'admin' | 'user' | 'viewer',
      permissions: accessInfo.permissions || []
    };
  } catch (error) {
    console.error('Error verifying tenant access:', error);
    return { hasAccess: false };
  }
};

// Enhanced user info with tenant context and security checks
export const getUserWithTenant = async (): Promise<UserWithTenant | null> => {
  const basicUser = getBasicUserInfo();
  if (!basicUser) {
    console.log('No authenticated user found');
    return null;
  }
  
  const tenantId = getCurrentTenant();
  if (!tenantId) {
    console.log('No tenant specified in URL');
    // Redirect to tenant selection page
    window.location.href = '/select-tenant';
    return null;
  }
  
  // SECURITY: Verify user has access to this tenant
  const accessCheck = await verifyTenantAccess(tenantId, basicUser.sub);
  if (!accessCheck.hasAccess) {
    console.error('User does not have access to tenant:', tenantId);
    window.location.href = '/unauthorized';
    return null;
  }
  
  // Get tenant information
  const tenantInfo = await getTenantInfo(tenantId);
  if (!tenantInfo) {
    console.error('Tenant not found:', tenantId);
    window.location.href = '/tenant-not-found';
    return null;
  }
  
  // SECURITY: Check subscription status
  if (tenantInfo.status === 'suspended') {
    window.location.href = '/account-suspended';
    return null;
  }
  
  if (tenantInfo.status !== 'active' && tenantInfo.status !== 'trial') {
    window.location.href = '/subscription-required';
    return null;
  }
  
  return {
    ...basicUser,
    tenant: tenantInfo,
    role: accessCheck.role || 'viewer',
    tenantPermissions: accessCheck.permissions || []
  };
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

// Create tenant-aware API request helper
export const tenantApiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const tenantId = getCurrentTenant();
  if (!tenantId) {
    throw new Error('No tenant context available');
  }
  
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'X-Tenant-ID': tenantId, // Custom header for backend to identify tenant
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
}; 