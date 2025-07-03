import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Calendar,
  DollarSign,
  Package,
  TrendingUp,
  // Clock,
  AlertTriangle,
  Activity,
  UserCheck,
  Stethoscope,
  Building,
  Settings
} from 'lucide-react';
import {
  ResponsiveContainer,
  // LineChart,
  Line,
  AreaChart,
  Area,
  // BarChart,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTenant } from '@/contexts/TenantContext';

// Mock data for clinic metrics
const revenueData = [
  { day: 'Mon', revenue: 2400, appointments: 12 },
  { day: 'Tue', revenue: 3200, appointments: 16 },
  { day: 'Wed', revenue: 2800, appointments: 14 },
  { day: 'Thu', revenue: 3600, appointments: 18 },
  { day: 'Fri', revenue: 4200, appointments: 22 },
  { day: 'Sat', revenue: 3800, appointments: 20 },
  { day: 'Sun', revenue: 1800, appointments: 8 }
];

const treatmentData = [
  { name: 'Laser Therapy', value: 35, color: '#3b82f6' },
  { name: 'Chemical Peels', value: 25, color: '#10b981' },
  { name: 'Botox', value: 20, color: '#f59e0b' },
  { name: 'Consultation', value: 20, color: '#8b5cf6' }
];

const staffPerformance = [
  { name: 'Dr. Sarah Johnson', role: 'Dermatologist', patients: 45, revenue: 12500, satisfaction: 98 },
  { name: 'Dr. Michael Chen', role: 'Cosmetic Surgeon', patients: 38, revenue: 15200, satisfaction: 96 },
  { name: 'Emily Davis', role: 'Nurse', patients: 62, revenue: 8500, satisfaction: 94 },
  { name: 'James Wilson', role: 'Technician', patients: 28, revenue: 6800, satisfaction: 92 }
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
              <span className="text-xs text-muted-foreground">vs last week</span>
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

const AdminDashboard: React.FC = () => {
  const { tenantName } = useTenant();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
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
            Clinic Administration
          </h1>
          <p className="text-muted-foreground text-lg">
            {tenantName} - Complete operational oversight and management
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild className="glass">
            <Link to="/admin/reports">
              <TrendingUp className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button asChild className="bg-gradient-primary text-white shadow-glow">
            <Link to="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Today's Revenue"
          value="$4,200"
          change={{ value: '18%', positive: true }}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          description="22 appointments completed"
        />
        <MetricCard
          title="Active Patients"
          value="1,247"
          change={{ value: '12%', positive: true }}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          description="Total in system"
        />
        <MetricCard
          title="Staff Members"
          value="24"
          change={{ value: '2', positive: true }}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-purple-500 to-violet-600"
          description="Active employees"
        />
        <MetricCard
          title="Satisfaction Rate"
          value="96.5%"
          change={{ value: '2.1%', positive: true }}
          icon={Activity}
          gradient="bg-gradient-to-br from-orange-500 to-amber-600"
          description="Patient feedback"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <span>Weekly Performance</span>
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
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'revenue' ? `$${value}` : value,
                      name === 'revenue' ? 'Revenue' : 'Appointments'
                    ]}
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
                    fill="url(#revenueGradient)" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="appointments" 
                    stroke="hsl(var(--secondary))" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Stethoscope className="h-5 w-5 text-blue-500" />
              <span>Treatment Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {treatmentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-purple-500" />
              <span>Staff Performance</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/hr">View HR Dashboard</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Staff Member</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Patients</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Satisfaction</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-semibold">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{staff.name}</h4>
                          <p className="text-sm text-muted-foreground">{staff.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{staff.patients}</div>
                      <div className="text-sm text-muted-foreground">This month</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">${staff.revenue.toLocaleString()}</div>
                      <div className="text-sm text-success">+12% vs last month</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={staff.satisfaction} className="w-16" />
                        <span className="text-sm font-medium">{staff.satisfaction}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/hr/staff/${staff.name.toLowerCase().replace(' ', '-')}`}>
                          View Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Access Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Alerts & Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { type: 'warning', message: 'Low inventory: Botox supplies', time: '5 min ago' },
              { type: 'info', message: 'New patient registration', time: '12 min ago' },
              { type: 'success', message: 'Payment received: $2,400', time: '1 hour ago' }
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.type === 'warning' ? 'bg-orange-500' :
                  alert.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Add Patient', icon: Users, href: '/patients/new', color: 'bg-blue-500' },
                  { label: 'Schedule', icon: Calendar, href: '/appointments', color: 'bg-green-500' },
                  { label: 'Inventory', icon: Package, href: '/inventory', color: 'bg-purple-500' },
                  { label: 'Billing', icon: DollarSign, href: '/billing', color: 'bg-orange-500' },
                  { label: 'Staff', icon: UserCheck, href: '/hr', color: 'bg-indigo-500' },
                  { label: 'Reports', icon: TrendingUp, href: '/reports', color: 'bg-pink-500' },
                  { label: 'Settings', icon: Settings, href: '/admin/settings', color: 'bg-gray-500' },
                  { label: 'Support', icon: Building, href: '/admin/support', color: 'bg-red-500' }
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
      </div>
    </div>
  );
};

export default AdminDashboard;