import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  ClipboardList,
  Wrench,
  CreditCard,
  UserCheck,
  Users2,
  Settings,
  Package,
  LogOut,
  User,
  Scissors,
  BarChart3,
  Calendar,
  FileText,
  Home,
  Building2
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

// Role-specific navigation items
const navigationItems = {
  doctor: [
    { title: 'Dashboard', url: '/doctor', icon: Home },
    { title: 'Appointments', url: '/doctor/appointments', icon: Calendar },
    { title: 'Patients', url: '/doctor/patients', icon: Users2 },
    { title: 'EMR / SOAP', url: '/doctor/emr', icon: FileText },
    { title: 'Procedures', url: '/doctor/procedures', icon: Scissors },
    { title: 'Teleconsult', url: '/doctor/teleconsult', icon: Stethoscope },
    { title: 'Messages', url: '/doctor/messages', icon: UserCheck },
    { title: 'Analytics', url: '/doctor/analytics', icon: BarChart3 },
    { title: 'Profile', url: '/doctor/profile', icon: User },
  ],
  reception: [
    { title: 'Dashboard', url: '/reception', icon: Home },
    { title: 'Appointments', url: '/reception/appointments', icon: Calendar },
    { title: 'Patient Register', url: '/reception/register', icon: Users2 },
    { title: 'Queue Management', url: '/reception/queue', icon: ClipboardList },
    { title: 'Check-in/out', url: '/reception/checkin', icon: UserCheck },
  ],
  billing: [
    { title: 'Dashboard', url: '/billing', icon: Home },
    { title: 'Invoices', url: '/billing/invoices', icon: FileText },
    { title: 'Payments', url: '/billing/payments', icon: CreditCard },
    { title: 'Reports', url: '/billing/reports', icon: BarChart3 },
  ],
  hr: [
    { title: 'Dashboard', url: '/hr', icon: Home },
    { title: 'Employees', url: '/hr/employees', icon: Users2 },
    { title: 'Attendance', url: '/hr/attendance', icon: Calendar },
    { title: 'Payroll', url: '/hr/payroll', icon: CreditCard },
    { title: 'Performance', url: '/hr/performance', icon: BarChart3 },
  ],
  admin: [
    { title: 'Dashboard', url: '/admin', icon: Home },
    { title: 'Users & Roles', url: '/admin/users', icon: Users2 },
    { title: 'Settings', url: '/admin/settings', icon: Settings },
    { title: 'Reports', url: '/admin/reports', icon: BarChart3 },
    { title: 'Multi-branch', url: '/admin/branches', icon: Building2 },
  ],
  inventory: [
    { title: 'Dashboard', url: '/inventory', icon: Home },
    { title: 'Products', url: '/inventory/products', icon: Package },
    { title: 'Stock Management', url: '/inventory/stock', icon: BarChart3 },
    { title: 'Purchase Orders', url: '/inventory/orders', icon: FileText },
    { title: 'Reports', url: '/inventory/reports', icon: BarChart3 },
  ],
  technician: [
    { title: 'Dashboard', url: '/technician', icon: Home },
    { title: 'Procedures', url: '/technician/procedures', icon: Wrench },
    { title: 'Equipment', url: '/technician/equipment', icon: Settings },
    { title: 'Photo Manager', url: '/technician/photos', icon: UserCheck },
    { title: 'Session History', url: '/technician/history', icon: FileText },
  ],
  procedures: [
    { title: 'Dashboard', url: '/procedures', icon: Home },
    { title: 'Procedure Catalog', url: '/procedures/catalog', icon: Scissors },
    { title: 'Protocol Builder', url: '/procedures/builder', icon: Settings },
    { title: 'Templates', url: '/procedures/templates', icon: FileText },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const user = getCurrentUser();
  
  // Determine current role from URL path
  const currentPath = location.pathname;
  let currentRole = 'admin'; // default
  
  if (currentPath.startsWith('/doctor')) currentRole = 'doctor';
  else if (currentPath.startsWith('/reception')) currentRole = 'reception';
  else if (currentPath.startsWith('/billing')) currentRole = 'billing';
  else if (currentPath.startsWith('/hr')) currentRole = 'hr';
  else if (currentPath.startsWith('/inventory')) currentRole = 'inventory';
  else if (currentPath.startsWith('/technician')) currentRole = 'technician';
  else if (currentPath.startsWith('/procedures')) currentRole = 'procedures';

  const items = navigationItems[currentRole as keyof typeof navigationItems] || navigationItems.admin;

  const isActive = (path: string) => {
    if (path === `/${currentRole}`) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    navigate('/select-role');
    toast.success('Logged out successfully');
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames: Record<string, string> = {
      doctor: 'Doctor Portal',
      reception: 'Reception Portal',
      billing: 'Billing Portal',
      hr: 'HR Portal',
      admin: 'Admin Portal',
      inventory: 'Pharmacy Portal',
      technician: 'Technician Portal',
      procedures: 'Procedures Portal'
    };
    return roleNames[role] || 'Dashboard';
  };

  const getRoleIcon = (role: string) => {
    const roleIcons: Record<string, React.ReactNode> = {
      doctor: <Stethoscope className="h-5 w-5" />,
      reception: <ClipboardList className="h-5 w-5" />,
      billing: <CreditCard className="h-5 w-5" />,
      hr: <Users2 className="h-5 w-5" />,
      admin: <Settings className="h-5 w-5" />,
      inventory: <Package className="h-5 w-5" />,
      technician: <Wrench className="h-5 w-5" />,
      procedures: <Scissors className="h-5 w-5" />
    };
    return roleIcons[role] || <Home className="h-5 w-5" />;
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            {getRoleIcon(currentRole)}
          </div>
          {state === 'expanded' && (
            <div>
              <h2 className="font-semibold text-foreground">HospVerse</h2>
              <p className="text-xs text-muted-foreground">{getRoleDisplayName(currentRole)}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {state === 'expanded' && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {state === 'expanded' ? (
          <div className="space-y-4">
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => navigate('/select-role')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Switch Role
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/select-role')}
              title="Switch Role"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Logout"
              className="text-destructive hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}