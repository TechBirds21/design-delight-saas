import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  AlertTriangle, 
  TrendingDown,
  Plus,
  FileText,
  Calendar,
  Activity
} from 'lucide-react';

const PharmacyDashboard: React.FC = () => {
  const stats = [
    { title: "Total Items", value: "1,247", icon: Package, trend: "+24 new items" },
    { title: "Low Stock Alert", value: "8", icon: AlertTriangle, trend: "Requires attention" },
    { title: "Expired Items", value: "3", icon: TrendingDown, trend: "Remove today" },
    { title: "Monthly Orders", value: "156", icon: ShoppingCart, trend: "+12% vs last month" }
  ];

  const inventory = [
    { id: 1, name: "Retinoid Cream 0.1%", category: "Topical", stock: 25, minStock: 10, status: "good", expiry: "Dec 2024" },
    { id: 2, name: "Hydroquinone Gel 4%", category: "Topical", stock: 5, minStock: 15, status: "low", expiry: "Nov 2024" },
    { id: 3, name: "Sunscreen SPF 50", category: "Protection", stock: 45, minStock: 20, status: "good", expiry: "Mar 2025" },
    { id: 4, name: "Vitamin C Serum", category: "Serum", stock: 2, minStock: 8, status: "critical", expiry: "Jan 2024" },
  ];

  const recentOrders = [
    { id: 1, supplier: "MedSupply Co.", items: 12, amount: "$1,250", status: "delivered", date: "Today" },
    { id: 2, supplier: "PharmaWorks", items: 8, amount: "$850", status: "pending", date: "Yesterday" },
    { id: 3, supplier: "HealthCorp", items: 15, amount: "$2,100", status: "shipped", date: "2 days ago" },
  ];

  const dispensingLog = [
    { id: 1, patient: "Sarah Johnson", medication: "Retinoid Cream", quantity: "1 tube", time: "10:30 AM" },
    { id: 2, patient: "Mike Wilson", medication: "Sunscreen SPF 50", quantity: "2 bottles", time: "11:15 AM" },
    { id: 3, patient: "Emma Davis", medication: "Vitamin C Serum", quantity: "1 bottle", time: "12:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
            <p className="text-gray-600">Manage inventory, purchase orders, and dispensing operations</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              New Order
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
                    <p className="text-sm text-teal-600 mt-1">{stat.trend}</p>
                  </div>
                  <div className="bg-teal-100 p-3 rounded-full">
                    <stat.icon className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-teal-600" />
                Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.category} • Exp: {item.expiry}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{item.stock} units</p>
                      <Badge 
                        variant={
                          item.status === 'good' ? 'default' : 
                          item.status === 'low' ? 'secondary' : 
                          'destructive'
                        }
                        className={
                          item.status === 'good' ? 'bg-green-100 text-green-800' :
                          item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
                Recent Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{order.supplier}</p>
                      <Badge 
                        variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'shipped' ? 'secondary' : 
                          'outline'
                        }
                        className={
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{order.items} items • {order.amount}</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dispensing Log */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-green-600" />
              Today's Dispensing Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dispensingLog.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="font-mono text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {entry.time}
                    </div>
                    <div>
                      <p className="font-medium">{entry.patient}</p>
                      <p className="text-sm text-gray-600">{entry.medication} • {entry.quantity}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    Dispensed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add Item</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <ShoppingCart className="h-6 w-6" />
                <span>Purchase Order</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span>Dispense Log</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Expiry Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PharmacyDashboard;