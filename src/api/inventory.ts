// Mock API functions for Inventory module
// In a real application, these would make HTTP requests to your backend

// Types
interface Product {
  id: string;
  name: string;
  category: 'consumables' | 'equipment' | 'medications' | 'supplies';
  batchNumber: string;
  vendor: string;
  costPrice: number;
  sellingPrice?: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: 'pieces' | 'ml' | 'grams' | 'boxes' | 'vials';
  expiryDate?: string;
  manufacturingDate?: string;
  location: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  autoDeductEnabled: boolean;
  treatmentTypes: string[]; // Which treatments this product is used for
}

interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: 'stock-in' | 'stock-out' | 'adjustment' | 'expired' | 'auto-deduct';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  treatmentId?: string;
  patientName?: string;
  performedBy: string;
  createdAt: string;
  notes?: string;
}

interface InventoryStats {
  totalProducts: number;
  lowStockAlerts: number;
  expiringSoon: number;
  autoDeductToday: number;
  totalValue: number;
  categoriesCount: number;
}

interface StockAdjustment {
  productId: string;
  quantity: number;
  type: 'add' | 'remove';
  reason: string;
  notes?: string;
}

interface InventoryFilters {
  category?: string;
  vendor?: string;
  expiryFrom?: string;
  expiryTo?: string;
  stockLevel?: 'all' | 'low' | 'normal' | 'high';
  search?: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  PRODUCTS: 'hospverse_inventory_products',
  INVENTORY_LOGS: 'hospverse_inventory_logs'
};

// Helper function to get data from localStorage
const getStorageData = <T>(key: string, defaultValue: T[] = []): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const setStorageData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Generate unique ID
const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Mock vendors
const VENDORS = [
  'MedSupply Corp',
  'Healthcare Solutions Ltd',
  'BioMed Distributors',
  'Pharma Plus',
  'Medical Equipment Co',
  'Aesthetic Supplies Inc'
];

// Mock treatment types
const TREATMENT_TYPES = [
  'Laser Hair Removal',
  'PRP Treatment',
  'Chemical Peel',
  'Microneedling',
  'Botox Injection',
  'Dermal Fillers',
  'Acne Treatment',
  'Consultation'
];

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Laser Gel',
        category: 'consumables',
        batchNumber: 'LG2024001',
        vendor: 'MedSupply Corp',
        costPrice: 25,
        sellingPrice: 35,
        currentStock: 15,
        minStockLevel: 10,
        maxStockLevel: 50,
        unit: 'ml',
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Storage Room A',
        description: 'Cooling gel for laser treatments',
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        autoDeductEnabled: true,
        treatmentTypes: ['Laser Hair Removal']
      },
      {
        id: '2',
        name: 'PRP Tubes',
        category: 'supplies',
        batchNumber: 'PRP2024002',
        vendor: 'BioMed Distributors',
        costPrice: 15,
        currentStock: 8,
        minStockLevel: 15,
        maxStockLevel: 100,
        unit: 'pieces',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Refrigerator B',
        description: 'Sterile tubes for PRP preparation',
        isActive: true,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        autoDeductEnabled: true,
        treatmentTypes: ['PRP Treatment']
      },
      {
        id: '3',
        name: 'Chemical Peel Solution',
        category: 'medications',
        batchNumber: 'CPS2024003',
        vendor: 'Pharma Plus',
        costPrice: 80,
        sellingPrice: 120,
        currentStock: 25,
        minStockLevel: 5,
        maxStockLevel: 30,
        unit: 'ml',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturingDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Chemical Storage',
        description: 'TCA 20% solution for chemical peels',
        isActive: true,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        autoDeductEnabled: true,
        treatmentTypes: ['Chemical Peel']
      },
      {
        id: '4',
        name: 'Microneedling Cartridges',
        category: 'supplies',
        batchNumber: 'MNC2024004',
        vendor: 'Aesthetic Supplies Inc',
        costPrice: 12,
        currentStock: 45,
        minStockLevel: 20,
        maxStockLevel: 100,
        unit: 'pieces',
        expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Treatment Room 1',
        description: 'Sterile cartridges for microneedling device',
        isActive: true,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        autoDeductEnabled: true,
        treatmentTypes: ['Microneedling']
      },
      {
        id: '5',
        name: 'Botox Vials',
        category: 'medications',
        batchNumber: 'BTX2024005',
        vendor: 'Pharma Plus',
        costPrice: 300,
        sellingPrice: 450,
        currentStock: 3,
        minStockLevel: 5,
        maxStockLevel: 20,
        unit: 'vials',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        manufacturingDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        location: 'Refrigerator A',
        description: 'Botulinum toxin type A, 100 units',
        isActive: true,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        autoDeductEnabled: true,
        treatmentTypes: ['Botox Injection']
      }
    ];
    setStorageData(STORAGE_KEYS.PRODUCTS, mockProducts);
  }

  if (!localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS)) {
    const mockLogs: InventoryLog[] = [
      {
        id: '1',
        productId: '1',
        productName: 'Laser Gel',
        type: 'auto-deduct',
        quantity: 5,
        previousStock: 20,
        newStock: 15,
        reason: 'Used in laser hair removal treatment',
        treatmentId: 'T001',
        patientName: 'John Doe',
        performedBy: 'Sarah Wilson',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        notes: 'Automatic deduction for laser treatment'
      },
      {
        id: '2',
        productId: '2',
        productName: 'PRP Tubes',
        type: 'auto-deduct',
        quantity: 2,
        previousStock: 10,
        newStock: 8,
        reason: 'Used in PRP treatment',
        treatmentId: 'T002',
        patientName: 'Jane Smith',
        performedBy: 'Mike Johnson',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Automatic deduction for PRP treatment'
      },
      {
        id: '3',
        productId: '3',
        productName: 'Chemical Peel Solution',
        type: 'stock-in',
        quantity: 50,
        previousStock: 0,
        newStock: 50,
        reason: 'New stock received',
        performedBy: 'Admin',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Initial stock entry'
      }
    ];
    setStorageData(STORAGE_KEYS.INVENTORY_LOGS, mockLogs);
  }
};

// Initialize mock data
initializeMockData();

// API Functions
export const getProducts = async (filters: InventoryFilters = {}): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
      
      // Apply filters
      if (filters.category && filters.category !== 'all') {
        products = products.filter(product => product.category === filters.category);
      }
      
      if (filters.vendor && filters.vendor !== 'all') {
        products = products.filter(product => product.vendor === filters.vendor);
      }
      
      if (filters.stockLevel && filters.stockLevel !== 'all') {
        products = products.filter(product => {
          const stockRatio = product.currentStock / product.maxStockLevel;
          switch (filters.stockLevel) {
            case 'low':
              return product.currentStock <= product.minStockLevel;
            case 'normal':
              return product.currentStock > product.minStockLevel && stockRatio <= 0.8;
            case 'high':
              return stockRatio > 0.8;
            default:
              return true;
          }
        });
      }
      
      if (filters.expiryFrom && filters.expiryTo) {
        const fromDate = new Date(filters.expiryFrom);
        const toDate = new Date(filters.expiryTo);
        products = products.filter(product => {
          if (!product.expiryDate) return false;
          const expiryDate = new Date(product.expiryDate);
          return expiryDate >= fromDate && expiryDate <= toDate;
        });
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.batchNumber.toLowerCase().includes(searchTerm) ||
          product.vendor.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by name
      products.sort((a, b) => a.name.localeCompare(b.name));
      
      resolve(products);
    }, 300);
  });
};

export const getProductDetails = async (id: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
      const product = products.find(p => p.id === id);
      
      if (product) {
        resolve(product);
      } else {
        reject(new Error('Product not found'));
      }
    }, 200);
  });
};

export const addStock = async (productId: string, quantity: number, notes?: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex === -1) {
        reject(new Error('Product not found'));
        return;
      }
      
      const product = products[productIndex];
      const previousStock = product.currentStock;
      const newStock = previousStock + quantity;
      
      // Update product
      products[productIndex] = {
        ...product,
        currentStock: newStock,
        updatedAt: new Date().toISOString()
      };
      
      // Add inventory log
      const logs = getStorageData<InventoryLog>(STORAGE_KEYS.INVENTORY_LOGS);
      const newLog: InventoryLog = {
        id: generateId(),
        productId,
        productName: product.name,
        type: 'stock-in',
        quantity,
        previousStock,
        newStock,
        reason: 'Stock added',
        performedBy: 'Current User', // In real app, get from auth context
        createdAt: new Date().toISOString(),
        notes
      };
      logs.unshift(newLog);
      
      setStorageData(STORAGE_KEYS.PRODUCTS, products);
      setStorageData(STORAGE_KEYS.INVENTORY_LOGS, logs);
      
      resolve(products[productIndex]);
    }, 500);
  });
};

export const deductProduct = async (productId: string, quantity: number, reason: string, treatmentId?: string, patientName?: string): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex === -1) {
        reject(new Error('Product not found'));
        return;
      }
      
      const product = products[productIndex];
      
      if (product.currentStock < quantity) {
        reject(new Error('Insufficient stock'));
        return;
      }
      
      const previousStock = product.currentStock;
      const newStock = previousStock - quantity;
      
      // Update product
      products[productIndex] = {
        ...product,
        currentStock: newStock,
        lastUsed: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add inventory log
      const logs = getStorageData<InventoryLog>(STORAGE_KEYS.INVENTORY_LOGS);
      const newLog: InventoryLog = {
        id: generateId(),
        productId,
        productName: product.name,
        type: 'auto-deduct',
        quantity,
        previousStock,
        newStock,
        reason,
        treatmentId,
        patientName,
        performedBy: 'System', // Auto-deduction
        createdAt: new Date().toISOString()
      };
      logs.unshift(newLog);
      
      setStorageData(STORAGE_KEYS.PRODUCTS, products);
      setStorageData(STORAGE_KEYS.INVENTORY_LOGS, logs);
      
      resolve(products[productIndex]);
    }, 400);
  });
};

export const adjustStock = async (adjustment: StockAdjustment): Promise<Product> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
      const productIndex = products.findIndex(p => p.id === adjustment.productId);
      
      if (productIndex === -1) {
        reject(new Error('Product not found'));
        return;
      }
      
      const product = products[productIndex];
      const previousStock = product.currentStock;
      const quantity = adjustment.type === 'add' ? adjustment.quantity : -adjustment.quantity;
      const newStock = previousStock + quantity;
      
      if (newStock < 0) {
        reject(new Error('Stock cannot be negative'));
        return;
      }
      
      // Update product
      products[productIndex] = {
        ...product,
        currentStock: newStock,
        updatedAt: new Date().toISOString()
      };
      
      // Add inventory log
      const logs = getStorageData<InventoryLog>(STORAGE_KEYS.INVENTORY_LOGS);
      const newLog: InventoryLog = {
        id: generateId(),
        productId: adjustment.productId,
        productName: product.name,
        type: 'adjustment',
        quantity: Math.abs(quantity),
        previousStock,
        newStock,
        reason: adjustment.reason,
        performedBy: 'Current User', // In real app, get from auth context
        createdAt: new Date().toISOString(),
        notes: adjustment.notes
      };
      logs.unshift(newLog);
      
      setStorageData(STORAGE_KEYS.PRODUCTS, products);
      setStorageData(STORAGE_KEYS.INVENTORY_LOGS, logs);
      
      resolve(products[productIndex]);
    }, 500);
  });
};

export const getInventoryLogs = async (productId?: string): Promise<InventoryLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let logs = getStorageData<InventoryLog>(STORAGE_KEYS.INVENTORY_LOGS);
      
      if (productId) {
        logs = logs.filter(log => log.productId === productId);
      }
      
      // Sort by creation date (newest first)
      logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      resolve(logs);
    }, 300);
  });
};

export const getInventoryStats = async (): Promise<InventoryStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = getStorageData<Product>(STORAGE_KEYS.PRODUCTS);
      const logs = getStorageData<InventoryLog>(STORAGE_KEYS.INVENTORY_LOGS);
      
      const totalProducts = products.filter(p => p.isActive).length;
      
      const lowStockAlerts = products.filter(p => 
        p.isActive && p.currentStock <= p.minStockLevel
      ).length;
      
      // Products expiring in next 30 days
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const expiringSoon = products.filter(p => 
        p.isActive && p.expiryDate && new Date(p.expiryDate) <= thirtyDaysFromNow
      ).length;
      
      // Auto-deductions today
      const today = new Date().toISOString().split('T')[0];
      const autoDeductToday = logs.filter(log => 
        log.type === 'auto-deduct' && log.createdAt.split('T')[0] === today
      ).length;
      
      const totalValue = products
        .filter(p => p.isActive)
        .reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0);
      
      const categoriesCount = new Set(products.filter(p => p.isActive).map(p => p.category)).size;
      
      resolve({
        totalProducts,
        lowStockAlerts,
        expiringSoon,
        autoDeductToday,
        totalValue,
        categoriesCount
      });
    }, 300);
  });
};

export const getVendors = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(VENDORS);
    }, 100);
  });
};

export const getTreatmentTypes = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(TREATMENT_TYPES);
    }, 100);
  });
};

// Export types for use in components
export type { Product, InventoryLog, InventoryStats, StockAdjustment, InventoryFilters };