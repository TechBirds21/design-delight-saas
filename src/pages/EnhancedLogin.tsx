import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Shield, Zap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const EnhancedLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      await login(data.email, data.password);
      navigate('/select-role');
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { 
      role: 'Super Admin', 
      email: 'super@hospverse.com', 
      password: '123',
      description: 'Platform administration & client management',
      color: 'bg-red-500'
    },
    { 
      role: 'Admin', 
      email: 'admin@skinova.com', 
      password: '123',
      description: 'Full clinic administration access',
      color: 'bg-blue-500'
    },
    { 
      role: 'Doctor', 
      email: 'doctor@skinova.com', 
      password: '123',
      description: 'Patient care & treatment management',
      color: 'bg-green-500'
    },
    { 
      role: 'Receptionist', 
      email: 'reception@skinova.com', 
      password: '123',
      description: 'Front desk & appointment management',
      color: 'bg-purple-500'
    },
    { 
      role: 'Technician', 
      email: 'technician@skinova.com', 
      password: '123',
      description: 'Treatment procedures & equipment',
      color: 'bg-orange-500'
    }
  ];

  const handleDemoLogin = (email: string, password: string) => {
    const formData = { email, password };
    onSubmit(formData);
  };

  const host = window.location.host;
  const subdomain = host.split('.')[0];
  const isLocalhost = subdomain === 'localhost' || subdomain.includes('127.0.0.1');
  const tenantName = isLocalhost ? 'Hospverse' : subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Panel - Branding & Features */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Logo & Title */}
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-gradient-primary">
                  {tenantName}
                </h1>
                <p className="text-sm text-muted-foreground">Healthcare Management Platform</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl lg:text-5xl font-heading font-bold text-foreground">
                Welcome to Your
                <span className="text-gradient-primary block">Healthcare SaaS</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0">
                Comprehensive multi-tenant platform for modern healthcare practices. 
                Role-based access, advanced analytics, and seamless operations.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "Secure", desc: "HIPAA Compliant" },
              { icon: Users, title: "Multi-Tenant", desc: "Role-Based Access" },
              { icon: Zap, title: "Real-time", desc: "Live Analytics" }
            ].map((feature, index) => (
              <div key={index} className="p-4 glass rounded-xl text-center hover-lift">
                <feature.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start space-x-8">
            {[
              { label: "Active Clinics", value: "500+" },
              { label: "Patients Served", value: "50K+" },
              { label: "Uptime", value: "99.9%" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold font-heading text-gradient-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="glass border-border/50 shadow-elegant">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-heading font-bold">Sign In</CardTitle>
              <CardDescription>
                Access your healthcare management dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@clinic.com"
                    className="bg-background/50"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="bg-background/50 pr-10"
                      {...register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary text-white border-0 shadow-glow hover-lift" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Demo Accounts */}
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Demo Accounts</h3>
                  <p className="text-xs text-muted-foreground">Click any role to login instantly</p>
                </div>
                
                <div className="space-y-2">
                  {demoCredentials.map((cred, index) => (
                    <Button 
                      key={index}
                      variant="outline" 
                      className="w-full justify-between p-4 h-auto glass hover:bg-primary/5 transition-all"
                      onClick={() => handleDemoLogin(cred.email, cred.password)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${cred.color}`}></div>
                        <div className="text-left">
                          <div className="font-medium text-foreground">{cred.role}</div>
                          <div className="text-xs text-muted-foreground">{cred.description}</div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  Contact Sales
                </Link>
              </div>
              <div className="text-xs text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;