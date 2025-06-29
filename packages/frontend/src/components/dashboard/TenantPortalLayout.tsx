import { TopNavigation } from "@/components/dashboard/TopNavigation";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { UserWithTenant } from "@/utils/tenantAuth";

interface TenantPortalLayoutProps {
  user: UserWithTenant;
  children: React.ReactNode;
}

const TenantPortalLayout = ({ user, children }: TenantPortalLayoutProps) => {
  // Get user token from localStorage (this is where Cognito stores it)
  const getUserToken = () => {
    return localStorage.getItem('idToken') || localStorage.getItem('accessToken') || '';
  };

  return (
    <div className="min-h-screen bg-[#EAEFF2] font-['Inter',system-ui,sans-serif]">
      <TopNavigation 
        activeView={undefined}
        setActiveView={() => {}}
      />
      <main className="p-6">
        {children}
      </main>
      <ChatInterface 
        tenantId={user.tenant.id}
        userToken={getUserToken()}
      />
    </div>
  );
};

export default TenantPortalLayout; 