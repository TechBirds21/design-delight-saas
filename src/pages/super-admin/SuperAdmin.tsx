// src/pages/SuperAdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Users,
  Activity,
  AlertTriangle,
  Ticket,
  FileText,
  DollarSign,
  Clock,
  ExternalLink,
  Server,
  Plus,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import SuperAdminService from '@/services/super-admin.service';
import type {
  SuperAdminStats,
  SystemLog,
  SupportTicket
} from '@/api/super-admin';
import { toast } from 'sonner';

// Mock data for API usage & active users charts
const apiUsageMock = [
  { name: 'SkinClinic Pro', value: 12500 },
  { name: 'BeautyMed Center', value: 8200 },
  { name: 'DermaCare Solutions', value: 24800 },
  { name: 'LaserTech Clinic', value: 3200 }
];
// const activeUsersMock = [...];
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon: any;
  color: string;
}

const MetricCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color
}) => (
  <Card className="overflow-hidden">
    <div className={`h-1 ${color}`} />
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <div className="flex items-center mt-1">
              <span
                className={`text-xs font-medium ${
                  change.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.positive ? '↑' : '↓'} {change.value}
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={`p-3 rounded-full ${color
            .replace('bg-', 'bg-opacity-20 text-')
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// const getStatusColor = (status: string) => {...};
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[priority] ?? colors.medium;
};

const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SuperAdminStats>({
    totalClinics: 0,
    activeSubscriptions: 0,
    apiHitsToday: 0,
    inactiveTrialClinics: 0,
    revenueThisMonth: 0,
    totalUsers: 0,
    openSupportTickets: 0
  });
  const [recentAlerts, setRecentAlerts] = useState<SystemLog[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [planDist, setPlanDist] = useState<{ name: string; value: number }[]>(
    []
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [statsData, alertsData, ticketsData, clinics] =
          await Promise.all([
            SuperAdminService.getSuperAdminStats(),
            SuperAdminService.getSystemLogs({ type: 'error' }),
            SuperAdminService.getSupportTickets('open'),
            SuperAdminService.getAllClients()
          ]);
        setStats(statsData);
        setRecentAlerts(alertsData.slice(0, 5));
        setSupportTickets(ticketsData.slice(0, 5));
        // build plan distribution
        const counts = clinics.reduce<Record<string, number>>((acc, c) => {
          acc[c.plan] = (acc[c.plan] ?? 0) + 1;
          return acc;
        }, {});
        setPlanDist(
          Object.entries(counts).map(([name, value]) => ({ name, value }))
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <p>Loading Super Admin Dashboard…</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage all Hospverse SaaS clients and system operations
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/super-admin/logs">
              <FileText size={16} className="mr-2" />
              System Logs
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/super-admin/clients">
              <Building size={16} className="mr-2" />
              View Clients
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Clinics"
          value={stats.totalClinics}
          change={{ value: '+2', positive: true }}
          icon={Building}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          change={{ value: '+1', positive: true }}
          icon={Users}
          color="bg-green-500"
        />
        <MetricCard
          title="API Hits Today"
          value={stats.apiHitsToday.toLocaleString()}
          icon={Activity}
          color="bg-purple-500"
        />
        <MetricCard
          title="Inactive/Trial Clinics"
          value={stats.inactiveTrialClinics}
          change={{ value: '-1', positive: false }}
          icon={AlertTriangle}
          color="bg-orange-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Usage */}
        <Card>
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Activity size={18} className="mr-2 text-purple-500" />
              API Usage by Clinic
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/super-admin/logs">
                <ExternalLink size={14} className="mr-1" />
                View Logs
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={apiUsageMock} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickMargin={10} />
                <YAxis tick={{ fontSize: 12 }} tickMargin={10} />
                <Tooltip formatter={value => [`${(value as number).toLocaleString()} requests`, 'API Hits']} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Activity size={18} className="mr-2 text-indigo-500" />
              Subscription Plan Distribution
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/super-admin/clients">
                <ExternalLink size={14} className="mr-1" />
                View Clients
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="h-80">
            {planDist.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={planDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {planDist.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </RePieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-16 text-gray-500">
                No subscription data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Support Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <AlertTriangle size={18} className="mr-2 text-red-500" />
              Recent Alerts
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/super-admin/logs">
                <ExternalLink size={14} className="mr-1" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 max-h-80 overflow-y-auto">
            {recentAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle size={36} className="mx-auto mb-2" />
                No alerts found
              </div>
            ) : (
              recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="p-2 rounded-full bg-red-100 text-red-600">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900">{alert.action}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{alert.details}</p>
                    {alert.clinicName && (
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Building size={12} className="mr-1" />
                        {alert.clinicName}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Support Tickets */}
        <Card>
          <CardHeader className="pb-2 flex justify-between items-center">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Ticket size={18} className="mr-2 text-orange-500" />
              Support Tickets
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/super-admin/support">
                <ExternalLink size={14} className="mr-1" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 max-h-80 overflow-y-auto">
            {supportTickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Ticket size={36} className="mx-auto mb-2" />
                No open tickets
              </div>
            ) : (
              supportTickets.map(ticket => (
                <div
                  key={ticket.id}
                  className="flex justify-between items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Building size={12} className="mr-1" />
                        {ticket.clinicName}
                      </div>
                      <div className="flex items-center">
                        <Clock size={12} className="mr-1" />
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize ${getPriorityColor(ticket.priority)}`}
                  >
                    {ticket.priority}
                  </Badge>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/super-admin/support/${ticket.id}`}>
                      <ExternalLink size={14} />
                    </Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { to: '/super-admin/clients', icon: Building, label: 'Clients' },
              { to: '/super-admin/logs', icon: Server, label: 'Logs' },
              { to: '/super-admin/support', icon: Ticket, label: 'Support' },
              { to: '/super-admin/clients/new', icon: Plus, label: 'Add Client' },
              { to: '/dashboard/billing', icon: DollarSign, label: 'Billing' },
              { to: '/dashboard/security', icon: ShieldAlert, label: 'Security' }
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center p-4 rounded-lg border hover:shadow transition"
              >
                <div className="p-3 rounded-full bg-gray-200 mb-2">
                  <Icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign size={18} className="text-green-500" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.revenueThisMonth.toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-green-600">↑ 8.5%</span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Avg. Revenue/Clinic</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {stats.totalClinics > 0
                  ? Math.round(stats.revenueThisMonth / stats.totalClinics).toLocaleString()
                  : 0}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-blue-600">↑ 3.2%</span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Projected Annual Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(stats.revenueThisMonth * 12).toLocaleString()}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-purple-600">↑ 12.4%</span>
                <span className="text-xs text-gray-500 ml-1">vs last year</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;
