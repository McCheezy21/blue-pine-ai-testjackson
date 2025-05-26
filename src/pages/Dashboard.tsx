
import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Mock user data - replace with actual auth data later
  const user = {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@example.com"
  };

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
          <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
            <p className="text-gray-600">Coming Soon - Advanced reporting and analytics dashboard</p>
          </div>
        );
      default:
        return <DashboardContent user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
