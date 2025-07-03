import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter username'),
  password: z.string().min(1, 'Please enter password'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const roleConfig = {
  doctor: {
    name: 'Doctor Portal',
    icon: '🩺',
    description: 'Access patient records, treatments, and medical tools',
    gradient: 'from-blue-500 to-blue-700',
    dashboard: '/doctor'
  },
  reception: {
    name: 'Reception Portal', 
    icon: '📋',
    description: 'Manage appointments, patient check-ins, and front desk operations',
    gradient: 'from-green-500 to-green-700',
    dashboard: '/reception'
  },
  billing: {
    name: 'Billing Portal',
    icon: '💳', 
    description: 'Handle invoices, payments, and financial operations',
    gradient: 'from-orange-500 to-orange-700',
    dashboard: '/billing'
  },
  hr: {
    name: 'HR Portal',
    icon: '👥',
    description: 'Manage staff, payroll, and human resources',
    gradient: 'from-purple-500 to-purple-700',
    dashboard: '/hr'
  },
  admin: {
    name: 'Admin Portal',
    icon: '⚙️',
    description: 'System administration and configuration',
    gradient: 'from-gray-500 to-gray-700',
    dashboard: '/admin'
  },
  inventory: {
    name: 'Pharmacy Portal',
    icon: '💊',
    description: 'Manage inventory, stock, and pharmaceutical operations',
    gradient: 'from-teal-500 to-teal-700', 
    dashboard: '/inventory'
  },
  technician: {
    name: 'Technician Portal',
    icon: '🔧',
    description: 'Equipment management and technical procedures',
    gradient: 'from-indigo-500 to-indigo-700',
    dashboard: '/technician'
  },
  procedures: {
    name: 'Procedures Portal',
    icon: '✂️',
    description: 'Procedure protocols and management',
    gradient: 'from-pink-500 to-pink-700',
    dashboard: '/procedures'
  }
};

const RoleLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const role = searchParams.get('role') as keyof typeof roleConfig;
  const config = roleConfig[role];

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'abc',
      password: '123',
    },
  });

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <h2 className="text-xl font-bold mb-2">Invalid Role</h2>
            <p className="text-gray-600 mb-4">The requested role is not valid.</p>
            <Button onClick={() => navigate('/select-role')}>
              Back to Role Selection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Simple demo authentication - use abc/123 for any role
      if (data.email === 'abc' && data.password === '123') {
        // Create a mock user with the selected role
        const mockUser = {
          id: `user-${Date.now()}`,
          name: `${config.name} User`,
          email: data.email,
          role: role === 'inventory' ? 'pharmacist' : role === 'reception' ? 'receptionist' : role,
          client_id: 'client-123'
        } as any;

        // Store tokens and user
        localStorage.setItem('token', 'demo_token');
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        // Navigate to role-specific dashboard
        navigate(config.dashboard);
        toast.success(`Welcome to ${config.name}!`);
      } else {
        throw new Error('Invalid credentials. Use abc/123 for demo.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const formData = { email: 'abc', password: '123' };
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Panel - Role Info */}
        <div className={`relative hidden lg:flex lg:items-center lg:justify-center bg-gradient-to-br ${config.gradient} p-8`}>
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-repeat" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
            }}></div>
          </div>
          
          <div className="relative z-10 text-center text-white space-y-8 max-w-lg">
            <div className="text-8xl">{config.icon}</div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">{config.name}</h1>
              <p className="text-xl opacity-90">{config.description}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <p className="text-sm font-medium">Secure Healthcare Platform</p>
              <p className="text-xs opacity-75 mt-1">HIPAA Compliant • End-to-End Encrypted</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-0">
              <CardHeader className="text-center space-y-2">
                <div className="flex items-center justify-center mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/select-role')}
                    className="absolute left-4 top-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className={`w-16 h-16 bg-gradient-to-br ${config.gradient} rounded-full flex items-center justify-center text-2xl`}>
                    {config.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{config.name}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Username</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="abc"
                      {...register('email')}
                      className="h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="123"
                        {...register('password')}
                        className="h-12 pr-10"
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
                  
                  <Button 
                    type="submit" 
                    className={`w-full h-12 bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white font-medium`}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : `Access ${config.name}`}
                  </Button>
                </form>

                <div className="pt-6 border-t border-gray-200">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-gray-600">Demo Credentials:</p>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <p><strong>Username:</strong> abc</p>
                      <p><strong>Password:</strong> 123</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={handleDemoLogin}
                    >
                      Quick Demo Login
                    </Button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="text-center">
                <div className="text-xs text-gray-400">
                  By signing in, you agree to our Terms of Service and Privacy Policy.
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;