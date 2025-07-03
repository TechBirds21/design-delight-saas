import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, Download } from 'lucide-react';

const PayrollManagement: React.FC = () => {
  const payrollData = [
    { id: 1, name: "Dr. Sarah Johnson", salary: "$5,000", status: "paid", month: "January 2024" },
    { id: 2, name: "Mike Wilson", salary: "$3,500", status: "pending", month: "January 2024" },
    { id: 3, name: "Emma Davis", salary: "$3,200", status: "paid", month: "January 2024" },
    { id: 4, name: "John Smith", salary: "$4,000", status: "processing", month: "January 2024" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Payroll Management</h1>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Payroll
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                  <p className="text-3xl font-bold">$48,200</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paid</p>
                  <p className="text-3xl font-bold text-green-600">12</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
                <FileText className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>January 2024 Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payrollData.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{record.name}</p>
                      <p className="text-sm text-muted-foreground">{record.month}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{record.salary}</p>
                    </div>
                    <Badge 
                      variant={
                        record.status === 'paid' ? 'default' : 
                        record.status === 'pending' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {record.status}
                    </Badge>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Payslip
                      </Button>
                      <Button size="sm">Process</Button>
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

export default PayrollManagement;