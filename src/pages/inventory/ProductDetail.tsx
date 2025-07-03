import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Package, 
  AlertTriangle, 
  Calendar, 
  DollarSign,
  MapPin,
  Plus,
  Minus,
  Edit,
  Archive,
  TrendingDown,
  Clock
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getProductDetails, addStock, adjustStock, getInventoryLogs } from '@/api/inventory';
import type { Product, InventoryLog, StockAdjustment } from '@/api/inventory';
import { toast } from 'sonner';
import InventoryService from '@/services/inventory.service';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddStockDialog, setShowAddStockDialog] = useState(false);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [stockQuantity, setStockQuantity] = useState('');
  const [stockNotes, setStockNotes] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadProductDetails();
    }
  }, [id]);

  const loadProductDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const [productData, logsData] = await Promise.all([
        InventoryService.getProductDetails(id),
        InventoryService.getInventoryLogs(id)
      ]);
      setProduct(productData);
      setLogs(logsData);
    } catch (error) {
      toast.error('Failed to load product details');
      console.error('Error loading product:', error);
      navigate('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async () => {
    if (!id || !stockQuantity) return;
    
    const quantity = parseInt(stockQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    try {
      await InventoryService.addStock(id, quantity, stockNotes);
      await loadProductDetails();
      
      setShowAddStockDialog(false);
      setStockQuantity('');
      setStockNotes('');
      
      toast.success(`Added ${quantity} ${product?.unit} to stock`);
    } catch (error) {
      toast.error('Failed to add stock');
      console.error('Error adding stock:', error);
    }
  };

  const handleAdjustStock = async () => {
    if (!id || !adjustmentQuantity || !adjustmentReason) return;
    
    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }
    
    try {
      const adjustment: StockAdjustment = {
        productId: id,
        quantity,
        type: adjustmentType,
        reason: adjustmentReason,
        notes: adjustmentNotes
      };
      
      await InventoryService.adjustStock(adjustment);
      await loadProductDetails();
      
      setShowAdjustDialog(false);
      setAdjustmentQuantity('');
      setAdjustmentReason('');
      setAdjustmentNotes('');
      
      toast.success(`Stock ${adjustmentType === 'add' ? 'increased' : 'decreased'} by ${quantity} ${product?.unit}`);
    } catch (error) {
      toast.error('Failed to adjust stock');
      console.error('Error adjusting stock:', error);
    }
  };

  const getStockLevelColor = (product: Product) => {
    if (product.currentStock <= product.minStockLevel) {
      return 'text-red-600 bg-red-50 border-red-200';
    } else if (product.currentStock / product.maxStockLevel <= 0.3) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    } else {
      return 'text-green-600 bg-green-50 border-green-200';
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

  const getLogTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'stock-in': 'bg-green-100 text-green-800 border-green-200',
      'stock-out': 'bg-red-100 text-red-800 border-red-200',
      'adjustment': 'bg-blue-100 text-blue-800 border-blue-200',
      'auto-deduct': 'bg-purple-100 text-purple-800 border-purple-200',
      'expired': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type] || colors['adjustment'];
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return expiry <= thirtyDaysFromNow;
  };

  // Generate stock trend data from logs
  const stockTrendData = logs
    .filter(log => ['stock-in', 'stock-out', 'adjustment', 'auto-deduct'].includes(log.type))
    .slice(0, 10)
    .reverse()
    .map((log, index) => ({
      date: new Date(log.createdAt).toLocaleDateString(),
      stock: log.newStock,
      change: log.type === 'stock-in' || (log.type === 'adjustment' && log.newStock > log.previousStock) ? log.quantity : -log.quantity
    }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
        <Button onClick={() => navigate('/inventory')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/inventory')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
            <p className="text-gray-600 mt-1">{product.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Edit size={16} className="mr-2" />
            Edit Product
          </Button>
          <Button variant="outline" size="sm">
            <Archive size={16} className="mr-2" />
            Deactivate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package size={20} />
                <span>Product Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-xl mb-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge 
                        variant="outline" 
                        className={`capitalize ${getCategoryColor(product.category)}`}
                      >
                        {product.category}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={product.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {product.description && (
                      <p className="text-gray-600">{product.description}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch Number:</span>
                      <span className="font-medium">{product.batchNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vendor:</span>
                      <span className="font-medium">{product.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Unit:</span>
                      <span className="font-medium capitalize">{product.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <div className="flex items-center space-x-1">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="font-medium">{product.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Stock Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Stock:</span>
                        <Badge 
                          variant="outline" 
                          className={`font-semibold ${getStockLevelColor(product)}`}
                        >
                          {product.currentStock} {product.unit}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Level:</span>
                        <span className="font-medium">{product.minStockLevel} {product.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Level:</span>
                        <span className="font-medium">{product.maxStockLevel} {product.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost Price:</span>
                        <span className="font-medium">${product.costPrice}</span>
                      </div>
                      {product.sellingPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Selling Price:</span>
                          <span className="font-medium">${product.sellingPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Dates</h4>
                    <div className="space-y-3">
                      {product.manufacturingDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Manufacturing:</span>
                          <span className="font-medium">
                            {new Date(product.manufacturingDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {product.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Expiry:</span>
                          <span className={`font-medium ${isExpiringSoon(product.expiryDate) ? 'text-red-600' : ''}`}>
                            {new Date(product.expiryDate).toLocaleDateString()}
                            {isExpiringSoon(product.expiryDate) && (
                              <span className="text-red-500 text-xs ml-2">Expiring soon!</span>
                            )}
                          </span>
                        </div>
                      )}
                      {product.lastUsed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Used:</span>
                          <span className="font-medium">
                            {new Date(product.lastUsed).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Types */}
              {product.treatmentTypes.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Used in Treatments</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.treatmentTypes.map((treatment) => (
                      <Badge key={treatment} variant="outline" className="bg-blue-50 text-blue-700">
                        {treatment}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <input 
                      type="checkbox" 
                      checked={product.autoDeductEnabled} 
                      readOnly 
                      className="rounded"
                    />
                    <span className="text-sm text-gray-600">Auto-deduction enabled</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stock Trend Chart */}
          {stockTrendData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingDown size={20} />
                  <span>Stock Movement Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stockTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stock" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions & Logs */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Dialog open={showAddStockDialog} onOpenChange={setShowAddStockDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start">
                      <Plus size={16} className="mr-2" />
                      Add Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Stock</DialogTitle>
                      <DialogDescription>
                        Add new stock for {product.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {product.currentStock} {product.unit}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="stock-quantity">Quantity to Add</Label>
                        <Input
                          id="stock-quantity"
                          type="number"
                          placeholder="Enter quantity"
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="stock-notes">Notes (Optional)</Label>
                        <Input
                          id="stock-notes"
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

                <Dialog open={showAdjustDialog} onOpenChange={setShowAdjustDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit size={16} className="mr-2" />
                      Adjust Stock
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adjust Stock</DialogTitle>
                      <DialogDescription>
                        Make manual adjustments to stock levels
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {product.currentStock} {product.unit}
                        </p>
                      </div>
                      
                      <div>
                        <Label htmlFor="adjustment-type">Adjustment Type</Label>
                        <Select value={adjustmentType} onValueChange={(value: 'add' | 'remove') => setAdjustmentType(value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Increase Stock</SelectItem>
                            <SelectItem value="remove">Decrease Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="adjustment-quantity">Quantity</Label>
                        <Input
                          id="adjustment-quantity"
                          type="number"
                          placeholder="Enter quantity"
                          value={adjustmentQuantity}
                          onChange={(e) => setAdjustmentQuantity(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="adjustment-reason">Reason</Label>
                        <Select value={adjustmentReason} onValueChange={setAdjustmentReason}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="damaged">Damaged/Expired</SelectItem>
                            <SelectItem value="lost">Lost/Misplaced</SelectItem>
                            <SelectItem value="found">Found/Recovered</SelectItem>
                            <SelectItem value="correction">Stock Correction</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="adjustment-notes">Notes (Optional)</Label>
                        <Input
                          id="adjustment-notes"
                          placeholder="Additional notes"
                          value={adjustmentNotes}
                          onChange={(e) => setAdjustmentNotes(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex space-x-3">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAdjustDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleAdjustStock}
                          disabled={!adjustmentQuantity || !adjustmentReason}
                          className="flex-1"
                        >
                          Adjust Stock
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full justify-start" disabled>
                  <Archive size={16} className="mr-2" />
                  Deactivate Product
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock size={20} />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No activity recorded</p>
                ) : (
                  logs.slice(0, 10).map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-shrink-0">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getLogTypeColor(log.type)}`}
                        >
                          {log.type.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {log.type === 'stock-in' ? '+' : '-'}{log.quantity} {product.unit}
                        </p>
                        <p className="text-xs text-gray-500">{log.reason}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleDateString()} by {log.performedBy}
                        </p>
                        {log.patientName && (
                          <p className="text-xs text-blue-600">Patient: {log.patientName}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Stock: {log.newStock}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;