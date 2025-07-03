import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import EmployeeDirectory from '@/pages/hr/EmployeeDirectory';

// Doctor Pages
import DoctorAppointments from '@/pages/doctor/DoctorAppointments';
import DoctorPatients from '@/pages/doctor/DoctorPatients';
import DoctorEMR from '@/pages/doctor/DoctorEMR';
import DoctorProcedures from '@/pages/doctor/DoctorProcedures';
import DoctorTeleconsult from '@/pages/doctor/DoctorTeleconsult';
import DoctorMessages from '@/pages/doctor/DoctorMessages';
import DoctorAnalytics from '@/pages/doctor/DoctorAnalytics';
import DoctorProfile from '@/pages/doctor/DoctorProfile';

// Auth & Landing Pages
import Login from '@/pages/Login';
import RoleSelect from '@/pages/RoleSelect';
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
              <Route path="/login" element={<Login />} />
              <Route path="/select-role" element={<RoleSelect />} />
              
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
                path="/doctor/appointments" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorAppointments />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/patients" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorPatients />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/emr/:patientId?" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorEMR />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/procedures" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorProcedures />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/teleconsult" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorTeleconsult />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/messages" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorMessages />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/analytics" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorAnalytics />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/doctor/profile" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorProfile />
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
                path="/hr/employees" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <EmployeeDirectory />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/hr/employees/:id" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <div className="p-6"><h1>Employee Profile - Coming Soon</h1></div>
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
              
              {/* CRM Routes */}
              <Route 
                path="/crm" 
                element={
                  <ProtectedRoute requiredModule="crm">
                    <div className="p-6"><h1>CRM Dashboard - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              
              {/* Super Admin Console */}
              <Route 
                path="/super-admin" 
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