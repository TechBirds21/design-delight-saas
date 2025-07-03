// src/pages/doctor/TreatmentHistory.tsx

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
  Calendar,
  User,
  Stethoscope,
  Eye,
  Edit,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DoctorService from '@/services/doctor.service';
import { toast } from 'sonner';

interface TreatmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  procedure: string;
  performedBy: string;
  notes: string;
  status: string;
}

const TreatmentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [procedures, setProcedures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [procedureFilter, setProcedureFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadTreatments();
  }, [searchTerm, procedureFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [treatmentsData, proceduresData] = await Promise.all([
        DoctorService.getTreatmentHistory(),
        DoctorService.getProcedures()
      ]);
      setTreatments(treatmentsData);
      setProcedures(proceduresData);
    } catch (error) {
      toast.error('Failed to load treatment history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadTreatments = async () => {
    try {
      const filters: any = {};
      if (procedureFilter !== 'all') filters.procedure = procedureFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      let list = await DoctorService.getTreatmentHistory(filters);
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        list = list.filter(t =>
          t.patientName.toLowerCase().includes(term) ||
          t.procedure.toLowerCase().includes(term) ||
          t.performedBy.toLowerCase().includes(term)
        );
      }
      setTreatments(list);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string,string> = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'follow-up': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.completed;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':   return <FileText size={16} className="text-green-600" />;
      case 'in-progress': return <Clock size={16} className="text-blue-600" />;
      case 'follow-up':   return <Calendar size={16} className="text-yellow-600" />;
      case 'cancelled':   return <FileText size={16} className="text-red-600" />;
      default:            return <FileText size={16} className="text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/doctor')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treatment History</h1>
            <p className="text-gray-600 mt-1">Complete record of all patient treatments</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadData}>
          <Clock size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by patient, procedure or doctor…" 
                className="pl-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={procedureFilter} onValueChange={setProcedureFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Procedures" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Procedures</SelectItem>
                {procedures.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText size={20} /> <span>Treatment Records</span>
            <Badge variant="outline" className="ml-auto">
              {treatments.length} records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {treatments.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No treatments found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || procedureFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'No treatment records available'}
              </p>
              <Button onClick={() => navigate('/doctor')}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {treatments.map(t => (
                <div
                  key={t.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
                    <div className="text-center sm:text-left sm:min-w-[80px]">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{t.procedure}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="hidden sm:block">{getStatusIcon(t.status)}</div>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(t.status)}`}>
                            {t.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User size={12} /><span>{t.patientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Stethoscope size={12} /><span>by {t.performedBy}</span>
                        </div>
                      </div>
                      {t.notes && (
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {t.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 self-end sm:self-auto">
                    <Button variant="outline" size="sm">
                      <Eye size={12} className="sm:mr-1" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    {t.status === 'in-progress' && (
                      <Button size="sm">
                        <Edit size={12} className="sm:mr-1" />
                        <span className="hidden sm:inline">Update</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {treatments.filter(t => t.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {treatments.filter(t => t.status === 'in-progress').length}
            </p>
            <p className="text-sm text-gray-600">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {treatments.filter(t => t.status === 'follow-up').length}
            </p>
            <p className="text-sm text-gray-600">Follow-ups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {new Set(treatments.map(t => t.procedure)).size}
            </p>
            <p className="text-sm text-gray-600">Procedures</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreatmentHistory;
