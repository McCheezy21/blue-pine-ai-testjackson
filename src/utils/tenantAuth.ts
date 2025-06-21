// Multi-tenant authentication utilities (Path-Based + Shared DB)
import { getUserInfo as getBasicUserInfo, isAuthenticated as isCognitoAuthenticated } from './cognitoAuth';
import { getPointClickCareUserInfo, isPointClickCareAuthenticated } from './pointClickCareAuth';

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
      if (response.status === 503) {
        // Database unavailable - return fallback tenant info
        console.log('🔄 FALLBACK: API unavailable, returning fallback tenant info');
        return getFallbackTenantInfo(tenantId);
      }
      throw new Error('Failed to fetch tenant info');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tenant info:', error);
    
    // FALLBACK: For network errors, also return fallback tenant info
    console.log('🔄 FALLBACK: Network error, returning fallback tenant info');
    return getFallbackTenantInfo(tenantId);
  }
};

// FALLBACK: Get basic tenant info when database is unavailable
const getFallbackTenantInfo = (tenantId: string): TenantInfo | null => {
  // Basic tenant configurations for when database is down
  const fallbackTenants: Record<string, TenantInfo> = {
    'bluepineai-test-tenant': {
      id: 'bluepineai-test-tenant',
      name: 'Blue Pine AI (Test)',
      plan: 'enterprise',
      status: 'active',
      allowed_email_domains: ['bluepineai.com', 'gmail.com'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    'PACs-test-tentant': {
      id: 'PACs-test-tentant',
      name: 'PACs Testing Organization',
      plan: 'pro',
      status: 'active', 
      allowed_email_domains: ['pacs.com'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    'blue-pine-test': {
      id: 'blue-pine-test',
      name: 'Blue Pine AI',
      plan: 'enterprise',
      status: 'active',
      allowed_email_domains: ['bluepineai.com'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    'pcc-demo-skilled-nursing-facility': {
      id: 'pcc-demo-skilled-nursing-facility',
      name: 'Demo Skilled Nursing Facility',
      plan: 'pro',
      status: 'active',
      allowed_email_domains: [], // PointClickCare users don't use email domain validation
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  };
  
  const fallbackTenant = fallbackTenants[tenantId];
  if (!fallbackTenant) {
    console.log(`🚫 FALLBACK: No fallback tenant info for ${tenantId}`);
    return null;
  }
  
  console.log(`✅ FALLBACK: Returning fallback tenant info for ${fallbackTenant.name}`);
  return fallbackTenant;
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
    
    if (response.ok) {
      const result = await response.json();
      console.log(`🔍 DOMAIN VALIDATION RESULT:`, result);
      console.log(`✅ DOMAIN VALIDATION SUCCESS: ${result.valid ? 'ALLOWED' : 'DENIED'}`);
      return result.valid;
    }
    
    // FALLBACK: If API is unavailable (500/503), use hardcoded validation
    if (response.status === 500 || response.status === 503) {
      console.log('🔄 DOMAIN VALIDATION FALLBACK: API unavailable, using hardcoded validation');
      return validateEmailDomainFallback(email, tenantId);
    }
    
    const result = await response.json();
    console.error(`❌ DOMAIN VALIDATION FAILED: HTTP ${response.status}`, result);
    return false;
  } catch (error) {
    console.error('❌ DOMAIN VALIDATION ERROR:', error);
    
    // FALLBACK: For network errors, use hardcoded validation
    console.log('🔄 DOMAIN VALIDATION FALLBACK: Network error, using hardcoded validation');
    return validateEmailDomainFallback(email, tenantId);
  }
};

// FALLBACK: Domain validation when database is unavailable
const validateEmailDomainFallback = (email: string, tenantId: string): boolean => {
  const emailDomain = email.split('@')[1];
  
  // Same tenant configurations as in checkFallbackTenantAccess
  const fallbackTenantAccess: Record<string, { allowedDomains: string[], defaultRole: 'admin' | 'user' | 'viewer' }> = {
    'bluepineai-test-tenant': {
      allowedDomains: ['bluepineai.com', 'gmail.com'],
      defaultRole: 'admin'
    },
    'PACs-test-tentant': {
      allowedDomains: ['pacs.com'],
      defaultRole: 'user'
    },
    'blue-pine-test': {
      allowedDomains: ['bluepineai.com'],
      defaultRole: 'admin'
    },
    'pcc-demo-skilled-nursing-facility': {
      allowedDomains: [], // PointClickCare users don't use email domain validation
      defaultRole: 'user'
    }
  };
  
  const tenantConfig = fallbackTenantAccess[tenantId];
  if (!tenantConfig) {
    console.log(`🚫 DOMAIN VALIDATION FALLBACK: No configuration for tenant ${tenantId}`);
    return false;
  }
  
  const isAllowed = tenantConfig.allowedDomains.includes(emailDomain);
  console.log(`${isAllowed ? '✅' : '🚫'} DOMAIN VALIDATION FALLBACK: ${emailDomain} ${isAllowed ? 'ALLOWED' : 'DENIED'} for tenant ${tenantId}`);
  return isAllowed;
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
    
    // FALLBACK: Check if this is a database unavailability issue (500 or 503)
    if (response.status === 503 || response.status === 500) {
      console.log('🔄 FALLBACK: API unavailable (status:', response.status, '), checking fallback tenant access');
      return checkFallbackTenantAccess(tenantId, userEmail);
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
    
    // FALLBACK: For network errors, also check fallback access
    console.log('🔄 FALLBACK: Network error, checking fallback tenant access');
    return checkFallbackTenantAccess(tenantId, userEmail);
  }
};

// FALLBACK: Check tenant access when database is unavailable
const checkFallbackTenantAccess = (tenantId: string, userEmail?: string): {
  hasAccess: boolean;
  role?: 'admin' | 'user' | 'viewer';
  permissions?: string[];
  reason?: string;
} => {
  if (!userEmail) {
    return { hasAccess: false, reason: 'No email provided for fallback check' };
  }
  
  const emailDomain = userEmail.split('@')[1];
  
  // Critical tenant-domain mappings for when database is down
  const fallbackTenantAccess: Record<string, { allowedDomains: string[], defaultRole: 'admin' | 'user' | 'viewer' }> = {
    'bluepineai-test-tenant': {
      allowedDomains: ['bluepineai.com', 'gmail.com'],
      defaultRole: 'admin'
    },
    'PACs-test-tentant': {
      allowedDomains: ['pacs.com'],
      defaultRole: 'user'
    },
    'blue-pine-test': {
      allowedDomains: ['bluepineai.com'],
      defaultRole: 'admin'
    },
    'pcc-demo-skilled-nursing-facility': {
      allowedDomains: [], // PointClickCare users don't use email domain validation
      defaultRole: 'user'
    }
  };
  
  const tenantConfig = fallbackTenantAccess[tenantId];
  if (!tenantConfig) {
    console.log(`🚫 FALLBACK: No fallback configuration for tenant ${tenantId}`);
    return { hasAccess: false, reason: 'Tenant not in fallback configuration' };
  }
  
  if (!tenantConfig.allowedDomains.includes(emailDomain)) {
    console.log(`🚫 FALLBACK: Domain ${emailDomain} not allowed for tenant ${tenantId}`);
    return { hasAccess: false, reason: 'Email domain not allowed for this tenant (fallback)' };
  }
  
  console.log(`✅ FALLBACK: Granting ${tenantConfig.defaultRole} access to ${userEmail} for tenant ${tenantId}`);
  return {
    hasAccess: true,
    role: tenantConfig.defaultRole,
    permissions: tenantConfig.defaultRole === 'admin' ? ['all'] : ['read']
  };
};

// ENHANCED: Complete user authentication with tenant validation (supports Cognito and PointClickCare)
export const getUserWithTenant = async (): Promise<UserWithTenant | null> => {
  console.log('🔄 getUserWithTenant: Starting tenant authentication process');
  
  // Check for PointClickCare authentication first
  let basicUser = null;
  let authProvider = 'unknown';
  
  if (isPointClickCareAuthenticated()) {
    console.log('🏥 getUserWithTenant: PointClickCare authentication detected');
    basicUser = getPointClickCareUserInfo();
    authProvider = 'pointclickcare';
    
    // For PointClickCare users, check if we have tenant mapping
    const tenantMappingString = localStorage.getItem('pcc_tenant_mapping');
    if (tenantMappingString) {
      try {
        const tenantMapping = JSON.parse(tenantMappingString);
        console.log(`🏥 getUserWithTenant: Using PCC tenant mapping for ${tenantMapping.facilityName}`);
        
        // Override getCurrentTenant() for PointClickCare users
        const tenantId = tenantMapping.tenantId;
        
        // Build complete user object with tenant info
        const tenantInfo = await getTenantInfo(tenantId);
        if (!tenantInfo) {
          console.error('❌ getUserWithTenant: PCC mapped tenant not found:', tenantId);
          window.location.href = '/tenant-not-found';
          return null;
        }
        
        return {
          ...basicUser,
          tenant: tenantInfo,
          role: tenantMapping.accessLevel === 'full' ? 'admin' : 'user',
          tenantPermissions: tenantMapping.accessLevel === 'full' ? ['all'] : ['read'],
          provider: 'pointclickcare'
        };
      } catch (error) {
        console.warn('Error parsing PCC tenant mapping:', error);
      }
    }
  } else if (isCognitoAuthenticated()) {
    console.log('🔐 getUserWithTenant: Cognito authentication detected');
    basicUser = getBasicUserInfo();
    authProvider = 'cognito';
  }
  
  if (!basicUser) {
    console.log('❌ getUserWithTenant: No authenticated user found');
    return null;
  }
  
  console.log(`✅ getUserWithTenant: Found authenticated user - ${basicUser.email} (${authProvider})`);
  
  const tenantId = getCurrentTenant();
  if (!tenantId) {
    console.log('❌ getUserWithTenant: No tenant specified in URL');
    // Redirect to tenant selection page
    window.location.href = '/select-tenant';
    return null;
  }
  
  console.log(`🔍 getUserWithTenant: Checking access to tenant "${tenantId}"`);
  
  // SECURITY: Verify user has access to this tenant
  let accessCheck;
  
  if (authProvider === 'pointclickcare') {
    // For PointClickCare users, use facility-based access
    accessCheck = {
      hasAccess: true,
      role: 'user' as const,
      permissions: ['read', 'write']
    };
  } else {
    // For Cognito users, use domain-based access
    accessCheck = await verifyTenantAccess(tenantId, basicUser.sub, basicUser.email);
  }
  
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
  
  console.log(`🎉 getUserWithTenant: Complete! User ${basicUser.email} authenticated for tenant ${tenantInfo.name} via ${authProvider}`);
  
  return {
    ...basicUser,
    tenant: tenantInfo,
    role: accessCheck.role || 'viewer',
    tenantPermissions: accessCheck.permissions || [],
    provider: authProvider
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