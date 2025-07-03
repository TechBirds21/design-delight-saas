import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Server,
  Search,
  Download,
  RefreshCw,
  AlertTriangle,
  Lock,
  Settings,
  Eye
} from 'lucide-react';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from '@/components/ui/select';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import SuperAdminService from '@/services/super-admin.service';
import type { SystemLog, Clinic } from '@/api/super-admin';
import { toast } from 'sonner';

const Logs: React.FC = () => {
  // state
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [clinicFilter, setClinicFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);

  const logsPerPage = 15;

  // load clinics & logs
  useEffect(() => {
    SuperAdminService.getAllClients()
      .then(setClinics)
      .catch(() => toast.error('Failed to load clinics'));

    loadLogs();
  }, []);

  // reload logs when filters/search change
  useEffect(() => {
    const timer = setTimeout(loadLogs, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, typeFilter, clinicFilter, dateFrom, dateTo]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchTerm || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        clinicId: clinicFilter !== 'all' ? clinicFilter : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      };
      const data = await SuperAdminService.getSystemLogs(filters);
      setLogs(data);
      setCurrentPage(1);
    } catch {
      toast.error('Failed to load system logs');
    } finally {
      setLoading(false);
    }
  };

  // CSV export of *all* filtered logs
  const handleExportLogs = () => {
    if (!logs.length) {
      toast.error('No logs to export');
      return;
    }
    const header = ['Timestamp','Type','Clinic','Action','IP Address','Details'];
    const rows = logs.map(l => [
      `"${new Date(l.timestamp).toISOString()}"`,
      `"${l.type}"`,
      `"${l.clinicName||'System'}"`,
      `"${l.action.replace(/"/g,'""')}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g,'""')}"`
    ]);
    const csv = [header, ...rows].map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hospverse_logs_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported logs as CSV');
  };

  // Pagination
  const indexLast = currentPage * logsPerPage;
  const indexFirst = indexLast - logsPerPage;
  const currentLogs = logs.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(logs.length / logsPerPage);
  const paginate = (n: number) => setCurrentPage(n);

  // Helpers for badge/icon
  const getTypeColor = (t: string) => ({
    api:    'bg-blue-100 text-blue-800 border-blue-200',
    error:  'bg-red-100 text-red-800 border-red-200',
    auth:   'bg-green-100 text-green-800 border-green-200',
    module: 'bg-purple-100 text-purple-800 border-purple-200'
  }[t]||'bg-gray-100 text-gray-800 border-gray-200');
  const getTypeIcon = (t: string) => ({
    api:    <Server size={16} className="text-blue-600"/>,
    error:  <AlertTriangle size={16} className="text-red-600"/>,
    auth:   <Lock size={16} className="text-green-600"/>,
    module: <Settings size={16} className="text-purple-600"/>
  }[t]||<Server size={16} className="text-gray-600"/>);

  const viewLogDetails = (l: SystemLog) => {
    setSelectedLog(l);
    setShowLogDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/super-admin">
              <ArrowLeft size={16} className="mr-2"/>Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">System Logs</h1>
            <p className="text-gray-600">Monitor all system activity</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadLogs}>
            <RefreshCw className="mr-2"/>Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportLogs}>
            <Download className="mr-2"/>Export CSV
          </Button>
        </div>
      </div>

      {/* filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              />
              <Input 
                className="pl-10" 
                placeholder="Search logs…" 
                value={searchTerm}
                onChange={e=>setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger><SelectValue placeholder="Type"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="module">Module</SelectItem>
              </SelectContent>
            </Select>

            <Select value={clinicFilter} onValueChange={setClinicFilter}>
              <SelectTrigger><SelectValue placeholder="Clinic"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clinics</SelectItem>
                {clinics.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="From"
              value={dateFrom}
              onChange={e=>setDateFrom(e.target.value)}
            />
            <Input
              type="date"
              placeholder="To"
              value={dateTo}
              onChange={e=>setDateTo(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server size={18} className="text-blue-500"/>
            <span>Logs ({logs.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading
            ? [...Array(5)].map((_,i)=>(
                <div key={i} className="animate-pulse h-12 bg-gray-200 rounded mb-2"/>
              ))
            : logs.length === 0
              ? (
                <div className="text-center py-12">
                  <Server size={48} className="mx-auto text-gray-300 mb-4"/>
                  <p className="text-gray-500">No logs match your filters.</p>
                </div>
              )
              : <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Clinic</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead className="hidden md:table-cell">IP</TableHead>
                          <TableHead className="text-right">View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentLogs.map(l=>(
                          <TableRow key={l.id}>
                            <TableCell>{new Date(l.timestamp).toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {getTypeIcon(l.type)}
                                <Badge 
                                  variant="outline" 
                                  className={getTypeColor(l.type)}
                                >{l.type}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              {l.clinicName || <span className="text-gray-500">System</span>}
                            </TableCell>
                            <TableCell>{l.action}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs">
                              {l.ipAddress}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={()=>viewLogDetails(l)}
                              >
                                <Eye size={14}/>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <span className="text-sm text-gray-500">
                        Showing {indexFirst+1}-{Math.min(indexLast, logs.length)} of {logs.length}
                      </span>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={()=>paginate(currentPage-1)} 
                          disabled={currentPage===1}
                        >Prev</Button>
                        {[...Array(totalPages)].map((_,i)=>(
                          <Button 
                            key={i} 
                            size="sm"
                            variant={currentPage===i+1?'default':'outline'}
                            onClick={()=>paginate(i+1)}
                          >{i+1}</Button>
                        ))}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={()=>paginate(currentPage+1)} 
                          disabled={currentPage===totalPages}
                        >Next</Button>
                      </div>
                    </div>
                  )}
                </>
          }
        </CardContent>
      </Card>

      {/* details dialog */}
      <Dialog open={showLogDetails} onOpenChange={setShowLogDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(selectedLog.type)}
                <Badge variant="outline" className={getTypeColor(selectedLog.type)}>
                  {selectedLog.type.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
              </div>
              <div>
                <Label>Action</Label>
                <p>{selectedLog.action}</p>
              </div>
              {selectedLog.clinicName && (
                <div>
                  <Label>Clinic</Label>
                  <p>{selectedLog.clinicName}</p>
                </div>
              )}
              <div>
                <Label>IP Address</Label>
                <p className="font-mono">{selectedLog.ipAddress}</p>
              </div>
              <div>
                <Label>Details</Label>
                <pre className="bg-gray-50 p-3 rounded text-sm font-mono whitespace-pre-wrap">
                  {selectedLog.details}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Logs;
