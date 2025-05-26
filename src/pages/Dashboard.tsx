
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
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com"
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
        return <div className="p-6">Other Services - Coming Soon</div>;
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
      <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
