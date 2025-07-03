import api from './api';
import { Appointment, Patient, TreatmentRecord, SOAPNote, DoctorStats, Technician, AssignmentData } from '../api/doctor';

const DoctorService = {
  getDoctorAppointments: async (filters: { status?: string; search?: string } = {}): Promise<Appointment[]> => {
    const response = await api.get('/doctor/appointments', { params: filters });
    return response.data;
  },
  
  getPatientDetails: async (patientId: string): Promise<Patient> => {
    const response = await api.get(`/doctor/patients/${patientId}`);
    return response.data;
  },
  
  submitSOAPNote: async (soapData: Omit<SOAPNote, 'id' | 'createdAt' | 'status'> & { isDraft?: boolean }): Promise<SOAPNote> => {
    const response = await api.post('/doctor/soap', soapData);
    return response.data;
  },
  
  assignTechnician: async (assignmentData: AssignmentData): Promise<any> => {
    const response = await api.post('/doctor/assign-technician', assignmentData);
    return response.data;
  },
  
  uploadPhoto: async (photoData: FormData): Promise<any> => {
    const response = await api.post('/doctor/photos', photoData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  getTreatmentHistory: async (filters: { 
    patientId?: string; 
    procedure?: string; 
    status?: string; 
  } = {}): Promise<TreatmentRecord[]> => {
    const response = await api.get('/doctor/treatment-history', { params: filters });
    return response.data;
  },
  
  getTechnicians: async (): Promise<Technician[]> => {
    const response = await api.get('/doctor/technicians');
    return response.data;
  },
  
  getProcedures: async (): Promise<string[]> => {
    const response = await api.get('/doctor/procedures');
    return response.data;
  },
  
  getDoctorStats: async (): Promise<DoctorStats> => {
    const response = await api.get('/doctor/stats');
    return response.data;
  },
  
  updateAppointmentStatus: async (appointmentId: string, status: Appointment['status']): Promise<Appointment> => {
    const response = await api.patch(`/doctor/appointments/${appointmentId}/status`, { status });
    return response.data;
  }
};

export default DoctorService;