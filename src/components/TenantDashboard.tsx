import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { InsuranceCardService } from "@/components/dashboard/InsuranceCardService";
import { AutomationServices } from "@/components/dashboard/AutomationServices";
import { ReportsModal } from "@/components/dashboard/ReportsModal";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { UserWithTenant } from "@/utils/tenantAuth";
import { Shield, CheckCircle2, Sparkles } from "lucide-react";

export type DashboardView = 'home' | 'insurance' | 'automation' | 'services';

interface TenantDashboardProps {
  user: UserWithTenant;
}

const TenantDashboard = ({ user }: TenantDashboardProps) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
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
            {/* Clean Apple-inspired Welcome Banner */}
            <div className={`relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-slate-50/50 backdrop-blur-sm border border-blue-100/50 rounded-2xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {/* Floating background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-2xl"></div>
              
              <div className="relative p-12 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent mb-4">
                  Welcome back, {user.tenant.name}
                </h1>
                <p className="text-lg text-slate-600 max-w-md mx-auto">
                  Your comprehensive healthcare revenue cycle management platform
                </p>
              </div>
            </div>

            {/* Dashboard Content with staggered animation */}
            <div className={`transition-all duration-700 delay-300 ${
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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50/30 to-blue-50/20 font-sans">
      {/* Background texture */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-slate-100/20 pointer-events-none"></div>
      
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
            email: user.email,
            tenant: user.tenant,
            role: user.role
          }}
        />
        <main className="p-8 relative">
          {renderContent()}
        </main>
      </div>
      
      {/* ChatInterface available on ALL dashboard pages */}
      <ChatInterface />
    </div>
  );
};

export default TenantDashboard; 