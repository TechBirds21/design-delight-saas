// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  Stethoscope,
  Camera,
  Wrench,
  Package,
  CreditCard,
  UserCheck,
  Users2,
  BarChart3,
  Settings,
  ShieldAlert,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface NavigationItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', description: 'Overview & Analytics' },
  { key: 'patients', label: 'Clients', icon: Users, href: '/patients', description: 'Client Records' },
  { key: 'appointments', label: 'Appointments', icon: Calendar, href: '/appointments', description: 'Schedule Management' },
  { key: 'reception', label: 'Reception', icon: ClipboardList, href: '/reception', description: 'Front Desk Operations' },
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, href: '/doctor', description: 'Patient Care & Treatment' },
  { key: 'photo-manager', label: 'Treatment Photos', icon: Camera, href: '/photo-manager', description: 'Before/After Images' },
  { key: 'technician', label: 'Technician', icon: Wrench, href: '/technician', description: 'Procedure Handling' },
  { key: 'inventory', label: 'Products', icon: Package, href: '/inventory', description: 'Inventory & Stock' },
  { key: 'billing', label: 'Billing & Accounts', icon: CreditCard, href: '/billing', description: 'Invoices & Payments' },
  { key: 'crm', label: 'Lead Management', icon: UserCheck, href: '/crm', description: 'Manage Leads & CRM' },
  { key: 'hr', label: 'HR', icon: Users2, href: '/hr', description: 'Staff & Payroll' },
  { key: 'reports', label: 'Analytics', icon: BarChart3, href: '/reports', description: 'Clinic Analytics' },
  { key: 'admin', label: 'Clinic Settings', icon: Settings, href: '/admin', description: 'Manage Clinic Settings' },
  { key: 'super_admin', label: 'Platform Admin', icon: ShieldAlert, href: '/super-admin', description: 'SaaS Platform Management' },
];

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { tenantName, hasModuleAccess } = useTenant();
  const { user } = useAuth();

  // Filter items by tenant modules & role permissions
  const filteredItems = navigationItems.filter(item => hasModuleAccess(item.key));

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  const toggleSidebar = () => setIsCollapsed(prev => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  const NavigationItemComponent: React.FC<{item: NavigationItem}> = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    const link = (
      <Link
        to={item.href}
        onClick={closeMobileSidebar}
        className={cn(
          'group flex items-center px-3 py-2.5 rounded-lg font-medium transition-all duration-200',
          active
            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        )}
      >
        <Icon
          size={20}
          className={cn(
            'transition-colors',
            active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
          )}
        />
        {!isCollapsed && (
          <div className="ml-3 flex-1">
            <span className="block">{item.label}</span>
            <span className="text-xs text-gray-500 group-hover:text-gray-600">
              {item.description}
            </span>
          </div>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-medium">{item.label}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return link;
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsMobileOpen(o => !o)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow"
      >
        {isMobileOpen ? <X size={18}/> : <Menu size={18}/>}
      </Button>

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 shadow-lg transition-transform duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Stethoscope className="w-5 h-5 text-blue-600" />
              </div>
              {!isCollapsed && (
                <div className="text-white">
                  <h1 className="text-lg font-bold">Hospverse</h1>
                  <p className="text-xs text-blue-100 truncate max-w-[180px]">
                    {tenantName}
                  </p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="hidden lg:flex text-white p-1 hover:bg-blue-600"
            >
              {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
            </Button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredItems.map(item => (
              <NavigationItemComponent key={item.key} item={item} />
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50">
            <div className={cn('flex items-center', isCollapsed && 'justify-center')}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-sm font-semibold">
                  {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              {!isCollapsed && (
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.role.replace('_',' ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
