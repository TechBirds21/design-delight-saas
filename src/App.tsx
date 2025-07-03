import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/components/routes/ProtectedRoute';

// Auth & Landing Pages
import EnhancedLogin from '@/pages/EnhancedLogin';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import Index from '@/pages/Index';

// Role-Based Dashboards
import ReceptionDashboard from '@/pages/dashboards/ReceptionDashboard';
import BillingDashboard from '@/pages/dashboards/BillingDashboard';
import DoctorDashboard from '@/pages/dashboards/DoctorDashboard';
import HRDashboard from '@/pages/dashboards/HRDashboard';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import PharmacyDashboard from '@/pages/dashboards/PharmacyDashboard';
import TechnicianDashboard from '@/pages/dashboards/TechnicianDashboard';
import ProceduresDashboard from '@/pages/dashboards/ProceduresDashboard';

// Super Admin Console
import SuperAdminDashboard from '@/pages/enhanced-dashboards/SuperAdminDashboard';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Landing Page - Public Route */}
              <Route path="/" element={<Index />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<EnhancedLogin />} />
              
              {/* Role-Based Dashboards */}
              <Route 
                path="/reception" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <ReceptionDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute requiredModule="billing">
                    <BillingDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/hr" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <HRDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/inventory" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <PharmacyDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/technician" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <TechnicianDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/procedures" 
                element={
                  <ProtectedRoute requiredModule="procedures">
                    <ProceduresDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Super Admin Console */}
              <Route 
                path="/superadmin" 
                element={
                  <ProtectedRoute requiredModule="super_admin">
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Error Pages */}
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Toast Notifications */}
            <Toaster />
          </div>
        </TenantProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;