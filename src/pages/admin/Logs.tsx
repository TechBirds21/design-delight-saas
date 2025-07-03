// src/pages/admin/Logs.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  RefreshCw,
  Download,
  Search,
  Eye,
  CheckCircle,
  RefreshCw as RefreshIcon,
  XCircle,
  User,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import AdminService from '@/services/admin.service';

// Define the shape of an activity log entry
interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  module: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'error';
  actionDesc: string;
  ipAddress: string;
  details?: string;
}

const Logs: React.FC = () => {
  // State
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all'|'today'|'yesterday'|'week'>('all');
  const [roleFilter, setRoleFilter] = useState<'all'|string>('all');
  const [actionFilter, setActionFilter] = useState<'all'|string>('all');

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 15;

  // Fetch logs on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await AdminService.getActivityLogs();
        setLogs(data as any);
      } catch (err) {
        toast.error('Failed to load logs. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  // Derived lists
  const roleOptions = useMemo(() => {
    const roles = Array.from(new Set(logs.map((l) => l.userRole)));
    return ['all', ...roles];
  }, [logs]);

  const actionOptions = useMemo(() => {
    const actions = Array.from(new Set(logs.map((l) => l.actionType)));
    return ['all', ...actions];
  }, [logs]);

  // Apply filters
  const filtered = useMemo(() => {
    return logs.filter((log) => {
      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        if (
          !log.user.toLowerCase().includes(term) &&
          !log.module.toLowerCase().includes(term) &&
          !log.actionDesc.toLowerCase().includes(term) &&
          !log.ipAddress.includes(term)
        ) return false;
      }
      // Role
      if (roleFilter !== 'all' && log.userRole !== roleFilter) return false;
      // Action
      if (actionFilter !== 'all' && log.actionType !== actionFilter) return false;
      // Date
      if (dateFilter !== 'all') {
        const ts = new Date(log.timestamp);
        const now = new Date();
        if (dateFilter === 'today') {
          if (
            ts.toDateString() !== now.toDateString()
          ) return false;
        } else if (dateFilter === 'yesterday') {
          const yd = new Date(now);
          yd.setDate(yd.getDate() - 1);
          if (ts.toDateString() !== yd.toDateString()) return false;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          if (ts < weekAgo) return false;
        }
      }
      return true;
    });
  }, [logs, searchTerm, roleFilter, actionFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  // Helpers for icons & colors
  const getColor = (type: ActivityLog['actionType']) => ({
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    view: 'bg-gray-100 text-gray-800',
    login: 'bg-purple-100 text-purple-800',
    logout: 'bg-orange-100 text-orange-800',
    error: 'bg-yellow-100 text-yellow-800',
  }[type]);

  const getIcon = (type: ActivityLog['actionType']) => ({
    create: <CheckCircle className="text-green-600" size={16} />,
    update: <RefreshIcon className="text-blue-600" size={16} />,
    delete: <XCircle className="text-red-600" size={16} />,
    view: <Eye className="text-gray-600" size={16} />,
    login: <User className="text-purple-600" size={16} />,
    logout: <User className="text-orange-600" size={16} />,
    error: <AlertTriangle className="text-yellow-600" size={16} />,
  }[type]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2"/>Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Clock size={20} className="mr-2 text-blue-600"/>Activity Logs
        </h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setPage(1); toast.success('Logs refreshed'); }}
          >
            <RefreshCw size={16} className="mr-1"/>Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.success('Exported CSV')}
          >
            <Download size={16} className="mr-1"/>Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={dateFilter} onValueChange={(value: "all" | "today" | "yesterday" | "week") => setDateFilter(value)}>
              <SelectTrigger><SelectValue placeholder="Date"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger><SelectValue placeholder="Role"/></SelectTrigger>
              <SelectContent>
                {roleOptions.map(role => (
                  <SelectItem key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.replace('_',' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger><SelectValue placeholder="Action"/></SelectTrigger>
              <SelectContent>
                {actionOptions.map(act => (
                  <SelectItem key={act} value={act}>
                    {act.charAt(0).toUpperCase()+act.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock size={18} />Entries 
            <Badge variant="outline">{filtered.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[...Array(perPage)].map((_,i)=>(
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : !filtered.length ? (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4"/>
              No logs found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map(log=>(
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          {log.user} <div className="text-xs text-gray-400">{log.userRole}</div>
                        </TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell className="flex items-center space-x-2">
                          {getIcon(log.actionType)}
                          <Badge className={getColor(log.actionType)}>
                            {log.actionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>
                          {log.details && (
                            <Button 
                              variant="ghost" size="sm"
                              onClick={()=>toast.info(log.details)}
                            >
                              <Eye size={14}/>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {(page-1)*perPage+1}-{Math.min(page*perPage, filtered.length)} of {filtered.length}
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" disabled={page===1} onClick={()=>setPage(page-1)}>Prev</Button>
                    {[...Array(totalPages)].map((_,i)=>(
                      <Button 
                        key={i} 
                        size="sm" 
                        variant={page===i+1?'default':'outline'}
                        onClick={()=>setPage(i+1)}
                      >
                        {i+1}
                      </Button>
                    ))}
                    <Button size="sm" variant="outline" disabled={page===totalPages} onClick={()=>setPage(page+1)}>Next</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
