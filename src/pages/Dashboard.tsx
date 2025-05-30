
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsModal } from "@/components/dashboard/ReportsModal";
import { getUserInfo, isAuthenticated } from "@/utils/cognitoAuth";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const navigate = useNavigate();

  // Temporarily disable auth check
  /*
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signin');
    }
  }, [navigate]);
  */

  // Mock user data for testing when auth is disabled
  const user = getUserInfo() || {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    sub: 'test-user-id'
  };

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
