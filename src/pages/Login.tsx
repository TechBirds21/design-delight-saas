import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const user = await login(data.email, data.password);
      
      // Navigate to role selection page
      if (user) {
        navigate('/select-role');
        toast.success(`Logged in as ${user.name}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to determine role from email
  const getRoleFromEmail = (email: string): string => {
    if (email.includes('doctor')) return 'Doctor';
    if (email.includes('reception')) return 'Receptionist';
    if (email.includes('technician')) return 'Technician';
    if (email.includes('admin')) return 'Admin';
    if (email.includes('super')) return 'Super Admin';
    return 'User';
  };

  // Demo login credentials
  const demoCredentials = [
    { role: 'Doctor', email: 'doctor@skinova.com', password: '123' },
    { role: 'Receptionist', email: 'reception@skinova.com', password: '123' },
    { role: 'Technician', email: 'technician@skinova.com', password: '123' },
    { role: 'Admin', email: 'admin@skinova.com', password: '123' },
    { role: 'Super Admin', email: 'super@hospverse.com', password: '123' }
  ];

  const handleDemoLogin = (email: string, password: string) => {
    const formData = { email, password };
    onSubmit(formData);
  };

  // Get subdomain from URL
  const host = window.location.host;
  const subdomain = host.split('.')[0];
  const isLocalhost = subdomain === 'localhost' || subdomain.includes('127.0.0.1');
  const tenantName = isLocalhost ? 'Hospverse' : subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to {tenantName}</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Login Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts (Click to login):</h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-between"
                  onClick={() => handleDemoLogin(cred.email, cred.password)}
                >
                  <span>{cred.role}</span>
                  <span className="text-xs text-gray-500">{cred.email}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-600">
              Sign up
            </Link>
          </div>
          <div className="text-xs text-center text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;