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
  Building2
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

interface HeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    tenant?: {
      name: string;
      plan: string;
      allowed_email_domains: string[];
    };
    role?: string;
  };
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);

  const handleSignOut = () => {
    navigate("/signout");
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <>
      <header className="bg-white border-b border-[#CCCCCC] px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl font-semibold text-[#333333]">
              Dashboard
            </h1>
            <p className="text-sm text-[#333333]/60">
              Healthcare Revenue Cycle Management
            </p>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-[#333333]/60 hover:text-[#004466] hover:bg-[#EAEFF2] rounded-lg transition-colors duration-200">
              <Bell className="h-5 w-5" />
            </button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-3 px-3 py-2 text-[#333333] hover:bg-[#EAEFF2] rounded-lg transition-colors duration-200">
                  <div className="w-8 h-8 bg-[#004466] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-[#333333]/60">
                      {user.tenant?.name || 'BluePine AI'}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#333333]/60" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-80 bg-white border border-[#CCCCCC] shadow-lg" align="end">
                <DropdownMenuLabel className="pb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#004466] rounded-full flex items-center justify-center text-white font-medium">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <div className="font-medium text-[#333333]">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-[#333333]/60">{user.email}</div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-[#CCCCCC]" />

                {/* View Profile Toggle */}
                <DropdownMenuItem 
                  onSelect={() => setShowProfileDetails(!showProfileDetails)}
                  className="text-[#333333] hover:bg-[#EAEFF2] focus:bg-[#EAEFF2]"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>View Profile Details</span>
                </DropdownMenuItem>

                {showProfileDetails && (
                  <div className="mx-1 my-2 p-3 bg-[#EAEFF2] rounded-lg border border-[#CCCCCC]">
                    {/* Tenant Status */}
                    <div className="flex items-center gap-3 mb-3 p-2 bg-[#3CB371]/10 rounded-lg border border-[#3CB371]/20">
                      <div className="w-6 h-6 bg-[#3CB371] rounded-lg flex items-center justify-center">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-[#333333]">Tenant Isolation Active</span>
                          <CheckCircle2 className="h-3 w-3 text-[#3CB371]" />
                        </div>
                        <div className="text-xs text-[#333333]/70">
                          Securely isolated within {user.tenant?.name || 'BluePine AI'} organization.
                        </div>
                      </div>
                    </div>

                    {/* Plan and Role Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[#333333]/70">Plan:</span>
                        <span className="font-medium text-[#004466] capitalize">{user.tenant?.plan || 'pro'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#333333]/70">Role:</span>
                        <span className="font-medium text-[#004466] capitalize">{user.role || 'user'}</span>
                      </div>
                      {user.tenant?.allowed_email_domains && (
                        <div className="pt-2 border-t border-[#CCCCCC]">
                          <div className="text-[#333333]/70 mb-1">Authorized domains:</div>
                          <div className="font-medium text-[#333333] text-xs">
                            {user.tenant.allowed_email_domains.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Help & Support */}
                <DropdownMenuItem 
                  onSelect={() => setShowHelpSupport(true)}
                  className="text-[#333333] hover:bg-[#EAEFF2] focus:bg-[#EAEFF2]"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-[#CCCCCC]" />

                {/* Sign Out */}
                <DropdownMenuItem 
                  onSelect={handleSignOut}
                  className="text-[#D9534F] hover:bg-[#D9534F]/10 focus:bg-[#D9534F]/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
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
    </>
  );
}; 