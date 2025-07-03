import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Plus, Eye } from 'lucide-react';

const InvoiceManagement: React.FC = () => {
  const invoices = [
    { id: "INV-001", patient: "Sarah Johnson", amount: "$250", status: "paid", date: "2024-01-15" },
    { id: "INV-002", patient: "Mike Wilson", amount: "$180", status: "pending", date: "2024-01-14" },
    { id: "INV-003", patient: "Emma Davis", amount: "$320", status: "overdue", date: "2024-01-10" },
    { id: "INV-004", patient: "John Smith", amount: "$150", status: "paid", date: "2024-01-15" },
    { id: "INV-005", patient: "Lisa Brown", amount: "$200", status: "pending", date: "2024-01-13" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Invoice Management</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search by invoice ID, patient name..." 
                  className="w-full"
                />
              </div>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {invoice.id}
                    </div>
                    <div>
                      <p className="font-medium">{invoice.patient}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{invoice.amount}</p>
                    </div>
                    <Badge 
                      variant={
                        invoice.status === 'paid' ? 'default' : 
                        invoice.status === 'pending' ? 'secondary' : 
                        'destructive'
                      }
                    >
                      {invoice.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceManagement;