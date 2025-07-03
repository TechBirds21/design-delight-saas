// src/pages/doctor/PatientDetails.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Camera, 
  UserCheck,
  Stethoscope,
  Clock,
  Edit,
  Eye
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

interface SOAPNote {
  id: string;
  patientId: string;
  patientName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: string;
  status: 'draft' | 'submitted';
  doctorId: string;
  doctorName: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  medicalHistory: string;
  allergies: string;
  lastVisit: string;
  totalVisits: number;
  avatar?: string;
  visitHistory?: TreatmentRecord[];
  soapNotes?: SOAPNote[];
}

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadPatientDetails();
  }, [id]);

  const loadPatientDetails = async () => {
    try {
      setLoading(true);
      const data = await DoctorService.getPatientDetails(id!);
      setPatient(data);
    } catch (err) {
      toast.error('Failed to load patient details');
      navigate('/doctor');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'follow-up': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return map[status] || map.completed;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
          <div className="lg:col-span-2 animate-pulse h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Patient not found</h3>
        <Button onClick={() => navigate('/doctor')}>
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
          <Button variant="outline" size="sm" onClick={() => navigate('/doctor')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
            <p className="text-gray-600 mt-1">Complete patient information and history</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info Panel */}
        <div className="space-y-6">
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
                  <div className="w-20 h-20 mx-auto mb-4">
                    {patient.avatar ? (
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {patient.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{patient.name}</h3>
                  <p className="text-gray-500">{patient.age} years • {patient.gender}</p>
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{patient.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">Last visit: {patient.lastVisit}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{patient.totalVisits} total visits</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Medical History</h4>
                  <p className="text-sm text-gray-600">{patient.medicalHistory}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                  <p className="text-sm text-gray-600">{patient.allergies}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to={`/doctor/soap/${patient.id}`}>
                  <FileText size={16} className="mr-2" />
                  Start SOAP Note
                </Link>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <UserCheck size={16} className="mr-2" />
                    Assign Technician
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Technician</DialogTitle>
                    <DialogDescription>
                      Coming soon: assign a technician for {patient.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <Button className="w-full">Coming Soon</Button>
                </DialogContent>
              </Dialog>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link to={`/doctor/upload-photo/${patient.id}`}>
                  <Camera size={16} className="mr-2" />
                  Upload Medical Photo
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start">
                <Link to={`/photo-manager/patient/${patient.id}`}>
                  <Camera size={16} className="mr-2" />
                  View Photo Gallery
                </Link>
              </Button>

              <Button variant="outline" className="w-full justify-start" disabled>
                <Stethoscope size={16} className="mr-2" />
                Add Prescription
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Visit History & SOAP Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visit History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock size={20} />
                <span>Visit History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.visitHistory?.length ? (
                <div className="space-y-3">
                  {patient.visitHistory.map((visit) => (
                    <div
                      key={visit.id}
                      className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="sm:min-w-[80px] text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                        <Badge
                          variant="outline"
                          className={`mt-1 text-xs ${getStatusColor(visit.status)}`}
                        >
                          {visit.status}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{visit.procedure}</h4>
                          <span className="text-sm text-gray-500 hidden sm:inline">
                            by {visit.performedBy}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 sm:hidden mb-1">
                          by {visit.performedBy}
                        </p>
                        <p className="text-sm text-gray-600">{visit.notes}</p>
                      </div>
                      <Button variant="outline" size="sm" className="self-start">
                        <Eye size={12} className="mr-1" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No visit history</h3>
                  <p className="text-gray-500 mb-4">No recorded visits yet.</p>
                  <Button asChild>
                    <Link to={`/doctor/soap/${patient.id}`}>
                      <FileText size={16} className="mr-2" />
                      Start First SOAP Note
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SOAP Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText size={20} />
                <span>SOAP Notes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.soapNotes?.length ? (
                <div className="space-y-4">
                  {patient.soapNotes.map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          SOAP Note – {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Status: {note.status} • Assessment: {note.assessment}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        {note.status === 'draft' && (
                          <Button size="sm">
                            <Edit size={14} className="mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No SOAP notes</h3>
                  <p className="text-gray-500 mb-4">None created yet.</p>
                  <Button asChild>
                    <Link to={`/doctor/soap/${patient.id}`}>
                      <FileText size={16} className="mr-2" />
                      Create SOAP Note
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
