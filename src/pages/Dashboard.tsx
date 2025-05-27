
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsModal } from "@/components/dashboard/ReportsModal";
// import { handleCognitoCallback, getUserInfo, isAuthenticated } from "@/utils/cognitoAuth";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  // Temporary mock user data for testing
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com"
  });
  const [isLoading, setIsLoading] = useState(false); // Set to false to skip loading
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Commented out authentication logic for testing
  /*
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        setAuthError(null);

        // Check if there's an authorization code in the URL (Cognito redirect)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          // Handle Cognito errors (user cancelled, etc.)
          console.error('Cognito authentication error:', error);
          setAuthError('Authentication failed. Please try again.');
          // Redirect to sign in after a delay
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        if (code) {
          // Handle the callback from Cognito
          console.log('Processing Cognito callback...');
          await handleCognitoCallback();
          
          // Clean up the URL by removing the code parameter
          window.history.replaceState({}, document.title, '/dashboard');
        }

        // Check if user is authenticated
        if (!isAuthenticated()) {
          console.log('User not authenticated, redirecting to sign in...');
          navigate('/signin');
          return;
        }

        // Get user information
        const userInfo = getUserInfo();
        if (!userInfo) {
          throw new Error('Failed to get user information from token');
        }
        setUser(userInfo);
        console.log('Dashboard loaded successfully for user:', userInfo.firstName);

      } catch (error) {
        console.error('Authentication error:', error);
        setAuthError('Failed to authenticate. Please try signing in again.');
        // Redirect to sign in page after error
        setTimeout(() => navigate('/signin'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate]);
  */

  // Show loading screen while processing authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Signing you in...</h2>
          <p className="text-gray-600">Please wait while we set up your dashboard.</p>
        </div>
      </div>
    );
  }

  // Show error screen if authentication failed
  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{authError}</p>
            <button 
              onClick={() => navigate('/signin')}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleNavigation = (view: DashboardView) => {
    if (view === 'services') {
      setShowReportsModal(true);
    } else {
      setActiveView(view);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <DashboardContent user={user} onNavigate={handleNavigation} />;
      case 'insurance':
        return <InsuranceCardService />;
      case 'automation':
        return <AutomationServices />;
      case 'services':
        return (
          <div className="p-8 bg-gray-50 min-h-screen font-sans">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
            <p className="text-gray-600">Coming Soon - Advanced reporting and analytics dashboard</p>
          </div>
        );
      default:
        return <DashboardContent user={user} onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar 
        activeView={activeView}
        setActiveView={handleNavigation}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
        {/* Global Chat Interface - shows floating icon on all pages except home */}
        {activeView !== 'home' && <ChatInterface />}
      </main>
      
      <ReportsModal 
        isOpen={showReportsModal} 
        onClose={() => setShowReportsModal(false)} 
      />
    </div>
  );
};

export default Dashboard;
