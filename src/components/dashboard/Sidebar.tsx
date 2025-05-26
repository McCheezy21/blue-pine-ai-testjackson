
import { useState } from "react";
import { Home, Image, Settings, Zap, ChevronRight } from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";

interface SidebarProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

export const Sidebar = ({ activeView, setActiveView, expanded, setExpanded }: SidebarProps) => {
  const menuItems = [
    { id: 'home' as DashboardView, icon: Home, label: 'Dashboard', description: 'Overview and metrics' },
    { id: 'insurance' as DashboardView, icon: Image, label: 'Insurance Cards', description: 'Upload & fetch patient cards' },
    { id: 'automation' as DashboardView, icon: Zap, label: 'Automation', description: 'Automated workflows' },
    { id: 'services' as DashboardView, icon: Settings, label: 'Other Services', description: 'Additional features' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${
        expanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/408a9d6d-f5ef-4982-8932-336aecfb2915.png" 
            alt="Blue Pine AI Logo" 
            className="h-8 w-8"
          />
          {expanded && (
            <span className="text-lg font-bold text-primary">Blue Pine AI</span>
          )}
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
              activeView === item.id ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-gray-700'
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {expanded && (
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            )}
            {expanded && <ChevronRight className="h-4 w-4 text-gray-400" />}
          </button>
        ))}
      </nav>
    </div>
  );
};
