from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

crm_bp = Blueprint("crm", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "crm" not in g.modules:
        return jsonify({"error": "CRM module is not enabled for this tenant"}), 403
        
    return None

# Get all leads
@crm_bp.route("/crm/leads", methods=["GET"])
def get_leads():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("leads").select("*").eq("client_id", g.tenant_id)
        
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        source = request.args.get("source")
        if source and source != "all":
            query = query.eq("source", source)
            
        assigned_to = request.args.get("assignedTo")
        if assigned_to and assigned_to != "all":
            query = query.eq("assigned_to", assigned_to)
            
        date_from = request.args.get("dateFrom")
        date_to = request.args.get("dateTo")
        
        if date_from and date_to:
            query = query.gte("created_at", date_from).lte("created_at", date_to)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"full_name.ilike.%{search}%,mobile.ilike.%{search}%,email.ilike.%{search}%")
            
        # Order by creation date (newest first)
        query = query.order("created_at", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add new lead
@crm_bp.route("/crm/leads", methods=["POST"])
def add_lead():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        lead_data = request.json
        
        # Generate lead ID
        lead_id = str(uuid.uuid4())
        
        # Set timestamps
        now = datetime.now().isoformat()
        
        # Prepare lead data
        new_lead = {
            "id": lead_id,
            "client_id": g.tenant_id,
            "status": "new",
            "created_at": now,
            "updated_at": now,
            "status_history": [
                {
                    "id": str(uuid.uuid4()),
                    "status": "new",
                    "changed_by": "System",
                    "changed_at": now,
                    "notes": f"Lead created from {lead_data.get('source')}"
                }
            ],
            "notes_history": lead_data.get("notes") ? [
                {
                    "id": str(uuid.uuid4()),
                    "note": lead_data.get("notes"),
                    "added_by": lead_data.get("assigned_to"),
                    "added_at": now
                }
            ] : [],
            **lead_data
        }
        
        # Insert lead
        result = supabase.table("leads").insert(new_lead).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get lead details
@crm_bp.route("/crm/leads/<lead_id>", methods=["GET"])
def get_lead(lead_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("leads").select("*").eq("id", lead_id).eq("client_id", g.tenant_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Lead not found"}), 404
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update lead status
@crm_bp.route("/crm/leads/<lead_id>/status", methods=["PATCH"])
def update_lead_status(lead_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        status = request.json.get("status")
        notes = request.json.get("notes")
        
        if not status:
            return jsonify({"error": "Status is required"}), 400
            
        # Get current lead
        lead = supabase.table("leads").select("*").eq("id", lead_id).eq("client_id", g.tenant_id).single().execute()
        
        if not lead.data:
            return jsonify({"error": "Lead not found"}), 404
            
        # Create status history entry
        now = datetime.now().isoformat()
        status_entry = {
            "id": str(uuid.uuid4()),
            "status": status,
            "changed_by": "Current User",  # In a real app, get from auth context
            "changed_at": now,
            "notes": notes
        }
        
        # Update lead
        status_history = lead.data.get("status_history", [])
        status_history.append(status_entry)
        
        update_data = {
            "status": status,
            "updated_at": now,
            "status_history": status_history
        }
        
        # If status is converted, set converted_at
        if status == "converted":
            update_data["converted_at"] = now
            
        result = supabase.table("leads").update(update_data).eq("id", lead_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add lead note
@crm_bp.route("/crm/leads/<lead_id>/notes", methods=["POST"])
def add_lead_note(lead_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        note = request.json.get("note")
        
        if not note:
            return jsonify({"error": "Note is required"}), 400
            
        # Get current lead
        lead = supabase.table("leads").select("*").eq("id", lead_id).eq("client_id", g.tenant_id).single().execute()
        
        if not lead.data:
            return jsonify({"error": "Lead not found"}), 404
            
        # Create note entry
        now = datetime.now().isoformat()
        note_entry = {
            "id": str(uuid.uuid4()),
            "note": note,
            "added_by": "Current User",  # In a real app, get from auth context
            "added_at": now
        }
        
        # Update lead
        notes_history = lead.data.get("notes_history", [])
        notes_history.append(note_entry)
        
        result = supabase.table("leads").update({
            "updated_at": now,
            "notes_history": notes_history
        }).eq("id", lead_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Convert lead to patient
@crm_bp.route("/crm/leads/<lead_id>/convert", methods=["POST"])
def convert_lead(lead_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get current lead
        lead = supabase.table("leads").select("*").eq("id", lead_id).eq("client_id", g.tenant_id).single().execute()
        
        if not lead.data:
            return jsonify({"error": "Lead not found"}), 404
            
        # Update lead status to converted
        now = datetime.now().isoformat()
        
        # Create status history entry
        status_entry = {
            "id": str(uuid.uuid4()),
            "status": "converted",
            "changed_by": "Current User",  # In a real app, get from auth context
            "changed_at": now,
            "notes": "Lead converted to patient"
        }
        
        status_history = lead.data.get("status_history", [])
        status_history.append(status_entry)
        
        lead_result = supabase.table("leads").update({
            "status": "converted",
            "updated_at": now,
            "converted_at": now,
            "status_history": status_history
        }).eq("id", lead_id).execute()
        
        # Create converted lead record
        patient_id = f"p{int(datetime.now().timestamp())}"
        
        converted_lead = {
            "id": str(uuid.uuid4()),
            "client_id": g.tenant_id,
            "lead_id": lead_id,
            "patient_id": patient_id,
            "full_name": lead.data["full_name"],
            "mobile": lead.data["mobile"],
            "email": lead.data.get("email"),
            "converted_at": now,
            "converted_by": "Current User",  # In a real app, get from auth context
            "source": lead.data["source"]
        }
        
        converted_result = supabase.table("converted_leads").insert(converted_lead).execute()
        
        return jsonify(converted_result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Drop lead
@crm_bp.route("/crm/leads/<lead_id>/drop", methods=["POST"])
def drop_lead(lead_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        reason = request.json.get("reason")
        
        if not reason:
            return jsonify({"error": "Reason is required"}), 400
            
        # Get current lead
        lead = supabase.table("leads").select("*").eq("id", lead_id).eq("client_id", g.tenant_id).single().execute()
        
        if not lead.data:
            return jsonify({"error": "Lead not found"}), 404
            
        # Update lead
        now = datetime.now().isoformat()
        
        # Create status history entry
        status_entry = {
            "id": str(uuid.uuid4()),
            "status": "dropped",
            "changed_by": "Current User",  # In a real app, get from auth context
            "changed_at": now,
            "notes": f"Lead dropped: {reason}"
        }
        
        status_history = lead.data.get("status_history", [])
        status_history.append(status_entry)
        
        result = supabase.table("leads").update({
            "status": "dropped",
            "updated_at": now,
            "drop_reason": reason,
            "status_history": status_history
        }).eq("id", lead_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get converted leads
@crm_bp.route("/crm/converted", methods=["GET"])
def get_converted_leads():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("converted_leads").select("*").eq("client_id", g.tenant_id).order("converted_at", desc=True).execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get CRM stats
@crm_bp.route("/crm/stats", methods=["GET"])
def get_crm_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get all leads
        leads_query = supabase.table("leads").select("*").eq("client_id", g.tenant_id).execute()
        leads = leads_query.data
        
        # Get converted leads
        converted_leads_query = supabase.table("converted_leads").select("*").eq("client_id", g.tenant_id).execute()
        
        # Calculate stats
        total_leads = len(leads)
        converted = len([lead for lead in leads if lead["status"] == "converted"])
        new_leads = len([lead for lead in leads if lead["status"] == "new"])
        contacted_leads = len([lead for lead in leads if lead["status"] == "contacted"])
        consulted_leads = len([lead for lead in leads if lead["status"] == "consulted"])
        dropped_leads = len([lead for lead in leads if lead["status"] == "dropped"])
        whatsapp_leads = len([lead for lead in leads if lead["source"] == "whatsapp"])
        
        # Calculate follow-ups due today (contacted leads that haven't been updated in 24 hours)
        one_day_ago = (datetime.now() - timedelta(days=1)).isoformat()
        follow_ups_due = len([
            lead for lead in leads 
            if lead["status"] == "contacted" and lead["updated_at"] < one_day_ago
        ])
        
        conversion_rate = round((converted / total_leads) * 100) if total_leads > 0 else 0
        
        stats = {
            "totalLeads": total_leads,
            "converted": converted,
            "followUpsDue": follow_ups_due,
            "whatsappLeads": whatsapp_leads,
            "conversionRate": conversion_rate,
            "newLeads": new_leads,
            "contactedLeads": contacted_leads,
            "consultedLeads": consulted_leads,
            "droppedLeads": dropped_leads
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get CRM users
@crm_bp.route("/crm/users", methods=["GET"])
def get_crm_users():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get users with CRM-related roles
        query = supabase.table("user_profiles") \
              .select("id, name, role") \
              .eq("client_id", g.tenant_id) \
              .in_("role", ["crm_manager", "lead_specialist", "customer_success", "sales_representative"]) \
              .eq("is_active", True) \
              .execute()
              
        return jsonify(query.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500