import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Stethoscope, Users, Calendar, CheckCircle, Clock,
  Search, Filter, Eye, Play, FileText, Plus, Download
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import DoctorService, { AppointmentFilters, Appointment, DoctorStats } from '@/services/doctor.service';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href?: string;
}

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DoctorStats>({
    todayAppointments: 0,
    assignedPatients: 0,
    completedSessions: 0,
    totalTreatments: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all');
  const [loading, setLoading] = useState(true);

  // Load both stats & appointments
  const loadData = async () => {
    try {
      setLoading(true);
      const [ appts, s ] = await Promise.all([
        DoctorService.getDoctorAppointments({
          search: searchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        DoctorService.getDoctorStats()
      ]);
      setAppointments(appts);
      setStats(s);
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Only reload appointments when filters change
  const loadAppointments = async () => {
    try {
      const appts = await DoctorService.getDoctorAppointments({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setAppointments(appts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadAppointments(); }, [searchTerm, statusFilter]);

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    try {
      await DoctorService.updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments();
      toast.success(`Appointment ${newStatus.replace('-', ' ')}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  // CSV export handler
  const handleExportCSV = async () => {
    try {
      const filters: AppointmentFilters = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      const blob = await DoctorService.exportAppointments(filters);
      const url = URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      // dynamic file name for this page:
      a.download = `doctor_appointments_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Appointments CSV downloaded');
    } catch {
      toast.error('Failed to export CSV');
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    const map = {
      scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return map[status];
  };
  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':    return <Clock size={16} className="text-blue-600" />;
      case 'in-progress':  return <Play size={16} className="text-green-600" />;
      case 'completed':    return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled':    return <CheckCircle size={16} className="text-red-600" />;
    }
  };

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, href }) => {
    const cls = {
      blue:  'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      purple:'text-purple-600 bg-purple-50',
      orange:'text-orange-600 bg-orange-50'
    }[color];
    const content = (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${cls}`}>
              <Icon size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
    return href ? <Link to={href}>{content}</Link> : content;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_,i) => <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage patient care & sessions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <Clock className="mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2" /> Export CSV
          </Button>
          <Button asChild size="sm">
            <Link to="/doctor/treatment-history">
              <FileText className="mr-2" /> History
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          subtitle="Scheduled for today"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Assigned Patients"
          value={stats.assignedPatients}
          subtitle="Under your care"
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Completed Sessions"
          value={stats.completedSessions}
          subtitle="Today"
          icon={CheckCircle}
          color="purple"
        />
        <StatsCard
          title="Total Treatments"
          value={stats.totalTreatments}
          subtitle="All time"
          icon={Stethoscope}
          color="orange"
        />
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>Today's Appointments</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search patients..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No appointments</h3>
              <Button asChild>
                <Link to="/appointments">
                  <Plus className="mr-2" /> View Schedule
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left hidden sm:table-cell">Age</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left hidden md:table-cell">Notes</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400 hidden sm:block" />
                        <span className="font-medium">{a.time}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{a.patientName}</p>
                        <p className="text-xs text-gray-500 sm:hidden">{a.age}y</p>
                        <p className="text-xs text-gray-500 hidden sm:block">{a.phone}</p>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span>{a.age} yrs</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(a.status)}
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs ${getStatusColor(a.status)}`}
                          >
                            {a.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="truncate max-w-[200px]">{a.notes}</span>
                      </td>
                      <td className="py-3 px-4 flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/doctor/patient/${a.patientId}`}>
                            <Eye size={12} className="mr-1 hidden sm:inline" />
                            View
                          </Link>
                        </Button>
                        {a.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(a.id, 'in-progress')}
                          >
                            <Play size={12} className="mr-1 hidden sm:inline" />
                            Start
                          </Button>
                        )}
                        {a.status === 'in-progress' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(a.id, 'completed')}
                          >
                            <CheckCircle size={12} className="mr-1 hidden sm:inline" />
                            Complete
                          </Button>
                        )}
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

export default DoctorDashboard;
