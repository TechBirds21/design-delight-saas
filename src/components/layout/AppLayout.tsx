// src/components/layout/AppLayout.tsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TenantHeader from './TenantHeader';
import { useAuth } from '@/contexts/AuthContext';

const AppLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in → force to login
        navigate('/login', { replace: true });
      } else if (location.pathname === '/') {
        // Already logged in but at root → go pick a role
        navigate('/select-role', { replace: true });
      }
    }
  }, [loading, isAuthenticated, location.pathname, navigate]);

  // While auth status is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (collapsible on mobile) */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 ease-in-out">
        {/* Tenant name, logo, switcher */}
        <TenantHeader />

        {/* Top navigation bar */}
        <Navbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
