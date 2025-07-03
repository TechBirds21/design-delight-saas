import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Server,
  DollarSign,
  // Clock,
  Plus,
  Settings,
  Shield,
  Globe,
  Zap
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  // Legend
} from 'recharts';

// Mock data for SaaS metrics
const revenueData = [
  { month: 'Jan', revenue: 45000, growth: 12 },
  { month: 'Feb', revenue: 52000, growth: 15 },
  { month: 'Mar', revenue: 49000, growth: 8 },
  { month: 'Apr', revenue: 61000, growth: 24 },
  { month: 'May', revenue: 58000, growth: 18 },
  { month: 'Jun', revenue: 67000, growth: 28 }
];

const clientGrowthData = [
  { month: 'Jan', new: 8, churned: 2, net: 6 },
  { month: 'Feb', new: 12, churned: 1, net: 11 },
  { month: 'Mar', new: 15, churned: 3, net: 12 },
  { month: 'Apr', new: 18, churned: 2, net: 16 },
  { month: 'May', new: 22, churned: 4, net: 18 },
  { month: 'Jun', new: 25, churned: 3, net: 22 }
];

const planDistribution = [
  { name: 'Starter', value: 35, color: '#3b82f6' },
  { name: 'Professional', value: 45, color: '#10b981' },
  { name: 'Enterprise', value: 20, color: '#f59e0b' }
];

const topClients = [
  { name: 'SkinClinic Pro', plan: 'Enterprise', revenue: 2400, growth: 15, status: 'active' },
  { name: 'BeautyMed Center', plan: 'Professional', revenue: 1800, growth: 22, status: 'active' },
  { name: 'DermaCare Solutions', plan: 'Professional', revenue: 1200, growth: -5, status: 'trial' },
  { name: 'LaserTech Clinic', plan: 'Starter', revenue: 600, growth: 8, status: 'active' }
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon: any;
  gradient: string;
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  gradient,
  description
}) => (
  <Card className="relative overflow-hidden glass hover-lift">
    <div className={`absolute inset-0 opacity-5 ${gradient}`}></div>
    <CardContent className="relative p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold font-heading text-gradient-primary">{value}</h3>
          {change && (
            <div className="flex items-center space-x-1">
              <span
                className={`text-sm font-medium ${
                  change.positive ? 'text-success' : 'text-destructive'
                }`}
              >
                {change.positive ? '↗' : '↘'} {change.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${gradient} shadow-glow`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-hero min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-bold text-gradient-primary">
            SaaS Platform Control
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage all Hospverse clients, monitor performance, and drive growth
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild className="glass">
            <Link to="/super-admin/logs">
              <Activity className="mr-2 h-4 w-4" />
              System Health
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary text-white shadow-glow">
            <Link to="/super-admin/clients/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value="$67,000"
          change={{ value: '28%', positive: true }}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          description="Monthly recurring revenue"
        />
        <MetricCard
          title="Active Clients"
          value="156"
          change={{ value: '22%', positive: true }}
          icon={Building2}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          description="Paying subscriptions"
        />
        <MetricCard
          title="Platform Users"
          value="2,847"
          change={{ value: '18%', positive: true }}
          icon={Users}
          gradient="bg-gradient-to-br from-purple-500 to-violet-600"
          description="Total active users"
        />
        <MetricCard
          title="System Uptime"
          value="99.97%"
          change={{ value: '0.02%', positive: true }}
          icon={Shield}
          gradient="bg-gradient-to-br from-orange-500 to-amber-600"
          description="Last 30 days"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span>Revenue Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#revenueGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Client Growth */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Client Acquisition</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="new" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churned" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-indigo-500" />
              <span>Subscription Plans</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <span>Top Performing Clients</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/super-admin/clients">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-4 glass rounded-lg hover-lift">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{client.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {client.plan}
                          </Badge>
                          <span>${client.revenue}/mo</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        client.growth > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {client.growth > 0 ? '+' : ''}{client.growth}%
                      </div>
                      <Badge 
                        variant={client.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Add Client', icon: Plus, href: '/super-admin/clients/new', color: 'bg-blue-500' },
              { label: 'System Logs', icon: Server, href: '/super-admin/logs', color: 'bg-green-500' },
              { label: 'Support Tickets', icon: AlertTriangle, href: '/super-admin/support', color: 'bg-orange-500' },
              { label: 'Analytics', icon: TrendingUp, href: '/super-admin/analytics', color: 'bg-purple-500' },
              { label: 'Settings', icon: Settings, href: '/super-admin/settings', color: 'bg-gray-500' },
              { label: 'Security', icon: Shield, href: '/super-admin/security', color: 'bg-red-500' }
            ].map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className="flex flex-col items-center p-4 glass rounded-lg hover-lift transition-all group"
              >
                <div className={`p-3 rounded-lg ${action.color} mb-2 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;