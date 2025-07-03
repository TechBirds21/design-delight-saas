import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown,
  Plus,
  Minus,
  BarChart3
} from 'lucide-react';

const InventoryManagement: React.FC = () => {
  const inventory = [
    { 
      id: 1, 
      name: "Amoxicillin 500mg", 
      category: "Antibiotics", 
      stock: 150, 
      minStock: 50, 
      status: "good", 
      expiry: "Dec 2024",
      lot: "AMX2024001"
    },
    { 
      id: 2, 
      name: "Ibuprofen 400mg", 
      category: "Pain Relief", 
      stock: 25, 
      minStock: 50, 
      status: "low", 
      expiry: "Nov 2024",
      lot: "IBU2024002"
    },
    { 
      id: 3, 
      name: "Vitamin D3 1000IU", 
      category: "Vitamins", 
      stock: 300, 
      minStock: 100, 
      status: "good", 
      expiry: "Mar 2025",
      lot: "VID2024003"
    },
    { 
      id: 4, 
      name: "Aspirin 75mg", 
      category: "Cardiovascular", 
      stock: 5, 
      minStock: 30, 
      status: "critical", 
      expiry: "Jan 2024",
      lot: "ASP2024004"
    },
  ];

  const lowStockItems = inventory.filter(item => item.status === 'low' || item.status === 'critical');
  const expiringItems = inventory.filter(item => {
    const expiryDate = new Date(item.expiry);
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return expiryDate <= threeMonthsFromNow;
  });

  return (
    <div className="space-y-6">
      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Low Stock Alert</p>
                <p className="text-2xl font-bold text-red-700">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-700">{expiringItems.length}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Inventory */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-purple-600" />
              Current Inventory
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inventory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="font-medium">{item.name}</p>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <span>Category: {item.category}</span>
                    <span>Stock: {item.stock} units</span>
                    <span>Lot: {item.lot}</span>
                    <span>Exp: {item.expiry}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;