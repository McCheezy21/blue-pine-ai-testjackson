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
        
        if (code) {
          console.log('🔄 Processing OAuth callback with code:', code.substring(0, 10) + '...');
          try {
            await handleCognitoCallback();
            console.log('✅ OAuth callback processed successfully');
            // Clean up URL by removing the code parameter
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (callbackError) {
            console.error('❌ OAuth callback processing failed:', callbackError);
            // If callback fails, redirect to signin
            navigate('/signin');
            return;
          }
        }
        
        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('❌ User not authenticated, redirecting to signin...');
          navigate('/signin');
          return;
        }
        
        // Get user information
        const userInfo = getUserInfo();
        if (userInfo) {
          setUser(userInfo);
          console.log('✅ User authenticated:', userInfo);
        } else {
          console.log('❌ Failed to get user info, redirecting to signin...');
          navigate('/signin');
          return;
        }
      } catch (error) {
        console.error('❌ Authentication error:', error);
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
