import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTenant } from '../contexts/TenantContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Stethoscope,
  ClipboardList,
  Wrench,
  CreditCard,
  UserCheck,
  Users2,
  Settings,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { toast } from 'sonner';

interface RoleOption {
  id: string; 
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const RoleSelect: React.FC = () => {
  const { tenantName, enabledModules } = useTenant();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleOptions: RoleOption[] = [
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Manage patients and treatments',
      icon: <Stethoscope className="h-8 w-8 text-blue-500" />,
      path: '/doctor'
    },
    {
      id: 'reception',
      name: 'Reception',
      description: 'Manage appointments and registrations',
      icon: <ClipboardList className="h-8 w-8 text-green-500" />,
      path: '/reception'
    },
    {
      id: 'technician',
      name: 'Technician',
      description: 'Manage treatment procedures',
      icon: <Wrench className="h-8 w-8 text-purple-500" />,
      path: '/technician'
    },
    {
      id: 'billing',
      name: 'Billing',
      description: 'Manage invoices and payments',
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      path: '/billing'
    },
    {
      id: 'crm',
      name: 'CRM',
      description: 'Manage leads and marketing',
      icon: <UserCheck className="h-8 w-8 text-pink-500" />,
      path: '/crm'
    },
    {
      id: 'hr',
      name: 'HR',
      description: 'Manage staff and payroll',
      icon: <Users2 className="h-8 w-8 text-indigo-500" />,
      path: '/hr'
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'System administration',
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      path: '/admin'
    },
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'SaaS platform administration',
      icon: <ShieldAlert className="h-8 w-8 text-red-500" />,
      path: '/super-admin'
    }
  ];
  
  // Define which roles can access which modules
  const roleAccessMap: Record<string, string[]> = {
    super_admin: roleOptions.map(r => r.id), // Super admin can access everything
    admin: ['admin', 'hr', 'crm', 'billing', 'inventory', 'reports'],
    doctor: ['doctor', 'photo-manager'],
    receptionist: ['reception'],
    technician: ['technician'],
    nurse: ['doctor'],
    pharmacist: ['inventory']
  };
  
  // Get the allowed modules for the current user
  const allowedModules = roleAccessMap[user?.role || ''] || [];
  
  // Filter roles based on user's role and enabled modules
  const availableRoles = roleOptions.filter(role => 
    allowedModules.includes(role.id) && 
    (enabledModules[role.id] || role.id === 'admin' || role.id === 'super-admin')
  );

  const handleRoleSelect = (role: RoleOption) => {
    navigate(role.path);
    toast.success(`Accessing ${role.name} dashboard`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Stethoscope className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{tenantName}</h1>
            <p className="text-xs text-blue-100">Multi-Tenant Healthcare Platform</p>
          </div>
        </div>
        
        <Button variant="ghost" className="text-white hover:bg-blue-700" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome, {user?.name}</CardTitle>
            <CardDescription>
              Select your role to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRoles.map((role) => (
                <Button
                  key={role.id}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 hover:border-blue-500 transition-all"
                  onClick={() => handleRoleSelect(role)}
                >
                  {role.icon}
                  <span className="font-medium">{role.name}</span>
                  <span className="text-xs text-gray-500">{role.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Logged in as {user?.email} • {user?.role.replace('_', ' ')}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelect;