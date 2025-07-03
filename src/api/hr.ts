// hr.ts

// ——————————————
// Types
// ——————————————
export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  branch: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'on-leave' | 'suspended' | 'terminated';
  avatar?: string;
  personalDetails?: {
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other';
    address?: string;
    emergencyContact?: string;
    bloodGroup?: string;
    maritalStatus?: string;
  };
  employmentDetails?: {
    employeeId: string;
    contractType: 'permanent' | 'contract' | 'part-time';
    designation: string;
    reportingTo?: string;
    workHours: string;
    probationPeriod?: string;
    probationEndDate?: string;
  };
  documents?: StaffDocument[];
  shifts?: ShiftRecord[];
  performance?: PerformanceNote[];
  salary?: SalaryStructure;
}

export interface StaffDocument {
  id: string;
  staffId: string;
  type: 'id-proof' | 'contract' | 'certificate' | 'resume' | 'other';
  name: string;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  expiryDate?: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'half-day' | 'leave' | 'holiday';
  leaveType?: 'casual' | 'sick' | 'annual' | 'unpaid';
  notes?: string;
  approvedBy?: string;
}

export interface ShiftRecord {
  id: string;
  staffId: string;
  date: string;
  shiftCode: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'missed';
  notes?: string;
}

export interface PerformanceNote {
  id: string;
  staffId: string;
  date: string;
  type: 'review' | 'achievement' | 'warning' | 'note';
  title: string;
  description: string;
  rating?: number;
  addedBy: string;
}

export interface SalaryStructure {
  id: string;
  staffId: string;
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  special: number;
  bonus?: number;
  pf: number;
  tax: number;
  otherDeductions?: number;
  effectiveFrom: string;
  currency: string;
  paymentFrequency: 'monthly' | 'bi-weekly' | 'weekly';
  bankAccount?: string;
  panNumber?: string;
  pfNumber?: string;
  uan?: string;
}

export interface HRStats {
  totalStaff: number;
  onLeaveToday: number;
  newJoinsThisMonth: number;
  upcomingReviews: number;
  departmentCounts: Record<string, number>;
  branchCounts: Record<string, number>;
}

// ——————————————
// localStorage keys & helpers
// ——————————————
const STORAGE_KEYS = {
  STAFF: 'hospverse_hr_staff',
  ATTENDANCE: 'hospverse_hr_attendance',
  DOCUMENTS: 'hospverse_hr_documents',
  SHIFTS: 'hospverse_hr_shifts',
  PERFORMANCE: 'hospverse_hr_performance',
  SALARY: 'hospverse_hr_salary'
};

const getStorageData = <T>(key: string, defaultValue: T[] = []): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorageData = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    /* ignore */
  }
};

const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

// ——————————————
// Seed some mock data on first load
// ——————————————
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.STAFF)) {
    const mockStaff: Staff[] = [
      /* … your five staff members from above … */
    ];
    setStorageData(STORAGE_KEYS.STAFF, mockStaff);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    setStorageData(STORAGE_KEYS.ATTENDANCE, generateMockAttendance());
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    setStorageData(STORAGE_KEYS.DOCUMENTS, [
      /* … your 3 mock docs … */
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SHIFTS)) {
    setStorageData(STORAGE_KEYS.SHIFTS, generateMockShifts());
  }
  if (!localStorage.getItem(STORAGE_KEYS.PERFORMANCE)) {
    setStorageData(STORAGE_KEYS.PERFORMANCE, [
      /* … your 3 perf notes … */
    ]);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALARY)) {
    setStorageData(STORAGE_KEYS.SALARY, [
      /* … your 2 salary records … */
    ]);
  }
};

initializeMockData();

// ——————————————
// Mock generators (30 days)
// ——————————————
function generateMockAttendance(): AttendanceRecord[] { return []; }
function generateMockShifts(): ShiftRecord[] { return []; }

// ——————————————
// API functions
// ——————————————
export const getAllStaff = async (filters: {
  branch?: string;
  role?: string;
  status?: string;
  search?: string;
} = {}): Promise<Staff[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let list = getStorageData<Staff>(STORAGE_KEYS.STAFF);
      if (filters.branch && filters.branch !== 'all') {
        list = list.filter(s => s.branch === filters.branch);
      }
      if (filters.role && filters.role !== 'all') {
        list = list.filter(s => s.role === filters.role);
      }
      if (filters.status && filters.status !== 'all') {
        list = list.filter(s => s.status === filters.status);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        list = list.filter(
          s =>
            s.name.toLowerCase().includes(term) ||
            s.email.toLowerCase().includes(term) ||
            s.phone.includes(term) ||
            s.employmentDetails?.employeeId
              .toLowerCase()
              .includes(term)
        );
      }
      list.sort((a, b) => a.name.localeCompare(b.name));
      resolve(list);
    }, 300);
  });
};

export const getStaffDetails = async (id: string): Promise<Staff> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = getStorageData<Staff>(STORAGE_KEYS.STAFF);
      const staff = all.find(s => s.id === id);
      if (!staff) return reject(new Error('Not found'));
      // attach documents, shifts, performance, salary
      const documents = getStorageData<StaffDocument>(
        STORAGE_KEYS.DOCUMENTS
      ).filter(d => d.staffId === id);
      const shifts = getStorageData<ShiftRecord>(
        STORAGE_KEYS.SHIFTS
      ).filter(sh => sh.staffId === id);
      const performance = getStorageData<PerformanceNote>(
        STORAGE_KEYS.PERFORMANCE
      ).filter(p => p.staffId === id);
      const salary = getStorageData<SalaryStructure>(
        STORAGE_KEYS.SALARY
      ).find(sal => sal.staffId === id);
      resolve({
        ...staff,
        documents,
        shifts,
        performance,
        salary
      });
    }, 300);
  });
};

export const addStaff = async (
  staffData: Omit<Staff, 'id'>
): Promise<Staff> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const all = getStorageData<Staff>(STORAGE_KEYS.STAFF);
      const newOne: Staff = {
        id: generateId(),
        ...staffData
      };
      all.push(newOne);
      setStorageData(STORAGE_KEYS.STAFF, all);
      resolve(newOne);
    }, 500);
  });
};

export const updateStaff = async (
  id: string,
  data: Partial<Staff>
): Promise<Staff> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const all = getStorageData<Staff>(STORAGE_KEYS.STAFF);
      const idx = all.findIndex(s => s.id === id);
      if (idx === -1) return reject(new Error('Not found'));
      all[idx] = { ...all[idx], ...data };
      setStorageData(STORAGE_KEYS.STAFF, all);
      resolve(all[idx]);
    }, 500);
  });
};

export const uploadStaffDocument = async (
  staffId: string,
  formData: FormData
): Promise<StaffDocument> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const file = formData.get('file') as File;
        if (!file) throw new Error('No file');
        const docs = getStorageData<StaffDocument>(
          STORAGE_KEYS.DOCUMENTS
        );
        const newDoc: StaffDocument = {
          id: generateId(),
          staffId,
          type: formData.get('type') as StaffDocument['type'],
          name: formData.get('name') as string,
          fileName: file.name,
          fileType: file.type,
          uploadedAt: new Date().toISOString(),
          expiryDate:
            (formData.get('expiryDate') as string) || undefined,
          notes: (formData.get('notes') as string) || undefined
        };
        docs.push(newDoc);
        setStorageData(STORAGE_KEYS.DOCUMENTS, docs);
        resolve(newDoc);
      } catch (err) {
        reject(err);
      }
    }, 500);
  });
};

export const getAttendanceLog = async (
  staffId: string,
  month?: string,
  year?: string
): Promise<AttendanceRecord[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      let recs = getStorageData<AttendanceRecord>(
        STORAGE_KEYS.ATTENDANCE
      ).filter(a => a.staffId === staffId);
      if (month && year) {
        const prefix = `${year}-${month.padStart(2, '0')}`;
        recs = recs.filter(a => a.date.startsWith(prefix));
      }
      recs.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      resolve(recs);
    }, 300);
  });
};

export const logPerformance = async (
  staffId: string,
  noteData: Omit<PerformanceNote, 'id' | 'staffId' | 'addedBy'>
): Promise<PerformanceNote> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allStaff = getStorageData<Staff>(STORAGE_KEYS.STAFF);
      if (!allStaff.find(s => s.id === staffId))
        return reject(new Error('Staff not found'));
      const notes = getStorageData<PerformanceNote>(
        STORAGE_KEYS.PERFORMANCE
      );
      const newNote: PerformanceNote = {
        id: generateId(),
        staffId,
        addedBy: 'Current User',
        ...noteData
      };
      notes.push(newNote);
      setStorageData(STORAGE_KEYS.PERFORMANCE, notes);
      resolve(newNote);
    }, 500);
  });
};

export const getHRStats = async (): Promise<HRStats> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const allStaff = getStorageData<Staff>(STORAGE_KEYS.STAFF);
      const allAtt = getStorageData<AttendanceRecord>(
        STORAGE_KEYS.ATTENDANCE
      );
      const totalStaff = allStaff.length;
      const today = new Date().toISOString().split('T')[0];
      const onLeaveToday = allAtt.filter(
        a => a.date === today && a.status === 'leave'
      ).length;
      const now = new Date();
      const newJoinsThisMonth = allStaff.filter(s => {
        const d = new Date(s.joinDate);
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth()
        );
      }).length;
      const upcomingReviews = 3;
      const departmentCounts: Record<string, number> = {};
      const branchCounts: Record<string, number> = {};
      allStaff.forEach(s => {
        departmentCounts[s.department] =
          (departmentCounts[s.department] || 0) + 1;
        branchCounts[s.branch] = (branchCounts[s.branch] || 0) + 1;
      });
      resolve({
        totalStaff,
        onLeaveToday,
        newJoinsThisMonth,
        upcomingReviews,
        departmentCounts,
        branchCounts
      });
    }, 300);
  });
};

// ——————————————
// Default export for convenience
// ——————————————
const HRService = {
  getAllStaff,
  getStaffDetails,
  addStaff,
  updateStaff,
  uploadStaffDocument,
  getAttendanceLog,
  logPerformance,
  getHRStats
};
export default HRService;
