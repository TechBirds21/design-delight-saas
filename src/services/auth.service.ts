// import api from './api';
import { UserRole } from '../contexts/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role?: string;
  client_id?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    auth_user_id: string;
    name: string;
    email: string;
    role: UserRole;
    client_id?: string;
    client?: any;
  };
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Mock login response
    console.log('Mock login with:', credentials);

    // Get mock user based on email
    const user = createMockUser(credentials.email);
    
    return {
      access_token: 'mock_token',
      refresh_token: 'mock_refresh_token',
      user
    };
  },
  
  signup: async (data: SignupData): Promise<any> => {
    // Mock signup response
    console.log('Mock signup with:', data);
    return { message: 'User created successfully', user: { name: data.name, email: data.email } };
  },
  
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    // Mock refresh token response
    return {
      access_token: 'new_mock_token',
      refresh_token: 'new_mock_refresh_token'
    };
  },
  
  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    // Get user from localStorage
    const userDataString = localStorage.getItem('currentUser');
    if (!userDataString) {
      throw new Error('No user found');
    }
    return JSON.parse(userDataString);
  },
  
  logout: async (): Promise<void> => {
    // Mock logout
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
  },
  
  // Helper methods
  setTokens: (tokens: { access_token: string, refresh_token: string }) => {
    localStorage.setItem('token', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

// Helper function to create a mock user based on email
const createMockUser = (email: string) => {
  let role: UserRole = 'admin';
  let name = 'User';
  
  if (email.includes('doctor')) {
    role = 'doctor' as UserRole;
    name = 'Dr. Sarah Johnson';
  } else if (email.includes('reception')) {
    role = 'receptionist' as UserRole;
    name = 'Emily Davis';
  } else if (email.includes('technician')) {
    role = 'technician' as UserRole;
    name = 'Mike Wilson';
  } else if (email.includes('admin')) {
    role = 'admin' as UserRole;
    name = 'Admin User';
  } else if (email.includes('super')) {
    role = 'super_admin' as UserRole;
    name = 'Super Admin';
  }
  
  return {
    id: `user-${Date.now()}`,
    auth_user_id: `auth-${Date.now()}`,
    name,
    email,
    role,
    client_id: 'client-123',
    client: {
      name: 'SkinClinic Pro',
      subdomain: 'skinova',
      logo: 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop',
      plan: 'professional',
      status: 'active',
      modules_enabled: [
        "dashboard", "patients", "appointments", "inventory", "billing", 
        "crm", "hr", "reports", "admin", "reception", "doctor", 
        "photo-manager", "technician"
      ],
      role_permissions: {}
    }
  };
};

export default AuthService;