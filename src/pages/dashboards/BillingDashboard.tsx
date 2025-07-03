import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const BillingDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: "Today's Revenue", value: "$2,450", icon: DollarSign, trend: "+18%" },
    { title: "Pending Invoices", value: "12", icon: FileText, trend: "+5%" },
    { title: "Overdue Payments", value: "3", icon: AlertTriangle, trend: "-12%" },
    { title: "Collections", value: "$8,200", icon: TrendingUp, trend: "+22%" }
  ];

  const invoices = [
    { id: "INV-001", patient: "Sarah Johnson", amount: "$250", status: "paid", date: "2024-01-15" },
    { id: "INV-002", patient: "Mike Wilson", amount: "$180", status: "pending", date: "2024-01-14" },
    { id: "INV-003", patient: "Emma Davis", amount: "$320", status: "overdue", date: "2024-01-10" },
    { id: "INV-004", patient: "John Smith", amount: "$150", status: "paid", date: "2024-01-15" },
  ];

  const payments = [
    { id: 1, patient: "Sarah Johnson", amount: "$250", method: "Card", time: "10:30 AM" },
    { id: 2, patient: "John Smith", amount: "$150", method: "Cash", time: "11:15 AM" },
    { id: 3, patient: "Lisa Brown", amount: "$300", method: "Insurance", time: "12:00 PM" },
  ];

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Billing Dashboard</h1>
            <p className="text-gray-600">Manage invoices, payments, and financial operations</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
            <Button variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Process Payment
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-blue-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-600" />
                Recent Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {invoice.id}
                      </div>
                      <div>
                        <p className="font-medium">{invoice.patient}</p>
                        <p className="text-sm text-gray-600">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount}</p>
                      <Badge 
                        variant={
                          invoice.status === 'paid' ? 'default' : 
                          invoice.status === 'pending' ? 'secondary' : 
                          'destructive'
                        }
                        className={
                          invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Payments */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Today's Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{payment.patient}</p>
                      <p className="text-sm text-gray-600">{payment.method} • {payment.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{payment.amount}</p>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Paid
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/billing/invoices')}>
                <FileText className="h-6 w-6" />
                <span>Create Invoice</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/billing/payments')}>
                <CreditCard className="h-6 w-6" />
                <span>Process Payment</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <RefreshCw className="h-6 w-6" />
                <span>Send Reminder</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2" onClick={() => navigate('/billing/reports')}>
                <TrendingUp className="h-6 w-6" />
                <span>Financial Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default BillingDashboard;