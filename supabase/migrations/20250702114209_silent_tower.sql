-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subdomain TEXT NOT NULL UNIQUE,
  logo TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic', 'professional', 'enterprise', 'trial')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'trial', 'suspended')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  modules JSONB NOT NULL DEFAULT '{}'::JSONB,
  modules_enabled TEXT[] DEFAULT '{}',
  role_permissions JSONB DEFAULT '{}'::JSONB,
  api_usage INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  last_login TIMESTAMPTZ
);

-- Create client branches table
CREATE TABLE IF NOT EXISTS client_branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_main BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  date_of_birth TEXT NOT NULL,
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('new', 'follow-up')),
  referred_by TEXT NOT NULL,
  clinic_branch TEXT,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  doctor_id INTEGER NOT NULL,
  doctor_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'waiting', 'in-progress', 'completed', 'cancelled')),
  type TEXT NOT NULL,
  notes TEXT,
  booked_at TIMESTAMPTZ,
  age INTEGER,
  phone TEXT
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_phone TEXT NOT NULL,
  procedure TEXT NOT NULL,
  duration INTEGER NOT NULL,
  assigned_by TEXT NOT NULL,
  assigned_by_id INTEGER NOT NULL,
  scheduled_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  notes TEXT,
  assigned_at TIMESTAMPTZ NOT NULL,
  date TEXT NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  completion_notes TEXT,
  actual_duration INTEGER
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('consumables', 'equipment', 'medications', 'supplies')),
  batch_number TEXT NOT NULL,
  vendor TEXT NOT NULL,
  cost_price NUMERIC NOT NULL,
  selling_price NUMERIC,
  current_stock INTEGER NOT NULL,
  min_stock_level INTEGER NOT NULL,
  max_stock_level INTEGER NOT NULL,
  unit TEXT NOT NULL,
  expiry_date TEXT,
  manufacturing_date TEXT,
  location TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  last_used TIMESTAMPTZ,
  auto_deduct_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  treatment_types TEXT[] NOT NULL
);

-- Create inventory logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stock-in', 'stock-out', 'adjustment', 'expired', 'auto-deduct')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL,
  treatment_id TEXT,
  patient_name TEXT,
  performed_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  notes TEXT
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  session_id TEXT,
  procedures JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  tax_rate NUMERIC NOT NULL,
  tax_amount NUMERIC NOT NULL,
  discount_rate NUMERIC NOT NULL,
  discount_amount NUMERIC NOT NULL,
  total_amount NUMERIC NOT NULL,
  paid_amount NUMERIC NOT NULL,
  balance_amount NUMERIC NOT NULL,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'card', 'upi', 'bank-transfer', 'insurance')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'partially-paid', 'overdue', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  due_date TEXT NOT NULL,
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_amount NUMERIC,
  refund_reason TEXT
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('cash', 'card', 'upi', 'bank-transfer', 'insurance')),
  transaction_id TEXT,
  paid_at TIMESTAMPTZ NOT NULL,
  notes TEXT
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL CHECK (source IN ('whatsapp', 'form', 'referral', 'instagram', 'walk-in', 'facebook', 'google')),
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'consulted', 'converted', 'dropped')),
  assigned_to TEXT NOT NULL,
  assigned_to_id INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  converted_at TIMESTAMPTZ,
  drop_reason TEXT,
  status_history JSONB NOT NULL,
  notes_history JSONB NOT NULL
);

-- Create converted leads table
CREATE TABLE IF NOT EXISTS converted_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lead_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  converted_at TIMESTAMPTZ NOT NULL,
  converted_by TEXT NOT NULL,
  assigned_doctor TEXT,
  billing_value NUMERIC,
  source TEXT NOT NULL
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  branch TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  join_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'on-leave', 'suspended', 'terminated')),
  avatar TEXT,
  personal_details JSONB,
  employment_details JSONB
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  date TEXT NOT NULL,
  check_in TEXT,
  check_out TEXT,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'half-day', 'leave', 'holiday')),
  leave_type TEXT,
  notes TEXT,
  approved_by TEXT
);

-- Create staff documents table
CREATE TABLE IF NOT EXISTS staff_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('id-proof', 'contract', 'certificate', 'resume', 'other')),
  name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL,
  expiry_date TEXT,
  notes TEXT
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  date TEXT NOT NULL,
  shift_code TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'missed')),
  notes TEXT
);

-- Create performance notes table
CREATE TABLE IF NOT EXISTS performance_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('review', 'achievement', 'warning', 'note')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rating NUMERIC,
  added_by TEXT NOT NULL
);

-- Create salary structures table
CREATE TABLE IF NOT EXISTS salary_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  basic NUMERIC NOT NULL,
  hra NUMERIC NOT NULL,
  conveyance NUMERIC NOT NULL,
  medical NUMERIC NOT NULL,
  special NUMERIC NOT NULL,
  bonus NUMERIC,
  pf NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  other_deductions NUMERIC,
  effective_from TEXT NOT NULL,
  currency TEXT NOT NULL,
  payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('monthly', 'bi-weekly', 'weekly')),
  bank_account TEXT,
  pan_number TEXT,
  pf_number TEXT,
  uan TEXT
);

-- Create payslips table
CREATE TABLE IF NOT EXISTS payslips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  basic NUMERIC NOT NULL,
  hra NUMERIC NOT NULL,
  conveyance NUMERIC NOT NULL,
  medical NUMERIC NOT NULL,
  special NUMERIC NOT NULL,
  bonus NUMERIC,
  gross_salary NUMERIC NOT NULL,
  pf NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  other_deductions NUMERIC,
  total_deductions NUMERIC NOT NULL,
  net_salary NUMERIC NOT NULL,
  days_worked INTEGER NOT NULL,
  leaves_taken INTEGER NOT NULL,
  bank_account TEXT,
  pan_number TEXT,
  pf_number TEXT,
  uan TEXT,
  payment_date TIMESTAMPTZ NOT NULL,
  payment_mode TEXT NOT NULL CHECK (payment_mode IN ('bank-transfer', 'check', 'cash')),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'processed', 'failed')),
  notes TEXT
);

-- Create leave balances table
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  casual INTEGER NOT NULL,
  sick INTEGER NOT NULL,
  annual INTEGER NOT NULL,
  compensatory INTEGER NOT NULL,
  unpaid INTEGER NOT NULL
);

-- Create treatment records table
CREATE TABLE IF NOT EXISTS treatment_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  date TEXT NOT NULL,
  procedure TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  performed_by_id TEXT,
  notes TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Create SOAP notes table
CREATE TABLE IF NOT EXISTS soap_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  subjective TEXT NOT NULL,
  objective TEXT NOT NULL,
  assessment TEXT NOT NULL,
  plan TEXT NOT NULL,
  vitals JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted')),
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL
);

-- Create patient photos table
CREATE TABLE IF NOT EXISTS patient_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  session_id TEXT NOT NULL,
  session_date TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('before', 'after', 'in-progress')),
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL
);

-- Create photo sessions table
CREATE TABLE IF NOT EXISTS photo_sessions (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  date TEXT NOT NULL,
  procedure TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  before_count INTEGER NOT NULL DEFAULT 0,
  after_count INTEGER NOT NULL DEFAULT 0,
  in_progress_count INTEGER NOT NULL DEFAULT 0
);

-- Create queue table
CREATE TABLE IF NOT EXISTS queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  doctor_name TEXT,
  appointment_time TEXT,
  status TEXT NOT NULL CHECK (status IN ('waiting', 'checked-in', 'with-doctor', 'completed', 'cancelled')),
  checked_in_at TIMESTAMPTZ NOT NULL,
  queue_number INTEGER NOT NULL
);

-- Create consent forms table
CREATE TABLE IF NOT EXISTS consent_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  signature TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT,
  type TEXT NOT NULL CHECK (type IN ('api', 'error', 'auth', 'module')),
  action TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT NOT NULL
);

-- Create usage logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  user_agent TEXT NOT NULL,
  ip_address TEXT NOT NULL
);

-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id TEXT PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  assigned_to TEXT,
  contact_email TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT
);

-- Create ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT NOT NULL,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('client', 'support')),
  sender_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL
);

-- Create session history table
CREATE TABLE IF NOT EXISTS session_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  procedure TEXT NOT NULL,
  duration INTEGER NOT NULL,
  assigned_by TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'cancelled')),
  notes TEXT NOT NULL
);

-- Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  username TEXT NOT NULL,
  user_role TEXT NOT NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('create', 'update', 'delete', 'view', 'login', 'logout', 'error')),
  ip_address TEXT NOT NULL,
  details TEXT
);

-- Create technician assignments table
CREATE TABLE IF NOT EXISTS technician_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  patient_id TEXT NOT NULL,
  technician_id TEXT NOT NULL,
  procedure TEXT NOT NULL,
  notes TEXT,
  assigned_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE converted_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for multi-tenant data isolation
-- Clients table policies (only super admins can access)
CREATE POLICY "Super admins can access all clients" ON clients
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE auth_user_id = auth.uid()) = 'super_admin'
  );

-- Client branches policies
CREATE POLICY "Users can access their own client's branches" ON client_branches
  FOR ALL USING (
    client_id = (SELECT client_id FROM user_profiles WHERE auth_user_id = auth.uid())
  );

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (
    auth_user_id = auth.uid()
  );

CREATE POLICY "Super admins can manage all user profiles" ON user_profiles
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE auth_user_id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Admins can manage users in their client" ON user_profiles
  FOR ALL USING (
    (SELECT role FROM user_profiles WHERE auth_user_id = auth.uid()) = 'admin' AND
    client_id = (SELECT client_id FROM user_profiles WHERE auth_user_id = auth.uid())
  );

-- Tenant-specific data policies (template for all tenant tables)
-- This policy pattern is applied to all tenant-specific tables
CREATE POLICY "Users can access their own client's patients" ON patients
  FOR ALL USING (
    client_id = (SELECT client_id FROM user_profiles WHERE auth_user_id = auth.uid())
  );

-- Create similar policies for all other tenant-specific tables
-- For brevity, not all policies are shown here but would follow the same pattern