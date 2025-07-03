// src/pages/Billing.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  DollarSign,
  FileText,
  RefreshCw,
  Plus,
  Search,
  // Filter,
  Eye,
  Printer,
  RotateCcw,
  TrendingUp,
  // Calendar,
  // User,
  // Phone
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
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import BillingService from '@/services/billing.service';
import type { Invoice, BillingStats } from '@/api/billing';
import { toast } from 'sonner';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: { value: string; direction: 'up' | 'down' };
}

const Billing: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<BillingStats>({
    todayRevenue: 0,
    invoicesGenerated: 0,
    pendingPayments: 0,
    refundedToday: 0,
    totalRevenue: 0,
    averageInvoiceValue: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [refundReason, setRefundReason] = useState('');

  // Chart data (replace with real API call if needed)
  const revenueTrendData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const paymentModeData = [
    { name: 'Card', value: 45, color: '#3B82F6' },
    { name: 'UPI', value: 30, color: '#8B5CF6' },
    { name: 'Cash', value: 20, color: '#10B981' },
    { name: 'Bank Transfer', value: 5, color: '#F59E0B' },
  ];

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [searchTerm, statusFilter, paymentModeFilter]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [inv, st] = await Promise.all([
        BillingService.getInvoices({
          search: searchTerm || undefined,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          paymentMode: paymentModeFilter !== 'all' ? paymentModeFilter : undefined,
        }),
        BillingService.getBillingStats(),
      ]);
      setInvoices(inv);
      setStats(st);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load billing data');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    try {
      const inv = await BillingService.getInvoices({
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentMode: paymentModeFilter !== 'all' ? paymentModeFilter : undefined,
      });
      setInvoices(inv);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefund = async () => {
    if (!selectedInvoice || !refundReason) return;
    try {
      await BillingService.refundInvoice(selectedInvoice.id, {
        amount: selectedInvoice.paidAmount,
        reason: refundReason,
      });
      toast.success('Refund processed');
      setShowRefundDialog(false);
      setSelectedInvoice(null);
      setRefundReason('');
      loadAll();
    } catch (e) {
      console.error(e);
      toast.error('Refund failed');
    }
  };

  const getStatusColor = (status: string) => ({
    draft:          'bg-gray-100 text-gray-800',
    sent:           'bg-blue-100 text-blue-800',
    paid:           'bg-green-100 text-green-800',
    'partially-paid':'bg-yellow-100 text-yellow-800',
    overdue:        'bg-red-100 text-red-800',
    refunded:       'bg-purple-100 text-purple-800',
  }[status] ?? 'bg-gray-100 text-gray-800');

  const getModeColor = (mode: string) => ({
    cash:          'bg-green-50 text-green-700',
    card:          'bg-blue-50 text-blue-700',
    upi:           'bg-purple-50 text-purple-700',
    'bank-transfer':'bg-orange-50 text-orange-700',
    insurance:     'bg-gray-50 text-gray-700',
  }[mode] ?? 'bg-gray-50 text-gray-700');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
    const colorClass = {
      blue:   'bg-blue-50 text-blue-600',
      green:  'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    }[color];

    return (
      <Card className="hover:shadow-lg transition">
        <CardContent className="p-4">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
              {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
              {trend && (
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp
                    size={12}
                    className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}
                  />
                  <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'} ml-1>
                    {trend.value}
                  </span>
                </div>
              )}
            </div>
            <div className={`p-2 rounded ${colorClass}`}>
              <Icon size={24} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Billing Dashboard</h1>
          <p className="text-gray-600">Track invoices and payments</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={loadAll}>
            <RefreshCw className="mr-1" /> Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-1" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Revenue"
          value={`$${stats.todayRevenue.toLocaleString()}`}
          subtitle="Payments received"
          icon={DollarSign}
          color="green"
          trend={{ value: '+12%', direction: 'up' }}
        />
        <StatsCard
          title="Invoices Generated"
          value={stats.invoicesGenerated}
          subtitle="Today"
          icon={FileText}
          color="blue"
          trend={{ value: '+8%', direction: 'up' }}
        />
        <StatsCard
          title="Pending Payments"
          value={`$${stats.pendingPayments.toLocaleString()}`}
          subtitle="Outstanding"
          icon={CreditCard}
          color="orange"
        />
        <StatsCard
          title="Refunded Today"
          value={`$${stats.refundedToday.toLocaleString()}`}
          subtitle="Total refunds"
          icon={RotateCcw}
          color="purple"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp /> Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <RechartTooltip formatter={val => `$${(val as number).toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard /> Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentModeData}
                  dataKey="value"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                >
                  {paymentModeData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <RechartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <FileText size={20} />
              <h2 className="text-lg font-medium">Recent Invoices</h2>
              <Badge>{invoices.length}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute top-2 left-2 text-gray-400" size={16} />
                <Input
                  placeholder="Search..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partially-paid">Partially Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={paymentModeFilter}
                onValueChange={setPaymentModeFilter}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <FileText size={48} className="text-gray-300 mx-auto" />
              <p className="text-gray-600">No invoices found.</p>
              <Button>
                <Plus className="mr-1" /> Create Invoice
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left"># / Date</th>
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-left hidden md:table-cell">Doctor</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-right hidden sm:table-cell">Paid</th>
                    <th className="p-3 text-left hidden lg:table-cell">Mode</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{inv.invoiceNumber}</div>
                          <div className="text-xs text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{inv.patientName}</div>
                        <div className="text-xs text-gray-500 sm:hidden">{inv.doctorName}</div>
                        <div className="text-xs text-gray-500 hidden sm:block">{inv.patientPhone}</div>
                      </td>
                      <td className="p-3 hidden md:table-cell">{inv.doctorName}</td>
                      <td className="p-3 text-right font-medium">${inv.totalAmount.toLocaleString()}</td>
                      <td className="p-3 text-right hidden sm:table-cell">
                        <div>${inv.paidAmount.toLocaleString()}</div>
                        {inv.balanceAmount > 0 && (
                          <div className="text-xs text-red-600">Bal: ${inv.balanceAmount.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <Badge className={getModeColor(inv.paymentMode)}>{inv.paymentMode.replace('-', ' ')}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(inv.status)}>{inv.status.replace('-', ' ')}</Badge>
                      </td>
                      <td className="p-3 text-center space-x-1">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/billing/invoice/${inv.id}`}>
                            <Eye size={14} />
                          </Link>
                        </Button>
                        {inv.status === 'paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(inv);
                              setShowRefundDialog(true);
                            }}
                          >
                            <RotateCcw size={14} />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Printer size={14} />
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

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Invoice</DialogTitle>
            <DialogDescription>
              Invoice <strong>{selectedInvoice?.invoiceNumber}</strong> — Amount: <strong>${selectedInvoice?.paidAmount.toLocaleString()}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Reason
              </label>
              <Select value={refundReason} onValueChange={setRefundReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Reason for refund" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-request">Customer Request</SelectItem>
                  <SelectItem value="service-issue">Service Issue</SelectItem>
                  <SelectItem value="billing-error">Billing Error</SelectItem>
                  <SelectItem value="duplicate-payment">Duplicate Payment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowRefundDialog(false)}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!refundReason}
                onClick={handleRefund}
              >
                Process Refund
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Billing;
