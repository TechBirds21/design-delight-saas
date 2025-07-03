import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line
} from 'recharts';
import {
  ArrowLeft,
  Building,
  Globe,
  Mail,
  Phone,
  User,
  Clock,
  BarChart3,
  Settings,
  RefreshCw,
  Send,
  AlertTriangle,
  PauseCircle,
  Lock,
  Plus,
  FileText,
  DollarSign,
  XCircle
} from 'lucide-react';
import {
  getClientDetails,
  toggleClientModule,
  updateClientStatus,
  getClientUsageLogs
} from '@/api/super-admin';
import type { Clinic, UsageLog } from '@/api/super-admin';
import { toast } from 'sonner';

// Mock data for usage chart
const usageData = [
  { date: '05/01', apiHits: 420 },
  /* …14 days… */
  { date: '05/14', apiHits: 590 }
];

// Mock data for dashboard views
const dashboardViewsData = [
  { date: '05/01', views: 45 },
  /* …14 days… */
  { date: '05/14', views: 62 }
];

// Mock payment history
const paymentHistory = [
  { id: 'pay1', date: '2024-04-15', amount: 299, plan: 'Professional', status: 'paid' },
  /* … last 5 payments … */
  { id: 'pay5', date: '2023-12-15', amount: 299, plan: 'Professional', status: 'paid' }
];

const ClientDetail: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Clinic | null>(null);
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [showResetPwdDialog, setShowResetPwdDialog] = useState(false);
  const [showNotifDialog, setShowNotifDialog] = useState(false);
  const [notifMessage, setNotifMessage] = useState('');
  const [showAddBranchDialog, setShowAddBranchDialog] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchPhone, setNewBranchPhone] = useState('');

  // Role permissions (mocked)
  const [rolePermissions, setRolePermissions] = useState<{
    [role: string]: string[];
  }>({
    admin: ['dashboard','patients','appointments','inventory','billing','crm','hr','reports','admin','reception','doctor','photo-manager','technician'],
    doctor: ['dashboard','patients','appointments','reports','doctor','photo-manager'],
    nurse: ['dashboard','patients','appointments'],
    receptionist: ['dashboard','patients','appointments','billing','reception'],
    pharmacist: ['dashboard','patients','inventory'],
    technician: ['dashboard','technician','photo-manager']
  });

  useEffect(() => {
    if (clientId) loadClientDetails();
  }, [clientId]);

  const loadClientDetails = async () => {
    try {
      setLoading(true);
      const [c, logs] = await Promise.all([
        getClientDetails(clientId!),
        getClientUsageLogs(clientId!)
      ]);
      setClient(c);
      setUsageLogs(logs.slice(0, 50));
    } catch {
      toast.error('Failed to load client details');
      navigate('/super-admin/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleModule = async (module: string, enabled: boolean) => {
    if (!client) return;
    try {
      const updated = await toggleClientModule(client.id, module, enabled);
      setClient(updated);
      toast.success(`${module} ${enabled ? 'enabled' : 'disabled'}`);
    } catch {
      toast.error('Could not update module');
    }
  };

  const handlePauseAccess = async () => {
    if (!client) return;
    try {
      const updated = await updateClientStatus(client.id, 'inactive');
      setClient(updated);
      setShowPauseDialog(false);
      toast.success('Access paused');
    } catch {
      toast.error('Could not pause access');
    }
  };

  const handleResumeAccess = async () => {
    if (!client) return;
    try {
      const updated = await updateClientStatus(client.id, 'active');
      setClient(updated);
      toast.success('Access resumed');
    } catch {
      toast.error('Could not resume access');
    }
  };

  const handleResetPassword = () => {
    toast.success('Reset link sent');
    setShowResetPwdDialog(false);
  };

  const handleSendNotification = () => {
    if (!notifMessage.trim()) {
      toast.error('Enter a message');
      return;
    }
    toast.success('Notification sent');
    setShowNotifDialog(false);
    setNotifMessage('');
  };

  const handleAddBranch = () => {
    if (!client) return;
    if (!newBranchName || !newBranchAddress || !newBranchPhone) {
      toast.error('Fill in all fields');
      return;
    }
    const branch = {
      id: `b${Date.now()}`,
      clinicId: client.id,
      name: newBranchName,
      address: newBranchAddress,
      phone: newBranchPhone,
      isMain: false,
      createdAt: new Date().toISOString()
    };
    setClient({
      ...client,
      branches: [...client.branches, branch]
    });
    toast.success('Branch added');
    setShowAddBranchDialog(false);
    setNewBranchName('');
    setNewBranchAddress('');
    setNewBranchPhone('');
  };

  const handleUpdateRolePermissions = (role: string, module: string, has: boolean) => {
    setRolePermissions(prev => {
      const copy = { ...prev };
      copy[role] = has
        ? Array.from(new Set([...copy[role], module]))
        : copy[role].filter(m => m !== module);
      return copy;
    });
    toast.success(`Updated ${role} → ${module}`);
  };

  const getStatusColor = (s: string) => ({
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    trial: 'bg-orange-100 text-orange-800',
    suspended: 'bg-red-100 text-red-800'
  }[s as keyof any] || 'bg-gray-100 text-gray-800');

  const getPlanColor = (p: string) => ({
    free: 'bg-gray-100 text-gray-800',
    basic: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    enterprise: 'bg-indigo-100 text-indigo-800'
  }[p as keyof any] || 'bg-gray-100 text-gray-800');

  const getPaymentStatusColor = (st: string) => ({
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800'
  }[st as keyof any] || 'bg-gray-100 text-gray-800');

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4" />
        <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2" />
        <div className="animate-pulse h-64 bg-gray-200 rounded-lg" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <Building size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium">Client not found</h3>
        <Button asChild>
          <Link to="/super-admin/clients">
            <ArrowLeft className="mr-2" /> Back
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/super-admin/clients">
              <ArrowLeft className="mr-2" /> Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={`capitalize ${getPlanColor(client.plan)}`}>
                {client.plan}
              </Badge>
              <Badge className={`capitalize ${getStatusColor(client.status)}`}>
                {client.status}
              </Badge>
              <span className="text-sm text-gray-500">ID: {client.id}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          {client.status === 'active' ? (
            <Button variant="outline" onClick={() => setShowPauseDialog(true)}>
              <PauseCircle className="mr-2" /> Pause Access
            </Button>
          ) : (
            <Button variant="outline" onClick={handleResumeAccess}>
              <RefreshCw className="mr-2" /> Resume Access
            </Button>
          )}
          <Button onClick={() => setShowNotifDialog(true)}>
            <Send className="mr-2" /> Notify
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage Logs</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview">
          {/* …same as before… */}
        </TabsContent>

        {/* MODULES */}
        <TabsContent value="modules">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="text-blue-500" /> Module Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg flex space-x-3">
                  <AlertTriangle className="text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">
                      Toggle features for this client.
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Changes take effect immediately.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    // Core
                    { key: 'dashboard', label: 'Dashboard', desc: 'Overview & analytics', core: true },
                    { key: 'patients', label: 'Patients', desc: 'Patient records', core: true },
                    { key: 'appointments', label: 'Appointments', desc: 'Scheduling', core: true },

                    // Standard
                    { key: 'billing', label: 'Billing', desc: 'Invoices & payments' },
                    { key: 'inventory', label: 'Inventory', desc: 'Stock management' },
                    { key: 'reports', label: 'Reports', desc: 'Analytics & reports' },
                    { key: 'crm', label: 'CRM', desc: 'Lead & call tracking' },
                    { key: 'hr', label: 'HR', desc: 'Staff management' },
                    { key: 'admin', label: 'Admin Panel', desc: 'Super-admin settings' },

                    // Global Enhancements (v2.5)
                    { key: 'notificationSystem', label: 'Notifications', desc: 'Alerts & reminders' },
                    { key: 'apiIntegrations', label: 'API Integrations', desc: 'ABHA, FHIR, TPA sync' },
                    { key: 'consentESign', label: 'eSignatures', desc: 'Consent capture' },
                    { key: 'lifestyleTracker', label: 'Lifestyle Tracker', desc: 'Diet & care logs' },
                    { key: 'internalChat', label: 'Internal Chat', desc: 'Staff messaging' },
                    { key: 'smartSOP', label: 'SOP Manager', desc: 'Protocol library' },
                    { key: 'fieldPermissions', label: 'Field Permissions', desc: 'Role-based fields' },
                    { key: 'multiBranch', label: 'Multi-Branch', desc: 'Branch comparisons' },
                    { key: 'callLogger', label: 'Call Logger', desc: 'CRM style call tracking' },

                    // Enterprise
                    { key: 'teleconsult', label: 'Teleconsult', desc: 'Video consult & chat' },
                    { key: 'biAnalytics', label: 'BI Analytics', desc: 'Dept/doctor KPIs' },
                    { key: 'procurement', label: 'Procurement', desc: 'PO & vendor workflows' },
                    { key: 'clinicalTemplates', label: 'Templates', desc: 'No-code form builder' },
                    { key: 'marketing', label: 'Marketing', desc: 'Bulk campaigns' },
                    { key: 'multiLanguage', label: 'Multi-Lang', desc: 'Regional UI' },
                    { key: 'emergencyAlerts', label: 'Emergency', desc: 'Code Blue & SOS' },
                    { key: 'franchiseTools', label: 'Franchise', desc: 'Franchise mgmt' },
                    { key: 'insuranceRecon', label: 'Insurance', desc: 'Claims reconciliation' },
                    { key: 'paymentGateways', label: 'Payments', desc: 'Gateways & UPI' },
                    { key: 'offlineMode', label: 'Offline Mode', desc: 'Low-net clinics' },
                    { key: 'dataMigration', label: 'Migration', desc: 'EMR import' },
                    { key: 'voiceCommands', label: 'Voice Commands', desc: 'Voice nav' },
                    { key: 'labIntegration', label: 'Lab Integration', desc: 'Device sync' },
                    { key: 'cds', label: 'CDS', desc: 'Decision support' },
                  ].map(({ key, label, desc, core }) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                      <Switch
                        checked={Boolean((client!.modules as any)[key])}
                        disabled={Boolean(core)}
                        onCheckedChange={on => handleToggleModule(key, on)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DASHBOARDS, BILLING, USAGE… */}
        <TabsContent value="dashboards">…</TabsContent>
        <TabsContent value="billing">…</TabsContent>
        <TabsContent value="usage">…</TabsContent>
      </Tabs>

      {/* DIALOGS: Pause, Reset Password, Notify, Add Branch */}
      <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Access</DialogTitle>
            <DialogDescription>
              Pausing will log out all users immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 p-4 rounded-lg">
            <div className="flex space-x-3">
              <AlertTriangle className="text-amber-500 mt-0.5" />
              <p className="text-amber-700">
                Are you sure you want to pause access?
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPauseDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePauseAccess}>
              <PauseCircle className="mr-2" /> Pause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetPwdDialog} onOpenChange={setShowResetPwdDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Send reset link to {client.contactEmail}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResetPwdDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              <Lock className="mr-2" /> Send Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNotifDialog} onOpenChange={setShowNotifDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="notif">Message</Label>
            <Input
              id="notif"
              placeholder="Your message…"
              value={notifMessage}
              onChange={e => setNotifMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotifDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification}>
              <Send className="mr-2" /> Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddBranchDialog} onOpenChange={setShowAddBranchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Branch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label htmlFor="branchName">Name</Label>
            <Input
              id="branchName"
              placeholder="Branch name"
              value={newBranchName}
              onChange={e => setNewBranchName(e.target.value)}
            />
            <Label htmlFor="branchAddr">Address</Label>
            <Input
              id="branchAddr"
              placeholder="Address"
              value={newBranchAddress}
              onChange={e => setNewBranchAddress(e.target.value)}
            />
            <Label htmlFor="branchPhone">Phone</Label>
            <Input
              id="branchPhone"
              placeholder="Phone"
              value={newBranchPhone}
              onChange={e => setNewBranchPhone(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBranchDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBranch}>
              <Plus className="mr-2" /> Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;
