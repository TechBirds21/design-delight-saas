import api from './api';
import { PatientPhoto, PhotoSession, PhotoStats, PhotoFilters } from '../api/photos';

const PhotoService = {
  getAllPatientPhotos: async (filters: PhotoFilters = {}): Promise<PatientPhoto[]> => {
    const response = await api.get('/photo-manager/photos', { params: filters });
    return response.data;
  },
  
  getPhotoSessions: async (patientId?: string): Promise<PhotoSession[]> => {
    const response = await api.get('/photo-manager/sessions', { 
      params: { patientId } 
    });
    return response.data;
  },
  
  getPhotoStats: async (): Promise<PhotoStats> => {
    const response = await api.get('/photo-manager/stats');
    return response.data;
  },
  
  uploadPatientPhoto: async (formData: FormData): Promise<PatientPhoto> => {
    const response = await api.post('/photo-manager/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  deletePhoto: async (photoId: string): Promise<void> => {
    await api.delete(`/photo-manager/photos/${photoId}`);
  }
};

export default PhotoService;