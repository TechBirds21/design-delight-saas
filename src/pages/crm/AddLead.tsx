// src/pages/crm/AddLead.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import CRMService from '@/services/crm.service';
import { toast } from 'sonner';

// --- validation schema ---
const leadSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  mobile: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits'),
  email: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  source: z.enum(
    ['whatsapp', 'form', 'referral', 'instagram', 'walk-in', 'facebook', 'google'],
    { required_error: 'Please select a lead source' }
  ),
  assignedToId: z.string().min(1, 'Please assign to a CRM user'),
  notes: z.string().min(1, 'Please add some notes about the lead'),
});

type LeadFormData = z.infer<typeof leadSchema>;

const AddLead: React.FC = () => {
  const navigate = useNavigate();
  const [crmUsers, setCrmUsers] = useState<CRMService.CRMUser[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      fullName: '',
      mobile: '',
      email: '',
      source: '',
      assignedToId: '',
      notes: '',
    },
  });

  // load CRM users once
  useEffect(() => {
    (async () => {
      try {
        const users = await CRMService.getCRMUsers();
        setCrmUsers(users);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load CRM users');
      }
    })();
  }, []);

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    try {
      // look up the full user object
      const assigned = crmUsers.find(u => u.id.toString() === data.assignedToId);
      if (!assigned) throw new Error('Invalid CRM user');

      const payload = {
        ...data,
        assignedTo: assigned.name,
        assignedToId: assigned.id,
      };

      const created = await CRMService.addLead(payload);
      toast.success('Lead added!', {
        description: `${created.fullName} was successfully added.`,
      });
      form.reset();
      navigate('/crm');
    } catch (err) {
      console.error(err);
      toast.error('Could not add lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/crm')}
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2" /> Back to CRM
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Lead</h1>
            <p className="text-gray-600">Enter lead details below</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus /> Lead Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mobile */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+1-555-1234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Source */}
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Source *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="How did they find us?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            <SelectItem value="form">Website Form</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="google">Google Search</SelectItem>
                            <SelectItem value="walk-in">Walk-in</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Assigned To */}
                <FormField
                  control={form.control}
                  name="assignedToId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Assign To *</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ''}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a team member" />
                          </SelectTrigger>
                          <SelectContent>
                            {crmUsers.map(u => (
                              <SelectItem key={u.id} value={u.id.toString()}>
                                {u.name} — {u.role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any context or requirements…"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/crm')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-b-2 rounded-full mr-2"></div>
                      Adding…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" /> Add Lead
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <ul className="list-disc pl-5 space-y-1">
            <li>Double-check phone & email for typos.</li>
            <li>Include all relevant context in the notes.</li>
            <li>Assign leads to the right specialist.</li>
            <li>Follow up within 24 hours for best results.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddLead;
