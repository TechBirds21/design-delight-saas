// Mock API functions for Reception module
// In a real application, these would make HTTP requests to your backend

// Types
export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorId: number;
  doctorName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'emergency' | 'specialist';
  notes?: string;
  bookedAt?: string;
}

export interface Patient {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  appointmentType: 'new' | 'follow-up';
  referredBy: 'google' | 'instagram' | 'facebook' | 'referral' | 'walk-in' | 'other';
  clinicBranch?: string;
  registeredAt: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  available: boolean;
}

export interface QueueEntry {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName?: string;
  appointmentTime?: string;
  status: 'waiting' | 'checked-in' | 'with-doctor' | 'completed' | 'cancelled';
  checkedInAt: string;
  queueNumber: number;
}

export interface ConsentForm {
  id: string;
  patientId: string;
  patientName: string;
  fileType: string;
  fileName: string;
  signature?: string;
  uploadedAt: string;
}

export interface ReceptionStats {
  todayAppointments: number;
  walkInsRegistered: number;
  patientsInQueue: number;
  completedAppointments: number;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  APPOINTMENTS: 'hospverse_appointments',
  PATIENTS: 'hospverse_patients',
  QUEUE: 'hospverse_queue',
  CONSENT_FORMS: 'hospverse_consent_forms'
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

// Mock doctors data
const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Sarah Johnson', specialization: 'General Medicine', available: true },
  { id: 2, name: 'Dr. Michael Chen', specialization: 'Dermatology', available: true },
  { id: 3, name: 'Dr. Emily Rodriguez', specialization: 'Cardiology', available: false },
  { id: 4, name: 'Dr. David Kim', specialization: 'Pediatrics', available: true },
  { id: 5, name: 'Dr. Lisa Thompson', specialization: 'Orthopedics', available: true }
];

// Mock time slots
const TIME_SLOTS: string[] = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'John Doe',
        patientPhone: '+1-555-0123',
        doctorId: 1,
        doctorName: 'Dr. Sarah Johnson',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        status: 'confirmed',
        type: 'consultation',
        notes: 'Regular checkup'
      },
      {
        id: '2',
        patientName: 'Jane Smith',
        patientPhone: '+1-555-0124',
        doctorId: 2,
        doctorName: 'Dr. Michael Chen',
        date: new Date().toISOString().split('T')[0],
        time: '10:30',
        status: 'waiting',
        type: 'follow-up',
        notes: 'Skin condition follow-up'
      }
    ];
    setStorageData(STORAGE_KEYS.APPOINTMENTS, mockAppointments);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const mockPatients: Patient[] = [
      {
        id: '1',
        fullName: 'John Doe',
        mobile: '+1-555-0123',
        email: 'john.doe@email.com',
        gender: 'male',
        dateOfBirth: '1990-05-15',
        appointmentType: 'new',
        referredBy: 'google',
        clinicBranch: 'main',
        registeredAt: new Date().toISOString()
      }
    ];
    setStorageData(STORAGE_KEYS.PATIENTS, mockPatients);
  }
};

// Initialize mock data
initializeMockData();

// API Functions
export const getTodayAppointments = async (): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appointments = getStorageData<Appointment>(STORAGE_KEYS.APPOINTMENTS);
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => apt.date === today);
      resolve(todayAppointments);
    }, 500);
  });
};

export const registerPatient = async (patientData: Omit<Patient, 'id' | 'registeredAt'>): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const patients = getStorageData<Patient>(STORAGE_KEYS.PATIENTS);
        const newPatient: Patient = {
          id: generateId(),
          ...patientData,
          registeredAt: new Date().toISOString()
        };
        patients.push(newPatient);
        setStorageData(STORAGE_KEYS.PATIENTS, patients);
        resolve(newPatient);
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
};

export const bookAppointment = async (appointmentData: Omit<Appointment, 'id' | 'doctorName' | 'status' | 'bookedAt'>): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const appointments = getStorageData<Appointment>(STORAGE_KEYS.APPOINTMENTS);
        const doctor = DOCTORS.find(d => d.id === appointmentData.doctorId);
        
        const newAppointment: Appointment = {
          id: generateId(),
          ...appointmentData,
          doctorName: doctor?.name || 'Unknown Doctor',
          status: 'confirmed',
          bookedAt: new Date().toISOString()
        };
        
        appointments.push(newAppointment);
        setStorageData(STORAGE_KEYS.APPOINTMENTS, appointments);
        resolve(newAppointment);
      } catch (error) {
        reject(error);
      }
    }, 800);
  });
};

export const getQueueList = async (): Promise<QueueEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const queue = getStorageData<QueueEntry>(STORAGE_KEYS.QUEUE);
      resolve(queue);
    }, 300);
  });
};

export const updatePatientStatus = async (patientId: string, newStatus: QueueEntry['status']): Promise<QueueEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const queue = getStorageData<QueueEntry>(STORAGE_KEYS.QUEUE);
      const updatedQueue = queue.map(patient => 
        patient.id === patientId ? { ...patient, status: newStatus } : patient
      );
      setStorageData(STORAGE_KEYS.QUEUE, updatedQueue);
      resolve(updatedQueue);
    }, 300);
  });
};

export const addToQueue = async (patientData: Omit<QueueEntry, 'id' | 'status' | 'checkedInAt' | 'queueNumber'>): Promise<QueueEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const queue = getStorageData<QueueEntry>(STORAGE_KEYS.QUEUE);
      const queueEntry: QueueEntry = {
        id: generateId(),
        ...patientData,
        status: 'waiting',
        checkedInAt: new Date().toISOString(),
        queueNumber: queue.length + 1
      };
      queue.push(queueEntry);
      setStorageData(STORAGE_KEYS.QUEUE, [queueEntry]);
      resolve(queueEntry);
    }, 300);
  });
};

export const uploadConsent = async (formData: FormData): Promise<ConsentForm> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const consentForms = getStorageData<ConsentForm>(STORAGE_KEYS.CONSENT_FORMS);
        const file = formData.get('file') as File;
        const newConsent: ConsentForm = {
          id: generateId(),
          patientId: formData.get('patientId') as string,
          patientName: formData.get('patientName') as string,
          fileType: file?.type || 'application/pdf',
          fileName: file?.name || 'consent.pdf',
          signature: formData.get('signature') as string,
          uploadedAt: new Date().toISOString()
        };
        consentForms.push(newConsent);
        setStorageData(STORAGE_KEYS.CONSENT_FORMS, consentForms);
        resolve(newConsent);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
};

export const getDoctors = async (): Promise<Doctor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DOCTORS);
    }, 200);
  });
};

export const getAvailableTimeSlots = async (date: string, doctorId: string): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appointments = getStorageData<Appointment>(STORAGE_KEYS.APPOINTMENTS);
      const bookedSlots = appointments
        .filter(apt => apt.date === date && apt.doctorId === parseInt(doctorId))
        .map(apt => apt.time);
      
      const availableSlots = TIME_SLOTS.filter(slot => !bookedSlots.includes(slot));
      resolve(availableSlots);
    }, 300);
  });
};

export const getReceptionStats = async (): Promise<ReceptionStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appointments = getStorageData<Appointment>(STORAGE_KEYS.APPOINTMENTS);
      const patients = getStorageData<Patient>(STORAGE_KEYS.PATIENTS);
      const queue = getStorageData<QueueEntry>(STORAGE_KEYS.QUEUE);
      
      const today = new Date().toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => apt.date === today);
      const todayRegistrations = patients.filter(patient => 
        patient.registeredAt.split('T')[0] === today
      );
      
      resolve({
        todayAppointments: todayAppointments.length,
        walkInsRegistered: todayRegistrations.length,
        patientsInQueue: queue.length,
        completedAppointments: todayAppointments.filter(apt => apt.status === 'completed').length
      });
    }, 400);
  });
};