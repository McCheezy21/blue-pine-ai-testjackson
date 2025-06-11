import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Image, Settings, Zap, ChevronRight, Activity, LogOut, TreePine } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { getUserInfo } from "@/utils/cognitoAuth";

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
      description: 'Overview & Metrics',
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'insurance' as DashboardView, 
      icon: Image, 
      label: 'Insurance Cards', 
      description: 'Upload & Process Cards',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    { 
      id: 'automation' as DashboardView, 
      icon: Activity, 
      label: 'Automation Services', 
      description: 'AI-Powered Workflows',
      gradient: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'services' as DashboardView, 
      icon: Settings, 
      label: 'Reports & Analytics', 
      description: 'Insights & Performance',
      gradient: 'from-amber-500 to-amber-600'
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
      className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/50 font-sans z-50 transition-all duration-300 ease-in-out shadow-xl ${
        expanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Apple-inspired Header */}
      <div className="p-4 border-b border-slate-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <TreePine className="h-6 w-6 text-white" />
          </div>
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            expanded ? 'opacity-100 w-full transform translate-x-0' : 'opacity-0 w-0 transform -translate-x-4'
          }`}>
            <div className="text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent whitespace-nowrap">
              Blue Pine AI
            </div>
            <div className="text-sm text-slate-500 whitespace-nowrap">Automation Portal</div>
          </div>
        </div>
      </div>
      
      {/* Apple-inspired Navigation */}
      <nav className="mt-6 px-3 flex-1">
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-4 mb-2 text-left rounded-2xl transition-all duration-300 group relative overflow-hidden ${
              activeView === item.id 
                ? 'bg-gradient-to-br from-blue-50 via-blue-50/50 to-white border border-blue-100/50 shadow-lg text-blue-600 scale-[1.02]' 
                : 'text-slate-700 hover:bg-gradient-to-br hover:from-slate-50 hover:to-white hover:shadow-md hover:scale-[1.01]'
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {/* Apple-style active indicator */}
            {activeView === item.id && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl" />
              </>
            )}
            
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
              activeView === item.id 
                ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                : 'bg-slate-100 group-hover:bg-slate-200'
            }`}>
              <item.icon className={`h-4 w-4 transition-colors duration-300 ${
                activeView === item.id ? 'text-white' : 'text-slate-600'
              }`} />
            </div>
            
            <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
              expanded 
                ? 'opacity-100 transform translate-x-0' 
                : 'opacity-0 transform -translate-x-4 w-0'
            }`}>
              <div className={`font-semibold whitespace-nowrap transition-colors duration-300 ${
                activeView === item.id ? 'text-blue-700' : 'text-slate-900 group-hover:text-slate-800'
              }`}>
                {item.label}
              </div>
              <div className="text-xs text-slate-500 whitespace-nowrap group-hover:text-slate-600 transition-colors duration-300">
                {item.description}
              </div>
            </div>

            {/* Subtle hover arrow */}
            <ChevronRight className={`h-4 w-4 transition-all duration-300 ${
              expanded && activeView !== item.id
                ? 'opacity-0 group-hover:opacity-50 transform group-hover:translate-x-1'
                : 'opacity-0'
            }`} />
          </button>
        ))}
      </nav>

      {/* Apple-inspired User Profile */}
      <div className={`absolute bottom-6 left-3 right-3 transition-all duration-300 ease-in-out ${
        expanded ? 'opacity-100' : 'opacity-0'
      }`}>
        {user && (
          <div className="p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {getInitials(user.firstName, user.lastName)}
              </div>
              <div className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
                expanded 
                  ? 'opacity-100 transform translate-x-0' 
                  : 'opacity-0 transform -translate-x-4'
              }`}>
                <div className="font-semibold text-slate-900 whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-xs text-slate-500 truncate">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className={`p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md ${
                  expanded 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform translate-x-4'
                }`}
                title="Sign Out"
              >
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
