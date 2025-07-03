from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime, timedelta

super_admin_bp = Blueprint("super_admin", __name__)

# Middleware to check if user is super admin
def require_super_admin():
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
        
    token = auth_header.split(" ")[1]
    
    try:
        # Verify token and get user
        user = supabase.auth.get_user(token)
        
        if not user:
            return jsonify({"error": "Invalid token"}), 401
            
        # Get user profile
        profile = supabase.table("user_profiles").select("*") \
                .eq("auth_user_id", user.user.id).single().execute()
                
        if not profile.data or profile.data["role"] != "super_admin":
            return jsonify({"error": "Unauthorized - Super Admin access required"}), 403
            
        return None
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all clients
@super_admin_bp.route("/super-admin/clients", methods=["GET"])
def get_all_clients():
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        # Apply filters if provided
        query = supabase.table("clients").select("*")
        
        plan = request.args.get("plan")
        if plan and plan != "all":
            query = query.eq("plan", plan)
            
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"name.ilike.%{search}%,subdomain.ilike.%{search}%,contact_name.ilike.%{search}%,contact_email.ilike.%{search}%")
            
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get client details
@super_admin_bp.route("/super-admin/clients/<client_id>", methods=["GET"])
def get_client_details(client_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        result = supabase.table("clients").select("*").eq("id", client_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Client not found"}), 404
            
        # Get client branches
        branches = supabase.table("client_branches").select("*").eq("client_id", client_id).execute()
        
        # Combine data
        client_data = result.data
        client_data["branches"] = branches.data
        
        return jsonify(client_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create new client
@super_admin_bp.route("/super-admin/clients", methods=["POST"])
def create_client():
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        data = request.json
        
        # Generate client ID
        client_id = str(uuid.uuid4())
        
        # Set created_at and expires_at
        now = datetime.now()
        created_at = now.isoformat()
        
        # Default expiry is 1 year from now
        expires_at = (now + timedelta(days=365)).isoformat()
        
        # Prepare client data
        client_data = {
            "id": client_id,
            "name": data.get("name"),
            "subdomain": data.get("subdomain"),
            "logo": data.get("logo"),
            "plan": data.get("plan", "basic"),
            "status": data.get("status", "active"),
            "created_at": created_at,
            "expires_at": expires_at,
            "contact_name": data.get("contact_name"),
            "contact_email": data.get("contact_email"),
            "contact_phone": data.get("contact_phone"),
            "modules": data.get("modules", {}),
            "api_usage": 0,
            "active_users": 0
        }
        
        # Insert client
        client_result = supabase.table("clients").insert(client_data).execute()
        
        # Insert branches if provided
        branches = data.get("branches", [])
        if branches:
            for branch in branches:
                branch["client_id"] = client_id
                branch["created_at"] = created_at
                
            supabase.table("client_branches").insert(branches).execute()
        
        return jsonify(client_result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update client modules
@super_admin_bp.route("/super-admin/clients/<client_id>/modules", methods=["PATCH"])
def toggle_client_module(client_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        module = request.json.get("module")
        enabled = request.json.get("enabled")
        
        if not module:
            return jsonify({"error": "Module name is required"}), 400
            
        # Get current client data
        client = supabase.table("clients").select("*").eq("id", client_id).single().execute()
        
        if not client.data:
            return jsonify({"error": "Client not found"}), 404
            
        # Update modules
        modules = client.data.get("modules", {})
        modules[module] = enabled
        
        # Update client
        result = supabase.table("clients").update({"modules": modules}).eq("id", client_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Set client dashboards
@super_admin_bp.route("/super-admin/clients/<client_id>/dashboards", methods=["PATCH"])
def set_client_dashboards(client_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        dashboards = request.json.get("dashboards", [])
        
        # Get current client data
        client = supabase.table("clients").select("*").eq("id", client_id).single().execute()
        
        if not client.data:
            return jsonify({"error": "Client not found"}), 404
            
        # Update modules based on dashboards
        modules = client.data.get("modules", {})
        
        # First, disable all dashboard modules except dashboard itself
        for key in modules:
            if key != "dashboard":
                modules[key] = False
                
        # Then enable selected dashboards
        for dashboard in dashboards:
            modules[dashboard] = True
            
        # Update client
        result = supabase.table("clients").update({"modules": modules}).eq("id", client_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Assign role permissions
@super_admin_bp.route("/super-admin/clients/<client_id>/roles", methods=["PATCH"])
def assign_role_permissions(client_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        role = request.json.get("role")
        permissions = request.json.get("permissions", [])
        
        if not role:
            return jsonify({"error": "Role is required"}), 400
            
        # Get current client data
        client = supabase.table("clients").select("*").eq("id", client_id).single().execute()
        
        if not client.data:
            return jsonify({"error": "Client not found"}), 404
            
        # Update role permissions
        role_permissions = client.data.get("role_permissions", {})
        role_permissions[role] = permissions
        
        # Update client
        result = supabase.table("clients").update({"role_permissions": role_permissions}).eq("id", client_id).execute()
        
        return jsonify({"role": role, "permissions": permissions}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update client status
@super_admin_bp.route("/super-admin/clients/<client_id>/status", methods=["PATCH"])
def update_client_status(client_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        status = request.json.get("status")
        
        if not status:
            return jsonify({"error": "Status is required"}), 400
            
        # Update client
        result = supabase.table("clients").update({"status": status}).eq("id", client_id).execute()
        
        if not result.data:
            return jsonify({"error": "Client not found"}), 404
            
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get client usage logs
@super_admin_bp.route("/super-admin/clients/<client_id>/logs", methods=["GET"])
def get_client_usage_logs(client_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        # Apply filters if provided
        query = supabase.table("usage_logs").select("*").eq("client_id", client_id)
        
        date_from = request.args.get("date_from")
        date_to = request.args.get("date_to")
        
        if date_from and date_to:
            query = query.gte("timestamp", date_from).lte("timestamp", date_to)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"endpoint.ilike.%{search}%,method.ilike.%{search}%,ip_address.ilike.%{search}%")
            
        # Order by timestamp (newest first)
        query = query.order("timestamp", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get system logs
@super_admin_bp.route("/super-admin/logs", methods=["GET"])
def get_system_logs():
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        # Apply filters if provided
        query = supabase.table("system_logs").select("*")
        
        client_id = request.args.get("client_id")
        if client_id:
            query = query.eq("client_id", client_id)
            
        log_type = request.args.get("type")
        if log_type and log_type != "all":
            query = query.eq("type", log_type)
            
        date_from = request.args.get("date_from")
        date_to = request.args.get("date_to")
        
        if date_from and date_to:
            query = query.gte("timestamp", date_from).lte("timestamp", date_to)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"action.ilike.%{search}%,details.ilike.%{search}%,ip_address.ilike.%{search}%")
            
        # Order by timestamp (newest first)
        query = query.order("timestamp", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get support tickets
@super_admin_bp.route("/super-admin/support", methods=["GET"])
def get_support_tickets():
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        # Apply filters if provided
        query = supabase.table("support_tickets").select("*")
        
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        # Order by updated_at (newest first)
        query = query.order("updated_at", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get support ticket details
@super_admin_bp.route("/super-admin/support/<ticket_id>", methods=["GET"])
def get_support_ticket_details(ticket_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        # Get ticket
        ticket = supabase.table("support_tickets").select("*").eq("id", ticket_id).single().execute()
        
        if not ticket.data:
            return jsonify({"error": "Support ticket not found"}), 404
            
        # Get ticket messages
        messages = supabase.table("ticket_messages").select("*").eq("ticket_id", ticket_id).order("timestamp", desc=False).execute()
        
        # Combine data
        ticket_data = ticket.data
        ticket_data["messages"] = messages.data
        
        return jsonify(ticket_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update support ticket
@super_admin_bp.route("/super-admin/support/<ticket_id>", methods=["PATCH"])
def update_support_ticket(ticket_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        updates = request.json
        
        # Update ticket
        result = supabase.table("support_tickets").update({
            **updates,
            "updated_at": datetime.now().isoformat()
        }).eq("id", ticket_id).execute()
        
        if not result.data:
            return jsonify({"error": "Support ticket not found"}), 404
            
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add support ticket message
@super_admin_bp.route("/super-admin/support/<ticket_id>/messages", methods=["POST"])
def add_support_ticket_message(ticket_id):
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        message = request.json.get("message")
        sender = request.json.get("sender")
        sender_name = request.json.get("sender_name")
        
        if not message or not sender or not sender_name:
            return jsonify({"error": "Message, sender, and sender name are required"}), 400
            
        # Add message
        message_data = {
            "id": str(uuid.uuid4()),
            "ticket_id": ticket_id,
            "message": message,
            "sender": sender,
            "sender_name": sender_name,
            "timestamp": datetime.now().isoformat()
        }
        
        message_result = supabase.table("ticket_messages").insert(message_data).execute()
        
        # Update ticket updated_at
        supabase.table("support_tickets").update({
            "updated_at": datetime.now().isoformat()
        }).eq("id", ticket_id).execute()
        
        # Get updated ticket with messages
        ticket = supabase.table("support_tickets").select("*").eq("id", ticket_id).single().execute()
        messages = supabase.table("ticket_messages").select("*").eq("ticket_id", ticket_id).order("timestamp", desc=False).execute()
        
        ticket_data = ticket.data
        ticket_data["messages"] = messages.data
        
        return jsonify(ticket_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get super admin stats
@super_admin_bp.route("/super-admin/stats", methods=["GET"])
def get_super_admin_stats():
    auth_error = require_super_admin()
    if auth_error:
        return auth_error
        
    try:
        # Get all clients
        clients = supabase.table("clients").select("*").execute()
        
        # Get today's API hits
        today = datetime.now().strftime("%Y-%m-%d")
        api_hits = supabase.table("usage_logs").select("id").gte("timestamp", f"{today}T00:00:00").execute()
        
        # Get open support tickets
        open_tickets = supabase.table("support_tickets").select("id").in_("status", ["open", "in-progress"]).execute()
        
        # Calculate stats
        total_clients = len(clients.data)
        active_subscriptions = len([c for c in clients.data if c["status"] in ["active", "trial"]])
        api_hits_today = len(api_hits.data)
        inactive_trial_clinics = len([c for c in clients.data if c["status"] in ["inactive", "trial"]])
        
        # Calculate revenue
        revenue_this_month = sum([
            999 if c["plan"] == "enterprise" else
            299 if c["plan"] == "professional" else
            99 if c["plan"] == "basic" else 0
            for c in clients.data if c["status"] == "active"
        ])
        
        # Calculate total users
        total_users = sum([c.get("active_users", 0) for c in clients.data])
        
        # Return stats
        stats = {
            "totalClinics": total_clients,
            "activeSubscriptions": active_subscriptions,
            "apiHitsToday": api_hits_today,
            "inactiveTrialClinics": inactive_trial_clinics,
            "revenueThisMonth": revenue_this_month,
            "totalUsers": total_users,
            "openSupportTickets": len(open_tickets.data)
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500