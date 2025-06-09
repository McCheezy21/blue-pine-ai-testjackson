import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsModal } from "@/components/dashboard/ReportsModal";
import { getUserInfo, isAuthenticated, handleCognitoCallback } from "@/utils/cognitoAuth";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
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
            console.log('🔄 Redirecting to post-login URL:', postLoginRedirect);
            
            // Add a small delay to ensure the user state is set
            setTimeout(() => {
              console.log('🎯 Executing redirect to:', postLoginRedirect);
              window.location.href = postLoginRedirect;
            }, 100);
            return;
          } else {
            console.log('🏠 No post-login redirect found, staying on dashboard');
          }
        } else {
          console.error('❌ Failed to get user info despite authentication');
          navigate('/signin');
          return;
        }
      } catch (error) {
        console.error('❌ Authentication error:', error.message);
        navigate('/signin');
      } finally {
        console.log('🏁 Dashboard: Authentication process complete, setting loading to false');
        setIsLoading(false);
      }
    };

    processAuthentication();
  }, [navigate]);

  const handleNavigate = (view: string) => {
    if (view === 'services') {
      setShowReports(true);
    } else {
      setActiveView(view as DashboardView);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'insurance':
        return <InsuranceCardService />;
      case 'automation':
        return <AutomationServices />;
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting up your dashboard...</h2>
          <p className="text-gray-600">Please wait while we verify your authentication.</p>
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
    <div className="min-h-screen flex w-full bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      
      {/* Main content area with smooth transition */}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarExpanded ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header with user profile dropdown */}
        <Header user={user} />
        
        <main className="h-full">
          {renderContent()}
        </main>
      </div>

      <ReportsModal 
        isOpen={showReports}
        onClose={() => setShowReports(false)}
      />
    </div>
  );
};

export default Dashboard;
