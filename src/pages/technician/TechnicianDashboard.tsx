import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Search, 
  Filter,
  Eye,
  Play,
  User,
  Stethoscope,
  Calendar,
  Plus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAssignedProcedures, getTechnicianStats } from '@/api/technician';
import { toast } from 'sonner';
import TechnicianService from '@/services/technician.service';

interface Procedure {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  procedure: string;
  duration: number;
  assignedBy: string;
  assignedById: number;
  scheduledTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  assignedAt: string;
  date: string;
  startTime?: string;
  endTime?: string;
  completionNotes?: string;
  actualDuration?: number;
}

interface TechnicianStats {
  assignedToday: number;
  completedSessions: number;
  missedDelayed: number;
  totalHistory: number;
}

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'red';
  href?: string;
}

const TechnicianDashboard: React.FC = () => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [stats, setStats] = useState<TechnicianStats>({
    assignedToday: 0,
    completedSessions: 0,
    missedDelayed: 0,
    totalHistory: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProcedures();
  }, [searchTerm, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [proceduresData, statsData] = await Promise.all([
        TechnicianService.getAssignedProcedures({ 
          search: searchTerm, 
          status: statusFilter !== 'all' ? statusFilter : undefined 
        }),
        TechnicianService.getTechnicianStats()
      ]);
      setProcedures(proceduresData);
      setStats(statsData);
    } catch (error) {
      toast.error('Failed to load technician dashboard data');
      console.error('Error loading technician data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProcedures = async () => {
    try {
      const proceduresData = await TechnicianService.getAssignedProcedures({ 
        search: searchTerm, 
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      setProcedures(proceduresData);
    } catch (error) {
      console.error('Error loading procedures:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-gray-600" />;
      case 'in-progress':
        return <Play size={16} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <AlertTriangle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const isDelayed = (procedure: Procedure) => {
    if (procedure.status !== 'pending') return false;
    const scheduledTime = new Date(`${procedure.date}T${procedure.scheduledTime}:00`);
    const now = new Date();
    return now > scheduledTime;
  };

  const getElapsedTime = (startTime?: string) => {
    if (!startTime) return null;
    const start = new Date(startTime);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - start.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, href }) => {
    const colorClasses: Record<string, string> = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      red: 'text-red-600 bg-red-50'
    };

    const colorClass = colorClasses[color];

    const CardContentComponent = (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${colorClass}`}>
              <Icon size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link to={href}>{CardContentComponent}</Link> : CardContentComponent;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technician Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage assigned procedures and treatment sessions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <Clock size={16} className="mr-2" />
            Refresh
          </Button>
          <Button asChild size="sm">
            <Link to="/technician/history">
              <CheckCircle size={16} className="mr-2" />
              View History
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Assigned Today"
          value={stats.assignedToday}
          subtitle="Procedures scheduled"
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Completed Sessions"
          value={stats.completedSessions}
          subtitle="Today"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Missed/Delayed"
          value={stats.missedDelayed}
          subtitle="Overdue procedures"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Total History"
          value={stats.totalHistory}
          subtitle="All sessions"
          icon={Wrench}
          color="orange"
          href="/technician/history"
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
              <Link to="/technician/history">
                <CheckCircle size={24} className="mb-2" />
                Session History
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" disabled>
              <Users size={24} className="mb-2" />
              Patient Records
            </Button>
            <Button variant="outline" className="h-20 flex-col" disabled>
              <Calendar size={24} className="mb-2" />
              Schedule
            </Button>
            <Button variant="outline" className="h-20 flex-col" disabled>
              <Wrench size={24} className="mb-2" />
              Equipment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assigned Procedures */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Wrench size={20} />
              <span>Assigned Procedures</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search procedures..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {procedures.length === 0 ? (
            <div className="text-center py-12">
              <Wrench size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No procedures found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No procedures assigned for today'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[80px]">Time</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[120px]">Patient</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden sm:table-cell">Procedure</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden md:table-cell">Assigned By</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[100px]">Status</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {procedures.map((procedure) => (
                    <tr key={procedure.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400 hidden sm:block" />
                          <div>
                            <span className="font-medium text-sm">{procedure.scheduledTime}</span>
                            {procedure.status === 'in-progress' && procedure.startTime && (
                              <p className="text-xs text-blue-600">
                                {getElapsedTime(procedure.startTime)} elapsed
                              </p>
                            )}
                            {isDelayed(procedure) && (
                              <p className="text-xs text-red-600">Delayed</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{procedure.patientName}</p>
                          <p className="text-xs text-gray-500 sm:hidden">{procedure.procedure}</p>
                          <p className="text-xs text-gray-500 hidden sm:block">{procedure.patientPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <div>
                          <p className="text-sm text-gray-900">{procedure.procedure}</p>
                          <p className="text-xs text-gray-500">{procedure.duration} minutes</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                        <p className="text-sm text-gray-900">{procedure.assignedBy}</p>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex items-center space-x-2">
                          <div className="hidden sm:block">{getStatusIcon(procedure.status)}</div>
                          <Badge 
                            variant="outline" 
                            className={`capitalize text-xs ${getStatusColor(procedure.status)}`}
                          >
                            <span className="hidden sm:inline">{procedure.status.replace('-', ' ')}</span>
                            <span className="sm:hidden">{procedure.status.charAt(0).toUpperCase()}</span>
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/technician/procedure/${procedure.id}`}>
                              <Eye size={12} className="sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Link>
                          </Button>
                          
                          {procedure.status === 'pending' && (
                            <Button asChild size="sm" className="px-2 sm:px-3">
                              <Link to={`/technician/procedure/${procedure.id}`}>
                                <Play size={12} className="sm:mr-1" />
                                <span className="hidden sm:inline">Start</span>
                              </Link>
                            </Button>
                          )}
                          
                          {procedure.status === 'in-progress' && (
                            <Button asChild variant="outline" size="sm" className="px-2 sm:px-3">
                              <Link to={`/technician/procedure/${procedure.id}`}>
                                <CheckCircle size={12} className="sm:mr-1" />
                                <span className="hidden sm:inline">Complete</span>
                              </Link>
                            </Button>
                          )}
                        </div>
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

export default TechnicianDashboard;