
import { useState } from "react";
import { Home, Image, Settings, Zap, ChevronRight, Activity, LogOut } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { logout, getUserInfo } from "@/utils/cognitoAuth";

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Sidebar = ({ activeView, setActiveView, expanded, setExpanded }: SidebarProps) => {
  const user = getUserInfo();
  
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
      description: 'Upload & Fetch Cards'
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
      label: 'Reports', 
      description: 'Analytics & Insights'
    },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-100 font-sans z-50 transition-all duration-300 ease-in-out ${
        expanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expanded ? 'opacity-100 w-full transform translate-x-0' : 'opacity-0 w-0 transform -translate-x-4'
          }`}>
            <div className="text-lg font-bold text-gray-900 whitespace-nowrap">Blue Pine AI</div>
            <div className="text-sm text-gray-500 whitespace-nowrap">Automation Portal</div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-2 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-4 mb-2 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${
              activeView === item.id 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {/* Active indicator */}
            {activeView === item.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full transition-all duration-200" />
            )}
            
            <item.icon className={`h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
              activeView === item.id ? 'text-blue-600' : 'text-gray-500'
            }`} />
            
            <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
              expanded 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform -translate-x-4 w-0'
            }`}>
              <div className={`font-medium whitespace-nowrap ${
                activeView === item.id ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {item.label}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">{item.description}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className={`absolute bottom-6 left-4 right-4 transition-all duration-300 ease-in-out ${
        expanded ? 'opacity-100' : 'opacity-0'
      }`}>
        {user && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
              expanded 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform -translate-x-4'
            }`}>
              <div className="font-medium text-gray-900 whitespace-nowrap">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 flex-shrink-0 ${
                expanded 
                  ? 'opacity-100 transform translate-x-0' 
                  : 'opacity-0 transform translate-x-4'
              }`}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
