// Mock API functions for Payroll module
// In a real application, these would make HTTP requests to your backend

// Types
interface Payslip {
  id: string;
  staffId: string;
  staffName: string;
  employeeId: string;
  month: number;
  year: number;
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  special: number;
  bonus?: number;
  grossSalary: number;
  pf: number;
  tax: number;
  otherDeductions?: number;
  totalDeductions: number;
  netSalary: number;
  daysWorked: number;
  leavesTaken: number;
  bankAccount?: string;
  panNumber?: string;
  pfNumber?: string;
  uan?: string;
  paymentDate: string;
  paymentMode: 'bank-transfer' | 'check' | 'cash';
  paymentStatus: 'pending' | 'processed' | 'failed';
  notes?: string;
}

interface PayrollStats {
  totalPayroll: number;
  employeesProcessed: number;
  pendingPayslips: number;
  averageSalary: number;
  departmentBreakdown: Record<string, number>;
}

interface LeaveBalance {
  staffId: string;
  casual: number;
  sick: number;
  annual: number;
  compensatory: number;
  unpaid: number;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  PAYSLIPS: 'hospverse_payroll_payslips',
  LEAVE_BALANCE: 'hospverse_payroll_leave_balance'
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

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.PAYSLIPS)) {
    const mockPayslips: Payslip[] = [
      {
        id: '1',
        staffId: '1',
        staffName: 'Dr. Sarah Johnson',
        employeeId: 'EMP001',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        basic: 8000,
        hra: 3000,
        conveyance: 800,
        medical: 1500,
        special: 2000,
        bonus: 1000,
        grossSalary: 16300,
        pf: 960,
        tax: 1800,
        otherDeductions: 200,
        totalDeductions: 2960,
        netSalary: 13340,
        daysWorked: 22,
        leavesTaken: 0,
        bankAccount: 'XXXX-XXXX-1234',
        panNumber: 'ABCDE1234F',
        pfNumber: 'PF12345678',
        uan: 'UAN9876543210',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMode: 'bank-transfer',
        paymentStatus: 'processed'
      },
      {
        id: '2',
        staffId: '1',
        staffName: 'Dr. Sarah Johnson',
        employeeId: 'EMP001',
        month: new Date().getMonth() - 1,
        year: new Date().getFullYear(),
        basic: 8000,
        hra: 3000,
        conveyance: 800,
        medical: 1500,
        special: 2000,
        grossSalary: 15300,
        pf: 960,
        tax: 1800,
        otherDeductions: 200,
        totalDeductions: 2960,
        netSalary: 12340,
        daysWorked: 21,
        leavesTaken: 1,
        bankAccount: 'XXXX-XXXX-1234',
        panNumber: 'ABCDE1234F',
        pfNumber: 'PF12345678',
        uan: 'UAN9876543210',
        paymentDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMode: 'bank-transfer',
        paymentStatus: 'processed'
      },
      {
        id: '3',
        staffId: '2',
        staffName: 'Mike Wilson',
        employeeId: 'EMP002',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        basic: 5000,
        hra: 2000,
        conveyance: 600,
        medical: 1000,
        special: 1200,
        grossSalary: 9800,
        pf: 600,
        tax: 900,
        totalDeductions: 1500,
        netSalary: 8300,
        daysWorked: 22,
        leavesTaken: 0,
        bankAccount: 'XXXX-XXXX-5678',
        panNumber: 'FGHIJ5678K',
        pfNumber: 'PF87654321',
        uan: 'UAN1234567890',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMode: 'bank-transfer',
        paymentStatus: 'processed'
      },
      {
        id: '4',
        staffId: '3',
        staffName: 'Emily Davis',
        employeeId: 'EMP003',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        basic: 4000,
        hra: 1600,
        conveyance: 500,
        medical: 800,
        special: 1000,
        grossSalary: 7900,
        pf: 480,
        tax: 700,
        totalDeductions: 1180,
        netSalary: 6720,
        daysWorked: 20,
        leavesTaken: 2,
        bankAccount: 'XXXX-XXXX-9012',
        panNumber: 'LMNOP9012Q',
        pfNumber: 'PF23456789',
        uan: 'UAN2345678901',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMode: 'bank-transfer',
        paymentStatus: 'processed'
      },
      {
        id: '5',
        staffId: '4',
        staffName: 'David Kim',
        employeeId: 'EMP004',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        basic: 4500,
        hra: 1800,
        conveyance: 550,
        medical: 900,
        special: 1100,
        grossSalary: 8850,
        pf: 540,
        tax: 800,
        totalDeductions: 1340,
        netSalary: 7510,
        daysWorked: 22,
        leavesTaken: 0,
        bankAccount: 'XXXX-XXXX-3456',
        panNumber: 'QRSTU3456V',
        pfNumber: 'PF34567890',
        uan: 'UAN3456789012',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMode: 'bank-transfer',
        paymentStatus: 'processed'
      },
      {
        id: '6',
        staffId: '5',
        staffName: 'Lisa Thompson',
        employeeId: 'EMP005',
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        basic: 6000,
        hra: 2400,
        conveyance: 700,
        medical: 1200,
        special: 1500,
        grossSalary: 11800,
        pf: 720,
        tax: 1200,
        totalDeductions: 1920,
        netSalary: 9880,
        daysWorked: 22,
        leavesTaken: 0,
        bankAccount: 'XXXX-XXXX-7890',
        panNumber: 'VWXYZ7890A',
        pfNumber: 'PF45678901',
        uan: 'UAN4567890123',
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMode: 'bank-transfer',
        paymentStatus: 'processed'
      }
    ];
    setStorageData(STORAGE_KEYS.PAYSLIPS, mockPayslips);
  }

  if (!localStorage.getItem(STORAGE_KEYS.LEAVE_BALANCE)) {
    const mockLeaveBalance: LeaveBalance[] = [
      {
        staffId: '1',
        casual: 8,
        sick: 10,
        annual: 15,
        compensatory: 2,
        unpaid: 0
      },
      {
        staffId: '2',
        casual: 6,
        sick: 8,
        annual: 12,
        compensatory: 0,
        unpaid: 0
      },
      {
        staffId: '3',
        casual: 4,
        sick: 6,
        annual: 10,
        compensatory: 1,
        unpaid: 0
      },
      {
        staffId: '4',
        casual: 7,
        sick: 9,
        annual: 14,
        compensatory: 0,
        unpaid: 0
      },
      {
        staffId: '5',
        casual: 10,
        sick: 12,
        annual: 18,
        compensatory: 3,
        unpaid: 0
      }
    ];
    setStorageData(STORAGE_KEYS.LEAVE_BALANCE, mockLeaveBalance);
  }
};

// Initialize mock data
initializeMockData();

// API Functions
export const getPayslips = async (userId: string, filters: { month?: number; year?: number } = {}): Promise<Payslip[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let payslips = getStorageData<Payslip>(STORAGE_KEYS.PAYSLIPS)
        .filter(p => p.staffId === userId);
      
      // Apply filters
      if (filters.month !== undefined) {
        payslips = payslips.filter(p => p.month === filters.month);
      }
      
      if (filters.year !== undefined) {
        payslips = payslips.filter(p => p.year === filters.year);
      }
      
      // Sort by date (newest first)
      payslips.sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.month - a.month;
      });
      
      resolve(payslips);
    }, 300);
  });
};

export const getPayslipDetails = async (id: string): Promise<Payslip> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payslips = getStorageData<Payslip>(STORAGE_KEYS.PAYSLIPS);
      const payslip = payslips.find(p => p.id === id);
      
      if (payslip) {
        resolve(payslip);
      } else {
        reject(new Error('Payslip not found'));
      }
    }, 200);
  });
};

export const downloadPayslip = async (id: string): Promise<{ url: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payslips = getStorageData<Payslip>(STORAGE_KEYS.PAYSLIPS);
      const payslip = payslips.find(p => p.id === id);
      
      if (payslip) {
        // In a real app, this would generate a PDF and return a download URL
        resolve({ url: `payslip_${payslip.month + 1}_${payslip.year}_${payslip.employeeId}.pdf` });
      } else {
        reject(new Error('Payslip not found'));
      }
    }, 500);
  });
};

export const getLeaveBalance = async (staffId: string): Promise<LeaveBalance> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leaveBalances = getStorageData<LeaveBalance>(STORAGE_KEYS.LEAVE_BALANCE);
      const balance = leaveBalances.find(b => b.staffId === staffId);
      
      if (balance) {
        resolve(balance);
      } else {
        reject(new Error('Leave balance not found'));
      }
    }, 200);
  });
};

export const getPayrollStats = async (): Promise<PayrollStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const payslips = getStorageData<Payslip>(STORAGE_KEYS.PAYSLIPS);
      
      // Filter to current month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const currentMonthPayslips = payslips.filter(p => 
        p.month === currentMonth && p.year === currentYear
      );
      
      const totalPayroll = currentMonthPayslips.reduce((sum, p) => sum + p.netSalary, 0);
      const employeesProcessed = currentMonthPayslips.filter(p => p.paymentStatus === 'processed').length;
      const pendingPayslips = currentMonthPayslips.filter(p => p.paymentStatus === 'pending').length;
      
      const allProcessedPayslips = currentMonthPayslips.filter(p => p.paymentStatus === 'processed');
      const averageSalary = allProcessedPayslips.length > 0 
        ? totalPayroll / allProcessedPayslips.length 
        : 0;
      
      // Mock department breakdown
      const departmentBreakdown: Record<string, number> = {
        'Medical': 25000,
        'Administration': 18000,
        'Technical': 12000,
        'Support': 8000
      };
      
      resolve({
        totalPayroll,
        employeesProcessed,
        pendingPayslips,
        averageSalary,
        departmentBreakdown
      });
    }, 300);
  });
};

// Export types for use in components
export type { Payslip, PayrollStats, LeaveBalance };