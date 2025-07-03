// src/api/doctor.ts

// Mock API functions for Doctor module
// In a real application, these would make HTTP requests to your backend

// Types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  phone: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  date: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  medicalHistory: string;
  allergies: string;
  lastVisit: string;
  totalVisits: number;
  avatar?: string;
  visitHistory?: TreatmentRecord[];
  soapNotes?: SOAPNote[];
}

export interface TreatmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  procedure: string;
  performedBy: string;
  notes: string;
  status: string;
}

export interface SOAPNote {
  id: string;
  patientId: string;
  patientName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    weight?: string;
  };
  createdAt: string;
  status: 'draft' | 'submitted';
  doctorId: string;
  doctorName: string;
}

export interface DoctorStats {
  todayAppointments: number;
  assignedPatients: number;
  completedSessions: number;
  totalTreatments: number;
}

export interface Technician {
  id: number;
  name: string;
  specialization: string;
  available: boolean;
}

export interface PhotoUpload {
  id: string;
  patientId: string;
  type: 'before' | 'after';
  sessionId: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AssignmentData {
  patientId: string;
  technicianId: string;
  procedure: string;
  notes?: string;
}

export interface TechnicianAssignment {
  id: string;
  patientId: string;
  technicianId: string;
  procedure: string;
  notes?: string;
  assignedAt: string;
  status: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  DOCTOR_APPOINTMENTS: 'hospverse_doctor_appointments',
  PATIENTS: 'hospverse_patients',
  SOAP_NOTES: 'hospverse_soap_notes',
  TREATMENT_HISTORY: 'hospverse_treatment_history',
  PATIENT_PHOTOS: 'hospverse_patient_photos',
  TECHNICIANS: 'hospverse_technicians'
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
const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

// Mock technicians data
const TECHNICIANS: Technician[] = [
  { id: 1, name: 'Sarah Wilson', specialization: 'Laser Therapy', available: true },
  { id: 2, name: 'Mike Johnson', specialization: 'PRP Treatment', available: true },
  { id: 3, name: 'Lisa Chen', specialization: 'Chemical Peels', available: false },
  { id: 4, name: 'David Brown', specialization: 'Microneedling', available: true }
];

// Mock procedures
const PROCEDURES: string[] = [
  'Laser Hair Removal',
  'PRP Treatment',
  'Chemical Peel',
  'Microneedling',
  'Botox Injection',
  'Dermal Fillers',
  'Acne Treatment',
  'Pigmentation Treatment'
];

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.DOCTOR_APPOINTMENTS)) {
    const today = new Date().toISOString().split('T')[0];
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: 'p1',
        patientName: 'John Doe',
        age: 34,
        phone: '+1-555-0123',
        time: '09:00',
        status: 'scheduled',
        notes: 'Acne treatment follow-up',
        date: today
      },
      {
        id: '2',
        patientId: 'p2',
        patientName: 'Jane Smith',
        age: 28,
        phone: '+1-555-0124',
        time: '10:30',
        status: 'in-progress',
        notes: 'Laser hair removal session 3',
        date: today
      },
      {
        id: '3',
        patientId: 'p3',
        patientName: 'Mike Johnson',
        age: 42,
        phone: '+1-555-0125',
        time: '14:00',
        status: 'completed',
        notes: 'PRP treatment consultation',
        date: today
      }
    ];
    setStorageData(STORAGE_KEYS.DOCTOR_APPOINTMENTS, mockAppointments);
  }

  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    const mockPatients: Patient[] = [
      {
        id: 'p1',
        name: 'John Doe',
        age: 34,
        gender: 'Male',
        phone: '+1-555-0123',
        email: 'john.doe@email.com',
        medicalHistory: 'Acne, sensitive skin',
        allergies: 'None known',
        lastVisit: '2024-01-10',
        totalVisits: 5,
        avatar:
          'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
      },
      {
        id: 'p2',
        name: 'Jane Smith',
        age: 28,
        gender: 'Female',
        phone: '+1-555-0124',
        email: 'jane.smith@email.com',
        medicalHistory: 'Unwanted hair growth',
        allergies: 'Latex',
        lastVisit: '2024-01-08',
        totalVisits: 8,
        avatar:
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
      },
      {
        id: 'p3',
        name: 'Mike Johnson',
        age: 42,
        gender: 'Male',
        phone: '+1-555-0125',
        email: 'mike.j@email.com',
        medicalHistory: 'Hair loss, aging skin',
        allergies: 'None',
        lastVisit: '2024-01-15',
        totalVisits: 3,
        avatar:
          'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop'
      }
    ];
    setStorageData(STORAGE_KEYS.PATIENTS, mockPatients);
  }

  if (!localStorage.getItem(STORAGE_KEYS.TREATMENT_HISTORY)) {
    const mockTreatmentHistory: TreatmentRecord[] = [
      {
        id: '1',
        patientId: 'p1',
        patientName: 'John Doe',
        date: '2024-01-10',
        procedure: 'Acne Treatment',
        performedBy: 'Dr. Sarah Johnson',
        notes: 'Applied topical treatment, good response',
        status: 'completed'
      },
      {
        id: '2',
        patientId: 'p2',
        patientName: 'Jane Smith',
        date: '2024-01-08',
        procedure: 'Laser Hair Removal',
        performedBy: 'Sarah Wilson',
        notes: 'Session 3 of 6, excellent progress',
        status: 'completed'
      },
      {
        id: '3',
        patientId: 'p3',
        patientName: 'Mike Johnson',
        date: '2024-01-15',
        procedure: 'PRP Treatment',
        performedBy: 'Mike Johnson',
        notes: 'Initial consultation and treatment plan',
        status: 'in-progress'
      }
    ];
    setStorageData(STORAGE_KEYS.TREATMENT_HISTORY, mockTreatmentHistory);
  }

  setStorageData(STORAGE_KEYS.TECHNICIANS, TECHNICIANS);
};
initializeMockData();

// ————————————————————————————————————————————————————————————————
// API Functions (all return Promises)
// ————————————————————————————————————————————————————————————————

export const getDoctorAppointments = async (filters: {
  status?: string;
  search?: string;
} = {}): Promise<Appointment[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let appts = getStorageData<Appointment>(STORAGE_KEYS.DOCTOR_APPOINTMENTS);
      if (filters.status && filters.status !== 'all')
        appts = appts.filter((a) => a.status === filters.status);
      if (filters.search) {
        const term = filters.search.toLowerCase();
        appts = appts.filter(
          (a) =>
            a.patientName.toLowerCase().includes(term) ||
            a.phone.includes(term)
        );
      }
      resolve(appts);
    }, 300);
  });
};

export const getPatientDetails = async (
  patientId: string
): Promise<Patient> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const patients = getStorageData<Patient>(STORAGE_KEYS.PATIENTS);
      const patient = patients.find((p) => p.id === patientId);
      if (!patient) return reject(new Error('Patient not found'));
      const history = getStorageData<TreatmentRecord>(
        STORAGE_KEYS.TREATMENT_HISTORY
      ).filter((h) => h.patientId === patientId);
      const notes = getStorageData<SOAPNote>(STORAGE_KEYS.SOAP_NOTES).filter(
        (s) => s.patientId === patientId
      );
      resolve({ ...patient, visitHistory: history, soapNotes: notes });
    }, 400);
  });
};

export const submitSOAPNote = async (
  soapData: Omit<SOAPNote, 'id' | 'createdAt' | 'status'> & {
    isDraft?: boolean;
  }
): Promise<SOAPNote> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const all = getStorageData<SOAPNote>(STORAGE_KEYS.SOAP_NOTES);
      const newNote: SOAPNote = {
        id: generateId(),
        ...soapData,
        createdAt: new Date().toISOString(),
        status: soapData.isDraft ? 'draft' : 'submitted'
      };
      all.push(newNote);
      setStorageData(STORAGE_KEYS.SOAP_NOTES, all);
      resolve(newNote);
    }, 600);
  });
};

export const assignTechnician = async (
  data: AssignmentData
): Promise<TechnicianAssignment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const all = getStorageData<TechnicianAssignment>(
          'hospverse_technician_assignments',
          []
        );
        const assign: TechnicianAssignment = {
          id: generateId(),
          ...data,
          assignedAt: new Date().toISOString(),
          status: 'assigned'
        };
        all.push(assign);
        setStorageData('hospverse_technician_assignments', all);
        resolve(assign);
      } catch (err) {
        reject(err);
      }
    }, 500);
  });
};

export const uploadPhoto = async (
  form: FormData
): Promise<PhotoUpload> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const photos = getStorageData<PhotoUpload>(
          STORAGE_KEYS.PATIENT_PHOTOS
        );
        const file = form.get('file') as File;
        const up: PhotoUpload = {
          id: generateId(),
          patientId: form.get('patientId') as string,
          type: form.get('type') as 'before' | 'after',
          sessionId: form.get('sessionId') as string,
          fileName: file?.name || 'photo.jpg',
          fileSize: file?.size || 0,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Dr. Sarah Johnson'
        };
        photos.push(up);
        setStorageData(STORAGE_KEYS.PATIENT_PHOTOS, photos);
        resolve(up);
      } catch (err) {
        reject(err);
      }
    }, 800);
  });
};

export const getTreatmentHistory = async (filters: {
  patientId?: string;
  procedure?: string;
  status?: string;
} = {}): Promise<TreatmentRecord[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let hist = getStorageData<TreatmentRecord>(
        STORAGE_KEYS.TREATMENT_HISTORY
      );
      if (filters.patientId)
        hist = hist.filter((h) => h.patientId === filters.patientId);
      if (filters.procedure && filters.procedure !== 'all')
        hist = hist.filter((h) => h.procedure === filters.procedure);
      if (filters.status && filters.status !== 'all')
        hist = hist.filter((h) => h.status === filters.status);
      hist.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      resolve(hist);
    }, 400);
  });
};

export const getTechnicians = async (): Promise<Technician[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        getStorageData<Technician>(STORAGE_KEYS.TECHNICIANS).filter(
          (t) => t.available
        )
      );
    }, 200);
  });
};

export const getProcedures = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(PROCEDURES), 100);
  });
};

export const getDoctorStats = async (): Promise<DoctorStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appts = getStorageData<Appointment>(
        STORAGE_KEYS.DOCTOR_APPOINTMENTS
      );
      const pats = getStorageData<Patient>(STORAGE_KEYS.PATIENTS);
      const hist = getStorageData<TreatmentRecord>(
        STORAGE_KEYS.TREATMENT_HISTORY
      );
      const today = new Date().toISOString().split('T')[0];
      const todays = appts.filter((a) => a.date === today);
      const completed = todays.filter((a) => a.status === 'completed');
      resolve({
        todayAppointments: todays.length,
        assignedPatients: pats.length,
        completedSessions: completed.length,
        totalTreatments: hist.length
      });
    }, 300);
  });
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: Appointment['status']
): Promise<Appointment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const appts = getStorageData<Appointment>(
        STORAGE_KEYS.DOCTOR_APPOINTMENTS
      ).map((a) =>
        a.id === appointmentId ? { ...a, status } : a
      );
      setStorageData(STORAGE_KEYS.DOCTOR_APPOINTMENTS, appts);
      resolve(appts.find((a) => a.id === appointmentId)!);
    }, 300);
  });
};

// ————————————————————————————————————————————————————————————————
// CSV Export
// ————————————————————————————————————————————————————————————————
/**
 * exportDoctorAppointments(filters?): Promise<Blob>
 * Generates a CSV of all appointments matching the optional filters.
 */
export const exportDoctorAppointments = async (filters: {
  status?: string;
  search?: string;
} = {}): Promise<Blob> => {
  const data = await getDoctorAppointments(filters);

  // Build CSV header
  const headers = [
    'ID',
    'Patient ID',
    'Patient Name',
    'Age',
    'Phone',
    'Time',
    'Date',
    'Status',
    'Notes'
  ];
  const rows = data.map((a) => {
    const safeName = a.patientName.replace(/"/g, '""');
    const safeNotes = a.notes.replace(/"/g, '""');
    return [
      a.id,
      a.patientId,
      `"${safeName}"`,
      a.age,
      `"${a.phone}"`,
      a.time,
      a.date,
      a.status,
      `"${safeNotes}"`
    ].join(',');
  });

  const csvString = [headers.join(','), ...rows].join('\r\n');
  return new Blob([csvString], { type: 'text/csv' });
};
