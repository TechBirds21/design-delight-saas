import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Search, 
  Filter,
  Calendar,
  User,
  Stethoscope,
  Eye,
  Clock,
  CheckCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSessionHistory, getProcedureTypes, getDoctors } from '@/api/technician';
import { toast } from 'sonner';
import TechnicianService from '@/services/technician.service';

interface SessionHistoryEntry {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  duration: number;
  assignedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  notes: string;
}

interface Doctor {
  id: number;
  name: string;
}

interface HistoryFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  doctor?: string;
  procedure?: string;
  search?: string;
}

const SessionHistory: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<SessionHistoryEntry[]>([]);
  const [procedureTypes, setProcedureTypes] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorFilter, setDoctorFilter] = useState('all');
  const [procedureFilter, setProcedureFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadSessions();
  }, [searchTerm, statusFilter, doctorFilter, procedureFilter, dateFrom, dateTo]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, proceduresData, doctorsData] = await Promise.all([
        TechnicianService.getSessionHistory(),
        TechnicianService.getProcedureTypes(),
        TechnicianService.getDoctors()
      ]);
      setSessions(sessionsData);
      setProcedureTypes(proceduresData);
      setDoctors(doctorsData);
    } catch (error) {
      toast.error('Failed to load session history');
      console.error('Error loading session history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const filters: HistoryFilters = {
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        doctor: doctorFilter !== 'all' ? doctorFilter : undefined,
        procedure: procedureFilter !== 'all' ? procedureFilter : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      };
      
      const sessionsData = await TechnicianService.getSessionHistory(filters);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.completed;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={16} className="text-blue-600" />;
      case 'cancelled':
        return <Clock size={16} className="text-red-600" />;
      default:
        return <CheckCircle size={16} className="text-green-600" />;
    }
  };

  const formatDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
    return `${diffMinutes} min`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDoctorFilter('all');
    setProcedureFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/technician')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
            <p className="text-gray-600 mt-1">Complete record of all treatment sessions</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <Clock size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search and Date Range */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search by patient, procedure, or doctor..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                  placeholder="From date"
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                  placeholder="To date"
                />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Doctors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Doctors</SelectItem>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.name}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={procedureFilter} onValueChange={setProcedureFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Procedures" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Procedures</SelectItem>
                  {procedureTypes.map((procedure) => (
                    <SelectItem key={procedure} value={procedure}>
                      {procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText size={20} />
            <span>Treatment Sessions</span>
            <Badge variant="outline" className="ml-auto">
              {sessions.length} sessions
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || doctorFilter !== 'all' || procedureFilter !== 'all' || dateFrom || dateTo
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No treatment sessions available'
                }
              </p>
              <Button onClick={() => navigate('/technician')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div 
                  key={session.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-3 sm:space-y-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                    <div className="text-left sm:text-center sm:min-w-[80px]">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-900">{session.procedure}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="hidden sm:block">{getStatusIcon(session.status)}</div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getStatusColor(session.status)}`}
                          >
                            {session.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User size={12} />
                          <span>{session.patientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Stethoscope size={12} />
                          <span>by {session.assignedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{formatDuration(session.startTime, session.endTime)}</span>
                        </div>
                      </div>
                      
                      {session.notes && (
                        <p className="text-xs text-gray-500 mt-1 max-w-full sm:max-w-md truncate">
                          {session.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm">
                      <Eye size={12} className="sm:mr-1" />
                      <span className="hidden sm:inline">View Details</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {sessions.filter(s => s.status === 'in-progress').length}
            </p>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(sessions.map(s => s.procedure)).size}
            </p>
            <p className="text-sm text-gray-600">Procedures</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {new Set(sessions.map(s => s.patientName)).size}
            </p>
            <p className="text-sm text-gray-600">Patients</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionHistory;