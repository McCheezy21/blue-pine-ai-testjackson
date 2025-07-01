import { useState, useEffect } from "react";
import { TopNavigation } from "@/components/dashboard/TopNavigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsModal } from "@/components/dashboard/ReportsModal";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { UserWithTenant } from "@/utils/tenantAuth";
import { Shield, CheckCircle2, Activity } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { ReportsAnalytics } from "@/components/dashboard/ReportsAnalytics";
import { getUserInfo } from "@/utils/cognitoAuth";

interface TenantDashboardProps {
  user: UserWithTenant;
}

const TenantDashboard = ({ user }: TenantDashboardProps) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [showReports, setShowReports] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  console.log('🏢 Tenant Dashboard loaded for:', {
    user: user.email,
    tenant: user.tenant.name,
    tenantId: user.tenant.id,
    role: user.role,
    permissions: user.tenantPermissions
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleNavigate = (view: string) => {
    if (view === 'services') {
      setShowReports(true);
    } else {
      setActiveView(view as DashboardView);
    }
  };

  // Get user token from localStorage (this is where Cognito stores it)
  const getUserToken = () => {
    return localStorage.getItem('idToken') || localStorage.getItem('accessToken') || '';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'insurance':
        return <InsuranceCardService />;
      case 'automation':
        return <AutomationServices />;
      case 'services':
        return <ReportsAnalytics />;
      case 'home':
      default:
        return (
          <div className="space-y-6">
            {/* Dashboard Content */}
            <div className={`transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <DashboardContent user={user} onNavigate={handleNavigate} />
            </div>
          </div>
        );
    }
  };

  if (showReports) {
    return <ReportsModal isOpen={true} onClose={() => setShowReports(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#EAEFF2] font-['Inter',system-ui,sans-serif]">
      <TopNavigation 
        activeView={activeView}
        setActiveView={setActiveView}
      />
      <main className="p-6">
        {renderContent()}
      </main>
      
      {/* ChatInterface available on ALL dashboard pages with authentication */}
      <ChatInterface 
        tenantId={user.tenant.id}
        userToken={getUserToken()}
      />
    </div>
  );
};

export default TenantDashboard; 