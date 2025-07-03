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
  Search, Eye, Play, FileText, Plus, Download,
  Camera, Activity, TrendingUp, AlertCircle, Heart,
  UserCircle, Clipboard, Pill, Timer, ArrowRight
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
 } from '@/components/ui/select';
import { toast } from 'sonner';
import DoctorService from '@/services/doctor.service';
import Sidebar from '@/components/layout/Sidebar';
// Temporary types until proper API types are available
interface Appointment { 
  id: string; 
  patientName: string; 
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'; 
  time: string; 
  type: string; 
  age: number;
  phone: string;
  patientId: string;
  notes: string;
}
interface DoctorStats { 
  todayAppointments: number; 
  assignedPatients: number; 
  completedSessions: number; 
  totalTreatments: number; 
}
// Remove unused interface
// interface AppointmentFilters {
//   search?: string;
//   status?: string;
// }
// import DoctorService, { AppointmentFilters, Appointment, DoctorStats } from '@/services/doctor.service';

const DoctorDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats] = useState<DoctorStats>({
    todayAppointments: 12,
    assignedPatients: 45,
    completedSessions: 8,
    totalTreatments: 234
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Appointment['status']>('all');
  const [loading, setLoading] = useState(true);

  // Load both stats & appointments
  const loadData = async () => {
    try {
      setLoading(true);
      const [ appts ] = await Promise.all([
        DoctorService.getDoctorAppointments({
          search: searchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined
        }),
        // DoctorService.getDoctorStats() - using mock stats instead
      ]);
      setAppointments(appts as any);
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
      setAppointments(appts as any);
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
      // const filters: AppointmentFilters = {
      //   search: searchTerm || undefined,
      //   status: statusFilter !== 'all' ? statusFilter : undefined
      // };
      // const blob = await DoctorService.exportAppointments(filters);
      const url = URL.createObjectURL(new Blob(['mock csv data'], { type: 'text/csv' }));
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
    <div className="flex h-screen bg-gradient-hero">
      <Sidebar />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-heading font-bold text-gradient-primary">
                Doctor Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Comprehensive patient care management platform
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={loadData} className="glass">
                <Activity className="mr-2 h-4 w-4" /> 
                Refresh Data
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV} className="glass">
                <Download className="mr-2 h-4 w-4" /> 
                Export
              </Button>
              <Button asChild size="sm" className="bg-gradient-primary text-white shadow-glow">
                <Link to="/doctor/treatment-history">
                  <FileText className="mr-2 h-4 w-4" /> 
                  History
                </Link>
              </Button>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                    <h3 className="text-3xl font-bold font-heading text-gradient-primary">{stats.todayAppointments}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-success">↗ 12%</span>
                      <span className="text-xs text-muted-foreground">vs yesterday</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl shadow-glow">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                    <h3 className="text-3xl font-bold font-heading text-gradient-primary">{stats.assignedPatients}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-success">↗ 8%</span>
                      <span className="text-xs text-muted-foreground">vs last week</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-glow">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                    <h3 className="text-3xl font-bold font-heading text-gradient-primary">{stats.completedSessions}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-success">↗ 15%</span>
                      <span className="text-xs text-muted-foreground">efficiency</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-glow">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Treatments</p>
                    <h3 className="text-3xl font-bold font-heading text-gradient-primary">{stats.totalTreatments}</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-success">↗ 5%</span>
                      <span className="text-xs text-muted-foreground">this month</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl shadow-glow">
                    <Stethoscope className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'New Patient', icon: UserCircle, href: '/patients/new', color: 'bg-blue-500' },
                  { label: 'SOAP Notes', icon: Clipboard, href: '/doctor/soap/new', color: 'bg-green-500' },
                  { label: 'Treatment Photos', icon: Camera, href: '/photo-manager', color: 'bg-purple-500' },
                  { label: 'Prescriptions', icon: Pill, href: '/doctor/prescriptions', color: 'bg-orange-500' },
                  { label: 'Lab Results', icon: Activity, href: '/doctor/lab-results', color: 'bg-pink-500' },
                  { label: 'Schedule', icon: Timer, href: '/appointments', color: 'bg-indigo-500' }
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex flex-col items-center p-4 glass rounded-lg hover-lift transition-all group"
                  >
                    <div className={`p-3 rounded-lg ${action.color} mb-2 group-hover:scale-110 transition-transform shadow-glow`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <span>Today's Appointments</span>
                      <Badge variant="secondary" className="text-xs">
                        {appointments.length} total
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search patients..."
                          className="pl-10 w-64 bg-background/50"
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                        <SelectTrigger className="w-32 bg-background/50">
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
                      <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No appointments scheduled</h3>
                      <p className="text-muted-foreground mb-4">Your schedule is clear for today</p>
                      <Button asChild className="bg-gradient-primary text-white">
                        <Link to="/appointments">
                          <Plus className="mr-2 h-4 w-4" /> 
                          View Full Schedule
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {appointments.map(a => (
                        <div key={a.id} className="p-4 glass rounded-lg hover-lift transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{a.time}</span>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">{a.patientName}</h4>
                                <p className="text-sm text-muted-foreground">{a.age} years • {a.phone}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(a.status)}
                                <Badge
                                  variant="outline"
                                  className={`capitalize text-xs ${getStatusColor(a.status)}`}
                                >
                                  {a.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/doctor/patient/${a.patientId}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                                {a.status === 'scheduled' && (
                                  <Button
                                    size="sm"
                                    className="bg-gradient-primary text-white"
                                    onClick={() => handleStatusUpdate(a.id, 'in-progress')}
                                  >
                                    <Play className="mr-1 h-4 w-4" />
                                    Start
                                  </Button>
                                )}
                                {a.status === 'in-progress' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(a.id, 'completed')}
                                  >
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          {a.notes && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-sm text-muted-foreground">{a.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* Recent Patients */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <span>Recent Patients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Sarah Johnson', time: '2 hours ago', condition: 'Acne Treatment', urgent: false },
                      { name: 'Michael Chen', time: '1 day ago', condition: 'Hair Loss', urgent: true },
                      { name: 'Emma Davis', time: '3 days ago', condition: 'Skin Checkup', urgent: false }
                    ].map((patient, index) => (
                      <div key={index} className="flex items-center justify-between p-3 glass rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {patient.urgent && (
                            <AlertCircle className="h-4 w-4 text-destructive mb-1" />
                          )}
                          <p className="text-xs text-muted-foreground">{patient.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link to="/patients">
                      View All Patients
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span>Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                      <span className="text-sm font-medium text-success">98%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Treatment Success</span>
                      <span className="text-sm font-medium text-success">95%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Response Time</span>
                      <span className="text-sm font-medium text-success">&lt; 5 min</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
