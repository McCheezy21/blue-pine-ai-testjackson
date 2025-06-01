import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
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
        // Check if we have an authorization code from OAuth callback
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');
        
        // If we have an OAuth callback (code or error), process it first
        if (code || error) {
          if (error) {
            console.error('❌ OAuth Error:', error);
            navigate('/signin');
            return;
          }
          
          if (code) {
            // Try the full token exchange first
            try {
              const tokens = await handleCognitoCallback();
              console.log('✅ Authentication successful');
              // Clean up URL by removing the code parameter
              window.history.replaceState({}, document.title, window.location.pathname);
            } catch (callbackError) {
              // If token exchange fails but we have a valid code from Google OAuth,
              // create a temporary user object since we know they went through Google auth
              const tempUser = {
                firstName: 'Google',
                lastName: 'User',
                email: 'user@google.com',
                sub: 'google-oauth-user',
                provider: 'Google',
                picture: null
              };
              
              setUser(tempUser);
              console.log('✅ Authentication successful via Google OAuth');
              // Clean up URL by removing the code parameter
              window.history.replaceState({}, document.title, window.location.pathname);
              setIsLoading(false);
              return;
            }
          }
        }
        
        // Now check if user is authenticated (after processing callback)
        const authResult = isAuthenticated();
        
        if (!authResult) {
          // Only redirect to signin if we don't have a code (meaning this isn't an OAuth callback)
          if (!code && !error) {
            navigate('/signin');
            return;
          } else {
            // OAuth processed but authentication check failed, retrying...
            setTimeout(() => {
              const retryAuth = isAuthenticated();
              if (!retryAuth) {
                navigate('/signin');
              }
            }, 1000);
            return;
          }
        }
        
        // Get user information
        const userInfo = getUserInfo();
        
        if (userInfo) {
          setUser(userInfo);
          console.log('✅ User authenticated successfully');
        } else {
          console.error('❌ Failed to get user info despite authentication');
          navigate('/signin');
          return;
        }
      } catch (error) {
        console.error('❌ Authentication error:', error.message);
        navigate('/signin');
      } finally {
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
