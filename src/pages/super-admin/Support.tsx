// src/pages/SuperAdminSupport.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Ticket,
  Search,
  RefreshCw,
  Building,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  User,
  Send
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import SuperAdminService from '@/services/super-admin.service';
import type { SupportTicket, TicketMessage } from '@/api/super-admin';
import { toast } from 'sonner';

const getStatusColor = (status: string) => ({
  open:        'bg-red-100 text-red-800 border-red-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  resolved:    'bg-green-100 text-green-800 border-green-200',
  closed:      'bg-gray-100 text-gray-800 border-gray-200'
}[status] ?? 'bg-gray-100 text-gray-800 border-gray-200');

const getPriorityColor = (priority: string) => ({
  low:      'bg-blue-100 text-blue-800 border-blue-200',
  medium:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  high:     'bg-orange-100 text-orange-800 border-orange-200',
  critical: 'bg-red-100 text-red-800 border-red-200'
}[priority] ?? 'bg-gray-100 text-gray-800 border-gray-200');

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).join('').toUpperCase();

const SuperAdminSupport: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all'|'open'|'in-progress'|'resolved'|'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<SupportTicket|null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [reply, setReply] = useState('');
  const [assignee, setAssignee] = useState('Support Agent');

  useEffect(() => {
    load();
  }, [statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  async function load() {
    setLoading(true);
    try {
      const data = await SuperAdminService.getSupportTickets(
        statusFilter==='all' ? undefined : statusFilter
      );
      setTickets(searchTerm
        ? data.filter(t =>
            t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : data
      );
    } catch {
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  }

  async function view(id: string) {
    try {
      const detail = await SuperAdminService.getSupportTicketDetails(id);
      setSelected(detail);
      setShowDetails(true);
    } catch {
      toast.error('Failed to load ticket details');
    }
  }

  async function updateStatus(status: SupportTicket['status']) {
    if (!selected) return;
    try {
      const updated = await SuperAdminService.updateSupportTicket(selected.id, {
        status, assignedTo: assignee
      });
      setSelected(updated);
      load();
      toast.success(`Status set to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  }

  async function sendReply() {
    if (!selected || !reply.trim()) return;
    try {
      const updated = await SuperAdminService.addSupportTicketMessage(
        selected.id, reply.trim(), 'support', assignee
      );
      setSelected(updated);
      setReply('');
      if (selected.status==='open') await updateStatus('in-progress');
      toast.success('Reply sent');
    } catch {
      toast.error('Failed to send reply');
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild size="sm">
            <Link to="/super-admin">
              <ArrowLeft size={16} /> Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Support Tickets</h1>
            <p className="text-gray-600">Manage client support requests</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw size={16} /> Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tickets…"
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              {['all','open','in-progress','resolved','closed'].map(s => (
                <SelectItem value={s} key={s}>
                  {s.replace('-', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Ticket className="text-orange-500" /> Tickets
            <Badge variant="outline">{tickets.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading
            ? <p>Loading…</p>
            : tickets.length === 0
              ? (
                <div className="text-center py-12">
                  <Ticket size={48} className="mx-auto text-gray-300" />
                  <p className="mt-4 text-gray-500">No tickets found</p>
                </div>
              )
              : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Clinic</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map(t => (
                        <TableRow key={t.id}>
                          <TableCell>{t.subject}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Building size={14} className="text-gray-400" />
                              {t.clinicName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-1">
                                <User size={12} /> {t.contactName}
                              </div>
                              <div className="flex items-center space-x-1">
                                <Mail size={12} /> {t.contactEmail}
                              </div>
                              {t.contactPhone && (
                                <div className="flex items-center space-x-1">
                                  <Phone size={12} /> {t.contactPhone}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize ${getPriorityColor(t.priority)}`}
                            >{t.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize ${getStatusColor(t.status)}`}
                            >{t.status.replace('-', ' ')}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Clock size={12} />{' '}
                              {new Date(t.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => view(t.id)}
                            >
                              <MessageSquare size={14} /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
          }
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selected.subject}</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusColor(selected.status)}`}
                    >{selected.status.replace('-', ' ')}</Badge>
                    <Badge
                      variant="outline"
                      className={`capitalize ${getPriorityColor(selected.priority)}`}
                    >{selected.priority}</Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {(selected.status==='open' || selected.status==='in-progress') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateStatus('resolved')}
                    >
                      <CheckCircle size={14} /> Resolve
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus('closed')}
                  >
                    <XCircle size={14} /> Close
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Client Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500">Clinic</Label>
                      <div className="flex items-center space-x-1 mt-1">
                        <Building size={14} className="text-gray-400" />
                        <span className="font-medium">{selected.clinicName}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Contact</Label>
                      <div className="space-y-1 mt-1 text-sm">
                        <div className="flex items-center space-x-1">
                          <User size={14} /> {selected.contactName}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail size={14} /> {selected.contactEmail}
                        </div>
                        {selected.contactPhone && (
                          <div className="flex items-center space-x-1">
                            <Phone size={14} /> {selected.contactPhone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Created</Label>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock size={14} />{' '}
                        {new Date(selected.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Assign To</Label>
                      <Select
                        value={assignee}
                        onValueChange={v => setAssignee(v)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Support Agent">Support Agent</SelectItem>
                          <SelectItem value="Technical Team">Technical Team</SelectItem>
                          <SelectItem value="Billing">Billing</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Description & Messages */}
                <div className="md:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{selected.description}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Conversation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                      {selected.messages.length === 0
                        ? (
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare size={36} className="mx-auto mb-2" />
                            No messages yet
                          </div>
                        )
                        : selected.messages.map((m: TicketMessage) => (
                          <div
                            key={m.id}
                            className={`flex ${
                              m.sender==='support' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div className={`max-w-[80%] p-3 rounded-lg ${
                              m.sender==='support'
                                ? 'bg-blue-50 text-blue-900'
                                : 'bg-gray-50 text-gray-900'
                            }`}>
                              <div className="flex items-center space-x-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className={m.sender==='support' ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}>
                                    {getInitials(m.senderName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium">{m.senderName}</span>
                              </div>
                              <p className="whitespace-pre-wrap">{m.message}</p>
                              <p className="text-xs text-right mt-1 opacity-70">
                                {new Date(m.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      }
                    </CardContent>

                    {(selected.status==='open' || selected.status==='in-progress') && (
                      <div className="p-4 border-t">
                        <Textarea
                          placeholder="Type your reply…"
                          value={reply}
                          onChange={e => setReply(e.target.value)}
                          className="mb-3"
                        />
                        <div className="flex justify-end">
                          <Button
                            onClick={sendReply}
                            disabled={!reply.trim()}
                          >
                            <Send size={16} className="mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SuperAdminSupport;
