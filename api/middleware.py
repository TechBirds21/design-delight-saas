from flask import request, g
from .extensions import supabase

def resolve_tenant():
    """
    BEFORE every request:
    1. Get sub-domain  →  skinova.hospverse.com  =>  'skinova'
    2. Lookup clients table → grab client_id + modules_enabled
    3. Store on flask.g   (g.tenant_id, g.modules)
    """
    host = request.headers.get("Host", "")
    
    # Skip tenant resolution for super admin endpoints
    if request.path.startswith("/api/super-admin"):
        g.tenant_id = None
        g.modules = []
        return
        
    # Local development handling
    if "localhost" in host or "127.0.0.1" in host:
        # For local testing, use a query param to simulate subdomain
        sub = request.args.get("tenant", "skinova")
        
        # For local development, always use mock data for 'skinova' tenant
        if sub == "skinova":
            g.tenant_id = "00000000-0000-0000-0000-000000000000"
            g.modules = ["reception", "doctor", "billing", "inventory", "hr", "crm", "photo-manager", "technician", "payroll"]
            g.client_data = {
                "id": "00000000-0000-0000-0000-000000000000",
                "name": "Skinova Clinic (Dev)",
                "subdomain": "skinova",
                "logo": None,
                "plan": "enterprise",
                "status": "active",
                "contact_name": "Dev Admin",
                "contact_email": "admin@skinova.dev",
                "contact_phone": "+1234567890",
                "modules_enabled": ["reception", "doctor", "billing", "inventory", "hr", "crm", "photo-manager", "technician", "payroll"],
                "role_permissions": {},
                "api_usage": 0,
                "active_users": 1,
                "max_users": 100,
                "max_storage_mb": 10000
            }
            return
    else:
        # Production - extract subdomain
        sub = host.split(".")[0]
    
    try:
        data = supabase.table("clients").select("*").eq("subdomain", sub).single().execute()
        if data.data is None:
            g.tenant_id = None
            g.modules = []
            g.client_data = None
        else:
            g.tenant_id = data.data["id"]
            g.modules = data.data["modules_enabled"]
            g.client_data = data.data
    except Exception as e:
        print(f"Error resolving tenant: {e}")
        g.tenant_id = None
        g.modules = []
        g.client_data = None