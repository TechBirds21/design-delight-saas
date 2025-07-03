import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Building, 
  Search, 
  Plus,
  Eye,
  PauseCircle,
  RefreshCw,
  MoreHorizontal,
  Globe,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SuperAdminService from '@/services/super-admin.service';
import { toast } from 'sonner';
import type { Clinic } from '@/api/super-admin';

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState<Clinic | null>(null);
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // New client form state
  const [newName, setNewName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPlan, setNewPlan] = useState<'basic'|'professional'|'enterprise'>('professional');
  const [newModules, setNewModules] = useState<Record<string,boolean>>({
    dashboard: true, patients: true, appointments: true, inventory: true,
    billing: true, crm: false, hr: false, reports: true, admin: true,
    reception: true, doctor: true, 'photo-manager': true, technician: true
  });

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadClients, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, planFilter, statusFilter]);

  async function loadClients() {
    try {
      setLoading(true);
      const data = await SuperAdminService.getAllClients({
        search: searchTerm || undefined,
        plan: planFilter!=='all'?planFilter:undefined,
        status: statusFilter!=='all'?statusFilter:undefined
      });
      setClients(data);
    } catch {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  }

  async function handleSuspend() {
    if (!selectedClient) return;
    try {
      await SuperAdminService.updateClientStatus(selectedClient.id, 'inactive');
      toast.success(`${selectedClient.name} suspended`);
      loadClients();
      setShowSuspendDialog(false);
    } catch {
      toast.error('Failed to suspend');
    }
  }

  async function handleRenew() {
    if (!selectedClient) return;
    try {
      await SuperAdminService.updateClientStatus(selectedClient.id, 'active');
      toast.success(`${selectedClient.name} activated`);
      loadClients();
      setShowRenewDialog(false);
    } catch {
      toast.error('Failed to activate');
    }
  }

  function handleAdd() {
    if (!newName||!newSubdomain||!newEmail) {
      toast.error('Fill all fields');
      return;
    }
    // call API in real app...
    toast.success(`Created ${newName}`);
    setShowAddDialog(false);
    setNewName(''); setNewSubdomain(''); setNewEmail('');
    loadClients();
  }

  const getStatusColor = (s:string)=>({
    active:'bg-green-100 text-green-800', inactive:'bg-gray-100 text-gray-800',
    trial:'bg-orange-100 text-orange-800', suspended:'bg-red-100 text-red-800'
  } as any)[s]||'bg-gray-100 text-gray-800';

  const getPlanColor = (p:string)=>({
    free:'bg-gray-100 text-gray-800', basic:'bg-blue-100 text-blue-800',
    professional:'bg-purple-100 text-purple-800', enterprise:'bg-indigo-100 text-indigo-800'
  } as any)[p]||'bg-gray-100 text-gray-800';

  const getInitials=(n:string)=>n.split(' ').map(w=>w[0]).join('').toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/super-admin">
              <ArrowLeft className="mr-2"/>Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Client Management</h1>
            <p className="text-gray-600">Manage all Hospverse SaaS clients</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadClients}>
            <RefreshCw className="mr-2"/>Refresh
          </Button>
          <Button size="sm" onClick={()=>setShowAddDialog(true)}>
            <Plus className="mr-2"/>Add Client
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={e=>setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger><SelectValue placeholder="Plan"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue placeholder="Status"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="text-blue-500"/>Clients
            <Badge variant="outline">{clients.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_,i)=>(
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"/>
              ))}
            </div>
          ) : !clients.length ? (
            <div className="text-center py-12">
              <Building className="mx-auto mb-4 text-gray-300" size={48}/>
              <p className="text-lg font-medium">No clients found</p>
              <Button onClick={()=>setShowAddDialog(true)}>
                <Plus className="mr-2"/>Add Client
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinic</TableHead>
                    <TableHead>Subdomain</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map(c=>(
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            {c.logo
                              ? <AvatarImage src={c.logo} alt={c.name}/>
                              : <AvatarFallback className="bg-blue-500 text-white">
                                  {getInitials(c.name)}
                                </AvatarFallback>}
                          </Avatar>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Globe className="text-gray-400" size={14}/>
                          <span>{c.subdomain}.hospverse.com</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getPlanColor(c.plan)}`}>
                          {c.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="text-gray-400" size={14}/>
                          <span>{new Date(c.expiresAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`capitalize ${getStatusColor(c.status)}`}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/super-admin/clients/${c.id}`}>
                              <Eye className="mr-1"/>View
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal/>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator/>
                              <DropdownMenuItem asChild>
                                <Link to={`/super-admin/clients/${c.id}`}>
                                  <Eye className="mr-2"/>View Details
                                </Link>
                              </DropdownMenuItem>
                              {c.status==='active' ? (
                                <DropdownMenuItem
                                  onClick={()=>{
                                    setSelectedClient(c);
                                    setShowSuspendDialog(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <PauseCircle className="mr-2"/>Suspend
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={()=>{
                                    setSelectedClient(c);
                                    setShowRenewDialog(true);
                                  }}
                                  className="text-green-600"
                                >
                                  <RefreshCw className="mr-2"/>Activate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={()=>window.open(`https://${c.subdomain}.hospverse.com`, '_blank')}
                              >
                                <Globe className="mr-2"/>Visit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suspend Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Access</DialogTitle>
            <DialogDescription>
              Suspend {selectedClient?.name}? This logs out all users immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 my-4">
            <div className="flex space-x-3">
              <AlertTriangle className="text-amber-500 mt-0.5"/>
              <p className="text-amber-700">
                Are you sure? Users will be locked out until reactivated.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setShowSuspendDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              <PauseCircle className="mr-2"/>Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Renew Dialog */}
      <Dialog open={showRenewDialog} onOpenChange={setShowRenewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activate Client</DialogTitle>
            <DialogDescription>
              Activate {selectedClient?.name}? Users regain access immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 my-4">
            <div className="flex space-x-3">
              <CheckCircle className="text-green-500 mt-0.5"/>
              <p className="text-green-700">
                Confirm activation and extend subscription.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setShowRenewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenew}>
              <CheckCircle className="mr-2"/>Activate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Create a new clinic on the Hospverse platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Clinic Name *</Label>
                <Input id="name" value={newName} onChange={e=>setNewName(e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="sub">Subdomain *</Label>
                <div className="flex items-center mt-1 space-x-2">
                  <Input id="sub" value={newSubdomain} onChange={e=>setNewSubdomain(e.target.value.replace(/[^a-z0-9]/g,''))}/>
                  <span className="text-gray-500">.hospverse.com</span>
                </div>
              </div>
              <div>
                <Label htmlFor="email">Owner Email *</Label>
                <Input id="email" type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} className="mt-1"/>
              </div>
              <div>
                <Label htmlFor="plan">Plan *</Label>
                <Select value={newPlan} onValueChange={v=>setNewPlan(v as any)}>
                  <SelectTrigger id="plan" className="mt-1">
                    <SelectValue placeholder="Choose plan"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <Label className="block mb-2">Enabled Modules</Label>
              <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                {Object.entries({
                  dashboard:'Dashboard',patients:'Patients',appointments:'Appointments',
                  reception:'Reception',doctor:'Doctor',technician:'Technician',
                  inventory:'Inventory',billing:'Billing',crm:'CRM',hr:'HR',
                  reports:'Reports',admin:'Admin','photo-manager':'Photo Manager'
                }).map(([key,label])=>(
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={!!newModules[key]}
                      onChange={e=>setNewModules({...newModules,[key]:e.target.checked})}
                      className="rounded"
                    />
                    <Label className="cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
              <div>
                <Label className="block mb-2">Role Defaults</Label>
                <p className="text-sm text-gray-600">
                  You can adjust role permissions later in Client Detail.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>
              <Plus className="mr-2"/>Create Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientList;
