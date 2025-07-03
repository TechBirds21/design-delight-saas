// src/pages/doctor/SOAPNote.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  ArrowLeft, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Save,
  Send,
  User
} from 'lucide-react';
import DoctorService from '@/services/doctor.service';
import { toast } from 'sonner';

interface SOAPFormData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  vitals: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
  };
}

const soapSchema = z.object({
  subjective: z.string().min(10, 'Subjective must be at least 10 characters'),
  objective: z.string().min(10, 'Objective must be at least 10 characters'),
  assessment: z.string().min(1, 'Please select an assessment'),
  plan: z.string().min(10, 'Plan must be at least 10 characters'),
  vitals: z
    .object({
      bloodPressure: z.string().optional(),
      heartRate: z.string().optional(),
      temperature: z.string().optional(),
      weight: z.string().optional(),
    })
    .optional(),
});

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
}

const SOAPNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    subjective: true,
    objective: true,
    assessment: true,
    plan: true,
  });

  const form = useForm<SOAPFormData>({
    resolver: zodResolver(soapSchema),
    defaultValues: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
      vitals: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
      },
    },
  });

  useEffect(() => {
    if (id) loadPatientDetails();
  }, [id]);

  const loadPatientDetails = async () => {
    try {
      setLoading(true);
      const data = await DoctorService.getPatientDetails(id!);
      setPatient(data);
    } catch {
      toast.error('Failed to load patient details');
      navigate('/doctor');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const onSubmit = async (data: SOAPFormData, isDraft = false) => {
    if (!id || !patient) return;
    try {
      setIsSubmitting(true);
      const soapData = {
        ...data,
        patientId: id,
        patientName: patient.name,
        isDraft,
        doctorId: 'dr1',       // replace with real auth context
        doctorName: 'Dr. Sarah Johnson',
      };
      await DoctorService.submitSOAPNote(soapData);
      toast.success(
        isDraft
          ? 'SOAP note saved as draft'
          : 'SOAP note submitted successfully!',
        {
          description: `Note for ${patient.name} has been ${
            isDraft ? 'saved' : 'submitted'
          }.`,
        }
      );
      navigate(`/doctor/patient/${id}`);
    } catch {
      toast.error('Failed to save SOAP note', {
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => form.handleSubmit((d) => onSubmit(d, true))();
  const handleSubmitFinal = () =>
    form.handleSubmit((d) => onSubmit(d, false))();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Patient not found
        </h3>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/doctor/patient/${id}`)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Patient
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SOAP Note</h1>
            <p className="text-gray-600 mt-1">
              Create medical documentation for {patient.name}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Info Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User size={20} />
                <span>Patient Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 mx-auto mb-3">
                  {patient.avatar ? (
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-500">
                  {patient.age} years • {patient.gender}
                </p>
                <div className="space-y-2 pt-4 border-t text-sm text-left">
                  <div>
                    <strong className="text-gray-700">Phone:</strong>{' '}
                    {patient.phone}
                  </div>
                  <div>
                    <strong className="text-gray-700">Last Visit:</strong>{' '}
                    {patient.lastVisit}
                  </div>
                  <div>
                    <strong className="text-gray-700">History:</strong>{' '}
                    {patient.medicalHistory}
                  </div>
                  <div>
                    <strong className="text-gray-700">Allergies:</strong>{' '}
                    {patient.allergies}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SOAP Form */}
        <div className="lg:col-span-3 space-y-6">
          <Form {...form}>
            <form className="space-y-6">
              {/* Subjective */}
              <Card>
                <Collapsible
                  open={openSections.subjective}
                  onOpenChange={() => toggleSection('subjective')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <span>Subjective</span>
                        {openSections.subjective ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="subjective"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Chief Complaint & History
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe symptoms, concerns..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Objective */}
              <Card>
                <Collapsible
                  open={openSections.objective}
                  onOpenChange={() => toggleSection('objective')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <span>Objective</span>
                        {openSections.objective ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="objective"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Exam Findings & Tests
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Physical exam, observations..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Assessment */}
              <Card>
                <Collapsible
                  open={openSections.assessment}
                  onOpenChange={() => toggleSection('assessment')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <span>Assessment</span>
                        {openSections.assessment ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="assessment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Diagnosis</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select diagnosis" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="acne">Acne Vulgaris</SelectItem>
                                <SelectItem value="rosacea">Rosacea</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Plan */}
              <Card>
                <Collapsible
                  open={openSections.plan}
                  onOpenChange={() => toggleSection('plan')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <CardTitle className="flex items-center justify-between">
                        <span>Plan</span>
                        {openSections.plan ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </CardTitle>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="plan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Treatment Plan & Follow-up
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe procedures, meds..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/doctor/patient/${id}`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving…' : <><Save size={16} className="mr-2" />Save Draft</>}
                    </Button>
                    <Button
                      onClick={handleSubmitFinal}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting…' : <><Send size={16} className="mr-2" />Submit Note</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SOAPNote;
