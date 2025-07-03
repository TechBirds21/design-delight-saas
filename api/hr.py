from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime, timedelta

hr_bp = Blueprint("hr", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "hr" not in g.modules:
        return jsonify({"error": "HR module is not enabled for this tenant"}), 403
        
    return None

# Get all staff
@hr_bp.route("/hr/staff", methods=["GET"])
def get_all_staff():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("staff").select("*").eq("client_id", g.tenant_id)
        
        branch = request.args.get("branch")
        if branch and branch != "all":
            query = query.eq("branch", branch)
            
        role = request.args.get("role")
        if role and role != "all":
            query = query.eq("role", role)
            
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"name.ilike.%{search}%,email.ilike.%{search}%,phone.ilike.%{search}%")
            
        # Order by name
        query = query.order("name")
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get staff details
@hr_bp.route("/hr/staff/<staff_id>", methods=["GET"])
def get_staff_details(staff_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get staff
        staff = supabase.table("staff").select("*").eq("id", staff_id).eq("client_id", g.tenant_id).single().execute()
        
        if not staff.data:
            return jsonify({"error": "Staff member not found"}), 404
            
        # Get documents
        documents = supabase.table("staff_documents").select("*").eq("staff_id", staff_id).eq("client_id", g.tenant_id).execute()
        
        # Get shifts
        shifts = supabase.table("shifts").select("*").eq("staff_id", staff_id).eq("client_id", g.tenant_id).execute()
        
        # Get performance notes
        performance = supabase.table("performance_notes").select("*").eq("staff_id", staff_id).eq("client_id", g.tenant_id).execute()
        
        # Get salary structure
        salary = supabase.table("salary_structures").select("*").eq("staff_id", staff_id).eq("client_id", g.tenant_id).single().execute()
        
        # Combine data
        staff_data = staff.data
        staff_data["documents"] = documents.data
        staff_data["shifts"] = shifts.data
        staff_data["performance"] = performance.data
        staff_data["salary"] = salary.data
        
        return jsonify(staff_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add staff
@hr_bp.route("/hr/staff", methods=["POST"])
def add_staff():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        staff_data = request.json
        
        # Generate staff ID
        staff_id = str(uuid.uuid4())
        
        # Prepare staff data
        new_staff = {
            "id": staff_id,
            "client_id": g.tenant_id,
            **staff_data
        }
        
        # Insert staff
        result = supabase.table("staff").insert(new_staff).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update staff
@hr_bp.route("/hr/staff/<staff_id>", methods=["PATCH"])
def update_staff(staff_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        staff_data = request.json
        
        # Update staff
        result = supabase.table("staff").update(staff_data).eq("id", staff_id).eq("client_id", g.tenant_id).execute()
        
        if not result.data:
            return jsonify({"error": "Staff member not found"}), 404
            
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Upload staff document
@hr_bp.route("/hr/staff/<staff_id>/documents", methods=["POST"])
def upload_staff_document(staff_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would handle file upload to storage
        # For this demo, we'll just create a record
        
        document_type = request.form.get("type")
        document_name = request.form.get("name")
        expiry_date = request.form.get("expiryDate")
        notes = request.form.get("notes")
        
        if not document_type or not document_name:
            return jsonify({"error": "Document type and name are required"}), 400
            
        # Generate document ID
        document_id = str(uuid.uuid4())
        
        # Mock file data
        file = request.files.get("file")
        file_name = file.filename if file else "document.pdf"
        file_type = file.content_type if file else "application/pdf"
        
        # Prepare document data
        document = {
            "id": document_id,
            "client_id": g.tenant_id,
            "staff_id": staff_id,
            "type": document_type,
            "name": document_name,
            "file_name": file_name,
            "file_type": file_type,
            "uploaded_at": datetime.now().isoformat(),
            "expiry_date": expiry_date,
            "notes": notes
        }
        
        # Insert document record
        result = supabase.table("staff_documents").insert(document).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get attendance log
@hr_bp.route("/hr/attendance/<staff_id>", methods=["GET"])
def get_attendance_log(staff_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get filter parameters
        month = request.args.get("month")
        year = request.args.get("year")
        
        # Build query
        query = supabase.table("attendance").select("*").eq("staff_id", staff_id).eq("client_id", g.tenant_id)
        
        # Filter by month and year if provided
        if month and year:
            filter_date = f"{year}-{month.zfill(2)}"
            query = query.ilike("date", f"{filter_date}%")
            
        # Order by date (newest first)
        query = query.order("date", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Log performance
@hr_bp.route("/hr/staff/<staff_id>/performance", methods=["POST"])
def log_performance(staff_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        performance_data = request.json
        
        # Check if staff exists
        staff = supabase.table("staff").select("id").eq("id", staff_id).eq("client_id", g.tenant_id).single().execute()
        
        if not staff.data:
            return jsonify({"error": "Staff member not found"}), 404
            
        # Generate performance note ID
        note_id = str(uuid.uuid4())
        
        # Prepare performance note data
        note = {
            "id": note_id,
            "client_id": g.tenant_id,
            "staff_id": staff_id,
            "added_by": "Current User",  # In a real app, get from auth context
            **performance_data
        }
        
        # Insert performance note
        result = supabase.table("performance_notes").insert(note).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get HR stats
@hr_bp.route("/hr/stats", methods=["GET"])
def get_hr_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get staff
        staff_query = supabase.table("staff").select("*").eq("client_id", g.tenant_id).execute()
        staff = staff_query.data
        
        # Get today's attendance
        today = datetime.now().strftime("%Y-%m-%d")
        attendance_query = supabase.table("attendance").select("*").eq("client_id", g.tenant_id).eq("date", today).execute()
        
        # Calculate stats
        total_staff = len(staff)
        
        # Staff on leave today
        on_leave_today = len([a for a in attendance_query.data if a["status"] == "leave"])
        
        # New joins this month
        current_month = datetime.now().strftime("%Y-%m")
        new_joins_this_month = len([s for s in staff if s["join_date"].startswith(current_month)])
        
        # Upcoming reviews (mock data)
        upcoming_reviews = 3
        
        # Department counts
        department_counts = {}
        for s in staff:
            dept = s["department"]
            if dept not in department_counts:
                department_counts[dept] = 0
            department_counts[dept] += 1
            
        # Branch counts
        branch_counts = {}
        for s in staff:
            branch = s["branch"]
            if branch not in branch_counts:
                branch_counts[branch] = 0
            branch_counts[branch] += 1
            
        stats = {
            "totalStaff": total_staff,
            "onLeaveToday": on_leave_today,
            "newJoinsThisMonth": new_joins_this_month,
            "upcomingReviews": upcoming_reviews,
            "departmentCounts": department_counts,
            "branchCounts": branch_counts
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500