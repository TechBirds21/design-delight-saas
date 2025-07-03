import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  // LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminService from '@/services/admin.service';
import { toast } from 'sonner';

/* ----------------------------------------------------------------------- */
/* ----------------------------- TYPE DEFS -------------------------------- */
/* ----------------------------------------------------------------------- */
// type LucideIcon = React.ElementType<{ size?: number; className?: string }>;

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: { value: string; trend: 'up' | 'down' };
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  subtitle?: string;
}

interface Metrics {
  revenueToday: number;
  totalAppointments: number;
  activeStaff: number;
  lowInventory: number;
  revenueChange?: number;
  appointmentsChange?: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  patients: number;
  appointments: number;
}

interface AppointmentType {
  name: string;
  value: number;
  color: string;
}

interface WeeklyPatient {
  day: string;
  patients: number;
}

interface ActivityFeed {
  id: number;
  action: string;
  user: string;
  time: string;
  type: string;
}

interface UpcomingAppointment {
  id: number;
  patient: string;
  doctor: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'urgent';
}

/* ----------------------------------------------------------------------- */
/* ---------------------------- COMPONENTS -------------------------------- */
/* ----------------------------------------------------------------------- */
const colorMap = {
  blue: {
    border: 'border-l-blue-500',
    bgIcon: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  green: {
    border: 'border-l-green-500',
    bgIcon: 'bg-green-50',
    icon: 'text-green-600',
  },
  purple: {
    border: 'border-l-purple-500',
    bgIcon: 'bg-purple-50',
    icon: 'text-purple-600',
  },
  orange: {
    border: 'border-l-orange-500',
    bgIcon: 'bg-orange-50',
    icon: 'text-orange-600',
  },
} as const;

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  subtitle,
}) => {
  const classes = colorMap[color];
  return (
    <Card className={clsx('transition-shadow hover:shadow-lg', classes.border)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {change && (
              <div className="flex items-center mt-1 text-sm">
                {change.trend === 'up' ? (
                  <ArrowUpRight size={16} className="text-green-600 mr-1" />
                ) : (
                  <ArrowDownRight size={16} className="text-red-600 mr-1" />
                )}
                <span
                  className={clsx(
                    change.trend === 'up' ? 'text-green-600' : 'text-red-600',
                    'font-medium',
                  )}
                >
                  {change.value}
                </span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            )}
          </div>

          <div
            className={clsx(
              'p-4 rounded-xl flex items-center justify-center',
              classes.bgIcon,
            )}
          >
            <Icon size={28} className={classes.icon} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ----------------------------------------------------------------------- */
/* ------------------------------ MAIN UI -------------------------------- */
/* ----------------------------------------------------------------------- */
const Dashboard: React.FC = () => {
  /* ------------------------ state ------------------------ */
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<Metrics>({
    revenueToday: 0,
    totalAppointments: 0,
    activeStaff: 0,
    lowInventory: 0,
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyData[]>([]);
  const [revenueChange, setRevenueChange] = useState('+0%');
  const [appointmentsChange, setAppointmentsChange] = useState('+0%');

  /* --------------------- lifecycle ----------------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const m = await AdminService.getAdminMetrics();
        const rev = await AdminService.getRevenueReport();

        setMetrics(m);
        setMonthlyRevenue(
          rev.map((r: any) => ({
            month: new Date(r.date).toLocaleDateString('en-US', {
              month: 'short',
            }),
            revenue: r.revenue,
            patients: r.patients ?? 0,
            appointments: r.appointments ?? 0,
          })),
        );
        setRevenueChange(
          `${m.revenueChange > 0 ? '+' : ''}${m.revenueChange ?? 0}%`,
        );
        setAppointmentsChange(
          `${m.appointmentsChange > 0 ? '+' : ''}${m.appointmentsChange ?? 0}%`,
        );
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard – showing demo data');
        /* --- fallback demo data --- */
        setMetrics({
          revenueToday: 12850,
          totalAppointments: 42,
          activeStaff: 15,
          lowInventory: 3,
        });
        setMonthlyRevenue([
          { month: 'Jan', revenue: 45000, patients: 120, appointments: 150 },
          { month: 'Feb', revenue: 52000, patients: 135, appointments: 165 },
          { month: 'Mar', revenue: 48000, patients: 128, appointments: 158 },
          { month: 'Apr', revenue: 61000, patients: 142, appointments: 175 },
          { month: 'May', revenue: 55000, patients: 138, appointments: 168 },
          { month: 'Jun', revenue: 67000, patients: 155, appointments: 190 },
        ]);
        setRevenueChange('+12%');
        setAppointmentsChange('+8%');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* -------------------- loading skeleton ----------------- */
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-1/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  /* -------------------- static demo sets ----------------- */
  const appointmentTypes: AppointmentType[] = [
    { name: 'Consultation', value: 45, color: '#3B82F6' },
    { name: 'Follow-up', value: 25, color: '#10B981' },
    { name: 'Emergency', value: 15, color: '#F59E0B' },
    { name: 'Specialist', value: 15, color: '#8B5CF6' },
  ];

  const weeklyPatients: WeeklyPatient[] = [
    { day: 'Mon', patients: 32 },
    { day: 'Tue', patients: 28 },
    { day: 'Wed', patients: 45 },
    { day: 'Thu', patients: 38 },
    { day: 'Fri', patients: 52 },
    { day: 'Sat', patients: 35 },
    { day: 'Sun', patients: 18 },
  ];

  const recentActivities: ActivityFeed[] = [
    { id: 1, action: 'New patient registered', user: 'Dr. Singh', time: '5 m', type: 'patient' },
    { id: 2, action: 'Appointment scheduled', user: 'Reception', time: '12 m', type: 'appointment' },
    { id: 3, action: 'Record updated', user: 'Dr. Khan', time: '25 m', type: 'record' },
    { id: 4, action: 'Prescription issued', user: 'Dr. Khan', time: '1 h', type: 'prescription' },
    { id: 5, action: 'Payment received', user: 'Cashier', time: '2 h', type: 'payment' },
  ];

  const upcomingAppointments: UpcomingAppointment[] = [
    { id: 1, patient: 'John Doe', doctor: 'Dr. Singh', time: '10:00', type: 'Consult', status: 'confirmed' },
    { id: 2, patient: 'Jane Wilson', doctor: 'Dr. Patel', time: '11:30', type: 'Follow-up', status: 'pending' },
    { id: 3, patient: 'Mike Brown', doctor: 'Dr. Khan', time: '14:00', type: 'Emergency', status: 'urgent' },
  ];

  /* --------------------------- UI ------------------------ */
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here&rsquo;s what&rsquo;s happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Eye size={16} className="mr-2" />
            View Reports
          </Button>
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            Quick Actions
          </Button>
        </div>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={metrics.totalAppointments}
          subtitle={`${Math.round(metrics.totalAppointments * 0.2)} new patients`}
          change={{
            value: appointmentsChange,
            trend: appointmentsChange.startsWith('+') ? 'up' : 'down',
          }}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Revenue Today"
          value={`$${metrics.revenueToday.toLocaleString()}`}
          subtitle={`$${Math.round(metrics.revenueToday * 0.3).toLocaleString()} pending`}
          change={{
            value: revenueChange,
            trend: revenueChange.startsWith('+') ? 'up' : 'down',
          }}
          icon={DollarSign}
          color="purple"
        />
        <StatsCard
          title="Active Staff"
          value={metrics.activeStaff}
          change={{ value: '-5%', trend: 'down' }}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Low Stock Items"
          value={metrics.lowInventory}
          icon={Activity}
          color="orange"
        />
      </section>

      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <TrendingUp size={20} />
                <span>Monthly Revenue &amp; Patients</span>
              </span>
              <Button variant="outline" size="sm">
                Detail
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(v: number, n: string) =>
                    n === 'revenue' ? [`$${v.toLocaleString()}`, 'Revenue'] : [v, 'Patients']
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="url(#revenueGradient)"
                />
                <Line type="monotone" dataKey="patients" stroke="#10B981" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users size={20} />
              <span>Weekly Patient Flow</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyPatients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="patients" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      {/* BOTTOM ROW */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Appointment Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={appointmentTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {appointmentTypes.map((t, i) => (
                    <Cell key={i} fill={t.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {appointmentTypes.map(t => (
              <div key={t.name} className="flex items-center justify-between text-sm mt-1">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                  <span>{t.name}</span>
                </span>
                <span className="font-medium">{t.value}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock size={20} />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {recentActivities.map(a => (
              <div key={a.id} className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-gray-500">by {a.user}</p>
                </div>
                <span className="text-xs text-gray-400">{a.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Today's Schedule</span>
              </span>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map(appt => (
              <div
                key={appt.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{appt.patient}</p>
                  <p className="text-xs text-gray-500">
                    {appt.doctor} • {appt.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{appt.time}</p>
                  <Badge
                    variant={
                      appt.status === 'confirmed'
                        ? 'default'
                        : appt.status === 'urgent'
                        ? 'destructive'
                        : 'secondary'
                    }
                    className="text-xs capitalize"
                  >
                    {appt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
