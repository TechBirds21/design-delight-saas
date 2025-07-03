import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
import { Calendar as CalendarWidget } from '@/components/ui/calendar';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  CalendarIcon,
  ArrowLeft,
  Clock,
  User as UserIcon,
  Stethoscope,
} from 'lucide-react';

import ReceptionService from '@/services/reception.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

//
// -- schema & types
//
const appointmentSchema = z.object({
  patientName:  z.string().min(2, 'Enter at least 2 characters'),
  patientPhone: z.string().min(10, 'Enter at least 10 digits'),
  doctorId:     z.string().min(1, 'Select a doctor'),
  date:         z.date({ required_error: 'Select a date' }),
  time:         z.string().min(1, 'Select a time'),
  type:         z.enum(['consultation', 'follow-up', 'emergency', 'specialist']),
  notes:        z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  available: boolean;
}

const AppointmentBooking: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors]         = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [slots, setSlots]             = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots]     = useState(false);
  const [isSubmitting, setIsSubmitting]     = useState(false);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName:  '',
      patientPhone: '',
      doctorId:     '',
      date:         new Date(),
      time:         '',
      type:         'consultation',
      notes:        '',
    },
  });

  const watchedDate     = form.watch('date');
  const watchedDoctorId = form.watch('doctorId');

  // Load doctors once
  const loadDoctors = useCallback(async () => {
    try {
      setLoadingDoctors(true);
      const all = await ReceptionService.getDoctors();
      setDoctors(all.filter(d => d.available));
    } catch {
      toast.error('Could not load doctors');
    } finally {
      setLoadingDoctors(false);
    }
  }, []);
  useEffect(() => { loadDoctors(); }, [loadDoctors]);

  // Reload slots whenever date or doctor changes
  useEffect(() => {
    form.setValue('time', '');
    if (watchedDate && watchedDoctorId) {
      (async () => {
        setLoadingSlots(true);
        try {
          const dateStr = format(watchedDate, 'yyyy-MM-dd');
          const s = await ReceptionService.getAvailableTimeSlots(dateStr, watchedDoctorId);
          setSlots(s);
        } catch {
          toast.error('Could not load time slots');
        } finally {
          setLoadingSlots(false);
        }
      })();
    } else {
      setSlots([]);
    }
  }, [watchedDate, watchedDoctorId, form]);

  // Submit handler
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        date:     format(data.date, 'yyyy-MM-dd'),
        doctorId: parseInt(data.doctorId, 10),
      };
      const res = await ReceptionService.bookAppointment(payload);
      toast.success('Appointment booked!', {
        description: `${res.patientName} on ${res.date} @ ${res.time}`
      });
      form.reset({ ...form.getValues(), date: new Date(), type: 'consultation' });
      setSlots([]);
      navigate('/reception');
    } catch {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate('/reception')}>
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <h1 className="text-2xl font-bold">Book Appointment</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CalendarIcon size={20} /> Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Patient Name */}
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Patient Phone */}
                    <FormField
                      control={form.control}
                      name="patientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input placeholder="+1-555-0123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Doctor */}
                    <FormField
                      control={form.control}
                      name="doctorId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Doctor *</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={loadingDoctors}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder={loadingDoctors ? 'Loading…' : 'Select'} />
                              </SelectTrigger>
                              <SelectContent>
                                {doctors.map(doc => (
                                  <SelectItem key={doc.id} value={doc.id.toString()}>
                                    <div className="flex items-center space-x-2">
                                      <Stethoscope size={16} />
                                      <span>
                                        {doc.name} — {doc.specialization}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Consultation" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="consultation">Consultation</SelectItem>
                                <SelectItem value="follow-up">Follow-up</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                                <SelectItem value="specialist">Specialist</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'w-full justify-start text-left',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? format(field.value, 'PPP')
                                  : 'Pick a date'}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent align="start">
                            <CalendarWidget
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date.getDay() === 0 ||
                                date.getDay() === 6
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  {watchedDate && watchedDoctorId && (
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time *</FormLabel>
                          <FormControl>
                            {loadingSlots ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900" />
                                <span>Loading slots…</span>
                              </div>
                            ) : slots.length === 0 ? (
                              <p className="text-gray-500">No slots available</p>
                            ) : (
                              <div className="grid grid-cols-4 gap-2">
                                {slots.map(slot => (
                                  <Button
                                    key={slot}
                                    variant={field.value === slot ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => field.onChange(slot)}
                                  >
                                    {slot}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional notes…" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Actions */}
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/reception')}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Clock className="animate-spin mr-2 h-4 w-4" /> Booking…
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="mr-2 h-4 w-4" /> Book
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Form>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon size={20} /> Doctors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingDoctors ? (
                <p>Loading…</p>
              ) : doctors.length === 0 ? (
                <p>No doctors available</p>
              ) : (
                doctors.map(d => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-500">{d.specialization}</p>
                    </div>
                    <span className="h-2 w-2 bg-green-500 rounded-full" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Book up to 30 days ahead.</p>
              <p>• Weekends are disabled.</p>
              <p>• Arrive 15 mins early.</p>
              <p>• Cancel ≥2 hrs prior.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
