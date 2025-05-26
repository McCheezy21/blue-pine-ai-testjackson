
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { handleCognitoCallback, getUserInfo } from "@/utils/cognitoAuth";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [user, setUser] = useState({
    firstName: "Loading...",
    lastName: "",
    email: ""
  });

  useEffect(() => {
    // Handle Cognito callback if code is present in URL
    const initAuth = async () => {
      try {
        await handleCognitoCallback();
        const userInfo = getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error('Authentication error:', error);
        // Still set user info even if auth fails (for development)
        const userInfo = getUserInfo();
        setUser(userInfo);
      }
    };

    initAuth();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <DashboardContent user={user} />;
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
        return <DashboardContent user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
