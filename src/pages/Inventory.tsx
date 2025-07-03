import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  AlertTriangle, 
  Calendar, 
  TrendingDown,
  Plus,
  Search, 
  // Filter,
  Eye,
  // Edit,
  RefreshCw,
  // DollarSign,
  BarChart3
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
// import { getProducts, getInventoryStats, addStock, getInventoryLogs } from '@/api/inventory';
// import type { Product, InventoryStats, InventoryLog } from '@/api/inventory';
import { toast } from 'sonner';
import InventoryService from '@/services/inventory.service';

// Temporary types until API is properly defined
interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  costPrice: number;
  vendor: string;
  batchNumber: string;
  expiryDate?: string;
  lastUsed?: string;
}

interface InventoryStats {
  totalProducts: number;
  lowStockAlerts: number;
  expiringSoon: number;
  autoDeductToday: number;
  totalValue: number;
  categoriesCount: number;
}

// interface InventoryLog {
//   id: string;
//   action: string;
//   timestamp: string;
//   user: string;
//   details: string;
// }

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color: 'blue' | 'red' | 'orange' | 'green';
  href?: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    lowStockAlerts: 0,
    expiringSoon: 0,
    autoDeductToday: 0,
    totalValue: 0,
    categoriesCount: 0
  });
  // const [logs] = useState<InventoryLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockLevelFilter, setStockLevelFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddStockDialog, setShowAddStockDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockNotes, setStockNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, categoryFilter, stockLevelFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, statsData] = await Promise.all([
        InventoryService.getProducts({ 
          search: searchTerm, 
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          stockLevel: stockLevelFilter as 'all' | 'low' | 'normal' | 'high' !== 'all' ? stockLevelFilter as 'low' | 'normal' | 'high' : undefined
        }),
        InventoryService.getInventoryStats(),
        // InventoryService.getInventoryLogs()
      ]);
      setProducts(productsData);
      setStats(statsData);
        // setLogs(logsData.slice(0, 10)); // Show only recent 10 logs
    } catch (error) {
      toast.error('Failed to load inventory data');
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const productsData = await InventoryService.getProducts({ 
        search: searchTerm, 
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        stockLevel: stockLevelFilter as 'all' | 'low' | 'normal' | 'high' !== 'all' ? stockLevelFilter as 'low' | 'normal' | 'high' : undefined
      });
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAddStock = async () => {
    if (!selectedProduct || !stockQuantity) return;
    
    const quantity = parseInt(stockQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    try {
      await InventoryService.addStock(selectedProduct.id, quantity, stockNotes);
      await loadData();
      
      setShowAddStockDialog(false);
      setSelectedProduct(null);
      setStockQuantity('');
      setStockNotes('');
      
      toast.success(`Added ${quantity} ${selectedProduct.unit} to ${selectedProduct.name}`);
    } catch (error) {
      toast.error('Failed to add stock');
      console.error('Error adding stock:', error);
    }
  };

  const getStockLevelColor = (product: Product) => {
    if (product.currentStock <= product.minStockLevel) {
      return 'text-red-600 bg-red-50';
    } else if (product.currentStock / product.maxStockLevel <= 0.3) {
      return 'text-orange-600 bg-orange-50';
    } else {
      return 'text-green-600 bg-green-50';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      consumables: 'bg-blue-50 text-blue-700',
      equipment: 'bg-purple-50 text-purple-700',
      medications: 'bg-red-50 text-red-700',
      supplies: 'bg-green-50 text-green-700'
    };
    return colors[category] || 'bg-gray-50 text-gray-700';
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiry <= thirtyDaysFromNow;
  };

  // Chart data
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find((item: any) => item.category === product.category);
    if (existing) {
      existing.count++;
      existing.value += product.currentStock * product.costPrice;
    } else {
      acc.push({ 
        category: product.category, 
        count: 1, 
        value: product.currentStock * product.costPrice 
      });
    }
    return acc;
  }, [] as { category: string; count: number; value: number }[]);

  const stockLevelData = [
    { 
      level: 'Low Stock', 
      count: products.filter(p => p.currentStock <= p.minStockLevel).length,
      color: '#EF4444'
    },
    { 
      level: 'Normal', 
      count: products.filter(p => p.currentStock > p.minStockLevel && p.currentStock / p.maxStockLevel <= 0.8).length,
      color: '#10B981'
    },
    { 
      level: 'High Stock', 
      count: products.filter(p => p.currentStock / p.maxStockLevel > 0.8).length,
      color: '#3B82F6'
    }
  ];

  const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon: Icon, color, href }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      red: 'text-red-600 bg-red-50',
      orange: 'text-orange-600 bg-orange-50',
      green: 'text-green-600 bg-green-50'
    };

    const colorClass = colorClasses[color];

    const CardContentComponent = (
      <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 sm:p-4 rounded-xl ${colorClass}`}>
              <Icon size={24} className="sm:w-7 sm:h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? <Link to={href}>{CardContentComponent}</Link> : CardContentComponent;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Track medical supplies and equipment</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus size={16} className="mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          subtitle={`${stats.categoriesCount} categories`}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          subtitle="Need restocking"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Expiring Soon"
          value={stats.expiringSoon}
          subtitle="Next 30 days"
          icon={Calendar}
          color="orange"
        />
        <StatsCard
          title="Auto-Deduct Today"
          value={stats.autoDeductToday}
          subtitle="Usage tracking"
          icon={TrendingDown}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 size={20} />
              <span>Category Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="category" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    name === 'value' ? `$${value.toLocaleString()}` : value,
                    name === 'value' ? 'Value' : 'Count'
                  ]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock Levels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package size={20} />
              <span>Stock Levels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="count"
                  data={stockLevelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ level, percent }: any) => `${level}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stockLevelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center space-x-2">
              <Package size={20} />
              <span>Products Inventory</span>
            </CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search products..." 
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="consumables">Consumables</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="medications">Medications</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                </SelectContent>
              </Select>
              <Select value={stockLevelFilter} onValueChange={setStockLevelFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'all' || stockLevelFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Start by adding your first product'
                }
              </p>
              <Button>
                <Plus size={16} className="mr-2" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[150px]">Product</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden sm:table-cell">Category</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[100px]">Stock</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden md:table-cell">Vendor</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden lg:table-cell">Expiry</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 hidden lg:table-cell">Last Used</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-900 min-w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 sm:px-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500 sm:hidden">{product.category}</p>
                          <p className="text-xs text-gray-500">Batch: {product.batchNumber}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-xs ${getCategoryColor(product.category)}`}
                        >
                          {product.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStockLevelColor(product)}`}>
                            {product.currentStock} {product.unit}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Min: {product.minStockLevel} | Max: {product.maxStockLevel}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                        <p className="text-sm text-gray-900">{product.vendor}</p>
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">
                        {product.expiryDate ? (
                          <div>
                            <p className={`text-sm ${isExpiringSoon(product.expiryDate) ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                              {new Date(product.expiryDate).toLocaleDateString()}
                            </p>
                            {isExpiringSoon(product.expiryDate) && (
                              <p className="text-xs text-red-500">Expiring soon!</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-2 sm:px-4 hidden lg:table-cell">
                        {product.lastUsed ? (
                          <p className="text-sm text-gray-600">
                            {new Date(product.lastUsed).toLocaleDateString()}
                          </p>
                        ) : (
                          <span className="text-sm text-gray-400">Never</span>
                        )}
                      </td>
                      <td className="py-3 px-2 sm:px-4">
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/inventory/product/${product.id}`}>
                              <Eye size={12} className="sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Link>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowAddStockDialog(true);
                            }}
                          >
                            <Plus size={12} className="sm:mr-1" />
                            <span className="hidden sm:inline">Stock</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Stock Dialog */}
      <Dialog open={showAddStockDialog} onOpenChange={setShowAddStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogDescription>
              Add stock for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedProduct?.currentStock} {selectedProduct?.unit}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700">Quantity to Add</label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
              <Input
                placeholder="Add notes about this stock addition"
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAddStockDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddStock}
                disabled={!stockQuantity}
                className="flex-1"
              >
                Add Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;