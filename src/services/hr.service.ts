import api from './api';
import { Staff, StaffDocument, AttendanceRecord, ShiftRecord, PerformanceNote, SalaryStructure, HRStats } from '../api/hr';

const HRService = {
  getAllStaff: async (filters: { branch?: string; role?: string; status?: string; search?: string } = {}): Promise<Staff[]> => {
    const response = await api.get('/hr/staff', { params: filters });
    return response.data;
  },
  
  getStaffDetails: async (id: string): Promise<Staff> => {
    const response = await api.get(`/hr/staff/${id}`);
    return response.data;
  },
  
  addStaff: async (staffData: Omit<Staff, 'id'>): Promise<Staff> => {
    const response = await api.post('/hr/staff', staffData);
    return response.data;
  },
  
  updateStaff: async (id: string, staffData: Partial<Staff>): Promise<Staff> => {
    const response = await api.patch(`/hr/staff/${id}`, staffData);
    return response.data;
  },
  
  uploadStaffDocument: async (staffId: string, documentData: FormData): Promise<StaffDocument> => {
    const response = await api.post(`/hr/staff/${staffId}/documents`, documentData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  getAttendanceLog: async (staffId: string, month?: string, year?: string): Promise<AttendanceRecord[]> => {
    const response = await api.get(`/hr/attendance/${staffId}`, { 
      params: { month, year } 
    });
    return response.data;
  },
  
  logPerformance: async (staffId: string, performanceData: Omit<PerformanceNote, 'id' | 'staffId' | 'addedBy'>): Promise<PerformanceNote> => {
    const response = await api.post(`/hr/staff/${staffId}/performance`, performanceData);
    return response.data;
  },
  
  getHRStats: async (): Promise<HRStats> => {
    const response = await api.get('/hr/stats');
    return response.data;
  }
};

export default HRService;