import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Bell, 
  ChevronDown,
  UserCircle,
  HelpCircle,
  Shield,
  CheckCircle2,
  Building2,
  Search,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpSupportModal } from "./HelpSupportModal";
import { Button } from "@/components/ui/button";
import { getUserInfo } from "@/utils/cognitoAuth";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export const Header = ({ onSettingsClick }: HeaderProps) => {
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const navigate = useNavigate();
  const user = getUserInfo();

  const handleSignOut = () => {
    navigate("/signout");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <header className="bg-white border-b border-[#CCCCCC] px-6 py-4 font-['Inter',system-ui,sans-serif]">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#333333]/40" />
              <input
                type="text"
                placeholder="Search patients, facilities, or reports..."
                className="w-full pl-10 pr-4 py-2 border border-[#CCCCCC] rounded-lg focus:border-[#004466] focus:ring-1 focus:ring-[#004466] focus:outline-none text-[#333333] placeholder-[#333333]/50"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
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

            {/* Help */}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHelpModal(true)}
              className="p-2 text-[#333333] hover:bg-[#EAEFF2] hover:text-[#004466]"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

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
                  {user && (
                    <span className="text-sm font-medium hidden md:block">
                      {user.firstName} {user.lastName}
                    </span>
                  )}
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
                  onClick={onSettingsClick}
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
                  onClick={handleSignOut}
                  className="hover:bg-[#EAEFF2] text-[#D9534F]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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