import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTenant } from '@/contexts/TenantContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Stethoscope,
  ClipboardList,
  Wrench,
  CreditCard,
  UserCheck,
  Users2,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { toast } from 'sonner';

interface RoleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const RoleSelector: React.FC = () => {
  const { tenantName, modulesEnabled } = useTenant();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roleOptions: RoleOption[] = [
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Manage patients and treatments',
      icon: <Stethoscope className="h-8 w-8 text-blue-500" />,      
      path: '/doctor',
    },
    {
      id: 'reception',
      name: 'Reception',
      description: 'Manage appointments and registrations',
      icon: <ClipboardList className="h-8 w-8 text-green-500" />,      
      path: '/reception',
    },
    {
      id: 'technician',
      name: 'Technician',
      description: 'Manage treatment procedures',
      icon: <Wrench className="h-8 w-8 text-purple-500" />,      
      path: '/technician',
    },
    {
      id: 'billing',
      name: 'Billing',
      description: 'Manage invoices and payments',
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,      
      path: '/billing',
    },
    {
      id: 'crm',
      name: 'CRM',
      description: 'Manage leads and marketing',
      icon: <UserCheck className="h-8 w-8 text-pink-500" />,      
      path: '/crm',
    },
    {
      id: 'hr',
      name: 'HR',
      description: 'Manage staff and payroll',
      icon: <Users2 className="h-8 w-8 text-indigo-500" />,      
      path: '/hr',
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'System administration',
      icon: <Settings className="h-8 w-8 text-gray-500" />,      
      path: '/admin',
    },
    {
      id: 'super_admin',
      name: 'Super Admin',
      description: 'SaaS platform administration',
      icon: <ShieldAlert className="h-8 w-8 text-red-500" />,      
      path: '/super-admin',
    },
  ];

  const availableRoles = roleOptions.filter((role) =>
    modulesEnabled[role.id] ||
    role.id === 'admin' ||
    (role.id === 'super_admin' && user?.role === 'super_admin')
  );

  const handleRoleSelect = async (role: RoleOption) => {
    setSelectedRole(role.id);
    await new Promise((r) => setTimeout(r, 300));
    navigate(role.path);
    toast.success(`Logged in as ${role.name}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome to {tenantName}</CardTitle>
        <CardDescription>Select your role to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableRoles.map((role) => (
            <Button
              key={role.id}
              variant={selectedRole === role.id ? 'default' : 'outline'}
              className={`h-32 flex flex-col items-center justify-center space-y-2 ${
                selectedRole === role.id ? 'border-2 border-blue-500' : ''
              }`}
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
          Logged in as {user?.name} ({user?.email})
        </p>
      </CardFooter>
    </Card>
  );
};

export default RoleSelector;
