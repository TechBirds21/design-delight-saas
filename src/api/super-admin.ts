// Mock API functions for Super Admin module
// In a real application, these would make HTTP requests to your backend

// Types
interface Clinic {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  status: 'active' | 'inactive' | 'trial' | 'suspended';
  createdAt: string;
  expiresAt: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  modules: {
    [key: string]: boolean;
  };
  branches: Branch[];
  apiUsage: number;
  activeUsers: number;
  lastLogin?: string;
}

interface Branch {
  id: string;
  clinicId: string;
  name: string;
  address: string;
  phone: string;
  isMain: boolean;
  createdAt: string;
}

interface UsageLog {
  id: string;
  clinicId: string;
  clinicName: string;
  timestamp: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  userAgent: string;
  ipAddress: string;
}

interface SystemLog {
  id: string;
  timestamp: string;
  clinicId?: string;
  clinicName?: string;
  type: 'api' | 'error' | 'auth' | 'module';
  action: string;
  details: string;
  ipAddress: string;
}

interface SupportTicket {
  id: string;
  clinicId: string;
  clinicName: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  contactEmail: string;
  contactName: string;
  contactPhone?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  ticketId: string;
  message: string;
  sender: 'client' | 'support';
  senderName: string;
  timestamp: string;
}

interface SuperAdminStats {
  totalClinics: number;
  activeSubscriptions: number;
  apiHitsToday: number;
  inactiveTrialClinics: number;
  revenueThisMonth: number;
  totalUsers: number;
  openSupportTickets: number;
}

interface ClientFilters {
  plan?: string;
  status?: string;
  search?: string;
}

interface LogFilters {
  clinicId?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Mock data storage (using localStorage for persistence)
const STORAGE_KEYS = {
  CLINICS: 'hospverse_super_admin_clinics',
  USAGE_LOGS: 'hospverse_super_admin_usage_logs',
  SYSTEM_LOGS: 'hospverse_super_admin_system_logs',
  SUPPORT_TICKETS: 'hospverse_super_admin_support_tickets'
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
  if (!localStorage.getItem(STORAGE_KEYS.CLINICS)) {
    const mockClinics: Clinic[] = [
      {
        id: '1',
        name: 'SkinClinic Pro',
        subdomain: 'skinclinic',
        logo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
        plan: 'professional',
        status: 'active',
        createdAt: '2023-10-15T10:30:00Z',
        expiresAt: '2024-10-15T10:30:00Z',
        contactName: 'Dr. Sarah Johnson',
        contactEmail: 'sarah.johnson@skinclinic.com',
        contactPhone: '+1-555-0123',
        modules: {
          dashboard: true,
          patients: true,
          appointments: true,
          inventory: true,
          billing: true,
          crm: true,
          hr: true,
          reports: true,
          admin: true,
          reception: true,
          doctor: true,
          'photo-manager': true,
          technician: true
        },
        branches: [
          {
            id: 'b1',
            clinicId: '1',
            name: 'Main Branch - Downtown Medical Center',
            address: '123 Medical Drive, New York, NY',
            phone: '+1-555-0123',
            isMain: true,
            createdAt: '2023-10-15T10:30:00Z'
          },
          {
            id: 'b2',
            clinicId: '1',
            name: 'North Branch',
            address: '456 Health Avenue, New York, NY',
            phone: '+1-555-0124',
            isMain: false,
            createdAt: '2023-11-20T14:45:00Z'
          }
        ],
        apiUsage: 12500,
        activeUsers: 18,
        lastLogin: '2024-05-15T08:30:00Z'
      },
      {
        id: '2',
        name: 'BeautyMed Center',
        subdomain: 'beautymed',
        logo: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
        plan: 'basic',
        status: 'active',
        createdAt: '2023-12-05T09:15:00Z',
        expiresAt: '2024-12-05T09:15:00Z',
        contactName: 'Dr. Michael Chen',
        contactEmail: 'michael.chen@beautymed.com',
        contactPhone: '+1-555-0125',
        modules: {
          dashboard: true,
          patients: true,
          appointments: true,
          inventory: true,
          billing: true,
          crm: false,
          hr: false,
          reports: true,
          admin: true,
          reception: true,
          doctor: true,
          'photo-manager': true,
          technician: true
        },
        branches: [
          {
            id: 'b3',
            clinicId: '2',
            name: 'BeautyMed Main',
            address: '789 Beauty Blvd, Los Angeles, CA',
            phone: '+1-555-0125',
            isMain: true,
            createdAt: '2023-12-05T09:15:00Z'
          }
        ],
        apiUsage: 8200,
        activeUsers: 12,
        lastLogin: '2024-05-14T16:45:00Z'
      },
      {
        id: '3',
        name: 'DermaCare Solutions',
        subdomain: 'dermacare',
        logo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
        plan: 'enterprise',
        status: 'active',
        createdAt: '2023-09-20T11:00:00Z',
        expiresAt: '2024-09-20T11:00:00Z',
        contactName: 'Dr. Emily Davis',
        contactEmail: 'emily.davis@dermacare.com',
        contactPhone: '+1-555-0126',
        modules: {
          dashboard: true,
          patients: true,
          appointments: true,
          inventory: true,
          billing: true,
          crm: true,
          hr: true,
          reports: true,
          admin: true,
          reception: true,
          doctor: true,
          'photo-manager': true,
          technician: true
        },
        branches: [
          {
            id: 'b4',
            clinicId: '3',
            name: 'DermaCare HQ',
            address: '101 Skin Street, Chicago, IL',
            phone: '+1-555-0126',
            isMain: true,
            createdAt: '2023-09-20T11:00:00Z'
          },
          {
            id: 'b5',
            clinicId: '3',
            name: 'DermaCare South',
            address: '202 Beauty Road, Chicago, IL',
            phone: '+1-555-0127',
            isMain: false,
            createdAt: '2023-10-15T13:30:00Z'
          },
          {
            id: 'b6',
            clinicId: '3',
            name: 'DermaCare West',
            address: '303 Wellness Way, Chicago, IL',
            phone: '+1-555-0128',
            isMain: false,
            createdAt: '2024-01-10T10:15:00Z'
          }
        ],
        apiUsage: 24800,
        activeUsers: 35,
        lastLogin: '2024-05-15T11:20:00Z'
      },
      {
        id: '4',
        name: 'LaserTech Clinic',
        subdomain: 'lasertech',
        logo: 'https://images.pexels.com/photos/3846005/pexels-photo-3846005.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
        plan: 'basic',
        status: 'trial',
        createdAt: '2024-05-01T14:30:00Z',
        expiresAt: '2024-06-01T14:30:00Z',
        contactName: 'Dr. Robert Wilson',
        contactEmail: 'robert.wilson@lasertech.com',
        contactPhone: '+1-555-0129',
        modules: {
          dashboard: true,
          patients: true,
          appointments: true,
          inventory: true,
          billing: true,
          crm: true,
          hr: false,
          reports: true,
          admin: true,
          reception: true,
          doctor: true,
          'photo-manager': true,
          technician: true
        },
        branches: [
          {
            id: 'b7',
            clinicId: '4',
            name: 'LaserTech Main',
            address: '404 Laser Lane, Miami, FL',
            phone: '+1-555-0129',
            isMain: true,
            createdAt: '2024-05-01T14:30:00Z'
          }
        ],
        apiUsage: 3200,
        activeUsers: 8,
        lastLogin: '2024-05-15T09:45:00Z'
      },
      {
        id: '5',
        name: 'Aesthetic Solutions',
        subdomain: 'aesthetic',
        logo: 'https://images.pexels.com/photos/4046567/pexels-photo-4046567.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
        plan: 'professional',
        status: 'inactive',
        createdAt: '2023-08-10T08:45:00Z',
        expiresAt: '2024-02-10T08:45:00Z',
        contactName: 'Dr. Lisa Thompson',
        contactEmail: 'lisa.thompson@aesthetic.com',
        contactPhone: '+1-555-0130',
        modules: {
          dashboard: true,
          patients: true,
          appointments: true,
          inventory: true,
          billing: true,
          crm: true,
          hr: true,
          reports: true,
          admin: true,
          reception: true,
          doctor: true,
          'photo-manager': true,
          technician: true
        },
        branches: [
          {
            id: 'b8',
            clinicId: '5',
            name: 'Aesthetic Solutions HQ',
            address: '505 Beauty Blvd, Seattle, WA',
            phone: '+1-555-0130',
            isMain: true,
            createdAt: '2023-08-10T08:45:00Z'
          }
        ],
        apiUsage: 0,
        activeUsers: 0,
        lastLogin: '2024-02-05T16:30:00Z'
      }
    ];
    setStorageData(STORAGE_KEYS.CLINICS, mockClinics);
  }

  if (!localStorage.getItem(STORAGE_KEYS.USAGE_LOGS)) {
    const mockUsageLogs: UsageLog[] = generateMockUsageLogs();
    setStorageData(STORAGE_KEYS.USAGE_LOGS, mockUsageLogs);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SYSTEM_LOGS)) {
    const mockSystemLogs: SystemLog[] = generateMockSystemLogs();
    setStorageData(STORAGE_KEYS.SYSTEM_LOGS, mockSystemLogs);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS)) {
    const mockSupportTickets: SupportTicket[] = generateMockSupportTickets();
    setStorageData(STORAGE_KEYS.SUPPORT_TICKETS, mockSupportTickets);
  }
};

// Generate mock usage logs
const generateMockUsageLogs = (): UsageLog[] => {
  const logs: UsageLog[] = [];
  const clinics = [
    { id: '1', name: 'SkinClinic Pro' },
    { id: '2', name: 'BeautyMed Center' },
    { id: '3', name: 'DermaCare Solutions' },
    { id: '4', name: 'LaserTech Clinic' }
  ];
  const endpoints = [
    '/api/patients',
    '/api/appointments',
    '/api/inventory',
    '/api/billing',
    '/api/crm/leads',
    '/api/hr/staff',
    '/api/reports'
  ];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const statusCodes = [200, 201, 400, 401, 403, 404, 500];
  const ipAddresses = ['192.168.1.101', '192.168.1.102', '192.168.1.103', '192.168.1.104'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  ];
  
  // Generate logs for the past 7 days
  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const clinicIndex = Math.floor(Math.random() * clinics.length);
    const clinic = clinics[clinicIndex];
    
    logs.push({
      id: `usage-${i}`,
      clinicId: clinic.id,
      clinicName: clinic.name,
      timestamp: date.toISOString(),
      endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
      method: methods[Math.floor(Math.random() * methods.length)],
      responseTime: Math.floor(Math.random() * 500),
      statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
    });
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock system logs
const generateMockSystemLogs = (): SystemLog[] => {
  const logs: SystemLog[] = [];
  const clinics = [
    { id: '1', name: 'SkinClinic Pro' },
    { id: '2', name: 'BeautyMed Center' },
    { id: '3', name: 'DermaCare Solutions' },
    { id: '4', name: 'LaserTech Clinic' }
  ];
  const logTypes = ['api', 'error', 'auth', 'module'];
  const actions = [
    { type: 'api', action: 'API rate limit exceeded' },
    { type: 'api', action: 'API key rotated' },
    { type: 'error', action: 'Database connection error' },
    { type: 'error', action: 'Payment processing failed' },
    { type: 'auth', action: 'Admin login successful' },
    { type: 'auth', action: 'Failed login attempt' },
    { type: 'auth', action: 'Password reset requested' },
    { type: 'module', action: 'Module enabled' },
    { type: 'module', action: 'Module disabled' }
  ];
  const ipAddresses = ['192.168.1.101', '192.168.1.102', '192.168.1.103', '192.168.1.104'];
  
  // Generate logs for the past 7 days
  for (let i = 0; i < 100; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    const includeClinic = Math.random() > 0.2; // Some logs might be system-wide
    const clinicIndex = Math.floor(Math.random() * clinics.length);
    const clinic = clinics[clinicIndex];
    
    const typeIndex = Math.floor(Math.random() * logTypes.length);
    const type = logTypes[typeIndex] as 'api' | 'error' | 'auth' | 'module';
    
    const actionOptions = actions.filter(a => a.type === type);
    const actionIndex = Math.floor(Math.random() * actionOptions.length);
    const action = actionOptions[actionIndex].action;
    
    logs.push({
      id: `system-${i}`,
      timestamp: date.toISOString(),
      clinicId: includeClinic ? clinic.id : undefined,
      clinicName: includeClinic ? clinic.name : undefined,
      type,
      action,
      details: `Details for ${action} - Log ID: system-${i}`,
      ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)]
    });
  }
  
  // Sort by timestamp (newest first)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Generate mock support tickets
const generateMockSupportTickets = (): SupportTicket[] => {
  const tickets: SupportTicket[] = [];
  const clinics = [
    { id: '1', name: 'SkinClinic Pro', contact: 'Dr. Sarah Johnson', email: 'sarah.johnson@skinclinic.com', phone: '+1-555-0123' },
    { id: '2', name: 'BeautyMed Center', contact: 'Dr. Michael Chen', email: 'michael.chen@beautymed.com', phone: '+1-555-0125' },
    { id: '3', name: 'DermaCare Solutions', contact: 'Dr. Emily Davis', email: 'emily.davis@dermacare.com', phone: '+1-555-0126' },
    { id: '4', name: 'LaserTech Clinic', contact: 'Dr. Robert Wilson', email: 'robert.wilson@lasertech.com', phone: '+1-555-0129' }
  ];
  const subjects = [
    'Unable to access patient records',
    'Billing module not working',
    'Need help with report generation',
    'System is slow during peak hours',
    'Integration with payment gateway failing',
    'Need additional user licenses',
    'Data migration assistance required',
    'Feature request: enhanced photo comparison'
  ];
  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];
  
  for (let i = 0; i < 12; i++) {
    const clinicIndex = Math.floor(Math.random() * clinics.length);
    const clinic = clinics[clinicIndex];
    const subjectIndex = Math.floor(Math.random() * subjects.length);
    const priorityIndex = Math.floor(Math.random() * priorities.length);
    const statusIndex = Math.floor(Math.random() * statuses.length);
    
    // Create date between 1-30 days ago
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30) - 1);
    
    // Update date is after created date
    const updatedDate = new Date(createdDate);
    updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 48));
    
    const messages: TicketMessage[] = [];
    const messageCount = Math.floor(Math.random() * 5) + 1;
    
    for (let j = 0; j < messageCount; j++) {
      const messageDate = new Date(createdDate);
      messageDate.setHours(messageDate.getHours() + j * 4);
      
      messages.push({
        id: `msg-${i}-${j}`,
        ticketId: `ticket-${i}`,
        message: `This is message ${j + 1} for ticket ${i}. ${j % 2 === 0 ? 'Client message explaining the issue in detail.' : 'Support response with troubleshooting steps or resolution.'}`,
        sender: j % 2 === 0 ? 'client' : 'support',
        senderName: j % 2 === 0 ? clinic.contact : 'Support Agent',
        timestamp: messageDate.toISOString()
      });
    }
    
    tickets.push({
      id: `ticket-${i}`,
      clinicId: clinic.id,
      clinicName: clinic.name,
      subject: subjects[subjectIndex],
      description: `Detailed description for ticket regarding: ${subjects[subjectIndex]}. The issue started occurring on ${createdDate.toLocaleDateString()}.`,
      status: statuses[statusIndex] as 'open' | 'in-progress' | 'resolved' | 'closed',
      priority: priorities[priorityIndex] as 'low' | 'medium' | 'high' | 'critical',
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString(),
      assignedTo: statusIndex > 0 ? 'Support Agent' : undefined,
      contactEmail: clinic.email,
      contactName: clinic.contact,
      contactPhone: clinic.phone,
      messages
    });
  }
  
  // Sort by updated date (newest first)
  return tickets.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

// Initialize mock data
initializeMockData();

// API Functions
export const getAllClients = async (filters: ClientFilters = {}): Promise<Clinic[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      
      // Apply filters
      if (filters.plan && filters.plan !== 'all') {
        clinics = clinics.filter(clinic => clinic.plan === filters.plan);
      }
      
      if (filters.status && filters.status !== 'all') {
        clinics = clinics.filter(clinic => clinic.status === filters.status);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        clinics = clinics.filter(clinic => 
          clinic.name.toLowerCase().includes(searchTerm) ||
          clinic.subdomain.toLowerCase().includes(searchTerm) ||
          clinic.contactName.toLowerCase().includes(searchTerm) ||
          clinic.contactEmail.toLowerCase().includes(searchTerm)
        );
      }
      
      resolve(clinics);
    }, 500);
  });
};

export const getClientDetails = async (clientId: string): Promise<Clinic> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      const clinic = clinics.find(c => c.id === clientId);
      
      if (clinic) {
        resolve(clinic);
      } else {
        reject(new Error('Clinic not found'));
      }
    }, 300);
  });
};

export const toggleClientModule = async (clientId: string, module: string, enabled: boolean): Promise<Clinic> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      const clinicIndex = clinics.findIndex(c => c.id === clientId);
      
      if (clinicIndex === -1) {
        reject(new Error('Clinic not found'));
        return;
      }
      
      clinics[clinicIndex].modules[module] = enabled;
      
      setStorageData(STORAGE_KEYS.CLINICS, clinics);
      resolve(clinics[clinicIndex]);
    }, 300);
  });
};

export const setClientDashboards = async (clientId: string, dashboards: string[]): Promise<Clinic> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      const clinicIndex = clinics.findIndex(c => c.id === clientId);
      
      if (clinicIndex === -1) {
        reject(new Error('Clinic not found'));
        return;
      }
      
      // Update modules based on dashboards
      const updatedModules = { ...clinics[clinicIndex].modules };
      
      // First, disable all dashboard modules
      Object.keys(updatedModules).forEach(key => {
        if (key !== 'dashboard') { // Keep dashboard always enabled
          updatedModules[key] = false;
        }
      });
      
      // Then enable only the selected dashboards
      dashboards.forEach(dashboard => {
        updatedModules[dashboard] = true;
      });
      
      clinics[clinicIndex].modules = updatedModules;
      
      setStorageData(STORAGE_KEYS.CLINICS, clinics);
      resolve(clinics[clinicIndex]);
    }, 300);
  });
};

export const assignRolePermissions = async (clientId: string, role: string, permissions: string[]): Promise<{role: string, permissions: string[]}> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      const clinic = clinics.find(c => c.id === clientId);
      
      if (!clinic) {
        reject(new Error('Clinic not found'));
        return;
      }
      
      // In a real app, this would update role permissions in the database
      // For this mock, we'll just return the updated permissions
      
      resolve({
        role,
        permissions
      });
    }, 300);
  });
};

export const updateClientStatus = async (clientId: string, status: Clinic['status']): Promise<Clinic> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      const clinicIndex = clinics.findIndex(c => c.id === clientId);
      
      if (clinicIndex === -1) {
        reject(new Error('Clinic not found'));
        return;
      }
      
      clinics[clinicIndex].status = status;
      
      setStorageData(STORAGE_KEYS.CLINICS, clinics);
      resolve(clinics[clinicIndex]);
    }, 300);
  });
};

export const getClientUsageLogs = async (clientId: string, filters: LogFilters = {}): Promise<UsageLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let logs = getStorageData<UsageLog>(STORAGE_KEYS.USAGE_LOGS);
      
      // Filter by clinic
      logs = logs.filter(log => log.clinicId === clientId);
      
      // Apply date filters
      if (filters.dateFrom && filters.dateTo) {
        logs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          const fromDate = new Date(filters.dateFrom!);
          const toDate = new Date(filters.dateTo!);
          return logDate >= fromDate && logDate <= toDate;
        });
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        logs = logs.filter(log => 
          log.endpoint.toLowerCase().includes(searchTerm) ||
          log.method.toLowerCase().includes(searchTerm) ||
          log.ipAddress.includes(searchTerm)
        );
      }
      
      resolve(logs);
    }, 500);
  });
};

export const getSystemLogs = async (filters: LogFilters = {}): Promise<SystemLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let logs = getStorageData<SystemLog>(STORAGE_KEYS.SYSTEM_LOGS);
      
      // Apply clinic filter
      if (filters.clinicId) {
        logs = logs.filter(log => log.clinicId === filters.clinicId);
      }
      
      // Apply type filter
      if (filters.type && filters.type !== 'all') {
        logs = logs.filter(log => log.type === filters.type);
      }
      
      // Apply date filters
      if (filters.dateFrom && filters.dateTo) {
        logs = logs.filter(log => {
          const logDate = new Date(log.timestamp);
          const fromDate = new Date(filters.dateFrom!);
          const toDate = new Date(filters.dateTo!);
          return logDate >= fromDate && logDate <= toDate;
        });
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        logs = logs.filter(log => 
          (log.clinicName && log.clinicName.toLowerCase().includes(searchTerm)) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.details.toLowerCase().includes(searchTerm) ||
          log.ipAddress.includes(searchTerm)
        );
      }
      
      resolve(logs);
    }, 500);
  });
};

export const getSupportTickets = async (status?: string): Promise<SupportTicket[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let tickets = getStorageData<SupportTicket>(STORAGE_KEYS.SUPPORT_TICKETS);
      
      // Apply status filter
      if (status && status !== 'all') {
        tickets = tickets.filter(ticket => ticket.status === status);
      }
      
      resolve(tickets);
    }, 400);
  });
};

export const getSupportTicketDetails = async (ticketId: string): Promise<SupportTicket> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tickets = getStorageData<SupportTicket>(STORAGE_KEYS.SUPPORT_TICKETS);
      const ticket = tickets.find(t => t.id === ticketId);
      
      if (ticket) {
        resolve(ticket);
      } else {
        reject(new Error('Support ticket not found'));
      }
    }, 300);
  });
};

export const updateSupportTicket = async (ticketId: string, updates: Partial<SupportTicket>): Promise<SupportTicket> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tickets = getStorageData<SupportTicket>(STORAGE_KEYS.SUPPORT_TICKETS);
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        reject(new Error('Support ticket not found'));
        return;
      }
      
      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      setStorageData(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
      resolve(tickets[ticketIndex]);
    }, 400);
  });
};

export const addSupportTicketMessage = async (ticketId: string, message: string, sender: 'client' | 'support', senderName: string): Promise<SupportTicket> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tickets = getStorageData<SupportTicket>(STORAGE_KEYS.SUPPORT_TICKETS);
      const ticketIndex = tickets.findIndex(t => t.id === ticketId);
      
      if (ticketIndex === -1) {
        reject(new Error('Support ticket not found'));
        return;
      }
      
      const newMessage: TicketMessage = {
        id: generateId(),
        ticketId,
        message,
        sender,
        senderName,
        timestamp: new Date().toISOString()
      };
      
      tickets[ticketIndex].messages.push(newMessage);
      tickets[ticketIndex].updatedAt = new Date().toISOString();
      
      setStorageData(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
      resolve(tickets[ticketIndex]);
    }, 400);
  });
};

export const createClinic = async (data: Omit<Clinic, 'id' | 'createdAt' | 'apiUsage' | 'activeUsers'>): Promise<Clinic> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      
      const newClient: Clinic = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        apiUsage: 0,
        activeUsers: 0
      };
      
      clinics.push(newClient);
      setStorageData(STORAGE_KEYS.CLINICS, clinics);
      resolve(newClient);
    }, 600);
  });
};

export const addNewClient = async (clientData: Omit<Clinic, 'id' | 'createdAt' | 'apiUsage' | 'activeUsers'>): Promise<Clinic> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      
      const newClient: Clinic = {
        id: generateId(),
        ...clientData,
        createdAt: new Date().toISOString(),
        apiUsage: 0,
        activeUsers: 0
      };
      
      clinics.push(newClient);
      setStorageData(STORAGE_KEYS.CLINICS, clinics);
      resolve(newClient);
    }, 600);
  });
};

export const getSuperAdminStats = async (): Promise<SuperAdminStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clinics = getStorageData<Clinic>(STORAGE_KEYS.CLINICS);
      const usageLogs = getStorageData<UsageLog>(STORAGE_KEYS.USAGE_LOGS);
      const supportTickets = getStorageData<SupportTicket>(STORAGE_KEYS.SUPPORT_TICKETS);
      
      const totalClinics = clinics.length;
      
      const activeSubscriptions = clinics.filter(c => 
        c.status === 'active' || c.status === 'trial'
      ).length;
      
      // API hits today
      const today = new Date().toISOString().split('T')[0];
      const apiHitsToday = usageLogs.filter(log => 
        log.timestamp.split('T')[0] === today
      ).length;
      
      // Inactive or trial clinics
      const inactiveTrialClinics = clinics.filter(c => 
        c.status === 'inactive' || c.status === 'trial'
      ).length;
      
      // Mock revenue calculation
      const revenueThisMonth = clinics.reduce((sum, clinic) => {
        if (clinic.status !== 'active') return sum;
        
        let amount = 0;
        switch (clinic.plan) {
          case 'basic': amount = 99; break;
          case 'professional': amount = 299; break;
          case 'enterprise': amount = 999; break;
          default: amount = 0;
        }
        
        return sum + amount;
      }, 0);
      
      // Total users across all clinics
      const totalUsers = clinics.reduce((sum, clinic) => sum + clinic.activeUsers, 0);
      
      // Open support tickets
      const openSupportTickets = supportTickets.filter(t => 
        t.status === 'open' || t.status === 'in-progress'
      ).length;
      
      resolve({
        totalClinics,
        activeSubscriptions,
        apiHitsToday,
        inactiveTrialClinics,
        revenueThisMonth,
        totalUsers,
        openSupportTickets
      });
    }, 400);
  });
};

// Export types for use in components
export type { 
  Clinic, 
  Branch, 
  UsageLog, 
  SystemLog, 
  SupportTicket, 
  TicketMessage, 
  SuperAdminStats,
  ClientFilters,
  LogFilters
};