import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavigation } from "@/components/dashboard/TopNavigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsAnalytics } from "@/components/dashboard/ReportsAnalytics";
import { getUserInfo, isAuthenticated, handleCognitoCallback } from "@/utils/cognitoAuth";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [showReports, setShowReports] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processAuthentication = async () => {
      try {
        console.log('🔄 Dashboard: Starting authentication process...');
        
        // Check if we have an authorization code from OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');
        
        console.log('🔍 Dashboard: OAuth params:', { code: code ? 'Present' : 'None', error, state });
        
        // If we have an OAuth callback (code or error), process it first
        if (code || error) {
          console.log('📥 Dashboard: Processing OAuth callback...');
          
          if (error) {
            console.error('❌ OAuth Error:', error);
            navigate('/signin');
            return;
          }
          
          if (code) {
            console.log('🔐 Dashboard: Exchanging authorization code for tokens...');
            // Try the real token exchange
            try {
              const tokens = await handleCognitoCallback();
              console.log('✅ Dashboard: Token exchange successful');
              // Clean up URL by removing the code parameter
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (callbackError) {
              console.error('❌ Dashboard: Token exchange failed:', callbackError);
              navigate('/signin');
              return;
            }
          }
        }
        
        console.log('🔍 Dashboard: Checking if user is authenticated...');
        
        // Now check if user is authenticated (after processing callback)
        const authResult = isAuthenticated();
        console.log('🔍 Dashboard: Authentication result:', authResult);
        
        if (!authResult) {
          console.log('❌ Dashboard: User not authenticated');
          // Only redirect to signin if we don't have a code (meaning this isn't an OAuth callback)
          if (!code && !error) {
            console.log('🔄 Dashboard: Redirecting to signin (no OAuth callback)');
            navigate('/signin');
            return;
          } else {
            // OAuth processed but authentication check failed, retrying...
            console.log('⏳ Dashboard: OAuth processed but auth check failed, retrying...');
            setTimeout(() => {
              const retryAuth = isAuthenticated();
              console.log('🔄 Dashboard: Retry auth result:', retryAuth);
              if (!retryAuth) {
                console.log('❌ Dashboard: Retry failed, redirecting to signin');
                navigate('/signin');
              }
            }, 1000);
            return;
          }
        }
        
        console.log('✅ Dashboard: User is authenticated, getting user info...');
        
        // Get user information
        const userInfo = getUserInfo();
        
        if (userInfo) {
          setUser(userInfo);
          console.log('✅ User authenticated successfully');
          console.log('👤 User info:', { email: userInfo.email, firstName: userInfo.firstName });
          console.log('📧 User email domain:', userInfo.email?.split('@')[1]);
          
          // Check for post-login redirect (for tenant access)
          const postLoginRedirect = localStorage.getItem('postLoginRedirect');
          console.log('🔍 Checking for post-login redirect:', postLoginRedirect);
          
          if (postLoginRedirect) {
            localStorage.removeItem('postLoginRedirect');
            console.log('🔀 Redirecting to post-login URL:', postLoginRedirect);
            window.location.href = postLoginRedirect;
            return;
          }
          
          // 🎯 NEW: Auto-redirect to appropriate tenant dashboard
          console.log('🎯 Checking for accessible tenants to auto-redirect...');
          await checkAccessibleTenantsAndRedirect();
        } else {
          console.error('❌ Failed to get user info despite authentication');
          navigate('/signin');
          return;
        }
      } catch (error) {
        console.error('❌ Authentication error:', error.message);
        navigate('/signin');
      }
    };

    // 🎯 NEW: Check accessible tenants and auto-redirect
    const checkAccessibleTenantsAndRedirect = async () => {
      try {
        console.log('🔍 Fetching accessible tenants...');
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/user/accessible-tenants`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('idToken')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Accessible tenants response:', data);
          
          const tenants = data.accessible_tenants || [];
          
          if (tenants.length === 1) {
            // User has access to exactly one tenant - redirect directly
            const tenant = tenants[0];
            const tenantWelcomeUrl = `/tenant/${tenant.id}/welcome`;
            console.log(`🎯 Auto-redirecting to single accessible tenant: ${tenant.name} (${tenant.id})`);
            console.log(`🔗 Redirecting to: ${tenantWelcomeUrl}`);
            window.location.href = tenantWelcomeUrl;
            return;
          } else if (tenants.length > 1) {
            // User has access to multiple tenants - redirect to tenant selector
            console.log(`🎯 User has access to ${tenants.length} tenants, redirecting to tenant selector`);
            window.location.href = '/select-tenant';
            return;
          } else {
            // User has no tenant access - redirect to request access page
            console.log('🚫 User has no tenant access, redirecting to request access page');
            window.location.href = '/request-access';
            return;
          }
        } else {
          // SECURITY FIX: Fail secure when API is unavailable, with tenant fallback for paying customers
          console.error('🚨 SECURITY: API failed to fetch accessible tenants (status:', response.status, '), checking for tenant fallback');
          
          // Try to get more specific error information
          try {
            const errorData = await response.json();
            console.error('🚨 API Error Details:', errorData);
            
            if (errorData.code === 'DATABASE_UNAVAILABLE') {
              console.error('🚨 SECURITY: Database unavailable - checking tenant fallback mapping');
              
              // FALLBACK TENANT MAPPING when database is unavailable
              const userInfo = getUserInfo();
              const userEmail = userInfo?.email;
              const emailDomain = userEmail?.split('@')[1];
              
              console.log(`🔍 FALLBACK: Checking domain "${emailDomain}" for tenant mapping`);
              
              // Critical tenant mappings for when database is down
              const fallbackTenantMapping: Record<string, string> = {
                'bluepineai.com': 'bluepineai-test-tenant',
                'pacs.com': 'PACs-test-tentant',
                // Add more critical customer domains here as needed
              };
              
              const fallbackTenantId = fallbackTenantMapping[emailDomain || ''];
              
              if (fallbackTenantId) {
                console.log(`🔓 FALLBACK SUCCESS: Redirecting ${emailDomain} to tenant ${fallbackTenantId}`);
                window.location.href = `/tenant/${fallbackTenantId}/welcome`;
                return;
              } else {
                console.error(`🚨 SECURITY: Unknown domain "${emailDomain}" with database unavailable - failing secure`);
              }
            }
          } catch (parseError) {
            console.error('🚨 Could not parse error response:', parseError);
          }
          
          // For unknown domains or other errors, redirect to request access
          console.log('🔒 SECURITY: Redirecting to request access page');
          window.location.href = '/request-access';
          return;
        }
      } catch (error) {
        // SECURITY FIX: Fail secure when database/API is not accessible, with tenant fallback for paying customers
        console.error('🚨 SECURITY: Error checking accessible tenants (likely database unavailable):', error);
        
        // Use same fallback tenant mapping for network errors
        const userInfo = getUserInfo();
        const userEmail = userInfo?.email;
        const emailDomain = userEmail?.split('@')[1];
        
        console.log(`🔍 FALLBACK (Network Error): Checking domain "${emailDomain}" for tenant mapping`);
        
        // Critical tenant mappings for when database is down (same as above)
        const fallbackTenantMapping: Record<string, string> = {
          'bluepineai.com': 'bluepineai-test-tenant',
          'pacs.com': 'PACs-test-tentant',
          // Add more critical customer domains here as needed
        };
        
        const fallbackTenantId = fallbackTenantMapping[emailDomain || ''];
        
        if (fallbackTenantId) {
          console.log(`🔓 FALLBACK SUCCESS (Network Error): Redirecting ${emailDomain} to tenant ${fallbackTenantId}`);
          window.location.href = `/tenant/${fallbackTenantId}/welcome`;
          return;
        }
        
        console.log('🔒 SECURITY: Failing secure - redirecting to request access page');
        window.location.href = '/request-access';
        return;
      }
    };

    processAuthentication();
  }, [navigate]);

  const handleNavigate = (view: string) => {
    setActiveView(view as DashboardView);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'insurance':
        return <InsuranceCardService />;
      case 'automation':
        return <AutomationServices />;
      case 'services':
        return <ReportsAnalytics />;
      case 'home':
      default:
        return <DashboardContent user={user} onNavigate={handleNavigate} />;
    }
  };

  // Show loading screen while processing authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your account...</h2>
          <p className="text-gray-600">Please wait while we get everything ready for you.</p>
        </div>
      </div>
    );
  }

  // Show error state if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">Unable to verify your authentication. Please try signing in again.</p>
          <button 
            onClick={() => navigate('/signin')}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEFF2] font-['Inter',system-ui,sans-serif]">
      <TopNavigation 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="p-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
