import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Building, 
  Save,
  User,
  Mail,
  Globe,
  Package
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClinic } from '@/api/super-admin';
import { toast } from 'sonner';
import type { Clinic } from '@/api/super-admin';

const ClientNew: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic info
  const [clientName, setClientName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [plan, setPlan] = useState<'basic' | 'professional' | 'enterprise'>('professional');
  
  // Owner info
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  
  // Modules, Features, Dashboards
  const [enabledModules, setEnabledModules] = useState<Record<string, boolean>>({
    dashboard: true, patients: true, appointments: true,
    inventory: true, billing: true, crm: false, hr: false,
    reports: true, admin: true, reception: true,
    doctor: true, 'photo-manager': true, technician: true
  });
  const [enabledFeatures, setEnabledFeatures] = useState<Record<string, boolean>>({
    soapNotes: true, consentForms: true, photoManager: true,
    whatsappCRM: false, payrollAttendance: false,
    multiBranch: false, customBranding: false
  });
  const [allowedDashboards, setAllowedDashboards] = useState<Record<string, boolean>>({
    reception: true, doctor: true, technician: true,
    billing: true, crm: false, hr: false,
    reports: true, admin: true
  });

  // Helpers to sync related toggles
  const handleModuleChange = (key: string, checked: boolean) => {
    setEnabledModules(m => ({ ...m, [key]: checked }));
    if (checked && allowedDashboards[key] === false && key in allowedDashboards) {
      setAllowedDashboards(d => ({ ...d, [key]: true }));
    }
  };
  const handleFeatureChange = (key: string, checked: boolean) => {
    setEnabledFeatures(f => ({ ...f, [key]: checked }));
    if (checked) {
      if (key === 'photoManager') handleModuleChange('photo-manager', true);
      if (key === 'whatsappCRM') handleModuleChange('crm', true);
      if (key === 'payrollAttendance') handleModuleChange('hr', true);
    }
  };
  const handleDashboardChange = (key: string, checked: boolean) => {
    setAllowedDashboards(d => ({ ...d, [key]: checked }));
    if (checked) handleModuleChange(key, true);
  };

  // Auto-format subdomain
  const updateSubdomain = (name: string) => {
    setSubdomain(name
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !subdomain || !ownerName || !ownerEmail) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // expiry = 1 year out
      const expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

      const payload: Partial<Clinic> = {
        name: clientName,
        subdomain,
        plan,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
        contactName: ownerName,
        contactEmail: ownerEmail,
        contactPhone: ownerPhone,
        modules: enabledModules,
        features: enabledFeatures,
        dashboards: allowedDashboards,
        branches: [
          {
            id: `b${Date.now()}`,
            clinicId: '', // server will fill
            name: 'Main Branch',
            address: '',
            phone: ownerPhone,
            isMain: true,
            createdAt: new Date().toISOString()
          }
        ]
      };

      const created = await createClinic(payload);
      toast.success(`Client ${created.name} created!`);
      navigate('/super-admin/clients');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/super-admin/clients">
              <ArrowLeft className="mr-2"/>Back to Clients
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Client</h1>
            <p className="text-gray-600">Create a new clinic in Hospverse SaaS</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clinic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="text-blue-500"/>Clinic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clinic-name">Clinic Name *</Label>
              <Input
                id="clinic-name"
                value={clientName}
                onChange={e => {
                  setClientName(e.target.value);
                  if (!subdomain) updateSubdomain(e.target.value);
                }}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="subdomain">Subdomain *</Label>
              <div className="flex items-center mt-1">
                <Input
                  id="subdomain"
                  value={subdomain}
                  onChange={e => updateSubdomain(e.target.value)}
                  required
                />
                <span className="ml-2 text-gray-500">.hospverse.com</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                lowercase letters & numbers only
              </p>
            </div>
            <div>
              <Label htmlFor="plan">Subscription Plan *</Label>
              <Select
                value={plan}
                onValueChange={v => setPlan(v as any)}
                className="mt-1"
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Select plan"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Owner Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User/> 
                  <Input
                    placeholder="Owner Name"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Mail/>
                  <Input
                    type="email"
                    placeholder="Owner Email"
                    value={ownerEmail}
                    onChange={e => setOwnerEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Package/>
                  <Input
                    placeholder="Owner Phone"
                    value={ownerPhone}
                    onChange={e => setOwnerPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules & Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="text-purple-500"/>Modules & Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Core Modules */}
              <section>
                <h3 className="font-medium mb-2">Core Modules</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded">
                  {['dashboard','patients','appointments','inventory','billing'].map(key => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={enabledModules[key]}
                        onCheckedChange={c=>handleModuleChange(key, c===true)}
                        disabled={['dashboard','patients','appointments'].includes(key)}
                      />
                      <Label className="capitalize">{key.replace('-',' ')}</Label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Advanced Modules */}
              <section>
                <h3 className="font-medium mb-2">Advanced Modules</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded">
                  {['crm','hr','reports','admin','reception','doctor','photo-manager','technician'].map(key => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={enabledModules[key]}
                        onCheckedChange={c=>handleModuleChange(key, c===true)}
                        disabled={plan==='basic' && ['crm','hr'].includes(key)}
                      />
                      <Label className="capitalize">{key.replace('-',' ')}</Label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Features */}
              <section>
                <h3 className="font-medium mb-2">Features</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded">
                  {Object.entries({
                    soapNotes: 'SOAP Notes',
                    consentForms: 'Consent Forms',
                    photoManager: 'Photo Manager',
                    whatsappCRM: 'WhatsApp CRM',
                    payrollAttendance: 'Payroll & Attendance',
                    multiBranch: 'Multi-Branch',
                    customBranding: 'Custom Branding'
                  }).map(([key,label])=>(
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={enabledFeatures[key]}
                        onCheckedChange={c=>handleFeatureChange(key, c===true)}
                        disabled={
                          plan==='basic' &&
                          ['whatsappCRM','payrollAttendance','multiBranch','customBranding'].includes(key)
                        }
                      />
                      <Label>{label}</Label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dashboards */}
              <section>
                <h3 className="font-medium mb-2">Dashboard Access</h3>
                <div className="space-y-2 bg-gray-50 p-4 rounded">
                  {Object.entries({
                    reception: 'Reception',
                    doctor: 'Doctor',
                    technician: 'Technician',
                    billing: 'Billing',
                    crm: 'CRM',
                    hr: 'HR',
                    reports: 'Reports',
                    admin: 'Admin'
                  }).map(([key,label])=>(
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        checked={allowedDashboards[key]}
                        onCheckedChange={c=>handleDashboardChange(key, c===true)}
                      />
                      <Label>{label}</Label>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Submit */}
            <div className="mt-6 border-t pt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/super-admin/clients')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? <div className="animate-spin h-4 w-4 border-b-2 border-white mr-2 rounded-full"/>
                  : <Save className="mr-2"/>
                }
                {isSubmitting ? 'Creating...' : 'Create Client'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ClientNew;
