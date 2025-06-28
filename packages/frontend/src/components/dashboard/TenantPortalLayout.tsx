import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { UserWithTenant } from "@/utils/tenantAuth";

interface TenantPortalLayoutProps {
  user: UserWithTenant;
  children: React.ReactNode;
}

const TenantPortalLayout = ({ user, children }: TenantPortalLayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Get user token from localStorage (this is where Cognito stores it)
  const getUserToken = () => {
    return localStorage.getItem('idToken') || localStorage.getItem('accessToken') || '';
  };

  return (
    <div className="min-h-screen bg-[#EAEFF2] font-['Inter',system-ui,sans-serif]">
      <Sidebar 
        activeView={undefined}
        setActiveView={() => {}}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <Header onSettingsClick={() => {}} />
        <main className="p-6">
          {children}
        </main>
      </div>
      <ChatInterface 
        tenantId={user.tenant.id}
        userToken={getUserToken()}
      />
    </div>
  );
};

export default TenantPortalLayout; 