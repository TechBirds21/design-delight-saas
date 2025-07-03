import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import { Toaster } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import RoleSelect from '@/pages/RoleSelect';

// Import all pages
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import Appointments from '@/pages/Appointments';
import Inventory from '@/pages/Inventory';
import Billing from '@/pages/Billing';

// Billing pages
import InvoiceDetail from '@/pages/billing/InvoiceDetail';

// Inventory pages
import ProductDetail from '@/pages/inventory/ProductDetail';

import CRM from '@/pages/CRM';
import HR from '@/pages/HR';
import Payroll from '@/pages/Payroll';
import Reports from '@/pages/Reports';
import Admin from '@/pages/Admin';
import AdminReports from '@/pages/admin/Reports';
import AdminLogs from '@/pages/admin/Logs';
import SuperAdmin from '@/pages/super-admin/SuperAdmin';
import ClientList from '@/pages/super-admin/ClientList';
import ClientDetail from '@/pages/super-admin/ClientDetail';
import ClientNew from '@/pages/super-admin/ClientNew';
import SuperAdminLogs from '@/pages/super-admin/Logs';
import Support from '@/pages/super-admin/Support';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// CRM pages
import CRMDashboard from '@/pages/crm/CRMDashboard';
import AddLead from '@/pages/crm/AddLead';
import LeadDetail from '@/pages/crm/LeadDetail';
import ConvertedLeads from '@/pages/crm/ConvertedLeads';

// HR pages
import StaffProfile from '@/pages/hr/StaffProfile';

// Payroll pages
import PayslipDetail from '@/pages/payroll/PayslipDetail';

// Reception pages
import ReceptionDashboard from '@/pages/reception/ReceptionDashboard';
import PatientRegister from '@/pages/reception/PatientRegister';
import AppointmentBooking from '@/pages/reception/AppointmentBooking';
import QueueManagement from '@/pages/reception/QueueManagement';
import ConsentForm from '@/pages/reception/ConsentForm';

// Doctor pages
import DoctorDashboard from '@/pages/doctor/DoctorDashboard';
import PatientDetails from '@/pages/doctor/PatientDetails';
import SOAPNote from '@/pages/doctor/SOAPNote';
import TreatmentHistory from '@/pages/doctor/TreatmentHistory';
import UploadPhoto from '@/pages/doctor/UploadPhoto';

// Photo Manager pages
import PhotoManager from '@/pages/photo-manager/PhotoManager';
import PhotoUpload from '@/pages/photo-manager/PhotoUpload';
import PatientGallery from '@/pages/photo-manager/PatientGallery';

// Technician pages
import TechnicianDashboard from '@/pages/technician/TechnicianDashboard';
import ProcedureDetail from '@/pages/technician/ProcedureDetail';
import SessionHistory from '@/pages/technician/SessionHistory';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TenantProvider>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/select-role" element={<RoleSelect />} />
              
              {/* Main Layout Routes */}
              <Route path="/" element={<AppLayout />}>
                {/* Default redirect to dashboard */}
                <Route index element={<Navigate to="/select-role" replace />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Patients */}
              <Route 
                path="patients" 
                element={
                  <ProtectedRoute requiredModule="patients">
                    <Patients />
                  </ProtectedRoute>
                } 
              />
              
              {/* Appointments */}
              <Route 
                path="appointments" 
                element={
                  <ProtectedRoute requiredModule="appointments">
                    <Appointments />
                  </ProtectedRoute>
                } 
              />
              
              {/* Reception Module */}
              <Route 
                path="reception" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <ReceptionDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reception/patient-register" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <PatientRegister />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reception/appointments" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <AppointmentBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reception/queue" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <QueueManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reception/consent-form" 
                element={
                  <ProtectedRoute requiredModule="reception">
                    <ConsentForm />
                  </ProtectedRoute>
                } 
              />
              
              {/* Doctor Module */}
              <Route 
                path="doctor" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="doctor/patient/:id" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <PatientDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="doctor/soap/:id" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <SOAPNote />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="doctor/treatment-history" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <TreatmentHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="doctor/upload-photo/:id" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <UploadPhoto />
                  </ProtectedRoute>
                } 
              />

              {/* Photo Manager Module */}
              <Route 
                path="photo-manager" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <PhotoManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="photo-manager/upload/:patientId" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <PhotoUpload />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="photo-manager/patient/:patientId" 
                element={
                  <ProtectedRoute requiredModule="doctor">
                    <PatientGallery />
                  </ProtectedRoute>
                } 
              />
              
              {/* Technician Module */}
              <Route 
                path="technician" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <TechnicianDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="technician/procedure/:id" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <ProcedureDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="technician/history" 
                element={
                  <ProtectedRoute requiredModule="technician">
                    <SessionHistory />
                  </ProtectedRoute>
                } 
              />
              
              {/* Other Modules */}
              <Route 
                path="inventory" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <Inventory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="inventory/product/:id" 
                element={
                  <ProtectedRoute requiredModule="inventory">
                    <ProductDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="billing" 
                element={
                  <ProtectedRoute requiredModule="billing">
                    <Billing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="billing/invoice/:id" 
                element={
                  <ProtectedRoute requiredModule="billing">
                    <InvoiceDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="crm" 
                element={
                  <ProtectedRoute requiredModule="crm">
                    <CRMDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="crm/add-lead" 
                element={
                  <ProtectedRoute requiredModule="crm">
                    <AddLead />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="crm/lead/:id" 
                element={
                  <ProtectedRoute requiredModule="crm">
                    <LeadDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="crm/converted" 
                element={
                  <ProtectedRoute requiredModule="crm">
                    <ConvertedLeads />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="hr" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <HR />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="hr/staff/:id" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <StaffProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payroll" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <Payroll />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="payroll/payslip/:id" 
                element={
                  <ProtectedRoute requiredModule="hr">
                    <PayslipDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="reports" 
                element={
                  <ProtectedRoute requiredModule="reports">
                    <Reports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/reports" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <AdminReports />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="admin/logs" 
                element={
                  <ProtectedRoute requiredModule="admin">
                    <AdminLogs />
                  </ProtectedRoute>
                } 
              />
              
              {/* Super Admin Module */}
              <Route 
                path="super-admin" 
                element={
                  <ProtectedRoute requiredModule="super-admin">
                    <SuperAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="super-admin/clients" 
                element={
                  <ProtectedRoute requiredModule="super-admin">
                    <ClientList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="super-admin/clients/new" 
                element={
                  <ProtectedRoute requiredModule="super-admin">
                    <ClientNew />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="super-admin/clients/:clientId" 
                element={
                  <ProtectedRoute requiredModule="super-admin">
                    <ClientDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="super-admin/logs" 
                element={
                  <ProtectedRoute requiredModule="super-admin">
                    <SuperAdminLogs />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="super-admin/support" 
                element={
                  <ProtectedRoute requiredModule="super-admin">
                    <Support />
                  </ProtectedRoute>
                } 
              />
              
              {/* Error Pages */}
              <Route path="unauthorized" element={<Unauthorized />} />
              </Route>
              
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