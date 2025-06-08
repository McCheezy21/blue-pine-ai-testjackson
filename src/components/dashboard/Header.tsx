import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  ChevronDown,
  UserCircle,
  Shield,
  HelpCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const Header = ({ user }: HeaderProps) => {
  const navigate = useNavigate();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleSignOut = () => {
    navigate('/signout');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - could add breadcrumbs or title here */}
        <div className="flex-1">
          {/* Space for future content like breadcrumbs or page title */}
        </div>

        {/* Right side - User menu and notifications */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {getInitials(user.firstName, user.lastName)}
                </div>
                <div className="hidden md:block">
                  <div className="font-medium text-gray-900 text-sm">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.email}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg rounded-lg p-1">
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator className="bg-gray-200" />
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2 rounded-md mx-1">
                <UserCircle className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-900">My Profile</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2 rounded-md mx-1">
                <Shield className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-900">Account Settings</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2 rounded-md mx-1">
                <Settings className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-900">Preferences</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2 rounded-md mx-1">
                <Bell className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-900">Notifications</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50 px-2 py-2 rounded-md mx-1">
                <HelpCircle className="mr-2 h-4 w-4 text-gray-600" />
                <span className="text-gray-900">Help & Support</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-200" />
              
              <DropdownMenuItem 
                className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 hover:text-red-700 focus:text-red-700 px-2 py-2 rounded-md mx-1"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}; 