// src/pages/admin/Reports.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Download,
  Mail,
  Printer,
  RefreshCw,
  Filter as FilterIcon,
  DollarSign,
  UserCheck,
  Package as PackageIcon,
  TrendingUp,
} from 'lucide-react';
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
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartTooltip,
} from 'recharts';
import { toast } from 'sonner';
import AdminService from '@/services/admin.service';

// -- Types for report items --
interface RevenueItem {
  date: string;
  revenue: number;
  patients: number;
  avgBill: number;
}
interface PerformanceItem {
  name: string;
  patients: number;
  procedures: number;
}
interface InventoryItem {
  item: string;
  used: number;
  remaining: number;
  reorder: boolean;
}
interface FunnelItem {
  stage: string;
  count: number;
  conversion: string;
}

const Reports: React.FC = () => {
  // Filters
  const [from, setFrom] = useState('2024-05-01');
  const [to, setTo] = useState('2024-05-07');
  const [department, setDepartment] = useState('all');
  const [branch, setBranch] = useState('all');
  const [role, setRole] = useState('all');

  // Loading & data
  const [loading, setLoading] = useState(false);
  const [revenue, setRevenue] = useState<RevenueItem[]>([]);
  const [performance, setPerformance] = useState<PerformanceItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [funnel, setFunnel] = useState<FunnelItem[]>([]);

  // Shared filter payload
  const filters = {
    dateFrom: from,
    dateTo: to,
    department: department !== 'all' ? department : undefined,
    branch: branch !== 'all' ? branch : undefined,
    role: role !== 'all' ? role : undefined,
  };

  // Fetch all reports
  const loadAll = async () => {
    setLoading(true);
    try {
      const [rev, perf, inv, crm] = await Promise.all([
        AdminService.getRevenueReport(filters),
        AdminService.getPerformanceReport(filters),
        AdminService.getInventoryReport(filters),
        AdminService.getCRMReport(filters),
      ]);
      setRevenue(rev);
      setPerformance(perf);
      // Convert InventoryReportItem to InventoryItem format
      const convertedInventory = inv.map((item: any) => ({
        ...item,
        reorder: item.reorder === 'Yes'
      }));
      setInventory(convertedInventory);
      setFunnel(crm);
      toast.success('Reports loaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Export / Email
  const exportCSV = (type: string) => {
    AdminService.exportReportAsCSV(type, filters)
      .then(() => toast.success(`${type} CSV exported`))
      .catch(() => toast.error(`Failed to export ${type}`));
  };
  const emailReport = (type: string) => {
    // AdminService.emailReport doesn't exist - using exportReportAsCSV instead
    AdminService.exportReportAsCSV(type, filters)
      .then(() => toast.success(`${type} report exported`))
      .catch(() => toast.error(`Failed to export ${type}`));
  };

  // Render a loading placeholder
  const skeleton = (
    <div className="animate-pulse space-y-2">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-48 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link to="/admin">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={loadAll}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="animate-spin mr-1" />
          ) : (
            <RefreshCw className="mr-1" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FilterIcon /> Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>From</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div>
              <Label>To</Label>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div>
              <Label>Dept.</Label>
              <Select
                value={department}
                onValueChange={setDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Branch</Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="text-green-500" /> Revenue
          </CardTitle>
          <div className="space-x-2">
            <Button size="sm" onClick={() => exportCSV('Revenue')}>
              <Download className="mr-1" /> CSV
            </Button>
            <Button size="sm" onClick={() => emailReport('Revenue')}>
              <Mail className="mr-1" /> Email
            </Button>
            <Button size="sm" onClick={() => toast.success('Print not implemented')}>
              <Printer className="mr-1" /> Print
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && skeleton}
          {!loading && revenue.length === 0 && (
            <p className="text-center py-8 text-gray-500">No revenue data</p>
          )}
          {!loading && revenue.length > 0 && (
            <>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartTooltip />
                    <Line dataKey="revenue" stroke="#10b981" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Avg Bill</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenue.map((r) => (
                    <TableRow key={r.date}>
                      <TableCell>
                        {new Date(r.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${r.revenue.toLocaleString()}</TableCell>
                      <TableCell>{r.patients}</TableCell>
                      <TableCell>${r.avgBill.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="text-blue-500" /> Staff Performance
          </CardTitle>
          <div className="space-x-2">
            <Button size="sm" onClick={() => exportCSV('StaffPerformance')}>
              <Download className="mr-1" /> CSV
            </Button>
            <Button size="sm" onClick={() => emailReport('StaffPerformance')}>
              <Mail className="mr-1" /> Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && skeleton}
          {!loading && performance.length === 0 && (
            <p className="text-center py-8 text-gray-500">No performance data</p>
          )}
          {!loading && performance.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartTooltip />
                  <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="procedures" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Usage */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <PackageIcon className="text-orange-500" /> Inventory Usage
          </CardTitle>
          <div className="space-x-2">
            <Button size="sm" onClick={() => exportCSV('InventoryUsage')}>
              <Download className="mr-1" /> CSV
            </Button>
            <Button size="sm" onClick={() => emailReport('InventoryUsage')}>
              <Mail className="mr-1" /> Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && skeleton}
          {!loading && inventory.length === 0 && (
            <p className="text-center py-8 text-gray-500">No inventory data</p>
          )}
          {!loading && inventory.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Reorder?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((it) => (
                  <TableRow key={it.item}>
                    <TableCell>{it.item}</TableCell>
                    <TableCell>{it.used}</TableCell>
                    <TableCell>{it.remaining}</TableCell>
                    <TableCell>
                      <Badge
                        variant={it.reorder ? 'destructive' : 'secondary'}
                      >
                        {it.reorder ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CRM Funnel */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="text-purple-500" /> CRM Funnel
          </CardTitle>
          <div className="space-x-2">
            <Button size="sm" onClick={() => exportCSV('CRMFunnel')}>
              <Download className="mr-1" /> CSV
            </Button>
            <Button size="sm" onClick={() => emailReport('CRMFunnel')}>
              <Mail className="mr-1" /> Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && skeleton}
          {!loading && funnel.length === 0 && (
            <p className="text-center py-8 text-gray-500">No funnel data</p>
          )}
          {!loading && funnel.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart layout="vertical" data={funnel}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <RechartTooltip />
                  <Bar dataKey="count" fill="#8b5cf6" barSize={20} radius={[4,4,4,4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
