import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users2, 
  CalendarDays, 
  Clock,
  UserPlus,
  FileCheck,
  DollarSign,
  Building,
  UserCog,
  Download,
  CheckCircle,
  AlertTriangle,
  Cake,
  Calendar
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { Link } from 'react-router-dom';
import HRService from '@/services/hr.service';
import { toast } from 'sonner';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface HRStats {
  totalEmployees: number;
  onDutyToday: number;
  offToday: number;
  pendingLeaveRequests: number;
  upcomingProbations: number;
  upcomingRenewals: number;
  departmentCounts: Record<string, number>;
  leaveRequests: any[];
  upcomingBirthdays: any[];
  workAnniversaries: any[];
}

const HRDashboard: React.FC = () => {
  const [stats, setStats] = useState<HRStats>({
    totalEmployees: 0,
    onDutyToday: 0,
    offToday: 0,
    pendingLeaveRequests: 0,
    upcomingProbations: 0,
    upcomingRenewals: 0,
    departmentCounts: {},
    leaveRequests: [],
    upcomingBirthdays: [],
    workAnniversaries: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHRStats();
  }, []);

  const loadHRStats = async () => {
    try {
      setLoading(true);
      const hrStats = await HRService.getHRStats();
      
      // Mock additional data for the dashboard
      const mockStats: HRStats = {
        totalEmployees: hrStats.totalStaff,
        onDutyToday: hrStats.totalStaff - hrStats.onLeaveToday,
        offToday: hrStats.onLeaveToday,
        pendingLeaveRequests: 8,
        upcomingProbations: 3,
        upcomingRenewals: 5,
        departmentCounts: hrStats.departmentCounts,
        leaveRequests: [
          { name: 'Sarah Johnson', type: 'Annual Leave', days: 3, date: '2025-01-15' },
          { name: 'Mike Chen', type: 'Sick Leave', days: 1, date: '2025-01-16' },
          { name: 'Lisa Park', type: 'Personal Leave', days: 2, date: '2025-01-18' }
        ],
        upcomingBirthdays: [
          { name: 'John Smith', department: 'IT', date: '2025-01-10' },
          { name: 'Emma Wilson', department: 'HR', date: '2025-01-12' },
          { name: 'David Brown', department: 'Finance', date: '2025-01-15' }
        ],
        workAnniversaries: [
          { name: 'Alex Rodriguez', years: 5, date: '2025-01-08' },
          { name: 'Maria Garcia', years: 3, date: '2025-01-20' }
        ]
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Error loading HR stats:', error);
      toast.error('Failed to load HR statistics');
    } finally {
      setLoading(false);
    }
  };

  // Mock leave trend data
  const leaveTrendData = [
    { day: 'Mon', leaves: 2 },
    { day: 'Tue', leaves: 4 },
    { day: 'Wed', leaves: 1 },
    { day: 'Thu', leaves: 6 },
    { day: 'Fri', leaves: 8 },
    { day: 'Sat', leaves: 0 },
    { day: 'Sun', leaves: 0 }
  ];

  // Department data for pie chart
  const departmentData = Object.entries(stats.departmentCounts).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const StatsCard = ({ title, value, subtitle, icon: Icon, color, href, trend }: any) => {
    const colorClasses: Record<string, string> = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      orange: 'text-orange-600 bg-orange-50 border-orange-200',
      red: 'text-red-600 bg-red-50 border-red-200'
    };

    const cardContent = (
      <Card className="hover:shadow-lg transition-all duration-200 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-foreground">{value}</p>
                {trend && (
                  <span className={`text-xs px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link to={href} className="block">{cardContent}</Link> : cardContent;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">HR Dashboard</h1>
            <p className="text-muted-foreground">Complete human resources management</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={loadHRStats}>
              <Clock size={16} className="mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            subtitle="Active workforce"
            icon={Users2}
            color="blue"
            href="/hr/employees"
            trend={2.5}
          />
          <StatsCard
            title="On Duty Today"
            value={stats.onDutyToday}
            subtitle="Present employees"
            icon={CheckCircle}
            color="green"
            href="/hr/attendance"
          />
          <StatsCard
            title="Pending Leave Requests"
            value={stats.pendingLeaveRequests}
            subtitle="Awaiting approval"
            icon={CalendarDays}
            color="orange"
            href="/hr/leaves"
          />
          <StatsCard
            title="Upcoming Reviews"
            value={stats.upcomingProbations + stats.upcomingRenewals}
            subtitle="Probations & renewals"
            icon={UserCog}
            color="purple"
            href="/hr/reviews"
          />
        </div>

        {/* Quick Actions */}
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild className="h-16 flex flex-col space-y-2">
                <Link to="/hr/employees/new">
                  <UserPlus size={20} />
                  <span className="text-sm">Add Employee</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex flex-col space-y-2">
                <Link to="/hr/leaves">
                  <FileCheck size={20} />
                  <span className="text-sm">Approve Leave</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex flex-col space-y-2">
                <Link to="/hr/payroll">
                  <DollarSign size={20} />
                  <span className="text-sm">Run Payroll</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 flex flex-col space-y-2">
                <Link to="/hr/reports">
                  <Download size={20} />
                  <span className="text-sm">HR Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Distribution */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building size={20} />
                <span>Department Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Leave Trend */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarDays size={20} />
                <span>Leave Trend (Last 7 Days)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leaveTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="leaves" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Events & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Birthdays */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cake size={20} />
                <span>Upcoming Birthdays</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.upcomingBirthdays.map((birthday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{birthday.name}</p>
                      <p className="text-xs text-muted-foreground">{birthday.department}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{birthday.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Work Anniversaries */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar size={20} />
                <span>Work Anniversaries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.workAnniversaries.map((anniversary, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{anniversary.name}</p>
                      <p className="text-xs text-muted-foreground">{anniversary.years} years</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{anniversary.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leave Requests */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle size={20} />
                <span>Recent Leave Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.leaveRequests.map((request, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{request.name}</p>
                      <p className="text-xs text-muted-foreground">{request.type} - {request.days} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{request.date}</p>
                      <Button size="sm" variant="outline" className="mt-1 h-6 text-xs">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default HRDashboard;