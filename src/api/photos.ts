// Mock API functions for Photo Manager module
// In a real application, these would make HTTP requests to your backend

// Types
interface PatientPhoto {
  id: string;
  patientId: string;
  patientName: string;
  sessionId: string;
  sessionDate: string;
  type: 'before' | 'after' | 'in-progress';
  imageUrl: string;
  thumbnailUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
  doctorId: string;
  doctorName: string;
}

interface PhotoSession {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  procedure: string;
  doctorId: string;
  doctorName: string;
  beforeCount: number;
  afterCount: number;
  inProgressCount: number;
}

interface PhotoStats {
  totalImages: number;
  patientsWithPhotos: number;
  beforeAfterSets: number;
  uploadedToday: number;
}

interface PhotoFilters {
  patientId?: string;
  sessionId?: string;
  type?: 'before' | 'after' | 'in-progress';
  dateFrom?: string;
  dateTo?: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  PATIENT_PHOTOS: 'hospverse_patient_photos',
  PHOTO_SESSIONS: 'hospverse_photo_sessions'
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
  if (!localStorage.getItem(STORAGE_KEYS.PATIENT_PHOTOS)) {
    const mockPhotos: PatientPhoto[] = [
      {
        id: '1',
        patientId: 'p1',
        patientName: 'John Doe',
        sessionId: 'session_001',
        sessionDate: '2024-05-01',
        type: 'before',
        imageUrl: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800',
        thumbnailUrl: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=200',
        uploadedBy: 'Dr. Sarah Johnson',
        uploadedAt: '2024-05-01T10:30:00Z',
        notes: 'Pre-treatment photo for laser hair removal',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: '2',
        patientId: 'p1',
        patientName: 'John Doe',
        sessionId: 'session_001',
        sessionDate: '2024-05-01',
        type: 'after',
        imageUrl: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=800',
        thumbnailUrl: 'https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg?auto=compress&cs=tinysrgb&w=200',
        uploadedBy: 'Dr. Sarah Johnson',
        uploadedAt: '2024-05-15T14:45:00Z',
        notes: 'Post-treatment photo for laser hair removal (2 weeks after)',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson'
      },
      {
        id: '3',
        patientId: 'p2',
        patientName: 'Jane Smith',
        sessionId: 'session_002',
        sessionDate: '2024-04-20',
        type: 'before',
        imageUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=800',
        thumbnailUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200',
        uploadedBy: 'Dr. Michael Chen',
        uploadedAt: '2024-04-20T09:15:00Z',
        notes: 'Pre-treatment photo for chemical peel',
        doctorId: 'dr2',
        doctorName: 'Dr. Michael Chen'
      },
      {
        id: '4',
        patientId: 'p2',
        patientName: 'Jane Smith',
        sessionId: 'session_002',
        sessionDate: '2024-04-20',
        type: 'in-progress',
        imageUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=800',
        thumbnailUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200',
        uploadedBy: 'Dr. Michael Chen',
        uploadedAt: '2024-04-27T11:30:00Z',
        notes: 'Mid-treatment photo for chemical peel (1 week after)',
        doctorId: 'dr2',
        doctorName: 'Dr. Michael Chen'
      },
      {
        id: '5',
        patientId: 'p2',
        patientName: 'Jane Smith',
        sessionId: 'session_002',
        sessionDate: '2024-04-20',
        type: 'after',
        imageUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=800',
        thumbnailUrl: 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200',
        uploadedBy: 'Dr. Michael Chen',
        uploadedAt: '2024-05-04T10:00:00Z',
        notes: 'Post-treatment photo for chemical peel (2 weeks after)',
        doctorId: 'dr2',
        doctorName: 'Dr. Michael Chen'
      },
      {
        id: '6',
        patientId: 'p3',
        patientName: 'Mike Johnson',
        sessionId: 'session_003',
        sessionDate: '2024-05-05',
        type: 'before',
        imageUrl: 'https://images.pexels.com/photos/3764168/pexels-photo-3764168.jpeg?auto=compress&cs=tinysrgb&w=800',
        thumbnailUrl: 'https://images.pexels.com/photos/3764168/pexels-photo-3764168.jpeg?auto=compress&cs=tinysrgb&w=200',
        uploadedBy: 'Dr. Sarah Johnson',
        uploadedAt: '2024-05-05T13:20:00Z',
        notes: 'Pre-treatment photo for PRP treatment',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson'
      }
    ];
    setStorageData(STORAGE_KEYS.PATIENT_PHOTOS, mockPhotos);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PHOTO_SESSIONS)) {
    const mockSessions: PhotoSession[] = [
      {
        id: 'session_001',
        patientId: 'p1',
        patientName: 'John Doe',
        date: '2024-05-01',
        procedure: 'Laser Hair Removal',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson',
        beforeCount: 1,
        afterCount: 1,
        inProgressCount: 0
      },
      {
        id: 'session_002',
        patientId: 'p2',
        patientName: 'Jane Smith',
        date: '2024-04-20',
        procedure: 'Chemical Peel',
        doctorId: 'dr2',
        doctorName: 'Dr. Michael Chen',
        beforeCount: 1,
        afterCount: 1,
        inProgressCount: 1
      },
      {
        id: 'session_003',
        patientId: 'p3',
        patientName: 'Mike Johnson',
        date: '2024-05-05',
        procedure: 'PRP Treatment',
        doctorId: 'dr1',
        doctorName: 'Dr. Sarah Johnson',
        beforeCount: 1,
        afterCount: 0,
        inProgressCount: 0
      }
    ];
    setStorageData(STORAGE_KEYS.PHOTO_SESSIONS, mockSessions);
  }
};

// Initialize mock data
initializeMockData();

// API Functions
export const getAllPatientPhotos = async (filters: PhotoFilters = {}): Promise<PatientPhoto[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let photos = getStorageData<PatientPhoto>(STORAGE_KEYS.PATIENT_PHOTOS);
      
      // Apply filters
      if (filters.patientId) {
        photos = photos.filter(photo => photo.patientId === filters.patientId);
      }
      
      if (filters.sessionId) {
        photos = photos.filter(photo => photo.sessionId === filters.sessionId);
      }
      
      if (filters.type) {
        photos = photos.filter(photo => photo.type === filters.type);
      }
      
      if (filters.dateFrom && filters.dateTo) {
        photos = photos.filter(photo => {
          const photoDate = new Date(photo.sessionDate);
          const fromDate = new Date(filters.dateFrom!);
          const toDate = new Date(filters.dateTo!);
          return photoDate >= fromDate && photoDate <= toDate;
        });
      }
      
      // Sort by upload date (newest first)
      photos.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
      
      resolve(photos);
    }, 500);
  });
};

export const getPhotoSessions = async (patientId?: string): Promise<PhotoSession[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let sessions = getStorageData<PhotoSession>(STORAGE_KEYS.PHOTO_SESSIONS);
      
      if (patientId) {
        sessions = sessions.filter(session => session.patientId === patientId);
      }
      
      // Sort by date (newest first)
      sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      resolve(sessions);
    }, 300);
  });
};

export const getPhotoStats = async (): Promise<PhotoStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const photos = getStorageData<PatientPhoto>(STORAGE_KEYS.PATIENT_PHOTOS);
      const sessions = getStorageData<PhotoSession>(STORAGE_KEYS.PHOTO_SESSIONS);
      
      const totalImages = photos.length;
      
      const patientsWithPhotos = new Set(photos.map(photo => photo.patientId)).size;
      
      // Count sessions with both before and after photos
      const beforeAfterSets = sessions.filter(session => session.beforeCount > 0 && session.afterCount > 0).length;
      
      // Count photos uploaded today
      const today = new Date().toISOString().split('T')[0];
      const uploadedToday = photos.filter(photo => photo.uploadedAt.split('T')[0] === today).length;
      
      resolve({
        totalImages,
        patientsWithPhotos,
        beforeAfterSets,
        uploadedToday
      });
    }, 400);
  });
};

export const uploadPatientPhoto = async (formData: FormData): Promise<PatientPhoto> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const photos = getStorageData<PatientPhoto>(STORAGE_KEYS.PATIENT_PHOTOS);
        const sessions = getStorageData<PhotoSession>(STORAGE_KEYS.PHOTO_SESSIONS);
        
        const patientId = formData.get('patientId') as string;
        const sessionId = formData.get('sessionId') as string;
        const type = formData.get('type') as 'before' | 'after' | 'in-progress';
        const notes = formData.get('notes') as string;
        const file = formData.get('file') as File;
        
        if (!patientId || !sessionId || !type || !file) {
          reject(new Error('Missing required fields'));
          return;
        }
        
        // In a real app, we would upload the file to a server and get back URLs
        // Here we're just using placeholder URLs
        const imageUrl = 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=800';
        const thumbnailUrl = 'https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200';
        
        // Find the session
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        let session: PhotoSession;
        
        if (sessionIndex === -1) {
          // Create a new session if it doesn't exist
          session = {
            id: sessionId,
            patientId,
            patientName: 'Unknown Patient', // This would be fetched from patient data in a real app
            date: new Date().toISOString().split('T')[0],
            procedure: 'Unknown Procedure', // This would be specified in a real app
            doctorId: 'dr1',
            doctorName: 'Dr. Sarah Johnson', // This would be the current user in a real app
            beforeCount: type === 'before' ? 1 : 0,
            afterCount: type === 'after' ? 1 : 0,
            inProgressCount: type === 'in-progress' ? 1 : 0
          };
          sessions.push(session);
        } else {
          // Update existing session
          session = sessions[sessionIndex];
          if (type === 'before') {
            sessions[sessionIndex].beforeCount++;
          } else if (type === 'after') {
            sessions[sessionIndex].afterCount++;
          } else {
            sessions[sessionIndex].inProgressCount++;
          }
        }
        
        // Create new photo
        const newPhoto: PatientPhoto = {
          id: generateId(),
          patientId,
          patientName: session.patientName,
          sessionId,
          sessionDate: session.date,
          type,
          imageUrl,
          thumbnailUrl,
          uploadedBy: 'Current User', // This would be the current user in a real app
          uploadedAt: new Date().toISOString(),
          notes: notes || undefined,
          doctorId: session.doctorId,
          doctorName: session.doctorName
        };
        
        photos.push(newPhoto);
        
        setStorageData(STORAGE_KEYS.PATIENT_PHOTOS, photos);
        setStorageData(STORAGE_KEYS.PHOTO_SESSIONS, sessions);
        
        resolve(newPhoto);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

export const deletePhoto = async (photoId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const photos = getStorageData<PatientPhoto>(STORAGE_KEYS.PATIENT_PHOTOS);
        const sessions = getStorageData<PhotoSession>(STORAGE_KEYS.PHOTO_SESSIONS);
        
        const photoIndex = photos.findIndex(p => p.id === photoId);
        
        if (photoIndex === -1) {
          reject(new Error('Photo not found'));
          return;
        }
        
        const photo = photos[photoIndex];
        const sessionIndex = sessions.findIndex(s => s.id === photo.sessionId);
        
        if (sessionIndex !== -1) {
          // Update session counts
          if (photo.type === 'before') {
            sessions[sessionIndex].beforeCount = Math.max(0, sessions[sessionIndex].beforeCount - 1);
          } else if (photo.type === 'after') {
            sessions[sessionIndex].afterCount = Math.max(0, sessions[sessionIndex].afterCount - 1);
          } else {
            sessions[sessionIndex].inProgressCount = Math.max(0, sessions[sessionIndex].inProgressCount - 1);
          }
          
          // Remove session if no photos left
          if (
            sessions[sessionIndex].beforeCount === 0 &&
            sessions[sessionIndex].afterCount === 0 &&
            sessions[sessionIndex].inProgressCount === 0
          ) {
            sessions.splice(sessionIndex, 1);
          }
        }
        
        // Remove photo
        photos.splice(photoIndex, 1);
        
        setStorageData(STORAGE_KEYS.PATIENT_PHOTOS, photos);
        setStorageData(STORAGE_KEYS.PHOTO_SESSIONS, sessions);
        
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

// Export types for use in components
export type { PatientPhoto, PhotoSession, PhotoStats, PhotoFilters };