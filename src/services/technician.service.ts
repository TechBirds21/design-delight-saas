import api from './api';
import { Procedure, SessionHistoryEntry, TechnicianStats, Doctor, CompletionData } from '../api/technician';

const TechnicianService = {
  getAssignedProcedures: async (filters: { status?: string; search?: string } = {}): Promise<Procedure[]> => {
    const response = await api.get('/technician/procedures', { params: filters });
    return response.data;
  },
  
  getProcedureDetails: async (procedureId: string): Promise<Procedure> => {
    const response = await api.get(`/technician/procedures/${procedureId}`);
    return response.data;
  },
  
  startSession: async (procedureId: string): Promise<Procedure> => {
    const response = await api.post(`/technician/procedures/${procedureId}/start`);
    return response.data;
  },
  
  completeSession: async (procedureId: string, completionData: CompletionData): Promise<Procedure> => {
    const response = await api.post(`/technician/procedures/${procedureId}/complete`, completionData);
    return response.data;
  },
  
  getSessionHistory: async (filters: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    doctor?: string;
    procedure?: string;
    search?: string;
  } = {}): Promise<SessionHistoryEntry[]> => {
    const response = await api.get('/technician/history', { params: filters });
    return response.data;
  },
  
  getTechnicianStats: async (): Promise<TechnicianStats> => {
    const response = await api.get('/technician/stats');
    return response.data;
  },
  
  getProcedureTypes: async (): Promise<string[]> => {
    const response = await api.get('/technician/procedure-types');
    return response.data;
  },
  
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await api.get('/technician/doctors');
    return response.data;
  }
};

export default TechnicianService;