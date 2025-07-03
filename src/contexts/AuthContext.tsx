// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/auth.service';
import { toast } from 'sonner';

export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'doctor'
  | 'receptionist'
  | 'technician'
  | 'nurse'
  | 'pharmacist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // Add this property
  client_id?: string;
  client?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // On mount, restore user from localStorage if token exists
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const stored = localStorage.getItem('currentUser');
          if (stored) {
            setUser(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error('Auth restore failed', err);
        // Clean up any broken state
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };
    restoreAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ email, password });
      // Persist tokens & user
      AuthService.setTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/select-role', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to login';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.logout();
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      navigate('/login', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to logout';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.signup({ name, email, password });
      AuthService.setTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      setUser(response.user);
      navigate('/select-role', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to signup';
      setError(msg);
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export { AuthProvider };
