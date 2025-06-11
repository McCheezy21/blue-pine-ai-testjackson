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
  const [notificationCount] = useState(3); // Mock notification count
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSignOut = () => {
    navigate('/signout');
  };

  const handleProfileClick = () => {
    setShowProfileDetails(!showProfileDetails);
  };

  const handleHelpClick = () => {
    setShowHelpModal(true);
  };

  return (
    <>
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          {/* Left side - Breadcrumbs or Page Title */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
              <span className="text-sm text-slate-500">Blue Pine AI Portal</span>
            </div>
          </div>

          {/* Right side - Actions and User menu */}
          <div className="flex items-center gap-3">
            {/* Apple-inspired Notifications */}
            <div className="relative">
              <button className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 rounded-xl transition-all duration-300 hover:scale-105 group">
                <Bell className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                {notificationCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-lg animate-pulse">
                    {notificationCount}
                  </div>
                )}
              </button>
            </div>

            {/* Apple-inspired User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50/50 rounded-xl transition-all duration-300 hover:scale-[1.02] group">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-semibold text-slate-900 text-sm">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.email}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500 transition-transform duration-300 group-hover:rotate-180" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-80 bg-white/90 backdrop-blur-xl border border-slate-200/50 shadow-2xl rounded-2xl p-2 mt-2">
                {/* Apple-inspired user info header */}
                <DropdownMenuLabel className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {getInitials(user.firstName, user.lastName)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-slate-200/50 my-2" />
                
                {/* My Profile with expandable details */}
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-slate-50/50 focus:bg-slate-50/50 px-3 py-2.5 rounded-xl mx-1 transition-all duration-200 group"
                  onClick={handleProfileClick}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <UserCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">My Profile</div>
                    <div className="text-xs text-slate-500">View and edit profile</div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showProfileDetails ? 'rotate-180' : ''}`} />
                </DropdownMenuItem>

                {/* Expanded Profile Details */}
                {showProfileDetails && (
                  <div className="mx-1 my-2 p-3 bg-slate-50/50 rounded-xl border border-slate-200/50">
                    {/* Tenant Isolation Status */}
                    <div className="flex items-center gap-3 mb-3 p-2 bg-green-50/70 rounded-lg border border-green-200/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-green-900">Tenant Isolation Active</span>
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        </div>
                        <div className="text-xs text-green-700/80">
                          You are securely isolated within the {user.tenant?.name || 'BluePine AI'} organization space.
                        </div>
                      </div>
                    </div>

                    {/* Plan and Role Info */}
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Plan:</span>
                        <span className="font-medium text-blue-600 capitalize">{user.tenant?.plan || 'pro'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Role:</span>
                        <span className="font-medium text-blue-600 capitalize">{user.role || 'user'}</span>
                      </div>
                      {user.tenant?.allowed_email_domains && (
                        <div className="pt-2 border-t border-slate-200/50">
                          <div className="text-slate-500 mb-1">Authorized domains:</div>
                          <div className="font-medium text-slate-700 text-xs">
                            {user.tenant.allowed_email_domains.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Help & Support */}
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-slate-50/50 focus:bg-slate-50/50 px-3 py-2.5 rounded-xl mx-1 transition-all duration-200 group"
                  onClick={handleHelpClick}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-500 to-slate-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <HelpCircle className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Help & Support</div>
                    <div className="text-xs text-slate-500">Get help when you need it</div>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-slate-200/50 my-2" />
                
                {/* Apple-style sign out */}
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 hover:bg-red-50/50 focus:bg-red-50/50 hover:text-red-700 focus:text-red-700 px-3 py-2.5 rounded-xl mx-1 transition-all duration-200 group"
                  onClick={handleSignOut}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                    <LogOut className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Sign Out</div>
                    <div className="text-xs text-red-500/70">End your session</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Help Support Modal */}
      <HelpSupportModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)} 
      />
    </>
  );
}; 