
import { useState } from "react";
import { Home, Image, Settings, Zap, ChevronRight, Activity } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Sidebar = ({ activeView, setActiveView, expanded, setExpanded }: SidebarProps) => {
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

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-50 border-r border-gray-100 font-sans ${
        expanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          {expanded && (
            <div>
              <div className="text-lg font-bold text-gray-900">Blue Pine AI</div>
              <div className="text-sm text-gray-500">Automation Portal</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-6 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-4 mb-2 text-left rounded-xl transition-all duration-200 group ${
              activeView === item.id 
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`h-5 w-5 flex-shrink-0 ${
              activeView === item.id ? 'text-blue-600' : 'text-gray-500'
            }`} />
            {expanded && (
              <div className="flex-1 min-w-0">
                <div className={`font-medium ${
                  activeView === item.id ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* User Profile */}
      {expanded && (
        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              SJ
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900">Sarah Johnson</div>
              <div className="text-xs text-gray-500">Blue Pine AI User</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
