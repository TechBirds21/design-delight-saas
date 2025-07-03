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

// Reception Pages
import AppointmentBooking from '@/pages/reception/AppointmentBooking';
import PatientRegister from '@/pages/reception/PatientRegister';
import QueueManagement from '@/pages/reception/QueueManagement';

// Billing Pages
import InvoiceManagement from '@/pages/billing/InvoiceManagement';
import PaymentProcessing from '@/pages/billing/PaymentProcessing';

// HR Pages
import AttendanceManagement from '@/pages/hr/AttendanceManagement';
import PayrollManagement from '@/pages/hr/PayrollManagement';

// Admin Pages
import UserManagement from '@/pages/admin/UserManagement';
import SystemSettings from '@/pages/admin/SystemSettings';

// Inventory Pages  
import InventoryProducts from '@/pages/inventory/InventoryProducts';
import StockManagement from '@/pages/inventory/StockManagement';
import PurchaseOrders from '@/pages/inventory/PurchaseOrders';

// Technician Pages
import TechnicianProcedures from '@/pages/technician/TechnicianProcedures';
import EquipmentManagement from '@/pages/technician/EquipmentManagement';

// HR Pages
import PerformanceManagement from '@/pages/hr/PerformanceManagement';

// Auth & Landing Pages
import Login from '@/pages/Login';
import RoleLogin from '@/pages/RoleLogin';
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
              <Route path="/select-role" element={<RoleSelect />} />
              <Route path="/login" element={<RoleLogin />} />
              <Route path="/old-login" element={<Login />} />
              
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
                path="/reception/appointments" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <AppointmentBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reception/register" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <PatientRegister />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reception/queue" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <QueueManagement />
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
                path="/billing/invoices" 
                element={
                  <ProtectedRoute requiredModule="billing">
                    <InvoiceManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/billing/payments" 
                element={
                  <ProtectedRoute requiredModule="billing">
                    <PaymentProcessing />
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
                path="/hr/attendance" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <AttendanceManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hr/payroll" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <PayrollManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/hr/performance" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <PerformanceManagement />
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
                path="/admin/users" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <SystemSettings />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/reports" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <div className="p-6"><h1>Admin Reports - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/branches" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <div className="p-6"><h1>Multi-branch Management - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/billing/reports" 
                element={
                  <ProtectedRoute requiredModule="billing">
                    <div className="p-6"><h1>Billing Reports - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/reception/checkin" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <div className="p-6"><h1>Check-in/out - Coming Soon</h1></div>
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
                path="/inventory/products" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <InventoryProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory/stock" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <StockManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory/orders" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <PurchaseOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/inventory/reports" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <div className="p-6"><h1>Inventory Reports - Coming Soon</h1></div>
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
                path="/technician/procedures" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <TechnicianProcedures />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/equipment" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <EquipmentManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/photos" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <div className="p-6"><h1>Photo Manager - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technician/history" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <div className="p-6"><h1>Session History - Coming Soon</h1></div>
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
              <Route 
                path="/procedures/catalog" 
                element={
                  <ProtectedRoute requiredModule="procedures">
                    <div className="p-6"><h1>Procedure Catalog - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/procedures/builder" 
                element={
                  <ProtectedRoute requiredModule="procedures">
                    <div className="p-6"><h1>Protocol Builder - Coming Soon</h1></div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/procedures/templates" 
                element={
                  <ProtectedRoute requiredModule="procedures">
                    <div className="p-6"><h1>Templates - Coming Soon</h1></div>
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