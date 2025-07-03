import api from './api';
import { AdminMetrics, RevenueReportItem, StaffPerformanceItem, InventoryReportItem, CRMReportItem, ActivityLog, ReportFilters, LogFilters } from '../api/admin';

// Mock data for development
const mockMetrics: AdminMetrics = {
  revenueToday: 12580,
  totalAppointments: 42,
  activeStaff: 18,
  lowInventory: 7,
  revenueChange: 12.5,
  appointmentsChange: 8.3
};

const AdminService = {
  getAdminMetrics: async (): Promise<AdminMetrics> => {
    try {
      const response = await api.get('/admin/metrics');
      return response.data;
    } catch (error) {
      console.warn('Using mock data for admin metrics due to API error:', error);
      return mockMetrics;
    }
  },
  
  getRevenueReport: async (filters: ReportFilters = {}): Promise<RevenueReportItem[]> => {
    try {
      const response = await api.get('/admin/reports/revenue', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Using mock data for revenue report due to API error:', error);
      // Generate mock data
      const mockData: RevenueReportItem[] = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        mockData.push({
          date: date.toISOString().split('T')[0],
          revenue: 4000 + Math.floor(Math.random() * 10000),
          patients: 15 + Math.floor(Math.random() * 15),
          avgBill: 0 // Will be calculated below
        });
        mockData[i].avgBill = mockData[i].revenue / mockData[i].patients;
      }
      
      return mockData;
    }
  },
  
  getPerformanceReport: async (filters: ReportFilters = {}): Promise<StaffPerformanceItem[]> => {
    try {
      const response = await api.get('/admin/reports/performance', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Using mock data for performance report due to API error:', error);
      return [
        { name: 'Dr. Sarah Johnson', patients: 42, hours: 38, procedures: 28, rating: 4.8 },
        { name: 'Dr. Michael Chen', patients: 38, hours: 36, procedures: 25, rating: 4.7 },
        { name: 'Dr. Emily Davis', patients: 35, hours: 40, procedures: 22, rating: 4.9 },
        { name: 'Dr. David Kim', patients: 31, hours: 35, procedures: 20, rating: 4.6 },
        { name: 'Dr. Lisa Thompson', patients: 45, hours: 42, procedures: 30, rating: 4.9 }
      ];
    }
  },
  
  getInventoryReport: async (filters: ReportFilters = {}): Promise<InventoryReportItem[]> => {
    try {
      const response = await api.get('/admin/reports/inventory', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Using mock data for inventory report due to API error:', error);
      return [
        { item: 'Laser Gel', used: 45, remaining: 15, reorder: 'Yes' },
        { item: 'PRP Tubes', used: 32, remaining: 8, reorder: 'Yes' },
        { item: 'Chemical Peel Solution', used: 18, remaining: 25, reorder: 'No' },
        { item: 'Microneedling Cartridges', used: 25, remaining: 45, reorder: 'No' },
        { item: 'Botox Vials', used: 12, remaining: 3, reorder: 'Yes' }
      ];
    }
  },
  
  getCRMReport: async (filters: ReportFilters = {}): Promise<CRMReportItem[]> => {
    try {
      const response = await api.get('/admin/reports/crm', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Using mock data for CRM report due to API error:', error);
      return [
        { stage: 'Leads', count: 120, conversion: '100%' },
        { stage: 'Contacted', count: 85, conversion: '70.8%' },
        { stage: 'Consulted', count: 62, conversion: '51.7%' },
        { stage: 'Converted', count: 38, conversion: '31.7%' }
      ];
    }
  },
  
  getActivityLogs: async (filters: LogFilters = {}): Promise<ActivityLog[]> => {
    try {
      const response = await api.get('/admin/logs', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Using mock data for activity logs due to API error:', error);
      // Generate mock logs
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
      
      for (let i = 0; i < 50; i++) {
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
      
      // Apply filters if provided
      let filteredLogs = [...logs];
      
      // Apply date filter
      if (filters.date && filters.date !== 'all') {
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        
        switch (filters.date) {
          case 'today':
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startOfDay);
            break;
          case 'yesterday': {
            const yesterday = new Date(startOfDay);
            yesterday.setDate(yesterday.getDate() - 1);
            const dayBefore = new Date(yesterday);
            dayBefore.setDate(dayBefore.getDate() - 1);
            filteredLogs = filteredLogs.filter(log => 
              new Date(log.timestamp) >= dayBefore && 
              new Date(log.timestamp) < startOfDay
            );
            break;
          }
          case 'week': {
            const weekAgo = new Date(startOfDay);
            weekAgo.setDate(weekAgo.getDate() - 7);
            filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= weekAgo);
            break;
          }
        }
      }
      
      // Apply role filter
      if (filters.role && filters.role !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.userRole === filters.role);
      }
      
      // Apply action type filter
      if (filters.actionType && filters.actionType !== 'all') {
        filteredLogs = filteredLogs.filter(log => log.actionType === filters.actionType);
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.user.toLowerCase().includes(searchTerm) ||
          log.module.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.ipAddress.includes(searchTerm)
        );
      }
      
      // Sort by timestamp (newest first)
      filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return filteredLogs;
    }
  },
  
  exportReportAsCSV: async (type: string, filters: ReportFilters = {}): Promise<{ url: string }> => {
    try {
      const response = await api.get('/admin/reports/export', { 
        params: { 
          type,
          ...filters
        } 
      });
      return response.data;
    } catch (error) {
      console.warn('Using mock data for export due to API error:', error);
      return { url: `${type.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.csv` };
    }
  }
};

export default AdminService;