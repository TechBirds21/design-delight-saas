import api from './api';
import { Appointment, Patient, Doctor, QueueEntry, ConsentForm, ReceptionStats } from '../api/reception';

const ReceptionService = {
  getTodayAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/reception/appointments/today');
    return response.data;
  },
  
  registerPatient: async (patientData: Omit<Patient, 'id' | 'registeredAt'>): Promise<Patient> => {
    const response = await api.post('/reception/patients', patientData);
    return response.data;
  },
  
  bookAppointment: async (appointmentData: Omit<Appointment, 'id' | 'doctorName' | 'status' | 'bookedAt'>): Promise<Appointment> => {
    const response = await api.post('/reception/appointments', appointmentData);
    return response.data;
  },
  
  getQueueList: async (): Promise<QueueEntry[]> => {
    const response = await api.get('/reception/queue');
    return response.data;
  },
  
  updatePatientStatus: async (patientId: string, newStatus: QueueEntry['status']): Promise<QueueEntry[]> => {
    const response = await api.patch(`/reception/queue/${patientId}/status`, { status: newStatus });
    return response.data;
  },
  
  addToQueue: async (patientData: Omit<QueueEntry, 'id' | 'status' | 'checkedInAt' | 'queueNumber'>): Promise<QueueEntry> => {
    const response = await api.post('/reception/queue', patientData);
    return response.data;
  },
  
  uploadConsent: async (formData: FormData): Promise<ConsentForm> => {
    const response = await api.post('/reception/consent', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await api.get('/reception/doctors');
    return response.data;
  },
  
  getAvailableTimeSlots: async (date: string, doctorId: string): Promise<string[]> => {
    const response = await api.get('/reception/time-slots', { 
      params: { date, doctorId } 
    });
    return response.data;
  },
  
  getReceptionStats: async (): Promise<ReceptionStats> => {
    const response = await api.get('/reception/stats');
    return response.data;
  }
};

export default ReceptionService;