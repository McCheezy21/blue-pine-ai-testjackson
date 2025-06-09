import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserWithTenant, UserWithTenant } from '@/utils/tenantAuth';
import { isAuthenticated } from '@/utils/cognitoAuth';

interface TenantProtectedRouteProps {
  children: (user: UserWithTenant) => React.ReactNode;
}

const TenantProtectedRoute = ({ children }: TenantProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserWithTenant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { tenantId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTenantAccess = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check basic authentication
        const isAuth = isAuthenticated();
        if (!isAuth) {
          console.log('❌ User not authenticated, redirecting to signin with tenant context');
          // Preserve the current tenant URL for post-login redirect
          const currentUrl = window.location.pathname + window.location.search;
          console.log('💾 Saving redirect URL:', currentUrl);
          localStorage.setItem('postLoginRedirect', currentUrl);
          navigate('/signin');
          return;
        }
        
        console.log('✅ User is authenticated, checking tenant access...');
        
        // This function handles all security checks:
        // - Tenant existence
        // - Domain validation
        // - Auto-join if domain is allowed
        const authenticatedUser = await getUserWithTenant();
        
        if (!authenticatedUser) {
          // getUserWithTenant handles its own redirects for access failures
          // If we get here without a redirect, something went wrong
          console.error('❌ getUserWithTenant returned null without redirect');
          setError('Authentication failed');
          return;
        }
        
        setUser(authenticatedUser);
        console.log(`✅ Tenant access granted for ${authenticatedUser.email} to ${tenantId}`);
      } catch (error) {
        console.error('❌ Tenant access check failed:', error);
        setError('Failed to verify tenant access');
        navigate('/unauthorized');
      } finally {
        setIsLoading(false);
      }
    };

    if (tenantId) {
      checkTenantAccess();
    } else {
      setError('No tenant specified');
      navigate('/select-tenant');
    }
  }, [tenantId, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Access...</h2>
          <p className="text-gray-600">Checking your permissions for this organization.</p>
          {tenantId && (
            <p className="text-sm text-gray-500 mt-2">Tenant: {tenantId}</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // This shouldn't happen as redirects are handled above
  }

  return <>{children(user)}</>;
};

export default TenantProtectedRoute; 