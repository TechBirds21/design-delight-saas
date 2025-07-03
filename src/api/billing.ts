// Mock API functions for Billing module
// In a real application, these would make HTTP requests to your backend

// Types
interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  sessionId?: string;
  procedures: InvoiceProcedure[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentMode: 'cash' | 'card' | 'upi' | 'bank-transfer' | 'insurance';
  status: 'draft' | 'sent' | 'paid' | 'partially-paid' | 'overdue' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  refundReason?: string;
}

interface InvoiceProcedure {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

interface BillingStats {
  todayRevenue: number;
  invoicesGenerated: number;
  pendingPayments: number;
  refundedToday: number;
  totalRevenue: number;
  averageInvoiceValue: number;
}

interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMode: Invoice['paymentMode'];
  transactionId?: string;
  paidAt: string;
  notes?: string;
}

interface BillingFilters {
  dateFrom?: string;
  dateTo?: string;
  doctor?: string;
  paymentMode?: string;
  status?: string;
  search?: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  INVOICES: 'hospverse_billing_invoices',
  PAYMENTS: 'hospverse_billing_payments'
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

// Generate invoice number
const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `INV${year}${month}${random}`;
};

// Mock procedures for invoice creation
const PROCEDURES = [
  { id: '1', name: 'Laser Hair Removal', unitPrice: 150 },
  { id: '2', name: 'PRP Treatment', unitPrice: 300 },
  { id: '3', name: 'Chemical Peel', unitPrice: 120 },
  { id: '4', name: 'Microneedling', unitPrice: 200 },
  { id: '5', name: 'Botox Injection', unitPrice: 400 },
  { id: '6', name: 'Dermal Fillers', unitPrice: 500 },
  { id: '7', name: 'Acne Treatment', unitPrice: 80 },
  { id: '8', name: 'Consultation', unitPrice: 50 }
];

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.INVOICES)) {
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV240001',
        patientId: 'p1',
        patientName: 'John Doe',
        patientPhone: '+1-555-0123',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson',
        procedures: [
          {
            id: '1',
            name: 'Laser Hair Removal',
            quantity: 1,
            unitPrice: 150,
            totalPrice: 150,
            description: 'Upper lip and chin area'
          },
          {
            id: '2',
            name: 'Consultation',
            quantity: 1,
            unitPrice: 50,
            totalPrice: 50
          }
        ],
        subtotal: 200,
        taxRate: 10,
        taxAmount: 20,
        discountRate: 5,
        discountAmount: 10,
        totalAmount: 210,
        paidAmount: 210,
        balanceAmount: 0,
        paymentMode: 'card',
        status: 'paid',
        notes: 'Payment completed via credit card',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        paidAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        invoiceNumber: 'INV240002',
        patientId: 'p2',
        patientName: 'Jane Smith',
        patientPhone: '+1-555-0124',
        doctorId: 'dr2',
        doctorName: 'Dr. Michael Chen',
        procedures: [
          {
            id: '3',
            name: 'PRP Treatment',
            quantity: 1,
            unitPrice: 300,
            totalPrice: 300,
            description: 'Hair restoration treatment'
          }
        ],
        subtotal: 300,
        taxRate: 10,
        taxAmount: 30,
        discountRate: 0,
        discountAmount: 0,
        totalAmount: 330,
        paidAmount: 150,
        balanceAmount: 180,
        paymentMode: 'upi',
        status: 'partially-paid',
        notes: 'Partial payment received, balance pending',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        invoiceNumber: 'INV240003',
        patientId: 'p3',
        patientName: 'Mike Johnson',
        patientPhone: '+1-555-0125',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson',
        procedures: [
          {
            id: '4',
            name: 'Chemical Peel',
            quantity: 1,
            unitPrice: 120,
            totalPrice: 120
          },
          {
            id: '5',
            name: 'Microneedling',
            quantity: 1,
            unitPrice: 200,
            totalPrice: 200
          }
        ],
        subtotal: 320,
        taxRate: 10,
        taxAmount: 32,
        discountRate: 10,
        discountAmount: 32,
        totalAmount: 320,
        paidAmount: 0,
        balanceAmount: 320,
        paymentMode: 'cash',
        status: 'sent',
        notes: 'Invoice sent to patient',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    setStorageData(STORAGE_KEYS.INVOICES, mockInvoices);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        invoiceId: '1',
        amount: 210,
        paymentMode: 'card',
        transactionId: 'TXN123456789',
        paidAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        notes: 'Full payment via credit card'
      },
      {
        id: '2',
        invoiceId: '2',
        amount: 150,
        paymentMode: 'upi',
        transactionId: 'UPI987654321',
        paidAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        notes: 'Partial payment via UPI'
      }
    ];
    setStorageData(STORAGE_KEYS.PAYMENTS, mockPayments);
  }
};

// Initialize mock data
initializeMockData();

// API Functions
export const getInvoices = async (filters: BillingFilters = {}): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let invoices = getStorageData<Invoice>(STORAGE_KEYS.INVOICES);
      
      // Apply filters
      if (filters.dateFrom && filters.dateTo) {
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        invoices = invoices.filter(invoice => {
          const invoiceDate = new Date(invoice.createdAt);
          return invoiceDate >= fromDate && invoiceDate <= toDate;
        });
      }
      
      if (filters.doctor && filters.doctor !== 'all') {
        invoices = invoices.filter(invoice => invoice.doctorName === filters.doctor);
      }
      
      if (filters.paymentMode && filters.paymentMode !== 'all') {
        invoices = invoices.filter(invoice => invoice.paymentMode === filters.paymentMode);
      }
      
      if (filters.status && filters.status !== 'all') {
        invoices = invoices.filter(invoice => invoice.status === filters.status);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        invoices = invoices.filter(invoice => 
          invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
          invoice.patientName.toLowerCase().includes(searchTerm) ||
          invoice.doctorName.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by creation date (newest first)
      invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      resolve(invoices);
    }, 300);
  });
};

export const getInvoiceDetails = async (id: string): Promise<Invoice> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const invoices = getStorageData<Invoice>(STORAGE_KEYS.INVOICES);
      const invoice = invoices.find(inv => inv.id === id);
      
      if (invoice) {
        resolve(invoice);
      } else {
        reject(new Error('Invoice not found'));
      }
    }, 200);
  });
};

export const createInvoice = async (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Promise<Invoice> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoices = getStorageData<Invoice>(STORAGE_KEYS.INVOICES);
      const newInvoice: Invoice = {
        id: generateId(),
        invoiceNumber: generateInvoiceNumber(),
        ...invoiceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      invoices.unshift(newInvoice);
      setStorageData(STORAGE_KEYS.INVOICES, invoices);
      resolve(newInvoice);
    }, 600);
  });
};

export const markAsPaid = async (id: string, paymentData: { amount: number; paymentMode: Invoice['paymentMode']; transactionId?: string; notes?: string }): Promise<Invoice> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const invoices = getStorageData<Invoice>(STORAGE_KEYS.INVOICES);
      const invoiceIndex = invoices.findIndex(inv => inv.id === id);
      
      if (invoiceIndex === -1) {
        reject(new Error('Invoice not found'));
        return;
      }
      
      const invoice = invoices[invoiceIndex];
      const newPaidAmount = invoice.paidAmount + paymentData.amount;
      const newBalanceAmount = invoice.totalAmount - newPaidAmount;
      
      // Update invoice
      invoices[invoiceIndex] = {
        ...invoice,
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        status: newBalanceAmount <= 0 ? 'paid' : 'partially-paid',
        paymentMode: paymentData.paymentMode,
        updatedAt: new Date().toISOString(),
        paidAt: newBalanceAmount <= 0 ? new Date().toISOString() : invoice.paidAt
      };
      
      // Add payment record
      const payments = getStorageData<PaymentRecord>(STORAGE_KEYS.PAYMENTS);
      const newPayment: PaymentRecord = {
        id: generateId(),
        invoiceId: id,
        amount: paymentData.amount,
        paymentMode: paymentData.paymentMode,
        transactionId: paymentData.transactionId,
        paidAt: new Date().toISOString(),
        notes: paymentData.notes
      };
      payments.unshift(newPayment);
      
      setStorageData(STORAGE_KEYS.INVOICES, invoices);
      setStorageData(STORAGE_KEYS.PAYMENTS, payments);
      
      resolve(invoices[invoiceIndex]);
    }, 500);
  });
};

export const refundInvoice = async (id: string, refundData: { amount: number; reason: string }): Promise<Invoice> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const invoices = getStorageData<Invoice>(STORAGE_KEYS.INVOICES);
      const invoiceIndex = invoices.findIndex(inv => inv.id === id);
      
      if (invoiceIndex === -1) {
        reject(new Error('Invoice not found'));
        return;
      }
      
      invoices[invoiceIndex] = {
        ...invoices[invoiceIndex],
        status: 'refunded',
        refundAmount: refundData.amount,
        refundReason: refundData.reason,
        refundedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setStorageData(STORAGE_KEYS.INVOICES, invoices);
      resolve(invoices[invoiceIndex]);
    }, 500);
  });
};

export const getBillingStats = async (): Promise<BillingStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoices = getStorageData<Invoice>(STORAGE_KEYS.INVOICES);
      
      const today = new Date().toISOString().split('T')[0];
      const todayInvoices = invoices.filter(inv => inv.createdAt.split('T')[0] === today);
      
      const todayRevenue = todayInvoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.paidAmount, 0);
      
      const invoicesGenerated = todayInvoices.length;
      
      const pendingPayments = invoices
        .filter(inv => ['sent', 'partially-paid', 'overdue'].includes(inv.status))
        .reduce((sum, inv) => sum + inv.balanceAmount, 0);
      
      const refundedToday = todayInvoices
        .filter(inv => inv.status === 'refunded' && inv.refundedAt?.split('T')[0] === today)
        .reduce((sum, inv) => sum + (inv.refundAmount || 0), 0);
      
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.paidAmount, 0);
      
      const paidInvoices = invoices.filter(inv => inv.status === 'paid');
      const averageInvoiceValue = paidInvoices.length > 0 
        ? totalRevenue / paidInvoices.length 
        : 0;
      
      resolve({
        todayRevenue,
        invoicesGenerated,
        pendingPayments,
        refundedToday,
        totalRevenue,
        averageInvoiceValue
      });
    }, 300);
  });
};

export const getProcedures = async (): Promise<typeof PROCEDURES> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PROCEDURES);
    }, 100);
  });
};

// Export types for use in components
export type { Invoice, InvoiceProcedure, BillingStats, PaymentRecord, BillingFilters };