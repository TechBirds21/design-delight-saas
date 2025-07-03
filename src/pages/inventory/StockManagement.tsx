import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, TrendingUp, TrendingDown } from 'lucide-react';

const StockManagement: React.FC = () => {
  const stockItems = [
    { id: 1, product: "Botox 100U", current: 15, reorder: 10, lastOrder: "2024-01-10", trend: "up" },
    { id: 2, product: "Dermal Filler", current: 8, reorder: 12, lastOrder: "2024-01-08", trend: "down" },
    { id: 3, product: "Laser Tips", current: 25, reorder: 5, lastOrder: "2024-01-05", trend: "up" },
    { id: 4, product: "Numbing Cream", current: 50, reorder: 20, lastOrder: "2024-01-12", trend: "stable" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Stock Management</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold">148</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <p className="text-3xl font-bold text-orange-600">8</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reorder Soon</p>
                  <p className="text-3xl font-bold text-red-600">3</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="text-sm text-muted-foreground">Last ordered: {item.lastOrder}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Current</p>
                      <p className="font-medium">{item.current}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Reorder At</p>
                      <p className="font-medium">{item.reorder}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                      {item.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                      <Badge 
                        variant={item.current > item.reorder ? 'default' : 'destructive'}
                      >
                        {item.current > item.reorder ? 'Good' : 'Low'}
                      </Badge>
                    </div>
                    <Button size="sm">Reorder</Button>
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

export default StockManagement;