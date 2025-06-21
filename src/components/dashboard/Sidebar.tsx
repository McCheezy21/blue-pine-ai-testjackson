import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Image, Settings, Activity, ChevronRight, LogOut } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { getUserInfo } from "@/utils/cognitoAuth";
import BluePineLogo from "@/components/ui/BluePineLogo";

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Sidebar = ({ activeView, setActiveView, expanded, setExpanded }: SidebarProps) => {
  const user = getUserInfo();
  const navigate = useNavigate();
  
  const menuItems = [
    { 
      id: 'home' as DashboardView, 
      icon: Home, 
      label: 'Dashboard', 
      description: 'Overview & Metrics'
    },
    { 
      id: 'insurance' as DashboardView, 
      icon: Image, 
      label: 'Insurance Cards', 
      description: 'Upload & Process Cards'
    },
    { 
      id: 'automation' as DashboardView, 
      icon: Activity, 
      label: 'Automation Services', 
      description: 'AI-Powered Workflows'
    },
    { 
      id: 'services' as DashboardView, 
      icon: Settings, 
      label: 'Reports & Analytics', 
      description: 'Insights & Performance'
    },
  ];

  const handleLogout = () => {
    navigate('/signout');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-[#CCCCCC] font-['Inter',system-ui,sans-serif] z-50 transition-all duration-200 ease-out ${
        expanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#CCCCCC]">
        <div className="flex items-center space-x-3 overflow-hidden">
          <BluePineLogo size="lg" />
          <div className={`transition-all duration-200 ease-out ${
            expanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
          }`}>
            <h2 className="text-xl font-semibold text-[#333333] whitespace-nowrap">
              Blue Pine AI
            </h2>
            <p className="text-sm text-[#333333]/60 whitespace-nowrap">Healthcare Platform</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-3 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 mb-2 text-left rounded-lg transition-all duration-200 group overflow-hidden ${
              activeView === item.id 
                ? 'bg-[#004466] text-white' 
                : 'text-[#333333] hover:bg-[#EAEFF2]'
            }`}
          >
            {/* Active indicator */}
            {activeView === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#004466] rounded-r" />
            )}
            
            <div className={`w-5 h-5 flex items-center justify-center transition-colors duration-200 ${
              activeView === item.id ? 'text-white' : 'text-[#333333]/70'
            }`}>
              <item.icon className="h-5 w-5" />
            </div>
            
            <div className={`flex-1 min-w-0 transition-all duration-200 ease-out ${
              expanded 
                ? 'opacity-100 w-auto' 
                : 'opacity-0 w-0'
            }`}>
              <div className={`font-medium whitespace-nowrap ${
                activeView === item.id ? 'text-white' : 'text-[#333333]'
              }`}>
                {item.label}
              </div>
              <div className={`text-xs whitespace-nowrap transition-colors duration-200 ${
                activeView === item.id ? 'text-white/80' : 'text-[#333333]/60'
              }`}>
                {item.description}
              </div>
            </div>

          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className={`absolute bottom-6 left-3 right-3 transition-all duration-200 ease-out ${
        expanded ? 'opacity-100' : 'opacity-0'
      }`}>
        {user && (
          <div className="p-4 bg-[#EAEFF2] border border-[#CCCCCC] rounded-lg overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#004466] rounded-full flex items-center justify-center text-white font-medium text-sm">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className={`flex-1 min-w-0 transition-all duration-200 ease-out ${
                expanded 
                  ? 'opacity-100 w-auto' 
                  : 'opacity-0 w-0'
              }`}>
                <div className="font-medium text-[#333333] whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-[#333333]/60 truncate">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 text-[#333333]/60 hover:text-[#D9534F] hover:bg-white rounded-lg transition-all duration-200 ${
                  expanded 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }`}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
