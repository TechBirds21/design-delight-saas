import React, { useState } from 'react';
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
  LogOut,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface RoleOption {
  id: string; 
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  gradient: string;
  features: string[];
}

const RoleSelect: React.FC = () => {
  const { tenantName, enabledModules } = useTenant();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roleOptions: RoleOption[] = [
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Patient care & treatment management',
      icon: <Stethoscope className="h-10 w-10 text-white" />,
      path: '/doctor',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      features: ['Patient Records', 'Treatment Plans', 'SOAP Notes', 'Photo Management']
    },
    {
      id: 'reception',
      name: 'Reception',
      description: 'Front desk & appointment management',
      icon: <ClipboardList className="h-10 w-10 text-white" />,
      path: '/reception',
      gradient: 'bg-gradient-to-br from-green-500 to-green-700',
      features: ['Appointment Booking', 'Patient Registration', 'Queue Management', 'Check-in/out']
    },
    {
      id: 'technician',
      name: 'Technician',
      description: 'Treatment procedures & equipment',
      icon: <Wrench className="h-10 w-10 text-white" />,
      path: '/technician',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
      features: ['Laser Procedures', 'Equipment Management', 'Session Reports', 'Treatment Photos']
    },
    {
      id: 'inventory',
      name: 'Pharmacy',
      description: 'Inventory & stock management',
      icon: <Package className="h-10 w-10 text-white" />,
      path: '/inventory',
      gradient: 'bg-gradient-to-br from-teal-500 to-teal-700',
      features: ['Stock Management', 'Product Catalog', 'Supplier Management', 'Expiry Tracking']
    },
    {
      id: 'billing',
      name: 'Billing',
      description: 'Financial management & invoicing',
      icon: <CreditCard className="h-10 w-10 text-white" />,
      path: '/billing',
      gradient: 'bg-gradient-to-br from-orange-500 to-orange-700',
      features: ['Invoice Generation', 'Payment Processing', 'Financial Reports', 'Insurance Claims']
    },
    {
      id: 'crm',
      name: 'CRM',
      description: 'Lead management & marketing',
      icon: <UserCheck className="h-10 w-10 text-white" />,
      path: '/crm',
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-700',
      features: ['Lead Tracking', 'Follow-up Management', 'Campaign Management', 'Conversion Analytics']
    },
    {
      id: 'hr',
      name: 'HR',
      description: 'Staff management & payroll',
      icon: <Users2 className="h-10 w-10 text-white" />,
      path: '/hr',
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      features: ['Staff Records', 'Attendance Tracking', 'Payroll Management', 'Performance Reviews']
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Clinic settings & configuration',
      icon: <Settings className="h-10 w-10 text-white" />,
      path: '/admin',
      gradient: 'bg-gradient-to-br from-gray-500 to-gray-700',
      features: ['System Settings', 'User Management', 'Clinic Configuration', 'Reports & Analytics']
    },
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'SaaS platform administration',
      icon: <ShieldAlert className="h-10 w-10 text-white" />,
      path: '/super-admin',
      gradient: 'bg-gradient-to-br from-red-500 to-red-700',
      features: ['Client Management', 'Platform Analytics', 'System Monitoring', 'Billing & Subscriptions']
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

  const handleRoleSelect = async (role: RoleOption) => {
    setSelectedRole(role.id);
    await new Promise((r) => setTimeout(r, 300));
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
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="flex items-center justify-between p-6 glass border-b border-border/50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-gradient-primary">{tenantName}</h1>
            <p className="text-sm text-muted-foreground">AI-Powered Healthcare SaaS Platform</p>
          </div>
        </div>
        
        <Button variant="outline" className="glass" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-7xl mx-auto">
          <Card className="glass border-border/50 shadow-elegant">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-heading font-bold text-gradient-primary">
                  Welcome back, {user?.name}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Select your role to access the healthcare management platform
                </CardDescription>
              </div>
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span>System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Role: {user?.role.replace('_', ' ')}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {availableRoles.map((role) => (
                  <div
                    key={role.id}
                    className={`group relative overflow-hidden rounded-2xl glass hover-lift transition-all duration-300 cursor-pointer ${
                      selectedRole === role.id ? 'ring-2 ring-primary shadow-glow' : ''
                    }`}
                    onClick={() => handleRoleSelect(role)}
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 opacity-10 ${role.gradient}`}></div>
                    
                    {/* Content */}
                    <div className="relative p-6 space-y-4">
                      {/* Icon */}
                      <div className={`w-16 h-16 ${role.gradient} rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform`}>
                        {role.icon}
                      </div>
                      
                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-gradient-primary transition-colors">
                          {role.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {role.description}
                        </p>
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Key Features
                        </h4>
                        <div className="space-y-1">
                          {role.features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                          {role.features.length > 3 && (
                            <div className="text-xs text-primary font-medium">
                              +{role.features.length - 3} more features
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Loading overlay */}
                      {selectedRole === role.id && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center rounded-2xl">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="text-center space-y-4 pt-8">
              <div className="text-sm text-muted-foreground">
                Logged in as <span className="font-medium text-foreground">{user?.email}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Secure access powered by advanced AI and machine learning algorithms
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;