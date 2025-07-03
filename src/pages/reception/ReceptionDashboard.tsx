// ReceptionDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Plus,
  Search,
  UserPlus,
  ClipboardList,
  FileText,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ReceptionService from '@/services/reception.service';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  time: string;
  status: 'confirmed' | 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency' | 'specialist';
}

interface ReceptionStats {
  todayAppointments: number;
  walkInsRegistered: number;
  patientsInQueue: number;
  completedAppointments: number;
}

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

const ReceptionDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<ReceptionStats>({
    todayAppointments: 0,
    walkInsRegistered: 0,
    patientsInQueue: 0,
    completedAppointments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [apps, st] = await Promise.all([
        ReceptionService.getTodayAppointments(),
        ReceptionService.getReceptionStats()
      ]);
      setAppointments(apps);
      setStats(st);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load reception data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(a => {
    const matchText =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchText && matchStatus;
  });

  const statusStyles: Record<Appointment['status'], string> = {
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'in-progress': 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };

  const statusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':    return <CheckCircle size={16} className="text-blue-600" />;
      case 'waiting':      return <ClockIcon size={16} className="text-yellow-600" />;
      case 'in-progress':  return <AlertCircle size={16} className="text-green-600" />;
      case 'completed':    return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled':    return <XCircle size={16} className="text-red-600" />;
    }
  };

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, href }) => {
    const colorMap: Record<typeof color, string> = {
      blue:   'bg-blue-50 text-blue-600',
      green:  'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };
    const containerBg = colorMap[color];

    const content = (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
          <div className={`p-4 rounded-xl ${containerBg}`}>
            <Icon size={28} />
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link to={href}>{content}</Link> : content;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reception Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage front desk operations and patient flow</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <ClockIcon size={16} className="mr-2" /> Refresh
          </Button>
          <Button asChild size="sm">
            <Link to="/reception/patient-register">
              <UserPlus size={16} className="mr-2" /> Register Patient
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          subtitle={`${stats.completedAppointments} completed`}
          icon={CalendarIcon}
          color="blue"
          href="/reception/appointments"
        />
        <StatsCard
          title="Walk-ins Registered"
          value={stats.walkInsRegistered}
          subtitle="Today"
          icon={UserPlus}
          color="green"
          href="/reception/patient-register"
        />
        <StatsCard
          title="Patients in Queue"
          value={stats.patientsInQueue}
          subtitle="Waiting now"
          icon={Users}
          color="purple"
          href="/reception/queue"
        />
        <StatsCard
          title="Consent Forms"
          value={0 /* dynamically fetch if needed */}
          subtitle="Pending signatures"
          icon={FileText}
          color="orange"
          href="/reception/consent-form"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/reception/patient-register">
                <UserPlus size={24} className="mb-2" /> Register Patient
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/reception/appointments">
                <CalendarIcon size={24} className="mb-2" /> Book Appointment
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/reception/queue">
                <ClipboardList size={24} className="mb-2" /> Manage Queue
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/reception/consent-form">
                <FileText size={24} className="mb-2" /> Consent Forms
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon size={20} /> <span>Today's Appointments</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search patients or doctors..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'No appointments scheduled for today.'}
              </p>
              <Button asChild>
                <Link to="/reception/appointments">
                  <Plus size={16} className="mr-2" /> Book Appointment
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(app => (
                    <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 flex items-center space-x-2">
                        <ClockIcon className="text-gray-400" /> <span>{app.time}</span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium">{app.patientName}</p>
                        <p className="text-sm text-gray-500">{app.patientPhone}</p>
                      </td>
                      <td className="py-4 px-4">{app.doctorName}</td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="capitalize">
                          {app.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 flex items-center space-x-2">
                        {statusIcon(app.status)}
                        <Badge variant="outline" className={`capitalize ${statusStyles[app.status]}`}>
                          {app.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="mr-1" /> View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit size={14} className="mr-1" /> Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceptionDashboard;
