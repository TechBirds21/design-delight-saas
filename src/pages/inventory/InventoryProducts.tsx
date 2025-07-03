import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, AlertTriangle } from 'lucide-react';

const InventoryProducts: React.FC = () => {
  const products = [
    { id: 1, name: "Botox 100U", category: "Injectable", stock: 15, minStock: 10, price: "$350", status: "In Stock" },
    { id: 2, name: "Dermal Filler", category: "Injectable", stock: 8, minStock: 12, price: "$280", status: "Low Stock" },
    { id: 3, name: "Laser Tips", category: "Equipment", stock: 25, minStock: 5, price: "$150", status: "In Stock" },
    { id: 4, name: "Numbing Cream", category: "Topical", stock: 50, minStock: 20, price: "$25", status: "In Stock" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Product Inventory</h1>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input 
                  placeholder="Search products..." 
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
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.stock}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{product.price}</p>
                    </div>
                    <Badge 
                      variant={product.status === 'In Stock' ? 'default' : 'destructive'}
                    >
                      {product.status === 'Low Stock' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {product.status}
                    </Badge>
                    <Button size="sm" variant="outline">View Details</Button>
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

export default InventoryProducts;