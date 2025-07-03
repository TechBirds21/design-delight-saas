import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  // Filter,
  Plus,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import CrmService from '@/services/crm.service';
import type { Lead, CrmStats } from '@/api/crm';

const CRM: React.FC = () => {
  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CrmStats>({
    total: 0,
    open: 0,
    converted: 0,
    lost: 0,
    monthly: []
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all'|'open'|'converted'|'lost'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Form for new lead
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    status: 'open',
    source: ''
  });
  
  // Load stats & leads
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [s, ls] = await Promise.all([
          CrmService.getCrmStats(),
          CrmService.getLeads({ status: statusFilter !== 'all' ? statusFilter : undefined, search: searchTerm || undefined })
        ]);
        setStats(s);
        setLeads(ls);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load CRM data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchTerm, statusFilter]);
  
  // Handlers
  const handleAddLead = async () => {
    if (!newLead.name || !newLead.email) {
      toast.error('Name & email are required');
      return;
    }
    try {
      await CrmService.createLead(newLead as Lead);
      toast.success('Lead created');
      setShowAddDialog(false);
      setNewLead({ name:'', email:'', phone:'', status:'open', source:'' });
      // reload
      const ls = await CrmService.getLeads({ status: statusFilter!=='all'?statusFilter:undefined, search: searchTerm||undefined });
      setLeads(ls);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create lead');
    }
  };
  
  const openView = (lead: Lead) => {
    setSelectedLead(lead);
    setShowViewDialog(true);
  };

  // Render
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRM</h1>
          <p className="text-gray-600 mt-1">Manage your leads and pipeline</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setLoading(true)}>
            <RefreshCw className="mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-1" /> New Lead
          </Button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-500">Total Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            <p className="text-sm text-gray-500">Open</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.converted}</p>
            <p className="text-sm text-gray-500">Converted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
            <p className="text-sm text-gray-500">Lost</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs: List & Analytics */}
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Leads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Leads Tab */}
        <TabsContent value="list">
          <Card>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <Input
                      placeholder="Search leads..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={v => setStatusFilter(v as any)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="converted">Converted</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map(lead => (
                      <TableRow key={lead.id} className="hover:bg-gray-50">
                        <TableCell>{lead.name}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell>{lead.phone}</TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${
                              lead.status === 'open' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => openView(lead)}>
                            <Eye size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Lead Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Lead</DialogTitle>
            <DialogDescription>Enter lead details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Name"
              value={newLead.name}
              onChange={e => setNewLead(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Email"
              value={newLead.email}
              onChange={e => setNewLead(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              placeholder="Phone"
              value={newLead.phone}
              onChange={e => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Select
              value={newLead.status!}
              onValueChange={v => setNewLead(prev => ({ ...prev, status: v as Lead['status'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Source (e.g. Website, Referral)"
              value={newLead.source}
              onChange={e => setNewLead(prev => ({ ...prev, source: e.target.value }))}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddLead}>
              <Plus className="mr-1" /> Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Lead Dialog */}
      <Dialog open={showViewDialog} onOpenChange={() => setShowViewDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <p><strong>Name:</strong> {selectedLead.name}</p>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Phone:</strong> {selectedLead.phone}</p>
              <p><strong>Status:</strong> {selectedLead.status}</p>
              <p><strong>Source:</strong> {selectedLead.source}</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await CrmService.updateLead(selectedLead.id, { status: 'converted' });
                    toast.success('Marked as converted');
                    setShowViewDialog(false);
                    // Refresh
                    const ls = await CrmService.getLeads({ status: statusFilter!=='all'?statusFilter:undefined, search: searchTerm||undefined });
                    setLeads(ls);
                  }}
                  disabled={selectedLead.status === 'converted'}
                >
                  <CheckCircle className="mr-1" /> Convert
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await CrmService.updateLead(selectedLead.id, { status: 'lost' });
                    toast.success('Marked as lost');
                    setShowViewDialog(false);
                    const ls = await CrmService.getLeads({ status: statusFilter!=='all'?statusFilter:undefined, search: searchTerm||undefined });
                    setLeads(ls);
                  }}
                  disabled={selectedLead.status === 'lost'}
                >
                  <XCircle className="mr-1" /> Lose
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CRM;
