import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Eye } from 'lucide-react';

const PurchaseOrders: React.FC = () => {
  const orders = [
    { id: "PO-001", supplier: "MedSupply Co", amount: "$2,450", status: "pending", date: "2024-01-15", items: 5 },
    { id: "PO-002", supplier: "PharmaDist", amount: "$1,800", status: "approved", date: "2024-01-14", items: 3 },
    { id: "PO-003", supplier: "EquipMed", amount: "$3,200", status: "delivered", date: "2024-01-12", items: 8 },
    { id: "PO-004", supplier: "Biotech Supplies", amount: "$950", status: "pending", date: "2024-01-10", items: 2 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Purchase Orders</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">4</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">6</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">2</p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                      {order.id}
                    </div>
                    <div>
                      <p className="font-medium">{order.supplier}</p>
                      <p className="text-sm text-muted-foreground">{order.date} • {order.items} items</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">{order.amount}</p>
                    </div>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' : 
                        order.status === 'approved' ? 'secondary' : 
                        'outline'
                      }
                    >
                      {order.status}
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

export default PurchaseOrders;