from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

tech_bp = Blueprint("technician", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "technician" not in g.modules:
        return jsonify({"error": "Technician module is not enabled for this tenant"}), 403
        
    return None

# Get assigned procedures
@tech_bp.route("/technician/procedures", methods=["GET"])
def get_assigned_procedures():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("procedures").select("*").eq("client_id", g.tenant_id)
        
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"patient_name.ilike.%{search}%,procedure.ilike.%{search}%,assigned_by.ilike.%{search}%")
            
        # Order by scheduled time
        query = query.order("scheduled_time")
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get procedure details
@tech_bp.route("/technician/procedures/<procedure_id>", methods=["GET"])
def get_procedure_details(procedure_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("procedures").select("*").eq("id", procedure_id).eq("client_id", g.tenant_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Procedure not found"}), 404
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start session
@tech_bp.route("/technician/procedures/<procedure_id>/start", methods=["POST"])
def start_session(procedure_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get procedure
        procedure = supabase.table("procedures").select("*").eq("id", procedure_id).eq("client_id", g.tenant_id).single().execute()
        
        if not procedure.data:
            return jsonify({"error": "Procedure not found"}), 404
            
        # Update procedure
        result = supabase.table("procedures").update({
            "status": "in-progress",
            "start_time": datetime.now().isoformat()
        }).eq("id", procedure_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Complete session
@tech_bp.route("/technician/procedures/<procedure_id>/complete", methods=["POST"])
def complete_session(procedure_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        completion_data = request.json
        
        # Get procedure
        procedure = supabase.table("procedures").select("*").eq("id", procedure_id).eq("client_id", g.tenant_id).single().execute()
        
        if not procedure.data:
            return jsonify({"error": "Procedure not found"}), 404
            
        # Update procedure
        now = datetime.now().isoformat()
        
        completed_procedure = supabase.table("procedures").update({
            "status": "completed",
            "end_time": now,
            "completion_notes": completion_data.get("notes"),
            "actual_duration": completion_data.get("actualDuration")
        }).eq("id", procedure_id).execute()
        
        # Add to session history
        history_id = str(uuid.uuid4())
        
        history_entry = {
            "id": history_id,
            "client_id": g.tenant_id,
            "patient_id": procedure.data["patient_id"],
            "patient_name": procedure.data["patient_name"],
            "procedure": procedure.data["procedure"],
            "duration": completion_data.get("actualDuration") or procedure.data["duration"],
            "assigned_by": procedure.data["assigned_by"],
            "date": procedure.data["date"],
            "start_time": procedure.data["start_time"],
            "end_time": now,
            "status": "completed",
            "notes": completion_data.get("notes")
        }
        
        supabase.table("session_history").insert(history_entry).execute()
        
        return jsonify(completed_procedure.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get session history
@tech_bp.route("/technician/history", methods=["GET"])
def get_session_history():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("session_history").select("*").eq("client_id", g.tenant_id)
        
        date_from = request.args.get("dateFrom")
        date_to = request.args.get("dateTo")
        
        if date_from and date_to:
            query = query.gte("date", date_from).lte("date", date_to)
            
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        doctor = request.args.get("doctor")
        if doctor and doctor != "all":
            query = query.eq("assigned_by", doctor)
            
        procedure = request.args.get("procedure")
        if procedure and procedure != "all":
            query = query.eq("procedure", procedure)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"patient_name.ilike.%{search}%,procedure.ilike.%{search}%,assigned_by.ilike.%{search}%")
            
        # Order by date (newest first)
        query = query.order("date", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get technician stats
@tech_bp.route("/technician/stats", methods=["GET"])
def get_technician_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Get procedures
        procedures_query = supabase.table("procedures").select("*").eq("client_id", g.tenant_id).eq("date", today).execute()
        procedures = procedures_query.data
        
        # Get session history
        history_query = supabase.table("session_history").select("*").eq("client_id", g.tenant_id).execute()
        
        # Calculate stats
        assigned_today = len(procedures)
        completed_today = len([p for p in procedures if p["status"] == "completed"])
        
        # Calculate missed/delayed
        now = datetime.now()
        missed_delayed = len([
            p for p in procedures 
            if p["status"] == "pending" and 
            datetime.fromisoformat(f"{p['date']}T{p['scheduled_time']}:00") < now
        ])
        
        total_history = len(history_query.data)
        
        stats = {
            "assignedToday": assigned_today,
            "completedSessions": completed_today,
            "missedDelayed": missed_delayed,
            "totalHistory": total_history
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get procedure types
@tech_bp.route("/technician/procedure-types", methods=["GET"])
def get_procedure_types():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would fetch from the database
        # For this demo, we'll return mock data
        procedure_types = [
            "Laser Hair Removal",
            "PRP Treatment",
            "Chemical Peel",
            "Microneedling",
            "Botox Injection",
            "Dermal Fillers",
            "Acne Treatment",
            "Pigmentation Treatment",
            "Hydrafacial",
            "LED Light Therapy"
        ]
        
        return jsonify(procedure_types), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get doctors
@tech_bp.route("/technician/doctors", methods=["GET"])
def get_doctors():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get doctors
        result = supabase.table("staff") \
               .select("id, name") \
               .eq("client_id", g.tenant_id) \
               .eq("role", "doctor") \
               .execute()
               
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500