import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  Home, 
  MessageCircle, 
  Image, 
  Settings, 
  Activity, 
  ChevronDown, 
  LogOut,
  User,
  Bell,
  HelpCircle,
  Search,
  Menu,
  X
} from "lucide-react";
import { DashboardView } from "@/pages/Dashboard";
import { getUserInfo } from "@/utils/cognitoAuth";
import BluePineLogo from "@/components/ui/BluePineLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HelpSupportModal } from "./HelpSupportModal";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopNavigationProps {
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;
}

export const TopNavigation = ({ activeView, setActiveView }: TopNavigationProps) => {
  const user = getUserInfo();
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId } = useParams();
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Navigation menu items organized by sections
  const navigationSections = [
    {
      id: 'main',
      label: 'Main',
      items: [
        {
          id: 'ai-home',
          icon: MessageCircle,
          label: 'AI Home',
          description: 'Chat with Blue Pine AI',
          path: `/tenant/${tenantId}/welcome`,
        },
        {
          id: 'dashboard',
          icon: Home,
          label: 'Dashboard',
          description: 'Overview & Metrics',
          path: `/tenant/${tenantId}/dashboard`,
        },
      ]
    },
    {
      id: 'services',
      label: 'Services',
      items: [
        {
          id: 'insurance',
          icon: Image,
          label: 'Insurance Cards',
          description: 'Upload & Process Cards',
          path: `/tenant/${tenantId}/insurance`,
        },
        {
          id: 'automation',
          icon: Activity,
          label: 'Automation Services',
          description: 'AI-Powered Workflows',
          path: `/tenant/${tenantId}/automation`,
        },
        {
          id: 'reports',
          icon: Settings,
          label: 'Reports & Analytics',
          description: 'Insights & Performance',
          path: `/tenant/${tenantId}/reports`,
        },
      ]
    }
  ];

  const handleLogout = () => {
    navigate('/signout');
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Determine active menu item based on path
  const currentPath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-[#CCCCCC] px-4 md:px-6 py-4 font-['Inter',system-ui,sans-serif] sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-2 md:space-x-3">
              <BluePineLogo size="lg" />
              <div className="hidden sm:block">
                <h2 className="text-xl font-semibold text-[#333333]">
                  Blue Pine AI
                </h2>
                <p className="text-sm text-[#333333]/60">Healthcare Platform</p>
              </div>
            </div>

            {/* Desktop Navigation Sections */}
            {!isMobile && (
              <nav className="flex items-center space-x-1">
                {navigationSections.map((section) => (
                  <DropdownMenu key={section.id}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="flex items-center space-x-2 px-4 py-2 text-[#333333] hover:bg-[#EAEFF2] hover:text-[#004466]"
                      >
                        <span className="font-medium">{section.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 bg-white border-[#CCCCCC]">
                      <DropdownMenuLabel className="text-[#333333] font-semibold">
                        {section.label}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-[#CCCCCC]" />
                      {section.items.map((item) => {
                        const isActive = currentPath === item.path;
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => handleNavigation(item.path!)}
                            className={`p-3 hover:bg-[#EAEFF2] cursor-pointer ${
                              isActive ? 'bg-[#004466] text-white hover:bg-[#004466]' : 'text-[#333333]'
                            }`}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className={`w-5 h-5 flex items-center justify-center ${
                                isActive ? 'text-white' : 'text-[#333333]/70'
                              }`}>
                                <item.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  isActive ? 'text-white' : 'text-[#333333]'
                                }`}>
                                  {item.label}
                                </div>
                                <div className={`text-xs ${
                                  isActive ? 'text-white/80' : 'text-[#333333]/60'
                                }`}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </nav>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Bar - Hidden on mobile */}
            {!isMobile && (
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#333333]/40" />
                  <input
                    type="text"
                    placeholder="Search patients, facilities, or reports..."
                    className="w-full pl-10 pr-4 py-2 border border-[#CCCCCC] rounded-lg focus:border-[#004466] focus:ring-1 focus:ring-[#004466] focus:outline-none text-[#333333] placeholder-[#333333]/50"
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="relative p-2 text-[#333333] hover:bg-[#EAEFF2] hover:text-[#004466]"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#D9534F] rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-white border-[#CCCCCC]">
                <div className="p-4 border-b border-[#CCCCCC]">
                  <h4 className="font-semibold text-[#333333]">Notifications</h4>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <DropdownMenuItem className="p-4 hover:bg-[#EAEFF2]">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#333333]">New automation completed</p>
                      <p className="text-xs text-[#333333]/70">Revenue cycle automation finished for Sunrise Manor</p>
                      <p className="text-xs text-[#333333]/50">2 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 hover:bg-[#EAEFF2]">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#333333]">Insurance cards processed</p>
                      <p className="text-xs text-[#333333]/70">45 new cards successfully uploaded and processed</p>
                      <p className="text-xs text-[#333333]/50">1 hour ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-4 hover:bg-[#EAEFF2]">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-[#333333]">System update available</p>
                      <p className="text-xs text-[#333333]/70">New features and improvements are ready</p>
                      <p className="text-xs text-[#333333]/50">3 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help - Hidden on mobile */}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHelpModal(true)}
                className="p-2 text-[#333333] hover:bg-[#EAEFF2] hover:text-[#004466]"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 p-2 text-[#333333] hover:bg-[#EAEFF2]"
                >
                  {user ? (
                    <div className="w-8 h-8 bg-[#004466] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  {user && !isMobile && (
                    <span className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-[#CCCCCC]">
                {user && (
                  <>
                    <div className="p-3 border-b border-[#CCCCCC]">
                      <p className="font-medium text-[#333333]">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-[#333333]/70">{user.email}</p>
                    </div>
                  </>
                )}
                <DropdownMenuItem 
                  onClick={() => {}}
                  className="hover:bg-[#EAEFF2] text-[#333333]"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowHelpSupport(true)}
                  className="hover:bg-[#EAEFF2] text-[#333333]"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#CCCCCC]" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-[#EAEFF2] text-[#D9534F]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#333333] hover:bg-[#EAEFF2] hover:text-[#004466]"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && mobileMenuOpen && (
          <div className="mt-4 border-t border-[#CCCCCC] pt-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#333333]/40" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border border-[#CCCCCC] rounded-lg focus:border-[#004466] focus:ring-1 focus:ring-[#004466] focus:outline-none text-[#333333] placeholder-[#333333]/50"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navigationSections.map((section) => (
                <div key={section.id} className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#333333] px-2 py-1">
                    {section.label}
                  </h3>
                  {section.items.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.path!)}
                        className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-[#004466] text-white' 
                            : 'text-[#333333] hover:bg-[#EAEFF2]'
                        }`}
                      >
                        <div className={`w-5 h-5 flex items-center justify-center ${
                          isActive ? 'text-white' : 'text-[#333333]/70'
                        }`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium ${
                            isActive ? 'text-white' : 'text-[#333333]'
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${
                            isActive ? 'text-white/80' : 'text-[#333333]/60'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            {/* Mobile Help Button */}
            <div className="mt-4 pt-4 border-t border-[#CCCCCC]">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setShowHelpModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start p-3 text-[#333333] hover:bg-[#EAEFF2]"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Help & Support
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Help Support Modal */}
      <HelpSupportModal
        isOpen={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

      <HelpSupportModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </>
  );
}; 