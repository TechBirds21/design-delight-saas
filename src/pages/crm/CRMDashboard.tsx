// src/pages/crm/CRMDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  TrendingUp,
  Clock,
  MessageCircle,
  Plus,
  Search,
  Eye,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import CRMService from '@/services/crm.service';
import type { Lead, CRMStats } from '@/services/crm.service';
import { toast } from 'sonner';

// StatsCard component
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'purple';
  href?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  href,
}) => {
  const colorBg = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  }[color];

  const content = (
    <Card className="hover:shadow transition-shadow">
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorBg}`}>
          <Icon size={24} />
        </div>
      </CardContent>
    </Card>
  );

  return href ? <Link to={href}>{content}</Link> : content;
};

const CRMDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CRMStats>({
    totalLeads: 0,
    converted: 0,
    followUpsDue: 0,
    whatsappLeads: 0,
    conversionRate: 0,
    newLeads: 0,
    contactedLeads: 0,
    consultedLeads: 0,
    droppedLeads: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Lead['status']>(
    'all'
  );
  const [sourceFilter, setSourceFilter] = useState<'all' | Lead['source']>(
    'all'
  );
  const [loading, setLoading] = useState(true);

  // initial load
  useEffect(() => {
    loadAll();
  }, []);

  // reload leads when filters or search change
  useEffect(() => {
    loadLeads();
  }, [searchTerm, statusFilter, sourceFilter]);

  async function loadAll() {
    try {
      setLoading(true);
      const [leadsData, statsData] = await Promise.all([
        CRMService.getLeads({}),
        CRMService.getCRMStats(),
      ]);
      setLeads(leadsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load CRM dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function loadLeads() {
    try {
      const filtered = await CRMService.getLeads({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
      });
      setLeads(filtered);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load leads');
    }
  }

  async function handleStatusUpdate(id: string, newStatus: Lead['status']) {
    try {
      await CRMService.updateLeadStatus(id, newStatus);
      await loadLeads();
      await loadAll();
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  }

  const getStatusColor = (s: Lead['status']) =>
    ({
      new: 'bg-gray-100 text-gray-800',
      contacted: 'bg-blue-100 text-blue-800',
      consulted: 'bg-purple-100 text-purple-800',
      converted: 'bg-green-100 text-green-800',
      dropped: 'bg-red-100 text-red-800',
    }[s] ?? 'bg-gray-100 text-gray-800');

  const getSourceColor = (src: Lead['source']) =>
    ({
      whatsapp: 'bg-green-50 text-green-700',
      form: 'bg-blue-50 text-blue-700',
      referral: 'bg-purple-50 text-purple-700',
      instagram: 'bg-pink-50 text-pink-700',
      'walk-in': 'bg-orange-50 text-orange-700',
      facebook: 'bg-blue-50 text-blue-700',
      google: 'bg-yellow-50 text-yellow-700',
    }[src] ?? 'bg-gray-50 text-gray-700');

  // funnel and pie data
  const funnelData = [
    { name: 'New', value: stats.newLeads },
    { name: 'Contacted', value: stats.contactedLeads },
    { name: 'Consulted', value: stats.consultedLeads },
    { name: 'Converted', value: stats.converted },
  ];
  const sourceData = leads.reduce((acc, l) => {
    const idx = acc.findIndex(x => x.source === l.source);
    if (idx >= 0) acc[idx].count++;
    else acc.push({ source: l.source, count: 1 });
    return acc;
  }, [] as { source: string; count: number }[]);

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
          <p className="text-gray-600">Manage and track your leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline" onClick={loadAll}>
            <Clock size={16} className="mr-2" /> Refresh
          </Button>
          <Button asChild size="sm">
            <Link to="/crm/add-lead">
              <Plus size={16} className="mr-2" /> Add Lead
            </Link>
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value={stats.totalLeads}
          subtitle={`${stats.conversionRate}% Converted`}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Converted"
          value={stats.converted}
          icon={TrendingUp}
          color="green"
          href="/crm/converted"
        />
        <StatsCard
          title="Follow-ups Due"
          value={stats.followUpsDue}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="WhatsApp Leads"
          value={stats.whatsappLeads}
          icon={MessageCircle}
          color="purple"
        />
      </div>

      {/* charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} /> Lead Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users size={20} /> Lead Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {sourceData.map((entry, i) => (
                    <Cell key={i} fill={`hsl(${i * 60},70%,60%)`} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* leads table + filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Users size={20} /> Recent Leads
            </CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10 w-64"
                  placeholder="Search..."
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
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="consulted">Consulted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sourceFilter}
                onValueChange={v => setSourceFilter(v as any)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="form">Form</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting filters or add your first lead.
              </p>
              <Button asChild>
                <Link to="/crm/add-lead">
                  <Plus size={16} className="mr-2" /> Add Lead
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left hidden sm:table-cell">Contact</th>
                    <th className="p-3 text-left">Source</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left hidden md:table-cell">
                      Created
                    </th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr
                      key={lead.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <p className="font-medium">{lead.fullName}</p>
                      </td>
                      <td className="p-3 hidden sm:table-cell text-gray-600 text-sm">
                        {lead.mobile}
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${getSourceColor(
                            lead.source
                          )}`}
                        >
                          {lead.source}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={`capitalize text-xs ${getStatusColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell text-gray-600 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 space-x-2">
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/crm/lead/${lead.id}`}>
                            <Eye size={12} /> View
                          </Link>
                        </Button>
                        {lead.status === 'consulted' && (
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(lead.id, 'converted')
                            }
                          >
                            <UserCheck size={12} /> Convert
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CRMDashboard;
