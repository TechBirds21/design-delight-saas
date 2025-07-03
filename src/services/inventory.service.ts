import api from './api';
import { Product, InventoryLog, InventoryStats, StockAdjustment, InventoryFilters } from '../api/inventory';

const InventoryService = {
  getProducts: async (filters: InventoryFilters = {}): Promise<Product[]> => {
    const response = await api.get('/inventory/products', { params: filters });
    return response.data;
  },
  
  getProductDetails: async (id: string): Promise<Product> => {
    const response = await api.get(`/inventory/products/${id}`);
    return response.data;
  },
  
  addStock: async (productId: string, quantity: number, notes?: string): Promise<Product> => {
    const response = await api.post(`/inventory/products/${productId}/add-stock`, { quantity, notes });
    return response.data;
  },
  
  deductProduct: async (productId: string, quantity: number, reason: string, treatmentId?: string, patientName?: string): Promise<Product> => {
    const response = await api.post(`/inventory/products/${productId}/deduct`, { 
      quantity, 
      reason, 
      treatmentId, 
      patientName 
    });
    return response.data;
  },
  
  adjustStock: async (adjustment: StockAdjustment): Promise<Product> => {
    const response = await api.post('/inventory/products/adjust', adjustment);
    return response.data;
  },
  
  getInventoryLogs: async (productId?: string): Promise<InventoryLog[]> => {
    const response = await api.get('/inventory/logs', { 
      params: { productId } 
    });
    return response.data;
  },
  
  getInventoryStats: async (): Promise<InventoryStats> => {
    const response = await api.get('/inventory/stats');
    return response.data;
  },
  
  getVendors: async (): Promise<string[]> => {
    const response = await api.get('/inventory/vendors');
    return response.data;
  },
  
  getTreatmentTypes: async (): Promise<string[]> => {
    const response = await api.get('/inventory/treatment-types');
    return response.data;
  }
};

export default InventoryService;