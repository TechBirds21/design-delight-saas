// src/pages/crm/ConvertedLeads.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  Search, 
  Eye,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Stethoscope
} from 'lucide-react';
import CRMService from '@/services/crm.service';
import type { ConvertedLead } from '@/api/crm';
import { toast } from 'sonner';

const ConvertedLeads: React.FC = () => {
  const navigate = useNavigate();
  const [convertedLeads, setConvertedLeads] = useState<ConvertedLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await CRMService.getConvertedLeads();
        setConvertedLeads(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load converted leads');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredLeads = convertedLeads.filter(lead =>
    lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.mobile.includes(searchTerm) ||
    (lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const getSourceColor = (source: ConvertedLead['source']) => {
    const map: Record<string,string> = {
      whatsapp: 'bg-green-50 text-green-700',
      form:     'bg-blue-50 text-blue-700',
      referral: 'bg-purple-50 text-purple-700',
      instagram:'bg-pink-50 text-pink-700',
      'walk-in':'bg-orange-50 text-orange-700',
      facebook: 'bg-blue-50 text-blue-700',
      google:   'bg-yellow-50 text-yellow-700',
    };
    return map[source] ?? 'bg-gray-50 text-gray-700';
  };

  const totalValue = convertedLeads.reduce((sum, l) => sum + (l.billingValue ?? 0), 0);
  const avgValue = convertedLeads.length
    ? totalValue / convertedLeads.length
    : 0;

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3" />
        {[...Array(5)].map(i => (
          <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/crm')}
          >
            <ArrowLeft size={16} className="mr-2" /> Back to CRM
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Converted Leads</h1>
            <p className="text-gray-600">Leads turned into patients</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            setLoading(true);
            try {
              const data = await CRMService.getConvertedLeads();
              setConvertedLeads(data);
              toast.success('Refreshed');
            } catch {
              toast.error('Failed to refresh');
            } finally {
              setLoading(false);
            }
          }}
        >
          <TrendingUp size={16} className="mr-2" /> Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {convertedLeads.length}
            </p>
            <p className="text-sm text-gray-600">Total Converted</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {convertedLeads.filter(l => {
                const d = new Date(l.convertedAt);
                const now = new Date();
                return (
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              }).length}
            </p>
            <p className="text-sm text-gray-600">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              ${totalValue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              ${Math.round(avgValue).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Average Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search + Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp size={20} /> <span>Converted Leads</span>
            </CardTitle>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 w-64"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matches' : 'No converted leads'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? 'Adjust your search'
                  : 'You haven’t converted any leads yet'}
              </p>
              <Button asChild>
                <Link to="/crm">
                  <ArrowLeft size={16} className="mr-2" /> Back to CRM
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-left hidden sm:table-cell">Contact</th>
                    <th className="p-3 text-left">Source</th>
                    <th className="p-3 text-left hidden md:table-cell">Converted By</th>
                    <th className="p-3 text-left hidden lg:table-cell">Doctor</th>
                    <th className="p-3 text-left hidden lg:table-cell">Value</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map(lead => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <p className="font-medium">{lead.fullName}</p>
                        <p className="text-xs text-gray-500">ID: {lead.patientId}</p>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center">
                            <Phone size={12} className="mr-1" /> {lead.mobile}
                          </div>
                          {lead.email && (
                            <div className="flex items-center">
                              <Mail size={12} className="mr-1" /> {lead.email}
                            </div>
                          )}
                        </div>
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
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={12} className="mr-1" /> {lead.convertedBy}
                        </div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        {lead.assignedDoctor ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <Stethoscope size={12} className="mr-1" />
                            {lead.assignedDoctor}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        {lead.billingValue ? (
                          <div className="flex items-center text-sm text-gray-600">
                            <DollarSign size={12} className="mr-1" />
                            ${lead.billingValue.toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={12} className="mr-1" />{' '}
                          {new Date(lead.convertedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <Button asChild variant="outline" size="sm">
                          <Link to="/patients">
                            <Eye size={12} className="mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Link>
                        </Button>
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

export default ConvertedLeads;
