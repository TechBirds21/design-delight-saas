// src/components/layout/Navbar.tsx
import React from 'react';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import {
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  Search,
  HelpCircle,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const Navbar: React.FC = () => {
  const { currentBranch, subscription } = useTenant();
  const { logout, user } = useAuth();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      super_admin: 'bg-red-100 text-red-800 border-red-200',
      doctor: 'bg-blue-100 text-blue-800 border-blue-200',
      nurse: 'bg-green-100 text-green-800 border-green-200',
      receptionist: 'bg-purple-100 text-purple-800 border-purple-200',
      pharmacist: 'bg-orange-100 text-orange-800 border-orange-200',
      technician: 'bg-teal-100 text-teal-800 border-teal-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (!user) {
    return (
      <Link
        to="/login"
        className="p-4 text-center block w-full bg-blue-50 text-blue-600 font-medium"
      >
        Please log in to access the system
      </Link>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Left side - Search and Branch info */}
        <div className="flex items-center space-x-3 sm:space-x-6 flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search patients, appointments..."
              className="pl-10 w-64 lg:w-80 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-lg"
            />
          </div>

          {/* Branch Info */}
          <div className="hidden lg:block min-w-0 flex-1">
            <h2 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
              Welcome back, {user.name.split(' ')[1] || user.name}!
            </h2>
            <p className="text-xs lg:text-sm text-gray-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              <span className="truncate">{currentBranch}</span>
            </p>
          </div>
        </div>

        {/* Right side - Actions and User menu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick Actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <HelpCircle size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-600 hover:text-gray-900"
            >
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                3
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings size={16} />
            </Button>
          </div>

          {/* Subscription Status */}
          <Badge
            variant="outline"
            className="hidden lg:flex bg-green-50 text-green-700 border-green-200 text-xs"
          >
            {subscription.plan}
          </Badge>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 px-2 sm:px-3 py-2 rounded-lg transition-colors"
              >
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-gray-200">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </span>
                    <Badge
                      className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(
                        user.role
                      )}`}
                      variant="outline"
                    >
                      {user.role
                        .replace('_', ' ')
                        .split(' ')
                        .map(
                          (w) => w.charAt(0).toUpperCase() + w.slice(1)
                        )
                        .join(' ')}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className="text-gray-400 hidden sm:block"
                />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[
                { icon: UserIcon, label: 'Profile Settings' },
                { icon: Settings, label: 'Account Settings' },
                { icon: Bell, label: 'Notifications' },
                { icon: HelpCircle, label: 'Help & Support' },
              ].map(({ icon: IconComponent, label }) => (
                <DropdownMenuItem key={label} className="cursor-pointer">
                  <IconComponent className="mr-2 h-4 w-4" />
                  <span>{label}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 cursor-pointer focus:text-red-600"
                onClick={async () => {
                  await logout();
                  toast.success('Logged out successfully');
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
