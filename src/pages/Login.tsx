import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter username'),
  password: z.string().min(1, 'Please enter password'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
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
      
      // Simple demo authentication - use abc/123 for any role
      if (data.email === 'abc' && data.password === '123') {
        // Create a mock user
        const mockUser = {
          id: `user-${Date.now()}`,
          name: 'Demo User',
          email: data.email,
          role: 'admin',
          client_id: 'client-123'
        };

        // Store tokens and user
        localStorage.setItem('token', 'demo_token');
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        // Navigate to role selection page  
        navigate('/select-role');
        toast.success('Login successful');
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
              <Label htmlFor="email">Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="abc"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="123"
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
                Try Demo Login
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
  );
};

export default Login;