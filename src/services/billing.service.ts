import api from './api';
import { Invoice, BillingStats, BillingFilters } from '../api/billing';

const BillingService = {
  getInvoices: async (filters: BillingFilters = {}): Promise<Invoice[]> => {
    const response = await api.get('/billing/invoices', { params: filters });
    return response.data;
  },
  
  getInvoiceDetails: async (id: string): Promise<Invoice> => {
    const response = await api.get(`/billing/invoices/${id}`);
    return response.data;
  },
  
  createInvoice: async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
    const response = await api.post('/billing/invoices', invoiceData);
    return response.data;
  },
  
  markAsPaid: async (id: string, paymentData: { 
    amount: number; 
    paymentMode: Invoice['paymentMode']; 
    transactionId?: string; 
    notes?: string 
  }): Promise<Invoice> => {
    const response = await api.post(`/billing/invoices/${id}/pay`, paymentData);
    return response.data;
  },
  
  refundInvoice: async (id: string, refundData: { amount: number; reason: string }): Promise<Invoice> => {
    const response = await api.post(`/billing/invoices/${id}/refund`, refundData);
    return response.data;
  },
  
  getBillingStats: async (): Promise<BillingStats> => {
    const response = await api.get('/billing/stats');
    return response.data;
  },
  
  getProcedures: async (): Promise<any[]> => {
    const response = await api.get('/billing/procedures');
    return response.data;
  }
};

export default BillingService;