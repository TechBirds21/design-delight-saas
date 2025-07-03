// Mock API functions for Technician module
// In a real application, these would make HTTP requests to your backend

// Types
interface Procedure {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  procedure: string;
  duration: number;
  assignedBy: string;
  assignedById: number;
  scheduledTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  assignedAt: string;
  date: string;
  startTime?: string;
  endTime?: string;
  completionNotes?: string;
  actualDuration?: number;
}

interface SessionHistoryEntry {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  duration: number;
  assignedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'in-progress' | 'cancelled';
  notes: string;
}

interface TechnicianStats {
  assignedToday: number;
  completedSessions: number;
  missedDelayed: number;
  totalHistory: number;
}

interface Doctor {
  id: number;
  name: string;
}

interface CompletionData {
  notes: string;
  actualDuration?: number;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  TECHNICIAN_PROCEDURES: 'hospverse_technician_procedures',
  SESSION_HISTORY: 'hospverse_session_history',
  ACTIVE_SESSIONS: 'hospverse_active_sessions'
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

// Mock procedures data
const PROCEDURE_TYPES: string[] = [
  'Laser Hair Removal',
  'PRP Treatment',
  'Chemical Peel',
  'Microneedling',
  'Botox Injection',
  'Dermal Fillers',
  'Acne Treatment',
  'Pigmentation Treatment',
  'Hydrafacial',
  'LED Light Therapy'
];

// Mock doctors data
const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Sarah Johnson' },
  { id: 2, name: 'Dr. Michael Chen' },
  { id: 3, name: 'Dr. Emily Rodriguez' },
  { id: 4, name: 'Dr. David Kim' }
];

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.TECHNICIAN_PROCEDURES)) {
    const mockProcedures: Procedure[] = [
      {
        id: '1',
        patientId: 'p1',
        patientName: 'John Doe',
        patientAge: 34,
        patientPhone: '+1-555-0123',
        procedure: 'Laser Hair Removal',
        duration: 45,
        assignedBy: 'Dr. Sarah Johnson',
        assignedById: 1,
        scheduledTime: '09:00',
        status: 'pending',
        notes: 'Session 3 of 6 - Upper lip and chin area',
        assignedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '2',
        patientId: 'p2',
        patientName: 'Jane Smith',
        patientAge: 28,
        patientPhone: '+1-555-0124',
        procedure: 'PRP Treatment',
        duration: 60,
        assignedBy: 'Dr. Michael Chen',
        assignedById: 2,
        scheduledTime: '10:30',
        status: 'in-progress',
        notes: 'Hair restoration treatment - scalp area',
        assignedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString() // Started 15 minutes ago
      },
      {
        id: '3',
        patientId: 'p3',
        patientName: 'Mike Johnson',
        patientAge: 42,
        patientPhone: '+1-555-0125',
        procedure: 'Chemical Peel',
        duration: 30,
        assignedBy: 'Dr. Emily Rodriguez',
        assignedById: 3,
        scheduledTime: '14:00',
        status: 'pending',
        notes: 'Medium depth peel for acne scarring',
        assignedAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: '4',
        patientId: 'p4',
        patientName: 'Sarah Wilson',
        patientAge: 35,
        patientPhone: '+1-555-0126',
        procedure: 'Microneedling',
        duration: 45,
        assignedBy: 'Dr. David Kim',
        assignedById: 4,
        scheduledTime: '11:00',
        status: 'completed',
        notes: 'Face and neck treatment for fine lines',
        assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        date: new Date().toISOString().split('T')[0],
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        completionNotes: 'Treatment completed successfully. Patient tolerated well. Mild redness expected for 24-48 hours.'
      }
    ];
    setStorageData(STORAGE_KEYS.TECHNICIAN_PROCEDURES, mockProcedures);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY)) {
    const mockHistory: SessionHistoryEntry[] = [
      {
        id: '1',
        patientId: 'p5',
        patientName: 'Lisa Chen',
        procedure: 'Laser Hair Removal',
        duration: 40,
        assignedBy: 'Dr. Sarah Johnson',
        date: '2024-01-10',
        startTime: '2024-01-10T09:00:00Z',
        endTime: '2024-01-10T09:40:00Z',
        status: 'completed',
        notes: 'Session completed without complications. Good response to treatment.'
      },
      {
        id: '2',
        patientId: 'p6',
        patientName: 'Robert Brown',
        procedure: 'PRP Treatment',
        duration: 55,
        assignedBy: 'Dr. Michael Chen',
        date: '2024-01-08',
        startTime: '2024-01-08T14:00:00Z',
        endTime: '2024-01-08T14:55:00Z',
        status: 'completed',
        notes: 'Hair restoration treatment completed. Patient advised on post-care.'
      },
      {
        id: '3',
        patientId: 'p7',
        patientName: 'Emma Davis',
        procedure: 'Chemical Peel',
        duration: 25,
        assignedBy: 'Dr. Emily Rodriguez',
        date: '2024-01-05',
        startTime: '2024-01-05T11:30:00Z',
        endTime: '2024-01-05T11:55:00Z',
        status: 'completed',
        notes: 'Light peel applied. Patient experienced minimal discomfort.'
      }
    ];
    setStorageData(STORAGE_KEYS.SESSION_HISTORY, mockHistory);
  }
};

// Initialize mock data
initializeMockData();

// API Functions
export const getAssignedProcedures = async (filters: { status?: string; search?: string } = {}): Promise<Procedure[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let procedures = getStorageData<Procedure>(STORAGE_KEYS.TECHNICIAN_PROCEDURES);
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        procedures = procedures.filter(proc => proc.status === filters.status);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        procedures = procedures.filter(proc => 
          proc.patientName.toLowerCase().includes(searchTerm) ||
          proc.procedure.toLowerCase().includes(searchTerm) ||
          proc.assignedBy.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by scheduled time
      procedures.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
      
      resolve(procedures);
    }, 300);
  });
};

export const getProcedureDetails = async (procedureId: string): Promise<Procedure> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const procedures = getStorageData<Procedure>(STORAGE_KEYS.TECHNICIAN_PROCEDURES);
      const procedure = procedures.find(p => p.id === procedureId);
      
      if (procedure) {
        resolve(procedure);
      } else {
        reject(new Error('Procedure not found'));
      }
    }, 200);
  });
};

export const startSession = async (procedureId: string): Promise<Procedure> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const procedures = getStorageData<Procedure>(STORAGE_KEYS.TECHNICIAN_PROCEDURES);
        const procedureIndex = procedures.findIndex(p => p.id === procedureId);
        
        if (procedureIndex === -1) {
          reject(new Error('Procedure not found'));
          return;
        }
        
        procedures[procedureIndex] = {
          ...procedures[procedureIndex],
          status: 'in-progress',
          startTime: new Date().toISOString()
        };
        
        setStorageData(STORAGE_KEYS.TECHNICIAN_PROCEDURES, procedures);
        resolve(procedures[procedureIndex]);
      } catch (error) {
        reject(error);
      }
    }, 400);
  });
};

export const completeSession = async (procedureId: string, completionData: CompletionData): Promise<Procedure> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const procedures = getStorageData<Procedure>(STORAGE_KEYS.TECHNICIAN_PROCEDURES);
        const procedureIndex = procedures.findIndex(p => p.id === procedureId);
        
        if (procedureIndex === -1) {
          reject(new Error('Procedure not found'));
          return;
        }
        
        const completedProcedure: Procedure = {
          ...procedures[procedureIndex],
          status: 'completed',
          endTime: new Date().toISOString(),
          completionNotes: completionData.notes,
          actualDuration: completionData.actualDuration
        };
        
        procedures[procedureIndex] = completedProcedure;
        setStorageData(STORAGE_KEYS.TECHNICIAN_PROCEDURES, procedures);
        
        // Add to session history
        const history = getStorageData<SessionHistoryEntry>(STORAGE_KEYS.SESSION_HISTORY);
        const historyEntry: SessionHistoryEntry = {
          id: generateId(),
          patientId: completedProcedure.patientId,
          patientName: completedProcedure.patientName,
          procedure: completedProcedure.procedure,
          duration: completionData.actualDuration || completedProcedure.duration,
          assignedBy: completedProcedure.assignedBy,
          date: completedProcedure.date,
          startTime: completedProcedure.startTime!,
          endTime: completedProcedure.endTime!,
          status: 'completed',
          notes: completionData.notes
        };
        
        history.unshift(historyEntry);
        setStorageData(STORAGE_KEYS.SESSION_HISTORY, history);
        
        resolve(completedProcedure);
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};

export const getSessionHistory = async (filters: {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  doctor?: string;
  procedure?: string;
  search?: string;
} = {}): Promise<SessionHistoryEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let history = getStorageData<SessionHistoryEntry>(STORAGE_KEYS.SESSION_HISTORY);
      
      // Apply filters
      if (filters.dateFrom && filters.dateTo) {
        history = history.filter(session => {
          const sessionDate = new Date(session.date);
          const fromDate = new Date(filters.dateFrom!);
          const toDate = new Date(filters.dateTo!);
          return sessionDate >= fromDate && sessionDate <= toDate;
        });
      }
      
      if (filters.status && filters.status !== 'all') {
        history = history.filter(session => session.status === filters.status);
      }
      
      if (filters.doctor && filters.doctor !== 'all') {
        history = history.filter(session => session.assignedBy === filters.doctor);
      }
      
      if (filters.procedure && filters.procedure !== 'all') {
        history = history.filter(session => session.procedure === filters.procedure);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        history = history.filter(session => 
          session.patientName.toLowerCase().includes(searchTerm) ||
          session.procedure.toLowerCase().includes(searchTerm) ||
          session.assignedBy.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by date (newest first)
      history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      resolve(history);
    }, 400);
  });
};

export const getTechnicianStats = async (): Promise<TechnicianStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const procedures = getStorageData<Procedure>(STORAGE_KEYS.TECHNICIAN_PROCEDURES);
      const history = getStorageData<SessionHistoryEntry>(STORAGE_KEYS.SESSION_HISTORY);
      
      const today = new Date().toISOString().split('T')[0];
      const todayProcedures = procedures.filter(proc => proc.date === today);
      const completedToday = todayProcedures.filter(proc => proc.status === 'completed');
      const missedDelayed = todayProcedures.filter(proc => {
        if (proc.status !== 'pending') return false;
        const scheduledTime = new Date(`${proc.date}T${proc.scheduledTime}:00`);
        const now = new Date();
        return now > scheduledTime;
      });
      
      resolve({
        assignedToday: todayProcedures.length,
        completedSessions: completedToday.length,
        missedDelayed: missedDelayed.length,
        totalHistory: history.length
      });
    }, 300);
  });
};

export const getProcedureTypes = async (): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(PROCEDURE_TYPES);
    }, 100);
  });
};

export const getDoctors = async (): Promise<Doctor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DOCTORS);
    }, 100);
  });
};