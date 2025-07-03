import sys
import os
import uuid
import random
from datetime import datetime, timedelta

# Add parent directory to path to import extensions
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api.extensions import supabase

def seed_clients():
    """Seed clients table with demo data"""
    print("Seeding clients...")
    
    # Check if clients already exist
    existing = supabase.table("clients").select("*").execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing clients. Skipping client seeding.")
        return
    
    demo = {
        "id": str(uuid.uuid4()),
        "name": "Skinova Clinic",
        "subdomain": "skinova",
        "logo": "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
        "plan": "professional",
        "status": "active",
        "created_at": datetime.now().isoformat(),
        "expires_at": (datetime.now() + timedelta(days=365)).isoformat(),
        "contact_name": "Dr. Sarah Johnson",
        "contact_email": "sarah.johnson@skinova.com",
        "contact_phone": "+1-555-0123",
        "modules": {
            "dashboard": True,
            "patients": True,
            "appointments": True,
            "inventory": True,
            "billing": True,
            "crm": True,
            "hr": True,
            "reports": True,
            "admin": True,
            "reception": True,
            "doctor": True,
            "photo_manager": True,
            "technician": True
        },
        "modules_enabled": ["dashboard", "patients", "appointments", "inventory", "billing", 
                           "crm", "hr", "reports", "admin", "reception", "doctor", 
                           "photo_manager", "technician"],
        "api_usage": 12500,
        "active_users": 18,
        "last_login": datetime.now().isoformat()
    }
    
    # Add a second client
    beauty_med = {
        "id": str(uuid.uuid4()),
        "name": "BeautyMed Center",
        "subdomain": "beautymed",
        "logo": "https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
        "plan": "basic",
        "status": "active",
        "created_at": (datetime.now() - timedelta(days=60)).isoformat(),
        "expires_at": (datetime.now() + timedelta(days=305)).isoformat(),
        "contact_name": "Dr. Michael Chen",
        "contact_email": "michael.chen@beautymed.com",
        "contact_phone": "+1-555-0125",
        "modules": {
            "dashboard": True,
            "patients": True,
            "appointments": True,
            "inventory": True,
            "billing": True,
            "crm": False,
            "hr": False,
            "reports": True,
            "admin": True,
            "reception": True,
            "doctor": True,
            "photo_manager": True,
            "technician": True
        },
        "modules_enabled": ["dashboard", "patients", "appointments", "inventory", "billing", 
                           "reports", "admin", "reception", "doctor", 
                           "photo_manager", "technician"],
        "api_usage": 8200,
        "active_users": 12,
        "last_login": datetime.now().isoformat()
    }
    
    # Add a trial client
    laser_tech = {
        "id": str(uuid.uuid4()),
        "name": "LaserTech Clinic",
        "subdomain": "lasertech",
        "logo": "https://images.pexels.com/photos/3846005/pexels-photo-3846005.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
        "plan": "trial",
        "status": "trial",
        "created_at": (datetime.now() - timedelta(days=15)).isoformat(),
        "expires_at": (datetime.now() + timedelta(days=15)).isoformat(),
        "contact_name": "Dr. Robert Wilson",
        "contact_email": "robert.wilson@lasertech.com",
        "contact_phone": "+1-555-0129",
        "modules": {
            "dashboard": True,
            "patients": True,
            "appointments": True,
            "inventory": True,
            "billing": True,
            "crm": True,
            "hr": False,
            "reports": True,
            "admin": True,
            "reception": True,
            "doctor": True,
            "photo_manager": True,
            "technician": True
        },
        "modules_enabled": ["dashboard", "patients", "appointments", "inventory", "billing", 
                           "crm", "reports", "admin", "reception", "doctor", 
                           "photo_manager", "technician"],
        "api_usage": 3200,
        "active_users": 8,
        "last_login": datetime.now().isoformat()
    }
    
    supabase.table("clients").insert([demo, beauty_med, laser_tech]).execute()
    print("Clients seeded successfully!")
    return demo["id"]

def seed_branches(client_id):
    """Seed branches for a client"""
    print("Seeding branches...")
    
    # Check if branches already exist
    existing = supabase.table("client_branches").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing branches. Skipping branch seeding.")
        return
    
    branches = [
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "name": "Main Branch - Downtown Medical Center",
            "address": "123 Medical Drive, New York, NY",
            "phone": "+1-555-0123",
            "is_main": True,
            "created_at": datetime.now().isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "name": "North Branch",
            "address": "456 Health Avenue, New York, NY",
            "phone": "+1-555-0124",
            "is_main": False,
            "created_at": (datetime.now() - timedelta(days=30)).isoformat()
        }
    ]
    
    supabase.table("client_branches").insert(branches).execute()
    print("Branches seeded successfully!")

def seed_users(client_id):
    """Seed users for a client"""
    print("Seeding users...")
    
    # Check if users already exist
    existing = supabase.table("user_profiles").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing users. Skipping user seeding.")
        return
    
    # Create users with different roles
    users = [
        {
            "id": str(uuid.uuid4()),
            "auth_user_id": str(uuid.uuid4()),
            "name": "Dr. Sarah Johnson",
            "email": "doctor@skinova.com",
            "role": "doctor",
            "client_id": client_id,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "auth_user_id": str(uuid.uuid4()),
            "name": "Mike Wilson",
            "email": "technician@skinova.com",
            "role": "technician",
            "client_id": client_id,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "auth_user_id": str(uuid.uuid4()),
            "name": "Emily Davis",
            "email": "reception@skinova.com",
            "role": "receptionist",
            "client_id": client_id,
            "is_active": True
        },
        {
            "id": str(uuid.uuid4()),
            "auth_user_id": str(uuid.uuid4()),
            "name": "Admin User",
            "email": "admin@skinova.com",
            "role": "admin",
            "client_id": client_id,
            "is_active": True
        }
    ]
    
    # Create super admin user (not tied to a client)
    super_admin = {
        "id": str(uuid.uuid4()),
        "auth_user_id": str(uuid.uuid4()),
        "name": "Super Admin",
        "email": "super@hospverse.com",
        "role": "super_admin",
        "is_active": True
    }
    
    users.append(super_admin)
    
    supabase.table("user_profiles").insert(users).execute()
    print("Users seeded successfully!")

def seed_patients(client_id):
    """Seed patients for a client"""
    print("Seeding patients...")
    
    # Check if patients already exist
    existing = supabase.table("patients").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing patients. Skipping patient seeding.")
        return
    
    patients = [
        {
            "id": "p1",
            "client_id": client_id,
            "full_name": "John Doe",
            "mobile": "+1-555-0123",
            "email": "john.doe@email.com",
            "gender": "male",
            "date_of_birth": "1990-05-15",
            "appointment_type": "new",
            "referred_by": "google",
            "clinic_branch": "main",
            "registered_at": datetime.now().isoformat()
        },
        {
            "id": "p2",
            "client_id": client_id,
            "full_name": "Jane Smith",
            "mobile": "+1-555-0124",
            "email": "jane.smith@email.com",
            "gender": "female",
            "date_of_birth": "1995-08-20",
            "appointment_type": "follow-up",
            "referred_by": "referral",
            "clinic_branch": "main",
            "registered_at": (datetime.now() - timedelta(days=5)).isoformat()
        },
        {
            "id": "p3",
            "client_id": client_id,
            "full_name": "Mike Johnson",
            "mobile": "+1-555-0125",
            "email": "mike.j@email.com",
            "gender": "male",
            "date_of_birth": "1982-03-10",
            "appointment_type": "new",
            "referred_by": "instagram",
            "clinic_branch": "north",
            "registered_at": (datetime.now() - timedelta(days=2)).isoformat()
        }
    ]
    
    supabase.table("patients").insert(patients).execute()
    print("Patients seeded successfully!")

def seed_appointments(client_id):
    """Seed appointments for a client"""
    print("Seeding appointments...")
    
    # Check if appointments already exist
    existing = supabase.table("appointments").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing appointments. Skipping appointment seeding.")
        return
    
    # Today's date
    today = datetime.now().strftime("%Y-%m-%d")
    
    appointments = [
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "patient_name": "John Doe",
            "patient_phone": "+1-555-0123",
            "doctor_id": 1,
            "doctor_name": "Dr. Sarah Johnson",
            "date": today,
            "time": "09:00",
            "status": "confirmed",
            "type": "consultation",
            "notes": "Regular checkup",
            "patient_id": "p1",
            "age": 34,
            "phone": "+1-555-0123"
        },
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "patient_name": "Jane Smith",
            "patient_phone": "+1-555-0124",
            "doctor_id": 2,
            "doctor_name": "Dr. Michael Chen",
            "date": today,
            "time": "10:30",
            "status": "waiting",
            "type": "follow-up",
            "notes": "Skin condition follow-up",
            "patient_id": "p2",
            "age": 28,
            "phone": "+1-555-0124"
        },
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "patient_name": "Mike Johnson",
            "patient_phone": "+1-555-0125",
            "doctor_id": 1,
            "doctor_name": "Dr. Sarah Johnson",
            "date": today,
            "time": "14:00",
            "status": "completed",
            "type": "consultation",
            "notes": "PRP treatment consultation",
            "patient_id": "p3",
            "age": 42,
            "phone": "+1-555-0125"
        }
    ]
    
    supabase.table("appointments").insert(appointments).execute()
    print("Appointments seeded successfully!")

def seed_procedures(client_id):
    """Seed procedures for a client"""
    print("Seeding procedures...")
    
    # Check if procedures already exist
    existing = supabase.table("procedures").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing procedures. Skipping procedure seeding.")
        return
    
    # Today's date
    today = datetime.now().strftime("%Y-%m-%d")
    
    procedures = [
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "patient_id": "p1",
            "patient_name": "John Doe",
            "patient_age": 34,
            "patient_phone": "+1-555-0123",
            "procedure": "Laser Hair Removal",
            "duration": 45,
            "assigned_by": "Dr. Sarah Johnson",
            "assigned_by_id": 1,
            "scheduled_time": "09:00",
            "status": "pending",
            "notes": "Session 3 of 6 - Upper lip and chin area",
            "assigned_at": datetime.now().isoformat(),
            "date": today
        },
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "patient_id": "p2",
            "patient_name": "Jane Smith",
            "patient_age": 28,
            "patient_phone": "+1-555-0124",
            "procedure": "PRP Treatment",
            "duration": 60,
            "assigned_by": "Dr. Michael Chen",
            "assigned_by_id": 2,
            "scheduled_time": "10:30",
            "status": "in-progress",
            "notes": "Hair restoration treatment - scalp area",
            "assigned_at": datetime.now().isoformat(),
            "date": today,
            "start_time": (datetime.now() - timedelta(minutes=15)).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "client_id": client_id,
            "patient_id": "p3",
            "patient_name": "Mike Johnson",
            "patient_age": 42,
            "patient_phone": "+1-555-0125",
            "procedure": "Chemical Peel",
            "duration": 30,
            "assigned_by": "Dr. Sarah Johnson",
            "assigned_by_id": 1,
            "scheduled_time": "14:00",
            "status": "pending",
            "notes": "Medium depth peel for acne scarring",
            "assigned_at": datetime.now().isoformat(),
            "date": today
        }
    ]
    
    supabase.table("procedures").insert(procedures).execute()
    print("Procedures seeded successfully!")

def seed_products(client_id):
    """Seed products for a client"""
    print("Seeding products...")
    
    # Check if products already exist
    existing = supabase.table("products").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing products. Skipping product seeding.")
        return
    
    # Calculate dates
    now = datetime.now()
    expiry_future = (now + timedelta(days=180)).strftime("%Y-%m-%d")
    manufacturing_past = (now - timedelta(days=30)).strftime("%Y-%m-%d")
    
    products = [
        {
            "id": "1",
            "client_id": client_id,
            "name": "Laser Gel",
            "category": "consumables",
            "batch_number": "LG2024001",
            "vendor": "MedSupply Corp",
            "cost_price": 25,
            "selling_price": 35,
            "current_stock": 15,
            "min_stock_level": 10,
            "max_stock_level": 50,
            "unit": "ml",
            "expiry_date": expiry_future,
            "manufacturing_date": manufacturing_past,
            "location": "Storage Room A",
            "description": "Cooling gel for laser treatments",
            "is_active": True,
            "created_at": (now - timedelta(days=30)).isoformat(),
            "updated_at": (now - timedelta(hours=2)).isoformat(),
            "last_used": (now - timedelta(hours=2)).isoformat(),
            "auto_deduct_enabled": True,
            "treatment_types": ["Laser Hair Removal"]
        },
        {
            "id": "2",
            "client_id": client_id,
            "name": "PRP Tubes",
            "category": "supplies",
            "batch_number": "PRP2024002",
            "vendor": "BioMed Distributors",
            "cost_price": 15,
            "current_stock": 8,
            "min_stock_level": 15,
            "max_stock_level": 100,
            "unit": "pieces",
            "expiry_date": (now + timedelta(days=365)).strftime("%Y-%m-%d"),
            "manufacturing_date": (now - timedelta(days=60)).strftime("%Y-%m-%d"),
            "location": "Refrigerator B",
            "description": "Sterile tubes for PRP preparation",
            "is_active": True,
            "created_at": (now - timedelta(days=60)).isoformat(),
            "updated_at": (now - timedelta(days=1)).isoformat(),
            "last_used": (now - timedelta(days=1)).isoformat(),
            "auto_deduct_enabled": True,
            "treatment_types": ["PRP Treatment"]
        }
    ]
    
    supabase.table("products").insert(products).execute()
    print("Products seeded successfully!")

def seed_invoices(client_id):
    """Seed invoices for a client"""
    print("Seeding invoices...")
    
    # Check if invoices already exist
    existing = supabase.table("invoices").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing invoices. Skipping invoice seeding.")
        return
    
    # Calculate dates
    now = datetime.now()
    
    invoices = [
        {
            "id": "1",
            "client_id": client_id,
            "invoice_number": "INV240001",
            "patient_id": "p1",
            "patient_name": "John Doe",
            "patient_phone": "+1-555-0123",
            "doctor_id": "dr1",
            "doctor_name": "Dr. Sarah Johnson",
            "procedures": [
                {
                    "id": "1",
                    "name": "Laser Hair Removal",
                    "quantity": 1,
                    "unit_price": 150,
                    "total_price": 150,
                    "description": "Upper lip and chin area"
                },
                {
                    "id": "2",
                    "name": "Consultation",
                    "quantity": 1,
                    "unit_price": 50,
                    "total_price": 50
                }
            ],
            "subtotal": 200,
            "tax_rate": 10,
            "tax_amount": 20,
            "discount_rate": 5,
            "discount_amount": 10,
            "total_amount": 210,
            "paid_amount": 210,
            "balance_amount": 0,
            "payment_mode": "card",
            "status": "paid",
            "notes": "Payment completed via credit card",
            "created_at": (now - timedelta(hours=2)).isoformat(),
            "updated_at": (now - timedelta(hours=1)).isoformat(),
            "due_date": (now + timedelta(days=7)).strftime("%Y-%m-%d"),
            "paid_at": (now - timedelta(hours=1)).isoformat()
        },
        {
            "id": "2",
            "client_id": client_id,
            "invoice_number": "INV240002",
            "patient_id": "p2",
            "patient_name": "Jane Smith",
            "patient_phone": "+1-555-0124",
            "doctor_id": "dr2",
            "doctor_name": "Dr. Michael Chen",
            "procedures": [
                {
                    "id": "3",
                    "name": "PRP Treatment",
                    "quantity": 1,
                    "unit_price": 300,
                    "total_price": 300,
                    "description": "Hair restoration treatment"
                }
            ],
            "subtotal": 300,
            "tax_rate": 10,
            "tax_amount": 30,
            "discount_rate": 0,
            "discount_amount": 0,
            "total_amount": 330,
            "paid_amount": 150,
            "balance_amount": 180,
            "payment_mode": "upi",
            "status": "partially-paid",
            "notes": "Partial payment received, balance pending",
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(hours=12)).isoformat(),
            "due_date": (now + timedelta(days=5)).strftime("%Y-%m-%d")
        }
    ]
    
    supabase.table("invoices").insert(invoices).execute()
    print("Invoices seeded successfully!")

def seed_leads(client_id):
    """Seed leads for a client"""
    print("Seeding leads...")
    
    # Check if leads already exist
    existing = supabase.table("leads").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing leads. Skipping lead seeding.")
        return
    
    # Calculate dates
    now = datetime.now()
    
    leads = [
        {
            "id": "1",
            "client_id": client_id,
            "full_name": "John Smith",
            "mobile": "+1-555-0123",
            "email": "john.smith@email.com",
            "source": "whatsapp",
            "status": "new",
            "assigned_to": "Sarah Johnson",
            "assigned_to_id": 1,
            "notes": "Interested in laser hair removal treatment",
            "created_at": (now - timedelta(hours=2)).isoformat(),
            "updated_at": (now - timedelta(hours=2)).isoformat(),
            "status_history": [
                {
                    "id": str(uuid.uuid4()),
                    "status": "new",
                    "changed_by": "System",
                    "changed_at": (now - timedelta(hours=2)).isoformat(),
                    "notes": "Lead created from WhatsApp inquiry"
                }
            ],
            "notes_history": [
                {
                    "id": str(uuid.uuid4()),
                    "note": "Interested in laser hair removal treatment",
                    "added_by": "Sarah Johnson",
                    "added_at": (now - timedelta(hours=2)).isoformat()
                }
            ]
        },
        {
            "id": "2",
            "client_id": client_id,
            "full_name": "Maria Garcia",
            "mobile": "+1-555-0124",
            "email": "maria.garcia@email.com",
            "source": "form",
            "status": "contacted",
            "assigned_to": "Mike Chen",
            "assigned_to_id": 2,
            "notes": "Wants consultation for acne treatment",
            "created_at": (now - timedelta(days=1)).isoformat(),
            "updated_at": (now - timedelta(hours=4)).isoformat(),
            "status_history": [
                {
                    "id": str(uuid.uuid4()),
                    "status": "new",
                    "changed_by": "System",
                    "changed_at": (now - timedelta(days=1)).isoformat(),
                    "notes": "Lead created from website form"
                },
                {
                    "id": str(uuid.uuid4()),
                    "status": "contacted",
                    "changed_by": "Mike Chen",
                    "changed_at": (now - timedelta(hours=4)).isoformat(),
                    "notes": "Called and scheduled consultation"
                }
            ],
            "notes_history": [
                {
                    "id": str(uuid.uuid4()),
                    "note": "Wants consultation for acne treatment",
                    "added_by": "Mike Chen",
                    "added_at": (now - timedelta(days=1)).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "note": "Called and scheduled consultation for tomorrow",
                    "added_by": "Mike Chen",
                    "added_at": (now - timedelta(hours=4)).isoformat()
                }
            ]
        }
    ]
    
    supabase.table("leads").insert(leads).execute()
    print("Leads seeded successfully!")

def seed_staff(client_id):
    """Seed staff for a client"""
    print("Seeding staff...")
    
    # Check if staff already exist
    existing = supabase.table("staff").select("*").eq("client_id", client_id).execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing staff. Skipping staff seeding.")
        return
    
    # Calculate dates
    now = datetime.now()
    
    staff = [
        {
            "id": "1",
            "client_id": client_id,
            "name": "Dr. Sarah Johnson",
            "role": "Doctor",
            "department": "Medical",
            "branch": "Main Branch",
            "email": "sarah.johnson@skinova.com",
            "phone": "+1-555-0123",
            "join_date": "2023-01-15",
            "status": "active",
            "avatar": "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
            "personal_details": {
                "date_of_birth": "1985-06-12",
                "gender": "female",
                "address": "123 Medical Drive, New York, NY",
                "emergency_contact": "+1-555-9876",
                "blood_group": "O+",
                "marital_status": "married"
            },
            "employment_details": {
                "employee_id": "EMP001",
                "contract_type": "permanent",
                "designation": "Senior Dermatologist",
                "reporting_to": "Dr. Michael Chen",
                "work_hours": "9:00 AM - 5:00 PM",
                "probation_period": "3 months",
                "probation_end_date": "2023-04-15"
            }
        },
        {
            "id": "2",
            "client_id": client_id,
            "name": "Mike Wilson",
            "role": "Technician",
            "department": "Technical",
            "branch": "Main Branch",
            "email": "mike.wilson@skinova.com",
            "phone": "+1-555-0124",
            "join_date": "2023-02-10",
            "status": "active",
            "avatar": "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&fit=crop",
            "personal_details": {
                "date_of_birth": "1990-08-22",
                "gender": "male",
                "address": "456 Tech Lane, New York, NY",
                "emergency_contact": "+1-555-8765",
                "blood_group": "A+",
                "marital_status": "single"
            },
            "employment_details": {
                "employee_id": "EMP002",
                "contract_type": "permanent",
                "designation": "Senior Laser Technician",
                "reporting_to": "Dr. Sarah Johnson",
                "work_hours": "9:00 AM - 5:00 PM",
                "probation_period": "3 months",
                "probation_end_date": "2023-05-10"
            }
        }
    ]
    
    supabase.table("staff").insert(staff).execute()
    print("Staff seeded successfully!")

def seed_system_logs():
    """Seed system logs"""
    print("Seeding system logs...")
    
    # Check if logs already exist
    existing = supabase.table("system_logs").select("*").execute()
    if existing.data and len(existing.data) > 10:
        print(f"Found {len(existing.data)} existing system logs. Skipping log seeding.")
        return
    
    # Get clients
    clients_query = supabase.table("clients").select("id, name").execute()
    clients = clients_query.data
    
    # Calculate dates
    now = datetime.now()
    
    logs = []
    log_types = ["api", "error", "auth", "module"]
    actions = [
        {"type": "api", "action": "API rate limit exceeded"},
        {"type": "api", "action": "API key rotated"},
        {"type": "error", "action": "Database connection error"},
        {"type": "error", "action": "Payment processing failed"},
        {"type": "auth", "action": "Admin login successful"},
        {"type": "auth", "action": "Failed login attempt"},
        {"type": "auth", "action": "Password reset requested"},
        {"type": "module", "action": "Module enabled"},
        {"type": "module", "action": "Module disabled"}
    ]
    ip_addresses = ["192.168.1.101", "192.168.1.102", "192.168.1.103", "192.168.1.104"]
    
    # Generate logs for the past 7 days
    for i in range(50):
        date = now - timedelta(days=random.randint(0, 7), 
                              hours=random.randint(0, 23), 
                              minutes=random.randint(0, 59))
        
        include_client = random.random() > 0.2  # Some logs might be system-wide
        client = random.choice(clients) if include_client and clients else None
        
        type_index = random.randint(0, len(log_types) - 1)
        log_type = log_types[type_index]
        
        action_options = [a for a in actions if a["type"] == log_type]
        action_index = random.randint(0, len(action_options) - 1)
        action = action_options[action_index]["action"]
        
        log = {
            "id": f"system-{i}",
            "timestamp": date.isoformat(),
            "type": log_type,
            "action": action,
            "details": f"Details for {action} - Log ID: system-{i}",
            "ip_address": random.choice(ip_addresses)
        }
        
        if client:
            log["client_id"] = client["id"]
            log["client_name"] = client["name"]
            
        logs.append(log)
    
    supabase.table("system_logs").insert(logs).execute()
    print("System logs seeded successfully!")

def seed_support_tickets():
    """Seed support tickets"""
    print("Seeding support tickets...")
    
    # Check if tickets already exist
    existing = supabase.table("support_tickets").select("*").execute()
    if existing.data:
        print(f"Found {len(existing.data)} existing support tickets. Skipping ticket seeding.")
        return
    
    # Get clients
    clients_query = supabase.table("clients").select("id, name, contact_name, contact_email, contact_phone").execute()
    clients = clients_query.data
    
    if not clients:
        print("No clients found. Skipping support ticket seeding.")
        return
    
    # Calculate dates
    now = datetime.now()
    
    tickets = []
    subjects = [
        "Unable to access patient records",
        "Billing module not working",
        "Need help with report generation",
        "System is slow during peak hours"
    ]
    priorities = ["low", "medium", "high", "critical"]
    statuses = ["open", "in-progress", "resolved", "closed"]
    
    for i in range(5):
        client = random.choice(clients)
        subject_index = random.randint(0, len(subjects) - 1)
        priority_index = random.randint(0, len(priorities) - 1)
        status_index = random.randint(0, len(statuses) - 1)
        
        created_date = now - timedelta(days=random.randint(1, 30))
        updated_date = created_date + timedelta(hours=random.randint(1, 48))
        
        ticket_id = f"ticket-{i}"
        
        # Create messages
        messages = []
        message_count = random.randint(1, 5)
        
        for j in range(message_count):
            message_date = created_date + timedelta(hours=j * 4)
            
            messages.append({
                "id": f"msg-{i}-{j}",
                "ticket_id": ticket_id,
                "message": f"This is message {j + 1} for ticket {i}. {'Client message explaining the issue in detail.' if j % 2 == 0 else 'Support response with troubleshooting steps or resolution.'}",
                "sender": "client" if j % 2 == 0 else "support",
                "sender_name": client["contact_name"] if j % 2 == 0 else "Support Agent",
                "timestamp": message_date.isoformat()
            })
        
        ticket = {
            "id": ticket_id,
            "client_id": client["id"],
            "client_name": client["name"],
            "subject": subjects[subject_index],
            "description": f"Detailed description for ticket regarding: {subjects[subject_index]}. The issue started occurring on {created_date.strftime('%Y-%m-%d')}.",
            "status": statuses[status_index],
            "priority": priorities[priority_index],
            "created_at": created_date.isoformat(),
            "updated_at": updated_date.isoformat(),
            "assigned_to": "Support Agent" if status_index > 0 else None,
            "contact_email": client["contact_email"],
            "contact_name": client["contact_name"],
            "contact_phone": client["contact_phone"],
            "messages": messages
        }
        
        tickets.append(ticket)
    
    # Insert tickets
    for ticket in tickets:
        messages = ticket.pop("messages")
        supabase.table("support_tickets").insert(ticket).execute()
        
        # Insert messages
        if messages:
            supabase.table("ticket_messages").insert(messages).execute()
    
    print("Support tickets seeded successfully!")

def create_tables():
    """Create necessary tables if they don't exist"""
    print("Checking and creating tables...")
    
    # This function would normally create tables via SQL
    # For Supabase, tables are typically created in the dashboard or via migrations
    # This is just a placeholder for demonstration purposes
    
    print("Tables should be created via Supabase dashboard or migrations.")
    print("Assuming tables already exist.")

def main():
    """Main seeding function"""
    print("Starting database seeding...")
    
    # Create tables (if using SQL directly)
    create_tables()
    
    # Seed clients
    client_id = seed_clients()
    
    # If no client_id returned, get the first client
    if not client_id:
        client_query = supabase.table("clients").select("id").eq("subdomain", "skinova").single().execute()
        if client_query.data:
            client_id = client_query.data["id"]
        else:
            print("No client found. Exiting.")
            return
    
    # Seed related data
    seed_branches(client_id)
    seed_users(client_id)
    seed_patients(client_id)
    seed_appointments(client_id)
    seed_procedures(client_id)
    seed_products(client_id)
    seed_invoices(client_id)
    seed_leads(client_id)
    seed_staff(client_id)
    
    # Seed system-wide data
    seed_system_logs()
    seed_support_tickets()
    
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    main()