// Mock API functions for Admin module
// In a real application, these would make HTTP requests to your backend

// Types
interface AdminMetrics {
  revenueToday: number;
  totalAppointments: number;
  activeStaff: number;
  lowInventory: number;
  revenueChange: number;
  appointmentsChange: number;
}

interface RevenueReportItem {
  date: string;
  revenue: number;
  patients: number;
  avgBill: number;
}

interface StaffPerformanceItem {
  name: string;
  patients: number;
  hours: number;
  procedures: number;
  rating: number;
}

interface InventoryReportItem {
  item: string;
  used: number;
  remaining: number;
  reorder: 'Yes' | 'No';
}

interface CRMReportItem {
  stage: string;
  count: number;
  conversion: string;
}

interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  module: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'error';
  ipAddress: string;
  details?: string;
}

interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  department?: string;
  branch?: string;
  role?: string;
}

interface LogFilters {
  date?: 'all' | 'today' | 'yesterday' | 'week';
  role?: string;
  actionType?: string;
  search?: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  ADMIN_METRICS: 'hospverse_admin_metrics',
  ACTIVITY_LOGS: 'hospverse_activity_logs'
};

// Helper function to get data from localStorage
const getStorageData = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const setStorageData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Generate unique ID
// const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_METRICS)) {
    const mockMetrics: AdminMetrics = {
      revenueToday: 12580,
      totalAppointments: 42,
      activeStaff: 18,
      lowInventory: 7,
      revenueChange: 12.5,
      appointmentsChange: 8.3
    };
    setStorageData(STORAGE_KEYS.ADMIN_METRICS, mockMetrics);
  }

  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS)) {
    const mockLogs: ActivityLog[] = generateMockLogs();
    setStorageData(STORAGE_KEYS.ACTIVITY_LOGS, mockLogs);
  }
};

// Generate mock logs
const generateMockLogs = (): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  const users = ['Dr. Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Kim', 'Lisa Thompson'];
  const roles = ['Doctor', 'Technician', 'Receptionist', 'Nurse', 'Manager'];
  const modules = ['Patients', 'Appointments', 'Billing', 'Inventory', 'CRM', 'HR'];
  const actions = [
    { type: 'create', desc: 'Created new' },
    { type: 'update', desc: 'Updated' },
    { type: 'delete', desc: 'Deleted' },
    { type: 'view', desc: 'Viewed' },
    { type: 'login', desc: 'Logged in to' },
    { type: 'logout', desc: 'Logged out from' },
    { type: 'error', desc: 'Error in' }
  ];
  const ipAddresses = ['192.168.1.101', '192.168.1.102', '192.168.1.103', '192.168.1.104', '192.168.1.105'];
  
  // Generate logs for the past 7 days
  for (let i = 0; i < 100; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const userIndex = Math.floor(Math.random() * users.length);
    const actionIndex = Math.floor(Math.random() * actions.length);
    const moduleIndex = Math.floor(Math.random() * modules.length);
    
    logs.push({
      id: `log-${i}`,
      timestamp: date.toISOString(),
      user: users[userIndex],
      userRole: roles[userIndex],
      module: modules[moduleIndex],
      action: `${actions[actionIndex].desc} ${modules[moduleIndex]}`,
      actionType: actions[actionIndex].type as ActivityLog['actionType'],
      ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
      details: Math.random() > 0.7 ? `Additional details for log ${i}` : undefined
    });
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock revenue report
const generateRevenueReport = (filters: ReportFilters): RevenueReportItem[] => {
  const report: RevenueReportItem[] = [];
  const startDate = filters.dateFrom ? new Date(filters.dateFrom) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const endDate = filters.dateTo ? new Date(filters.dateTo) : new Date();
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const revenue = 4000 + Math.floor(Math.random() * 10000);
    const patients = 15 + Math.floor(Math.random() * 15);
    
    report.push({
      date: d.toISOString().split('T')[0],
      revenue,
      patients,
      avgBill: revenue / patients
    });
  }
  
  return report;
};

// Generate mock staff performance report
const generateStaffPerformanceReport = (filters: ReportFilters): StaffPerformanceItem[] => {
  const staffMembers = [
    { name: 'Dr. Sarah Johnson', role: 'Doctor' },
    { name: 'Dr. Michael Chen', role: 'Doctor' },
    { name: 'Dr. Emily Davis', role: 'Doctor' },
    { name: 'Dr. David Kim', role: 'Doctor' },
    { name: 'Dr. Lisa Thompson', role: 'Doctor' },
    { name: 'Mike Wilson', role: 'Technician' },
    { name: 'Emily Davis', role: 'Nurse' },
    { name: 'David Kim', role: 'Nurse' },
    { name: 'Lisa Thompson', role: 'Manager' }
  ];
  
  // Filter by role if specified
  let filteredStaff = staffMembers;
  if (filters.role && filters.role !== 'all') {
    filteredStaff = staffMembers.filter(staff => staff.role === filters.role);
  }
  
  return filteredStaff.map(staff => ({
    name: staff.name,
    patients: 20 + Math.floor(Math.random() * 30),
    hours: 30 + Math.floor(Math.random() * 15),
    procedures: 15 + Math.floor(Math.random() * 20),
    rating: 4 + Math.random()
  }));
};

// Generate mock inventory report
const generateInventoryReport = (_filters: ReportFilters): InventoryReportItem[] => {
  const inventoryItems = [
    'Laser Gel',
    'PRP Tubes',
    'Chemical Peel Solution',
    'Microneedling Cartridges',
    'Botox Vials',
    'Dermal Fillers',
    'Acne Treatment',
    'Pigmentation Treatment'
  ];
  
  return inventoryItems.map(item => {
    const used = 10 + Math.floor(Math.random() * 40);
    const remaining = Math.floor(Math.random() * 50);
    
    return {
      item,
      used,
      remaining,
      reorder: remaining < 10 ? 'Yes' : 'No'
    };
  });
};

// Generate mock CRM report
const generateCRMReport = (_filters: ReportFilters): CRMReportItem[] => {
  const leads = 100 + Math.floor(Math.random() * 50);
  const contacted = Math.floor(leads * (0.6 + Math.random() * 0.3));
  const consulted = Math.floor(contacted * (0.6 + Math.random() * 0.3));
  const converted = Math.floor(consulted * (0.5 + Math.random() * 0.3));
  
  return [
    { stage: 'Leads', count: leads, conversion: '100%' },
    { stage: 'Contacted', count: contacted, conversion: `${(contacted / leads * 100).toFixed(1)}%` },
    { stage: 'Consulted', count: consulted, conversion: `${(consulted / leads * 100).toFixed(1)}%` },
    { stage: 'Converted', count: converted, conversion: `${(converted / leads * 100).toFixed(1)}%` }
  ];
};

// Initialize mock data
initializeMockData();

// API Functions
export const getAdminMetrics = async (): Promise<AdminMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const metrics = getStorageData<AdminMetrics>(STORAGE_KEYS.ADMIN_METRICS, {
        revenueToday: 12580,
        totalAppointments: 42,
        activeStaff: 18,
        lowInventory: 7,
        revenueChange: 12.5,
        appointmentsChange: 8.3
      });
      resolve(metrics);
    }, 500);
  });
};

export const getRevenueReport = async (filters: ReportFilters = {}): Promise<RevenueReportItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const report = generateRevenueReport(filters);
      resolve(report);
    }, 800);
  });
};

export const getPerformanceReport = async (filters: ReportFilters = {}): Promise<StaffPerformanceItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const report = generateStaffPerformanceReport(filters);
      resolve(report);
    }, 800);
  });
};

export const getInventoryReport = async (filters: ReportFilters = {}): Promise<InventoryReportItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const report = generateInventoryReport(filters);
      resolve(report);
    }, 800);
  });
};

export const getCRMReport = async (filters: ReportFilters = {}): Promise<CRMReportItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const report = generateCRMReport(filters);
      resolve(report);
    }, 800);
  });
};

export const getActivityLogs = async (filters: LogFilters = {}): Promise<ActivityLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let logs = getStorageData<ActivityLog[]>(STORAGE_KEYS.ACTIVITY_LOGS, []);
      
      // Apply date filter
      if (filters.date && filters.date !== 'all') {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        
        switch (filters.date) {
          case 'today':
            logs = logs.filter(log => new Date(log.timestamp) >= startOfDay);
            break;
          case 'yesterday': {
            const yesterday = new Date(startOfDay);
            yesterday.setDate(yesterday.getDate() - 1);
            const dayBefore = new Date(yesterday);
            dayBefore.setDate(dayBefore.getDate() - 1);
            logs = logs.filter(log => 
              new Date(log.timestamp) >= dayBefore && 
              new Date(log.timestamp) < startOfDay
            );
            break;
          }
          case 'week': {
            const weekAgo = new Date(startOfDay);
            weekAgo.setDate(weekAgo.getDate() - 7);
            logs = logs.filter(log => new Date(log.timestamp) >= weekAgo);
            break;
          }
        }
      }
      
      // Apply role filter
      if (filters.role && filters.role !== 'all') {
        logs = logs.filter(log => log.userRole === filters.role);
      }
      
      // Apply action type filter
      if (filters.actionType && filters.actionType !== 'all') {
        logs = logs.filter(log => log.actionType === filters.actionType);
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        logs = logs.filter(log => 
          log.user.toLowerCase().includes(searchTerm) ||
          log.module.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.ipAddress.includes(searchTerm)
        );
      }
      
      resolve(logs);
    }, 600);
  });
};

export const exportReportAsCSV = async (type: string, _filters: ReportFilters = {}): Promise<{ url: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would generate a CSV file and return a download URL
      resolve({ url: `${type.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.csv` });
    }, 1000);
  });
};

// Export types for use in components
export type { 
  AdminMetrics, 
  RevenueReportItem, 
  StaffPerformanceItem, 
  InventoryReportItem, 
  CRMReportItem, 
  ActivityLog,
  ReportFilters,
  LogFilters
};