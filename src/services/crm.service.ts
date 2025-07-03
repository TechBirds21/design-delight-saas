import api from './api';
import { Lead, ConvertedLead, CRMStats, CRMUser, LeadFilters } from '../api/crm';

const CRMService = {
  getLeads: async (filters: LeadFilters = {}): Promise<Lead[]> => {
    const response = await api.get('/crm/leads', { params: filters });
    return response.data;
  },
  
  addLead: async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'notesHistory'>): Promise<Lead> => {
    const response = await api.post('/crm/leads', leadData);
    return response.data;
  },
  
  getLead: async (id: string): Promise<Lead> => {
    const response = await api.get(`/crm/leads/${id}`);
    return response.data;
  },
  
  updateLeadStatus: async (id: string, status: Lead['status'], notes?: string): Promise<Lead> => {
    const response = await api.patch(`/crm/leads/${id}/status`, { status, notes });
    return response.data;
  },
  
  addLeadNote: async (id: string, note: string): Promise<Lead> => {
    const response = await api.post(`/crm/leads/${id}/notes`, { note });
    return response.data;
  },
  
  convertLead: async (id: string): Promise<ConvertedLead> => {
    const response = await api.post(`/crm/leads/${id}/convert`);
    return response.data;
  },
  
  dropLead: async (id: string, reason: string): Promise<Lead> => {
    const response = await api.post(`/crm/leads/${id}/drop`, { reason });
    return response.data;
  },
  
  getConvertedLeads: async (): Promise<ConvertedLead[]> => {
    const response = await api.get('/crm/converted');
    return response.data;
  },
  
  getCRMStats: async (): Promise<CRMStats> => {
    const response = await api.get('/crm/stats');
    return response.data;
  },
  
  getCRMUsers: async (): Promise<CRMUser[]> => {
    const response = await api.get('/crm/users');
    return response.data;
  }
};

export default CRMService;