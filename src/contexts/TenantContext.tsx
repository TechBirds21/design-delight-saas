// src/contexts/TenantContext.tsx
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from 'react';
// import axios from 'axios'; // Removed as we're using mock data
import { useAuth } from '@/contexts/AuthContext';

export interface TenantContextType {
  tenantName: string;
  tenantLogoURL: string;
  currentRole:
    | 'super_admin'
    | 'admin'
    | 'doctor'
    | 'nurse'
    | 'receptionist'
    | 'pharmacist'
    | 'technician';
  currentUser: {
    name: string;
    email: string;
    avatar?: string;
  };
  currentBranch: string;
  enabledModules: Record<string, boolean>;
  modulesEnabled: Record<string, boolean>; // Add this property
  rolePermissions: Record<string, string[]>;
  subscription: {
    plan: string;
    status: string;
    expiresAt: string;
  };
  features: {
    multiLocation: boolean;
    advancedReporting: boolean;
    apiAccess: boolean;
    customBranding: boolean;
  };
  loading: boolean;
  hasModuleAccess: (module: string) => boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = (): TenantContextType => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  // Defaults until real data arrives
  const defaults: Omit<TenantContextType, 'loading' | 'hasModuleAccess'> = {
    tenantName: 'SkinClinic Pro',
    tenantLogoURL:
      'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
    currentRole: 'admin',
    currentUser: { name: 'User', email: 'user@example.com', avatar: undefined },
    currentBranch: 'Main Branch - Downtown Medical Center',
    enabledModules: {
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
      technician: true,
      super_admin: true,
    },
    modulesEnabled: {
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
      technician: true,
      super_admin: true,
    },
    rolePermissions: {
      super_admin: [
        'dashboard','patients','appointments','inventory','billing','crm',
        'hr','reports','admin','reception','doctor','photo-manager',
        'technician','super_admin'
      ],
      admin: [
        'dashboard','patients','appointments','inventory','billing','crm',
        'hr','reports','admin','reception','doctor','photo-manager','technician'
      ],
      doctor: ['dashboard','patients','appointments','reports','doctor','photo-manager'],
      nurse: ['dashboard','patients','appointments'],
      receptionist: ['dashboard','patients','appointments','billing','reception'],
      pharmacist: ['dashboard','patients','inventory'],
      technician: ['dashboard','technician','photo-manager'],
    },
    subscription: { plan: 'Professional', status: 'active', expiresAt: '2024-12-31' },
    features: {
      multiLocation: true,
      advancedReporting: true,
      apiAccess: true,
      customBranding: true,
    },
  };

  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTenant = async () => {
      try {
        // Use mock data for SaaS tenant functionality
        const mockClient = {
          name: user?.client?.name || 'SkinClinic Pro',
          logo: user?.client?.logo || 'https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg',
          main_branch: 'Main Branch - Downtown Medical Center',
          modules_enabled: user?.client?.modules_enabled || [
            'dashboard', 'patients', 'appointments', 'inventory', 'billing', 
            'crm', 'hr', 'reports', 'admin', 'reception', 'doctor', 
            'photo-manager', 'technician', 'super_admin'
          ],
          role_permissions: user?.client?.role_permissions || defaults.rolePermissions,
          plan: user?.client?.plan || 'Professional',
          status: user?.client?.status || 'active',
          expires_at: '2024-12-31',
          features: {
            multiLocation: true,
            advancedReporting: true,
            apiAccess: true,
            customBranding: true,
          }
        };

        setData({
          tenantName: mockClient.name,
          tenantLogoURL: mockClient.logo,
          currentRole: (user?.role as any) || defaults.currentRole,
          currentUser: {
            name: user?.name || defaults.currentUser.name,
            email: user?.email || defaults.currentUser.email,
            avatar: user?.avatar || defaults.currentUser.avatar,
          },
          currentBranch: mockClient.main_branch,
          enabledModules: mockClient.modules_enabled.reduce(
            (acc: Record<string, boolean>, m: string) => ((acc[m] = true), acc),
            {}
          ),
          modulesEnabled: mockClient.modules_enabled.reduce(
            (acc: Record<string, boolean>, m: string) => ((acc[m] = true), acc),
            {}
          ),
          rolePermissions: mockClient.role_permissions,
          subscription: {
            plan: mockClient.plan,
            status: mockClient.status,
            expiresAt: mockClient.expires_at,
          },
          features: mockClient.features,
        });
      } catch (err) {
        console.error('Error loading tenant data', err);
        // Fall back to defaults
        setData(defaults);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadTenant();
    }
  }, [authLoading, user]);

  const hasModuleAccess = useCallback(
    (mod: string) => {
      if (loading || authLoading) return false;
      if (data.currentRole === 'super_admin') return true;
      return (
        Boolean(data.enabledModules[mod]) &&
        data.rolePermissions[data.currentRole]?.includes(mod)
      );
    },
    [loading, authLoading, data]
  );

  return (
    <TenantContext.Provider
      value={{ ...data, loading, hasModuleAccess }}
    >
      {children}
    </TenantContext.Provider>
  );
};
