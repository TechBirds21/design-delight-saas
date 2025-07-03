import api from './api';
import { Clinic, UsageLog, SystemLog, SupportTicket, SuperAdminStats, ClientFilters, LogFilters } from '../api/super-admin';

const SuperAdminService = {
  getAllClients: async (filters: ClientFilters = {}): Promise<Clinic[]> => {
    const response = await api.get('/super-admin/clients', { params: filters });
    return response.data;
  },
  
  getClientDetails: async (clientId: string): Promise<Clinic> => {
    const response = await api.get(`/super-admin/clients/${clientId}`);
    return response.data;
  },
  
  toggleClientModule: async (clientId: string, module: string, enabled: boolean): Promise<Clinic> => {
    const response = await api.patch(`/super-admin/clients/${clientId}/modules`, { module, enabled });
    return response.data;
  },
  
  setClientDashboards: async (clientId: string, dashboards: string[]): Promise<Clinic> => {
    const response = await api.patch(`/super-admin/clients/${clientId}/dashboards`, { dashboards });
    return response.data;
  },
  
  assignRolePermissions: async (clientId: string, role: string, permissions: string[]): Promise<{role: string, permissions: string[]}> => {
    const response = await api.patch(`/super-admin/clients/${clientId}/roles`, { role, permissions });
    return response.data;
  },
  
  updateClientStatus: async (clientId: string, status: Clinic['status']): Promise<Clinic> => {
    const response = await api.patch(`/super-admin/clients/${clientId}/status`, { status });
    return response.data;
  },
  
  getClientUsageLogs: async (clientId: string, filters: LogFilters = {}): Promise<UsageLog[]> => {
    const response = await api.get(`/super-admin/clients/${clientId}/logs`, { params: filters });
    return response.data;
  },
  
  getSystemLogs: async (filters: LogFilters = {}): Promise<SystemLog[]> => {
    const response = await api.get('/super-admin/logs', { params: filters });
    return response.data;
  },
  
  getSupportTickets: async (status?: string): Promise<SupportTicket[]> => {
    const response = await api.get('/super-admin/support', { 
      params: { status } 
    });
    return response.data;
  },
  
  getSupportTicketDetails: async (ticketId: string): Promise<SupportTicket> => {
    const response = await api.get(`/super-admin/support/${ticketId}`);
    return response.data;
  },
  
  updateSupportTicket: async (ticketId: string, updates: Partial<SupportTicket>): Promise<SupportTicket> => {
    const response = await api.patch(`/super-admin/support/${ticketId}`, updates);
    return response.data;
  },
  
  addSupportTicketMessage: async (ticketId: string, message: string, sender: 'client' | 'support', senderName: string): Promise<SupportTicket> => {
    const response = await api.post(`/super-admin/support/${ticketId}/messages`, { 
      message, 
      sender, 
      sender_name: senderName 
    });
    return response.data;
  },
  
  createClinic: async (data: Omit<Clinic, 'id' | 'createdAt' | 'apiUsage' | 'activeUsers'>): Promise<Clinic> => {
    const response = await api.post('/super-admin/clients', data);
    return response.data;
  },
  
  getSuperAdminStats: async (): Promise<SuperAdminStats> => {
    const response = await api.get('/super-admin/stats');
    return response.data;
  }
};

export default SuperAdminService;