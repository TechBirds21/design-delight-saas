// src/pages/crm/LeadDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  UserCheck,
  XCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CRMService from '@/services/crm.service';
import type { Lead } from '@/api/crm';
import { toast } from 'sonner';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [newNote, setNewNote] = useState('');
  const [dropReason, setDropReason] = useState('');

  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [showDropDialog, setShowDropDialog] = useState(false);

  useEffect(() => {
    if (id) loadLead();
  }, [id]);

  async function loadLead() {
    try {
      setLoading(true);
      const data = await CRMService.getLead(id!);
      setLead(data);
    } catch {
      toast.error('Failed to load lead');
      navigate('/crm');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(status: Lead['status']) {
    if (!id) return;
    try {
      setIsUpdating(true);
      await CRMService.updateLeadStatus(id, status);
      await loadLead();
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Could not update status');
    } finally {
      setIsUpdating(false);
    }
  }

  async function addNote() {
    if (!id || !newNote.trim()) return;
    try {
      await CRMService.addLeadNote(id, newNote);
      setNewNote('');
      await loadLead();
      toast.success('Note added');
    } catch {
      toast.error('Could not add note');
    }
  }

  async function convertLead() {
    if (!id) return;
    try {
      setIsUpdating(true);
      await CRMService.convertLead(id);
      setShowConvertDialog(false);
      await loadLead();
      toast.success('Converted to patient');
    } catch {
      toast.error('Conversion failed');
    } finally {
      setIsUpdating(false);
    }
  }

  async function dropLead() {
    if (!id || !dropReason) return;
    try {
      setIsUpdating(true);
      await CRMService.dropLead(id, dropReason);
      setShowDropDialog(false);
      await loadLead();
      toast.success('Lead dropped');
    } catch {
      toast.error('Could not drop lead');
    } finally {
      setIsUpdating(false);
    }
  }

  const getStatusColor = (s: string) =>
    ({
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      consulted: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      dropped: 'bg-red-100 text-red-800',
    }[s] ?? 'bg-gray-100 text-gray-800');

  const getSourceColor = (src: string) =>
    ({
      whatsapp: 'bg-green-50 text-green-700',
      form: 'bg-blue-50 text-blue-700',
      referral: 'bg-purple-50 text-purple-700',
      instagram: 'bg-pink-50 text-pink-700',
      'walk-in': 'bg-orange-50 text-orange-700',
      facebook: 'bg-blue-50 text-blue-700',
      google: 'bg-yellow-50 text-yellow-700',
    }[src] ?? 'bg-gray-50 text-gray-700');

  const getStatusIcon = (s: Lead['status']) => {
    switch (s) {
      case 'new': return <Clock size={16} />;
      case 'contacted': return <Phone size={16} />;
      case 'consulted': return <MessageSquare size={16} />;
      case 'converted': return <CheckCircle size={16} />;
      case 'dropped': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-gray-200 rounded" />
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <User size={48} className="text-gray-300 mx-auto" />
        <p className="mt-4 text-gray-700">Lead not found</p>
        <Button onClick={() => navigate('/crm')} className="mt-4">
          <ArrowLeft className="mr-2" /> Back to CRM
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/crm')}
          >
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Lead Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div
                  className="w-20 h-20 bg-blue-500 rounded-full text-white text-2xl flex items-center justify-center mx-auto"
                >
                  {lead.fullName
                    .split(' ')
                    .map((t: string) => t[0])
                    .join('')}
                </div>
                <h2 className="mt-2 font-semibold">{lead.fullName}</h2>
                <div className="inline-flex items-center space-x-2 mt-1">
                  {getStatusIcon(lead.status)}
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone /> <span>{lead.mobile}</span>
                </div>
                {lead.email && (
                  <div className="flex items-center space-x-2">
                    <Mail /> <span>{lead.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar />{' '}
                  <span>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <User /> <span>Assigned: {lead.assignedTo}</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium">Source</h3>
                <Badge className={getSourceColor(lead.source)}>
                  {lead.source}
                </Badge>
              </div>
              {lead.notes && (
                <div>
                  <h3 className="font-medium">Initial Notes</h3>
                  <p className="text-gray-700">{lead.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status update */}
              {lead.status !== 'converted' &&
                lead.status !== 'dropped' && (
                  <div>
                    <Label>Update Status</Label>
                    <Select
                      onValueChange={(v) =>
                        updateStatus(v as Lead['status'])
                      }
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {lead.status !== 'contacted' && (
                          <SelectItem value="contacted">
                            Contacted
                          </SelectItem>
                        )}
                        {lead.status !== 'consulted' && (
                          <SelectItem value="consulted">
                            Consulted
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

              {/* Convert dialog */}
              {lead.status === 'consulted' && (
                <Dialog
                  open={showConvertDialog}
                  onOpenChange={setShowConvertDialog}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <UserCheck className="mr-2" /> Convert
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Convert Lead</DialogTitle>
                      <DialogDescription>
                        Turn this lead into a patient record.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex space-x-3 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowConvertDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={convertLead}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Converting…' : 'Confirm'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Drop dialog */}
              {lead.status !== 'dropped' && (
                <Dialog
                  open={showDropDialog}
                  onOpenChange={setShowDropDialog}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full text-red-600"
                    >
                      <XCircle className="mr-2" /> Drop Lead
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Drop Lead</DialogTitle>
                      <DialogDescription>
                        Select a reason for dropping.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Select
                        value={dropReason}
                        onValueChange={setDropReason}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Reason..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-interested">
                            Not Interested
                          </SelectItem>
                          <SelectItem value="budget-constraints">
                            Budget Constraints
                          </SelectItem>
                          <SelectItem value="wrong-contact">
                            Wrong Contact
                          </SelectItem>
                          <SelectItem value="competitor">
                            Chose Competitor
                          </SelectItem>
                          <SelectItem value="no-response">
                            No Response
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowDropDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={dropLead}
                          disabled={!dropReason || isUpdating}
                        >
                          {isUpdating ? 'Dropping…' : 'Drop Lead'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>

        {/* History & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status history */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock /> Status History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.statusHistory.map((h: any) => (
                <div
                  key={h.id}
                  className="flex items-start space-x-4 border-b pb-4 last:border-b-0"
                >
                  <div>{getStatusIcon(h.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getStatusColor(h.status)}>
                        {h.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        by {h.changedBy}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {new Date(h.changedAt).toLocaleString()}
                    </p>
                    {h.notes && <p className="text-sm">{h.notes}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare /> Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lead.status !== 'converted' &&
                lead.status !== 'dropped' && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Label>Add a note</Label>
                    <Textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mt-1"
                    />
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={addNote}
                      disabled={!newNote.trim()}
                    >
                      <MessageSquare className="mr-2" /> Save Note
                    </Button>
                  </div>
                )}

              {lead.notesHistory.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No notes yet
                </p>
              ) : (
                lead.notesHistory.map((n: any) => (
                  <div
                    key={n.id}
                    className="bg-white p-4 rounded-lg border"
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{n.addedBy}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(n.addedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{n.note}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
