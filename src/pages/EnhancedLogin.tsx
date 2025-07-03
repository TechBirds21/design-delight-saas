import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Users, 
  Stethoscope, 
  CreditCard, 
  ClipboardList, 
  Package,
  Wrench,
  Scissors,
  Settings,
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter username'),
  password: z.string().min(1, 'Please enter password'),
  role: z.string().min(1, 'Please select a role'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const EnhancedLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'abc',
      password: '123',
      role: 'reception',
    },
  });

  const selectedRole = watch('role');

  // Role definitions matching your specifications
  const roles = [
    { 
      id: 'reception', 
      name: 'Reception', 
      icon: ClipboardList,
      description: 'Appointments, Patients check-in, Queue management',
      color: 'bg-green-500'
    },
    { 
      id: 'billing', 
      name: 'Billing', 
      icon: CreditCard,
      description: 'Invoices, Payments, Refunds',
      color: 'bg-blue-500'
    },
    { 
      id: 'doctor', 
      name: 'Doctor', 
      icon: Stethoscope,
      description: 'Patients, SOAP notes, Prescriptions, Lab orders',
      color: 'bg-emerald-500'
    },
    { 
      id: 'hr', 
      name: 'HR / Employees', 
      icon: Users,
      description: 'Staff directory, Attendance, Payroll slips',
      color: 'bg-purple-500'
    },
    { 
      id: 'admin', 
      name: 'Admin', 
      icon: Settings,
      description: 'Users & roles, Settings, Multi-branch',
      color: 'bg-gray-600'
    },
    { 
      id: 'pharmacy', 
      name: 'Pharmacy', 
      icon: Package,
      description: 'Inventory, Purchase orders, Dispensing logs',
      color: 'bg-teal-500'
    },
    { 
      id: 'technician', 
      name: 'Technician', 
      icon: Wrench,
      description: 'Photo manager, Device protocols',
      color: 'bg-orange-500'
    },
    { 
      id: 'procedures', 
      name: 'Procedures', 
      icon: Scissors,
      description: 'Procedure catalog, Protocol builder',
      color: 'bg-pink-500'
    }
  ];

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Simple validation for demo - any role works with abc/123
      if (data.email === 'abc' && data.password === '123') {
        await login(data.email, data.password);
        
        // Navigate to role-specific dashboard
        const roleRoutes: Record<string, string> = {
          reception: '/reception',
          billing: '/billing',
          doctor: '/doctor',
          hr: '/hr',
          admin: '/admin',
          pharmacy: '/inventory',
          technician: '/technician',
          procedures: '/procedures'
        };
        
        navigate(roleRoutes[data.role] || '/dashboard');
        toast.success(`Signed in as ${data.role}`);
      } else {
        throw new Error('Invalid credentials. Use abc/123 for demo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get tenant info from subdomain
  const host = window.location.host;
  const subdomain = host.split('.')[0];
  const isLocalhost = subdomain === 'localhost' || subdomain.includes('127.0.0.1');
  const clinicName = isLocalhost ? 'Demo Clinic' : subdomain.charAt(0).toUpperCase() + subdomain.slice(1) + ' Clinic';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Panel - Clinic Illustration & Info */}
        <div className="relative hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}></div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center text-white space-y-8 max-w-lg">
            {/* Medical Illustration */}
            <div className="mx-auto w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Stethoscope className="w-16 h-16 text-white" />
            </div>
            
            {/* Clinic Info */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{clinicName}</h1>
              <p className="text-xl text-indigo-100">Welcome to Hospverse</p>
              <p className="text-lg text-indigo-200">Your Clinic Universe</p>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Shield className="w-8 h-8 text-white mb-2 mx-auto" />
                <p className="text-sm font-medium">HIPAA Compliant</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <Activity className="w-8 h-8 text-white mb-2 mx-auto" />
                <p className="text-sm font-medium">Real-time Analytics</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex justify-center space-x-8 text-sm">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-indigo-200">Active Clinics</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-indigo-200">Patients</div>
              </div>
              <div>
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-indigo-200">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex items-center justify-center p-8">
          <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
              {/* Clinic Logo */}
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{clinicName}</CardTitle>
              <p className="text-gray-600">Access your healthcare management system</p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Selector */}
                <div className="space-y-2">
                  <Label htmlFor="role">Select Your Role</Label>
                  <Select 
                    onValueChange={(value) => setValue('role', value)}
                    {...register('role')}
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Choose your role..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id} className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${role.color}`}></div>
                            <div>
                              <div className="font-medium">{role.name}</div>
                              <div className="text-sm text-gray-500">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="email">Username</Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="abc"
                    className="h-12"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <span className="text-sm text-gray-500">Demo: 123</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="123"
                      className="h-12 pr-10"
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : `Sign In as ${selectedRole ? roles.find(r => r.id === selectedRole)?.name : 'User'}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="text-center space-y-4">
              <div className="text-sm text-gray-500">
                Need help? Contact{' '}
                <a href="mailto:support@hospverse.com" className="text-indigo-600 hover:text-indigo-500">
                  support@hospverse.com
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;