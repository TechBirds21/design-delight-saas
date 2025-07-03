import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle,
  UserCheck,
  XCircle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import ReceptionService from '@/services/reception.service';

interface QueueEntry {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName?: string;
  appointmentTime?: string;
  status: 'waiting' | 'checked-in' | 'with-doctor' | 'completed' | 'cancelled';
  checkedInAt: string; // ISO timestamp
  queueNumber: number;
}

const QueueManagement: React.FC = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch / refresh queue
  const loadQueue = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await ReceptionService.getQueueList();
      setQueue(data);
    } catch (err) {
      toast.error('Failed to load queue');
      console.error('Error loading queue:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 30000);
    return () => clearInterval(interval);
  }, [loadQueue]);

  // Update a patient's status
  const handleStatusUpdate = async (id: string, newStatus: QueueEntry['status']) => {
    try {
      await ReceptionService.updatePatientStatus(id, newStatus);
      await loadQueue();
      const messages: Record<QueueEntry['status'], string> = {
        waiting: '',
        'checked-in': 'Checked in successfully',
        'with-doctor': 'Sent to doctor',
        completed: 'Marked as completed',
        cancelled: 'Appointment cancelled'
      };
      toast.success(messages[newStatus]);
    } catch (err) {
      toast.error('Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  // Helpers for UI
  const getStatusColor = (status: QueueEntry['status']) => {
    const map: Record<QueueEntry['status'], string> = {
      waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'checked-in': 'bg-blue-100 text-blue-800 border-blue-200',
      'with-doctor': 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return map[status];
  };
  const getStatusIcon = (status: QueueEntry['status']) => {
    switch (status) {
      case 'waiting':     return <Clock size={16} className="text-yellow-600" />;
      case 'checked-in':  return <CheckCircle size={16} className="text-blue-600" />;
      case 'with-doctor': return <UserCheck size={16} className="text-green-600" />;
      case 'completed':   return <CheckCircle size={16} className="text-gray-600" />;
      case 'cancelled':   return <XCircle size={16} className="text-red-600" />;
    }
  };
  const getWaitTime = (iso: string) => {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffMins = Math.floor((now - then) / 60000);
    return diffMins < 60
      ? `${diffMins}m`
      : `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/reception')}>
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Queue Management</h1>
            <p className="text-gray-600">Monitor and manage patient queue</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadQueue}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 ${refreshing ? 'animate-spin' : ''}`}
            /> Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/reception/patient-register')}
          >
            <Plus className="mr-2" /> Add to Queue
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-blue-600">{queue.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {queue.filter(p => p.status === 'waiting').length}
            </p>
            <p className="text-sm text-gray-600">Waiting</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {queue.filter(p => p.status === 'with-doctor').length}
            </p>
            <p className="text-sm text-gray-600">With Doctor</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-gray-600">
              {queue.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue List */}
      <Card>
        <CardHeader className="flex items-center space-x-2">
          <Users size={20} />
          <CardTitle>Patient Queue</CardTitle>
          <Badge variant="outline" className="ml-auto">
            {
              queue.filter(p =>
                ['waiting', 'checked-in', 'with-doctor'].includes(p.status)
              ).length
            } Active
          </Badge>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                No patients in queue
              </p>
              <Button
                onClick={() => navigate('/reception/patient-register')}
              >
                <Plus className="mr-2" /> Register & Add
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {p.queueNumber}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {getWaitTime(p.checkedInAt)}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{p.patientName}</h4>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(p.status)}
                          <Badge
                            variant="outline"
                            className={`text-xs ${getStatusColor(p.status)}`}
                          >
                            {p.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex space-x-4">
                        <span>📞 {p.patientPhone}</span>
                        {p.doctorName && <span>👨‍⚕️ {p.doctorName}</span>}
                        {p.appointmentTime && <span>🕐 {p.appointmentTime}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {p.status === 'waiting' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(p.id, 'checked-in')}
                      >
                        <CheckCircle size={14} className="mr-1" /> Check In
                      </Button>
                    )}
                    {p.status === 'checked-in' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(p.id, 'with-doctor')}
                      >
                        <UserCheck size={14} className="mr-1" /> Send to Doctor
                      </Button>
                    )}
                    {p.status === 'with-doctor' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusUpdate(p.id, 'completed')}
                      >
                        <CheckCircle size={14} className="mr-1" /> Complete
                      </Button>
                    )}
                    {!['completed','cancelled'].includes(p.status) && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleStatusUpdate(p.id, 'cancelled')}
                      >
                        <XCircle size={14} className="mr-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QueueManagement;
