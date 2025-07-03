// Mock API functions for CRM module
// In a real application, these would make HTTP requests to your backend

// Types
interface Lead {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  source: 'whatsapp' | 'form' | 'referral' | 'instagram' | 'walk-in' | 'facebook' | 'google';
  status: 'new' | 'contacted' | 'consulted' | 'converted' | 'dropped';
  assignedTo: string;
  assignedToId: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  convertedAt?: string;
  dropReason?: string;
  statusHistory: StatusHistoryEntry[];
  notesHistory: NoteEntry[];
}

interface StatusHistoryEntry {
  id: string;
  status: Lead['status'];
  changedBy: string;
  changedAt: string;
  notes?: string;
}

interface NoteEntry {
  id: string;
  note: string;
  addedBy: string;
  addedAt: string;
}

interface ConvertedLead {
  id: string;
  leadId: string;
  patientId: string;
  fullName: string;
  mobile: string;
  email?: string;
  convertedAt: string;
  convertedBy: string;
  assignedDoctor?: string;
  billingValue?: number;
  source: Lead['source'];
}

interface CRMStats {
  totalLeads: number;
  converted: number;
  followUpsDue: number;
  whatsappLeads: number;
  conversionRate: number;
  newLeads: number;
  contactedLeads: number;
  consultedLeads: number;
  droppedLeads: number;
}

interface CRMUser {
  id: number;
  name: string;
  role: string;
  active: boolean;
}

interface LeadFilters {
  status?: string;
  source?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  LEADS: 'hospverse_crm_leads',
  CONVERTED_LEADS: 'hospverse_crm_converted_leads',
  CRM_USERS: 'hospverse_crm_users'
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

// Mock CRM users
const CRM_USERS: CRMUser[] = [
  { id: 1, name: 'Sarah Johnson', role: 'CRM Manager', active: true },
  { id: 2, name: 'Mike Chen', role: 'Lead Specialist', active: true },
  { id: 3, name: 'Emily Davis', role: 'Customer Success', active: true },
  { id: 4, name: 'David Wilson', role: 'Sales Representative', active: true }
];

// Initialize with some mock data if localStorage is empty
const initializeMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.LEADS)) {
    const mockLeads: Lead[] = [
      {
        id: '1',
        fullName: 'John Smith',
        mobile: '+1-555-0123',
        email: 'john.smith@email.com',
        source: 'whatsapp',
        status: 'new',
        assignedTo: 'Sarah Johnson',
        assignedToId: 1,
        notes: 'Interested in laser hair removal treatment',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            id: generateId(),
            status: 'new',
            changedBy: 'System',
            changedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            notes: 'Lead created from WhatsApp inquiry'
          }
        ],
        notesHistory: [
          {
            id: generateId(),
            note: 'Interested in laser hair removal treatment',
            addedBy: 'Sarah Johnson',
            addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: '2',
        fullName: 'Maria Garcia',
        mobile: '+1-555-0124',
        email: 'maria.garcia@email.com',
        source: 'form',
        status: 'contacted',
        assignedTo: 'Mike Chen',
        assignedToId: 2,
        notes: 'Wants consultation for acne treatment',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            id: generateId(),
            status: 'new',
            changedBy: 'System',
            changedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Lead created from website form'
          },
          {
            id: generateId(),
            status: 'contacted',
            changedBy: 'Mike Chen',
            changedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
            notes: 'Called and scheduled consultation'
          }
        ],
        notesHistory: [
          {
            id: generateId(),
            note: 'Wants consultation for acne treatment',
            addedBy: 'Mike Chen',
            addedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: generateId(),
            note: 'Called and scheduled consultation for tomorrow',
            addedBy: 'Mike Chen',
            addedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: '3',
        fullName: 'Robert Johnson',
        mobile: '+1-555-0125',
        email: 'robert.j@email.com',
        source: 'instagram',
        status: 'consulted',
        assignedTo: 'Emily Davis',
        assignedToId: 3,
        notes: 'Had consultation, considering PRP treatment',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            id: generateId(),
            status: 'new',
            changedBy: 'System',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Lead from Instagram ad'
          },
          {
            id: generateId(),
            status: 'contacted',
            changedBy: 'Emily Davis',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Initial contact made'
          },
          {
            id: generateId(),
            status: 'consulted',
            changedBy: 'Emily Davis',
            changedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            notes: 'Consultation completed'
          }
        ],
        notesHistory: [
          {
            id: generateId(),
            note: 'Interested in hair restoration',
            addedBy: 'Emily Davis',
            addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: generateId(),
            note: 'Had consultation, considering PRP treatment',
            addedBy: 'Emily Davis',
            addedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: '4',
        fullName: 'Lisa Chen',
        mobile: '+1-555-0126',
        email: 'lisa.chen@email.com',
        source: 'referral',
        status: 'converted',
        assignedTo: 'David Wilson',
        assignedToId: 4,
        notes: 'Converted to patient - booked laser treatment',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        convertedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [
          {
            id: generateId(),
            status: 'new',
            changedBy: 'System',
            changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Referral from existing patient'
          },
          {
            id: generateId(),
            status: 'contacted',
            changedBy: 'David Wilson',
            changedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Called and scheduled consultation'
          },
          {
            id: generateId(),
            status: 'consulted',
            changedBy: 'David Wilson',
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Consultation completed, interested in treatment'
          },
          {
            id: generateId(),
            status: 'converted',
            changedBy: 'David Wilson',
            changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Converted to patient and booked treatment'
          }
        ],
        notesHistory: [
          {
            id: generateId(),
            note: 'Referred by existing patient for laser treatment',
            addedBy: 'David Wilson',
            addedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: generateId(),
            note: 'Very interested, ready to proceed with treatment',
            addedBy: 'David Wilson',
            addedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: generateId(),
            note: 'Converted to patient - booked laser treatment',
            addedBy: 'David Wilson',
            addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      {
        id: '5',
        fullName: 'Alex Thompson',
        mobile: '+1-555-0127',
        source: 'google',
        status: 'dropped',
        assignedTo: 'Sarah Johnson',
        assignedToId: 1,
        notes: 'Not interested in treatment at this time',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dropReason: 'Budget constraints',
        statusHistory: [
          {
            id: generateId(),
            status: 'new',
            changedBy: 'System',
            changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Lead from Google search'
          },
          {
            id: generateId(),
            status: 'contacted',
            changedBy: 'Sarah Johnson',
            changedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Initial contact made'
          },
          {
            id: generateId(),
            status: 'dropped',
            changedBy: 'Sarah Johnson',
            changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Lead dropped due to budget constraints'
          }
        ],
        notesHistory: [
          {
            id: generateId(),
            note: 'Interested in skin treatments',
            addedBy: 'Sarah Johnson',
            addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: generateId(),
            note: 'Not interested in treatment at this time',
            addedBy: 'Sarah Johnson',
            addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    ];
    setStorageData(STORAGE_KEYS.LEADS, mockLeads);
  }

  if (!localStorage.getItem(STORAGE_KEYS.CONVERTED_LEADS)) {
    const mockConvertedLeads: ConvertedLead[] = [
      {
        id: '1',
        leadId: '4',
        patientId: 'p001',
        fullName: 'Lisa Chen',
        mobile: '+1-555-0126',
        email: 'lisa.chen@email.com',
        convertedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        convertedBy: 'David Wilson',
        assignedDoctor: 'Dr. Sarah Johnson',
        billingValue: 1200,
        source: 'referral'
      }
    ];
    setStorageData(STORAGE_KEYS.CONVERTED_LEADS, mockConvertedLeads);
  }

  setStorageData(STORAGE_KEYS.CRM_USERS, CRM_USERS);
};

// Initialize mock data
initializeMockData();

// API Functions
export const getLeads = async (filters: LeadFilters = {}): Promise<Lead[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        leads = leads.filter(lead => lead.status === filters.status);
      }
      
      if (filters.source && filters.source !== 'all') {
        leads = leads.filter(lead => lead.source === filters.source);
      }
      
      if (filters.assignedTo && filters.assignedTo !== 'all') {
        leads = leads.filter(lead => lead.assignedTo === filters.assignedTo);
      }
      
      if (filters.dateFrom && filters.dateTo) {
        const fromDate = new Date(filters.dateFrom);
        const toDate = new Date(filters.dateTo);
        leads = leads.filter(lead => {
          const leadDate = new Date(lead.createdAt);
          return leadDate >= fromDate && leadDate <= toDate;
        });
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        leads = leads.filter(lead => 
          lead.fullName.toLowerCase().includes(searchTerm) ||
          lead.mobile.includes(searchTerm) ||
          (lead.email && lead.email.toLowerCase().includes(searchTerm))
        );
      }
      
      // Sort by creation date (newest first)
      leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      resolve(leads);
    }, 300);
  });
};

export const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory' | 'notesHistory'>): Promise<Lead> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      const newLead: Lead = {
        id: generateId(),
        ...leadData,
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            id: generateId(),
            status: 'new',
            changedBy: 'System',
            changedAt: new Date().toISOString(),
            notes: `Lead created from ${leadData.source}`
          }
        ],
        notesHistory: leadData.notes ? [
          {
            id: generateId(),
            note: leadData.notes,
            addedBy: leadData.assignedTo,
            addedAt: new Date().toISOString()
          }
        ] : []
      };
      
      leads.unshift(newLead);
      setStorageData(STORAGE_KEYS.LEADS, leads);
      resolve(newLead);
    }, 600);
  });
};

export const getLead = async (id: string): Promise<Lead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      const lead = leads.find(l => l.id === id);
      
      if (lead) {
        resolve(lead);
      } else {
        reject(new Error('Lead not found'));
      }
    }, 200);
  });
};

export const updateLeadStatus = async (id: string, status: Lead['status'], notes?: string): Promise<Lead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      const leadIndex = leads.findIndex(l => l.id === id);
      
      if (leadIndex === -1) {
        reject(new Error('Lead not found'));
        return;
      }
      
      const statusEntry: StatusHistoryEntry = {
        id: generateId(),
        status,
        changedBy: 'Current User', // In real app, get from auth context
        changedAt: new Date().toISOString(),
        notes
      };
      
      leads[leadIndex] = {
        ...leads[leadIndex],
        status,
        updatedAt: new Date().toISOString(),
        statusHistory: [...leads[leadIndex].statusHistory, statusEntry]
      };
      
      setStorageData(STORAGE_KEYS.LEADS, leads);
      resolve(leads[leadIndex]);
    }, 400);
  });
};

export const addLeadNote = async (id: string, note: string): Promise<Lead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      const leadIndex = leads.findIndex(l => l.id === id);
      
      if (leadIndex === -1) {
        reject(new Error('Lead not found'));
        return;
      }
      
      const noteEntry: NoteEntry = {
        id: generateId(),
        note,
        addedBy: 'Current User', // In real app, get from auth context
        addedAt: new Date().toISOString()
      };
      
      leads[leadIndex] = {
        ...leads[leadIndex],
        updatedAt: new Date().toISOString(),
        notesHistory: [...leads[leadIndex].notesHistory, noteEntry]
      };
      
      setStorageData(STORAGE_KEYS.LEADS, leads);
      resolve(leads[leadIndex]);
    }, 400);
  });
};

export const convertLead = async (id: string): Promise<ConvertedLead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      const leadIndex = leads.findIndex(l => l.id === id);
      
      if (leadIndex === -1) {
        reject(new Error('Lead not found'));
        return;
      }
      
      const lead = leads[leadIndex];
      
      // Update lead status to converted
      leads[leadIndex] = {
        ...lead,
        status: 'converted',
        updatedAt: new Date().toISOString(),
        convertedAt: new Date().toISOString(),
        statusHistory: [...lead.statusHistory, {
          id: generateId(),
          status: 'converted',
          changedBy: 'Current User',
          changedAt: new Date().toISOString(),
          notes: 'Lead converted to patient'
        }]
      };
      
      // Create converted lead record
      const convertedLead: ConvertedLead = {
        id: generateId(),
        leadId: id,
        patientId: `p${Date.now()}`, // Generate patient ID
        fullName: lead.fullName,
        mobile: lead.mobile,
        email: lead.email,
        convertedAt: new Date().toISOString(),
        convertedBy: 'Current User',
        source: lead.source
      };
      
      const convertedLeads = getStorageData<ConvertedLead>(STORAGE_KEYS.CONVERTED_LEADS);
      convertedLeads.unshift(convertedLead);
      
      setStorageData(STORAGE_KEYS.LEADS, leads);
      setStorageData(STORAGE_KEYS.CONVERTED_LEADS, convertedLeads);
      
      resolve(convertedLead);
    }, 600);
  });
};

export const dropLead = async (id: string, reason: string): Promise<Lead> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      const leadIndex = leads.findIndex(l => l.id === id);
      
      if (leadIndex === -1) {
        reject(new Error('Lead not found'));
        return;
      }
      
      leads[leadIndex] = {
        ...leads[leadIndex],
        status: 'dropped',
        updatedAt: new Date().toISOString(),
        dropReason: reason,
        statusHistory: [...leads[leadIndex].statusHistory, {
          id: generateId(),
          status: 'dropped',
          changedBy: 'Current User',
          changedAt: new Date().toISOString(),
          notes: `Lead dropped: ${reason}`
        }]
      };
      
      setStorageData(STORAGE_KEYS.LEADS, leads);
      resolve(leads[leadIndex]);
    }, 400);
  });
};

export const getConvertedLeads = async (): Promise<ConvertedLead[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const convertedLeads = getStorageData<ConvertedLead>(STORAGE_KEYS.CONVERTED_LEADS);
      // Sort by conversion date (newest first)
      convertedLeads.sort((a, b) => new Date(b.convertedAt).getTime() - new Date(a.convertedAt).getTime());
      resolve(convertedLeads);
    }, 300);
  });
};

export const getCRMStats = async (): Promise<CRMStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const leads = getStorageData<Lead>(STORAGE_KEYS.LEADS);
      // const _convertedLeads = getStorageData<ConvertedLead>(STORAGE_KEYS.CONVERTED_LEADS);
      
      const totalLeads = leads.length;
      const converted = leads.filter(l => l.status === 'converted').length;
      const newLeads = leads.filter(l => l.status === 'new').length;
      const contactedLeads = leads.filter(l => l.status === 'contacted').length;
      const consultedLeads = leads.filter(l => l.status === 'consulted').length;
      const droppedLeads = leads.filter(l => l.status === 'dropped').length;
      const whatsappLeads = leads.filter(l => l.source === 'whatsapp').length;
      
      // Calculate follow-ups due today (contacted leads that haven't been updated in 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const followUpsDue = leads.filter(l => 
        l.status === 'contacted' && new Date(l.updatedAt) < oneDayAgo
      ).length;
      
      const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;
      
      resolve({
        totalLeads,
        converted,
        followUpsDue,
        whatsappLeads,
        conversionRate,
        newLeads,
        contactedLeads,
        consultedLeads,
        droppedLeads
      });
    }, 300);
  });
};

export const getCRMUsers = async (): Promise<CRMUser[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const users = getStorageData<CRMUser>(STORAGE_KEYS.CRM_USERS);
      resolve(users.filter(u => u.active));
    }, 200);
  });
};

// Export types for use in components
export type { Lead, ConvertedLead, CRMStats, CRMUser, LeadFilters, StatusHistoryEntry, NoteEntry };