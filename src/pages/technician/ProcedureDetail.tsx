import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Clock, 
  Stethoscope,
  Play,
  CheckCircle,
  AlertCircle,
  Timer,
  FileText
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
// import { getProcedureDetails, startSession, completeSession } from '@/api/technician';
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

interface CompletionData {
  notes: string;
  actualDuration?: number;
}

const ProcedureDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  useEffect(() => {
    if (id) {
      loadProcedureDetails();
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (procedure?.status === 'in-progress' && procedure?.startTime) {
      interval = setInterval(() => {
        const start = new Date(procedure.startTime!);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsedTime(diffSeconds);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [procedure]);

  const loadProcedureDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const procedureData = await TechnicianService.getProcedureDetails(id);
      setProcedure(procedureData);
      
      // Calculate elapsed time if session is in progress
      if (procedureData.status === 'in-progress' && procedureData.startTime) {
        const start = new Date(procedureData.startTime);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsedTime(diffSeconds);
      }
    } catch (error) {
      toast.error('Failed to load procedure details');
      console.error('Error loading procedure:', error);
      navigate('/technician');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!id) return;
    
    try {
      setIsStarting(true);
      const updatedProcedure = await TechnicianService.startSession(id);
      setProcedure(updatedProcedure);
      toast.success('Session started successfully!');
    } catch (error) {
      toast.error('Failed to start session');
      console.error('Error starting session:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!id) return;
    
    if (!completionNotes.trim()) {
      toast.error('Please add completion notes');
      return;
    }

    try {
      setIsCompleting(true);
      const actualDuration = Math.floor(elapsedTime / 60); // Convert to minutes
      
      const completionData: CompletionData = {
        notes: completionNotes,
        actualDuration
      };
      
      const updatedProcedure = await TechnicianService.completeSession(id, completionData);
      setProcedure(updatedProcedure);
      setShowCompleteDialog(false);
      toast.success('Session completed successfully!');
      
      // Navigate back to dashboard after a short delay
      setTimeout(() => {
        navigate('/technician');
      }, 1500);
    } catch (error) {
      toast.error('Failed to complete session');
      console.error('Error completing session:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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
        return <Clock size={20} className="text-gray-600" />;
      case 'in-progress':
        return <Play size={20} className="text-blue-600" />;
      case 'completed':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'cancelled':
        return <AlertCircle size={20} className="text-red-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="lg:col-span-2 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!procedure) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Procedure not found</h3>
        <Button onClick={() => navigate('/technician')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
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
            <h1 className="text-3xl font-bold text-gray-900">Procedure Details</h1>
            <p className="text-gray-600 mt-1">Treatment session for {procedure.patientName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient & Procedure Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Patient Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User size={20} />
                <span>Patient Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3">
                    {procedure.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-bold text-gray-900">{procedure.patientName}</h3>
                  <p className="text-sm text-gray-500">{procedure.patientAge} years</p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{procedure.patientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Scheduled: {procedure.scheduledTime}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Stethoscope size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Assigned by: {procedure.assignedBy}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Procedure Info */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Procedure</h4>
                  <p className="text-sm text-gray-600">{procedure.procedure}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Estimated Duration</h4>
                  <p className="text-sm text-gray-600">{procedure.duration} minutes</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(procedure.status)}
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${getStatusColor(procedure.status)}`}
                    >
                      {procedure.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                {procedure.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                    <p className="text-sm text-gray-600">{procedure.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Session Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timer & Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Timer size={20} />
                <span>Session Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                {/* Timer Display */}
                <div className="bg-gray-50 rounded-lg p-8">
                  <div className="text-6xl font-mono font-bold text-gray-900 mb-2">
                    {formatTime(elapsedTime)}
                  </div>
                  <p className="text-gray-500">
                    {procedure.status === 'in-progress' ? 'Session in progress' : 
                     procedure.status === 'completed' ? 'Session completed' : 'Session not started'}
                  </p>
                  {procedure.status === 'in-progress' && procedure.startTime && (
                    <p className="text-sm text-blue-600 mt-2">
                      Started at {new Date(procedure.startTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {procedure.status === 'pending' && (
                    <Button 
                      onClick={handleStartSession}
                      disabled={isStarting}
                      size="lg"
                      className="px-8"
                    >
                      {isStarting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play size={20} className="mr-2" />
                          Start Session
                        </>
                      )}
                    </Button>
                  )}

                  {procedure.status === 'in-progress' && (
                    <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
                      <DialogTrigger asChild>
                        <Button size="lg" className="px-8">
                          <CheckCircle size={20} className="mr-2" />
                          Complete Session
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Complete Session</DialogTitle>
                          <DialogDescription>
                            Add notes about the completed treatment session.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="notes">Session Notes *</Label>
                            <Textarea
                              id="notes"
                              placeholder="Describe what was done, any complications, patient reactions, etc..."
                              value={completionNotes}
                              onChange={(e) => setCompletionNotes(e.target.value)}
                              className="min-h-[100px] mt-2"
                            />
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Duration:</strong> {formatTime(elapsedTime)} ({Math.floor(elapsedTime / 60)} minutes)
                            </p>
                          </div>

                          <div className="flex space-x-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setShowCompleteDialog(false)}
                              className="flex-1"
                              disabled={isCompleting}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleCompleteSession}
                              disabled={isCompleting || !completionNotes.trim()}
                              className="flex-1"
                            >
                              {isCompleting ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Completing...
                                </>
                              ) : (
                                'Complete Session'
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {procedure.status === 'completed' && (
                    <div className="text-center">
                      <CheckCircle size={48} className="mx-auto text-green-500 mb-2" />
                      <p className="text-lg font-medium text-green-700">Session Completed</p>
                      <p className="text-sm text-gray-500">
                        Completed at {procedure.endTime && new Date(procedure.endTime).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Notes (if completed) */}
          {procedure.status === 'completed' && procedure.completionNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Session Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{procedure.completionNotes}</p>
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p><strong>Actual Duration:</strong> {procedure.actualDuration || procedure.duration} minutes</p>
                  <p><strong>Completed:</strong> {procedure.endTime && new Date(procedure.endTime).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Treatment Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ensure patient comfort throughout the procedure</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Monitor patient reactions and adjust treatment as needed</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Document any complications or unusual reactions</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Provide post-treatment care instructions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcedureDetail;