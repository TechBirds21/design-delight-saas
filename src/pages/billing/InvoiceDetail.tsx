// src/pages/billing/InvoiceDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FileText,
  User,
  Phone,
  DollarSign,
  CreditCard,
  Printer,
  CheckCircle,
  Download,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { toast } from 'sonner';
import BillingService from '@/services/billing.service';
import type { Invoice } from '@/api/billing';

// Utility to pick the right badge color
function getStatusColor(status: Invoice['status']) {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'sent':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'paid':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'partially-paid':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'overdue':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'refunded':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'cash' | 'card' | 'upi' | 'bank-transfer' | 'insurance'>('cash');
  const [txId, setTxId] = useState('');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Load invoice on mount / id change
  useEffect(() => {
    if (!id) {
      navigate('/billing');
      return;
    }
    (async () => {
      try {
        const data = await BillingService.getInvoiceDetails(id);
        setInvoice(data);
        setAmount(data.balanceAmount.toString());
      } catch {
        toast.error('Could not load invoice');
        navigate('/billing');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handlePayment = async () => {
    if (!invoice) return;

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (parsed > invoice.balanceAmount) {
      toast.error('Cannot exceed balance due');
      return;
    }

    setProcessing(true);
    try {
      await BillingService.markAsPaid(invoice.id, {
        amount: parsed,
        paymentMode: mode,
        transactionId: txId || undefined,
        notes: notes || undefined,
      });
      // Refresh
      const updated = await BillingService.getInvoiceDetails(invoice.id);
      setInvoice(updated);
      setAmount(updated.balanceAmount.toString());
      setTxId('');
      setNotes('');
      toast.success('Payment recorded');
    } catch {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const print = () => window.print();

  if (loading) {
    return (
      <div className="animate-pulse p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-lg text-gray-700 mb-4">Invoice not found</p>
        <Button onClick={() => navigate('/billing')}>
          <ArrowLeft className="mr-2" /> Back to Billing
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/billing')}
          >
            <ArrowLeft className="mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
            <p className="text-gray-600">
              Date: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="space-x-2">
          <Button size="sm" onClick={print}>
            <Printer className="mr-1" /> Print
          </Button>
          <Button size="sm" onClick={() => toast.info('PDF download functionality not implemented')}>
            <Download className="mr-1" /> PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Invoice Info & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bill to & Status */}
          <Card>
            <CardHeader className="bg-blue-600 text-white">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Billing Info</span>
                <Badge
                  className={`capitalize ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Bill To</h3>
                  <p className="flex items-center space-x-2">
                    <User /> <span>{invoice.patientName}</span>
                  </p>
                  <p className="flex items-center space-x-2 mt-1">
                    <Phone /> <span>{invoice.patientPhone}</span>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Doctor</h3>
                  <p>{invoice.doctorName}</p>
                  <h3 className="font-semibold mt-4 mb-2">Due Date</h3>
                  <p>{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Services</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th>Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Unit</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.procedures.map((p: any) => (
                    <tr key={p.id} className="border-b">
                      <td>
                        <p className="font-medium">{p.name}</p>
                        {p.description && (
                          <p className="text-sm text-gray-500">{p.description}</p>
                        )}
                      </td>
                      <td className="text-center">{p.quantity}</td>
                      <td className="text-right">
                        ${p.unitPrice.toFixed(2)}
                      </td>
                      <td className="text-right">
                        ${p.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 space-y-1 text-right">
                <div>
                  Subtotal: ${invoice.subtotal.toFixed(2)}
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="text-green-600">
                    Discount ({invoice.discountRate}%): -
                    ${invoice.discountAmount.toFixed(2)}
                  </div>
                )}
                <div>
                  Tax ({invoice.taxRate}%): ${invoice.taxAmount.toFixed(2)}
                </div>
                <div className="font-bold border-t pt-2">
                  Total: ${invoice.totalAmount.toFixed(2)}
                </div>
                <div className="text-green-600">
                  Paid: ${invoice.paidAmount.toFixed(2)}
                </div>
                {invoice.balanceAmount > 0 && (
                  <div className="text-red-600 font-semibold">
                    Balance Due: ${invoice.balanceAmount.toFixed(2)}
                  </div>
                )}
              </div>

              {invoice.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <strong>Notes:</strong> {invoice.notes}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment */}
        <div className="space-y-6">
          {/* Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard /> Payment Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-3">
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    invoice.status === 'paid'
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  {invoice.status === 'paid' ? (
                    <CheckCircle size={32} className="text-green-600" />
                  ) : (
                    <DollarSign size={32} className="text-yellow-600" />
                  )}
                </div>
                <Badge
                  className={`capitalize ${getStatusColor(invoice.status)}`}
                >
                  {invoice.status.replace('-', ' ')}
                </Badge>

                <div className="pt-4 border-t space-y-1">
                  <div>Total: ${invoice.totalAmount.toFixed(2)}</div>
                  <div className="text-green-600">
                    Paid: ${invoice.paidAmount.toFixed(2)}
                  </div>
                  {invoice.balanceAmount > 0 && (
                    <div className="text-red-600">
                      Due: ${invoice.balanceAmount.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Record Payment Form */}
          {invoice.balanceAmount > 0 && invoice.status !== 'refunded' && (
            <Card>
              <CardHeader>
                <CardTitle>Record Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Mode</Label>
                  <Select value={mode} onValueChange={(value: 'cash' | 'card' | 'upi' | 'bank-transfer' | 'insurance') => setMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank-transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {mode !== 'cash' && (
                  <div>
                    <Label>Transaction ID</Label>
                    <Input
                      value={txId}
                      onChange={(e) => setTxId(e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                )}
                <div>
                  <Label>Notes</Label>
                  <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={processing || !amount}
                  className="w-full"
                >
                  {processing ? 'Processing…' : 'Record Payment'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Refund Details */}
          {invoice.status === 'refunded' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">
                  Refund Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <strong>Amount:</strong> ${invoice.refundAmount?.toFixed(2)}
                </div>
                <div>
                  <strong>Date:</strong>{' '}
                  {invoice.refundedAt &&
                    new Date(invoice.refundedAt).toLocaleDateString()}
                </div>
                {invoice.refundReason && (
                  <div>
                    <strong>Reason:</strong> {invoice.refundReason}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
