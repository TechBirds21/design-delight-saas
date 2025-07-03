// src/pages/AdminDashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  Calendar,
  Users,
  Package,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Bell,
  FileText,
  Download,
  ExternalLink,
  Clock,
  Building,
  UserX
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { toast } from 'sonner';
import AdminService from '@/services/admin.service';

interface RevenueData {
  date: string;
  revenue: number;
}

const patientsByDepartment = [
  { department: 'Dermatology', patients: 145 },
  { department: 'Cosmetic',    patients: 120 },
  { department: 'Laser',       patients:  95 },
  { department: 'Hair',        patients:  75 },
  { department: 'Wellness',    patients:  60 },
];

const appointmentTypes = [
  { name: 'Consultation', value: 45, color: '#3B82F6' },
  { name: 'Treatment',    value: 35, color: '#10B981' },
  { name: 'Review',       value: 20, color: '#F59E0B' },
];

const alerts = [
  {
    id: 1,
    message: '5 patients missed their follow-up appointments today',
    time: '2 hours ago',
    icon: Calendar,
    color: 'text-orange-500 bg-orange-100'
  },
  {
    id: 2,
    message: 'Laser Gel stock is below minimum threshold (5 units remaining)',
    time: '4 hours ago',
    icon: Package,
    color: 'text-red-500 bg-red-100'
  },
  {
    id: 3,
    message: '3 staff members reported absent today',
    time: '6 hours ago',
    icon: UserX,
    color: 'text-blue-500 bg-blue-100'
  },
  {
    id: 4,
    message: '2 invoices are overdue for payment (total $1,250)',
    time: '1 day ago',
    icon: FileText,
    color: 'text-purple-500 bg-purple-100'
  },
];

const quickAccessItems = [
  { name: 'CRM',        icon: Users,      href: '/crm',      color: 'bg-blue-500' },
  { name: 'Billing',    icon: DollarSign, href: '/billing',  color: 'bg-green-500' },
  { name: 'Inventory',  icon: Package,    href: '/inventory',color: 'bg-orange-500' },
  { name: 'HR',         icon: Users,      href: '/hr',       color: 'bg-purple-500' },
  { name: 'Reports',    icon: FileText,   href: '/reports',  color: 'bg-pink-500' },
  { name: 'Settings',   icon: Building,   href: '/settings', color: 'bg-indigo-500' },
];

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [metrics, setMetrics] = useState({
    revenueToday:      0,
    totalAppointments: 0,
    activeStaff:       0,
    lowInventory:      0
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const m = await AdminService.getAdminMetrics();
      setMetrics(m);

      const report = await AdminService.getRevenueReport();
      setRevenueData(
        report.map(item => ({
          date:    new Date(item.date).toLocaleDateString('en-US',{ day:'2-digit', month:'2-digit' }),
          revenue: item.revenue
        }))
      );
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon: Icon, color }) => (
    <Card className="overflow-hidden">
      <div className={`h-1 ${color}`}></div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            {change && (
              <div className="flex items-center mt-1 text-xs">
                <span className={change.positive ? 'text-green-600' : 'text-red-600'}>
                  {change.positive ? '↑' : '↓'} {change.value}
                </span>
                <span className="ml-1 text-gray-500">vs yesterday</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color.replace('bg-', 'bg-opacity-20 text-')}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of clinic operations</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/reports"><ExternalLink size={16} /> Reports</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/logs"><Clock size={16} /> Logs</Link>
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue Today"
          value={`$${metrics.revenueToday.toLocaleString()}`}
          change={{ value: '12.5%', positive: true }}
          icon={DollarSign}
          color="bg-green-500"
        />
        <MetricCard
          title="Appointments"
          value={metrics.totalAppointments}
          change={{ value: '8.3%', positive: true }}
          icon={Calendar}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Staff"
          value={metrics.activeStaff}
          change={{ value: '2 on leave', positive: false }}
          icon={Users}
          color="bg-purple-500"
        />
        <MetricCard
          title="Low Inventory"
          value={metrics.lowInventory}
          change={{ value: '3 critical', positive: false }}
          icon={Package}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 text-blue-500" /> Revenue (30 days)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast.success('Exported')}>
              <Download className="mr-1" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer>
                <LineChart data={revenueData} margin={{ top:20, right:30, left:20, bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize:12 }} />
                  <YAxis tickFormatter={v => `$${v}`} tick={{ fontSize:12 }} />
                  <Tooltip formatter={v => [`$${v}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r:6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Patients by Department */}
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="mr-2 text-purple-500" /> Patients by Dept
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => toast.success('Exported')}>
              <Download className="mr-1" /> Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={patientsByDepartment} margin={{ top:20, right:30, left:20, bottom:20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="department" tick={{ fontSize:12 }} />
                  <YAxis tick={{ fontSize:12 }} />
                  <Tooltip formatter={v => [`${v}`, 'Patients']} />
                  <Bar dataKey="patients" fill="#8b5cf6" radius={[4,4,0,0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Types */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <PieChartIcon className="mr-2 text-orange-500" /> Appointment Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={appointmentTypes}
                    cx="50%" cy="50%"
                    innerRadius={60} outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {appointmentTypes.map((entry,i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => [`${v}%`, 'Percent']} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <Bell className="mr-2 text-red-500" /> Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {alerts.map(a => (
                <div key={a.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className={`p-2 rounded-full ${a.color}`}><a.icon size={16} /></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                  </div>
                  <Button variant="ghost" size="sm"><ExternalLink size={14} /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Quick Access</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {quickAccessItems.map(item => (
              <Link
                key={item.name}
                to={item.href}
                className="flex flex-col items-center p-4 bg-white border rounded-lg hover:shadow-md transition"
              >
                <div className={`${item.color} text-white p-3 rounded-full mb-2`}>
                  <item.icon size={20} />
                </div>
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
