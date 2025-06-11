import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsModal } from "@/components/dashboard/ReportsModal";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { UserWithTenant } from "@/utils/tenantAuth";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

interface TenantDashboardProps {
  user: UserWithTenant;
}

const TenantDashboard = ({ user }: TenantDashboardProps) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [showReports, setShowReports] = useState(false);

  console.log('🏢 Tenant Dashboard loaded for:', {
    user: user.email,
    tenant: user.tenant.name,
    tenantId: user.tenant.id,
    role: user.role,
    permissions: user.tenantPermissions
  });

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
        return (
          <div className="space-y-6">
            {/* Tenant Information Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-blue-900">
                    Welcome to {user.tenant.name}
                  </h2>
                  <p className="text-blue-700 mt-1">
                    Plan: <span className="font-medium capitalize">{user.tenant.plan}</span> • 
                    Role: <span className="font-medium capitalize">{user.role}</span>
                  </p>
                  {user.tenant.allowed_email_domains && user.tenant.allowed_email_domains.length > 0 && (
                    <p className="text-blue-600 text-sm mt-2">
                      Authorized domains: {user.tenant.allowed_email_domains.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-700 font-medium">ACTIVE</span>
                </div>
              </div>
            </div>
            
            {/* Security Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="text-green-500 text-2xl mr-3">🔒</div>
                <div>
                  <h3 className="font-medium text-green-900">
                    Tenant Isolation Active
                  </h3>
                  <p className="text-green-700 text-sm">
                    You are securely isolated within the {user.tenant.name} organization space.
                  </p>
                </div>
              </div>
            </div>

            {/* Regular Dashboard Content */}
            <DashboardContent user={user} onNavigate={handleNavigate} />
          </div>
        );
    }
  };

  if (showReports) {
    return <ReportsModal isOpen={true} onClose={() => setShowReports(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
      />
      <div className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <Header 
          user={{
            firstName: user.firstName || 'User',
            lastName: user.lastName || '',
            email: user.email
          }}
        />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
      
      {/* ChatInterface available on ALL dashboard pages */}
      <ChatInterface />
    </div>
  );
};

export default TenantDashboard; 