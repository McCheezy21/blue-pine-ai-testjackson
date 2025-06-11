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
            {/* Apple-inspired Welcome Banner */}
            <div className={`relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-slate-50/50 backdrop-blur-sm border border-blue-100/50 rounded-2xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {/* Floating background elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-blue-300/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-slate-400/10 to-slate-200/10 rounded-full blur-2xl"></div>
              
              <div className="relative p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
                        Welcome back, {user.tenant.name}
                      </h2>
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-slate-600">
                          Plan: <span className="font-medium text-blue-600 capitalize">{user.tenant.plan}</span>
                        </p>
                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                        <p className="text-slate-600">
                          Role: <span className="font-medium text-blue-600 capitalize">{user.role}</span>
                        </p>
                      </div>
                      {user.tenant.allowed_email_domains && user.tenant.allowed_email_domains.length > 0 && (
                        <p className="text-slate-500 text-sm mt-2">
                          Authorized domains: <span className="font-medium">{user.tenant.allowed_email_domains.join(', ')}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full border border-green-200/50">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-medium text-sm">ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Apple-inspired Security Status */}
            <div className={`relative overflow-hidden bg-gradient-to-br from-green-50/50 via-white to-emerald-50/30 backdrop-blur-sm border border-green-100/50 rounded-2xl transition-all duration-700 delay-150 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-green-500/10 to-emerald-300/10 rounded-full blur-xl"></div>
              
              <div className="relative p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-green-900">Tenant Isolation Active</h3>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-green-700/80 text-sm">
                      You are securely isolated within the <span className="font-medium">{user.tenant.name}</span> organization space.
                    </p>
                  </div>
                </div>
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