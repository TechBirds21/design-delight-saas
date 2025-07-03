from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

doctor_bp = Blueprint("doctor", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "doctor" not in g.modules:
        return jsonify({"error": "Doctor module is not enabled for this tenant"}), 403
        
    return None

# Get doctor appointments
@doctor_bp.route("/doctor/appointments", methods=["GET"])
def get_doctor_appointments():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("appointments").select("*").eq("client_id", g.tenant_id)
        
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"patient_name.ilike.%{search}%,phone.ilike.%{search}%")
            
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        query = query.eq("date", today)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get patient details
@doctor_bp.route("/doctor/patients/<patient_id>", methods=["GET"])
def get_patient_details(patient_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get patient
        patient = supabase.table("patients").select("*").eq("id", patient_id).eq("client_id", g.tenant_id).single().execute()
        
        if not patient.data:
            return jsonify({"error": "Patient not found"}), 404
            
        # Get patient's visit history
        treatment_history = supabase.table("treatment_records").select("*").eq("patient_id", patient_id).eq("client_id", g.tenant_id).execute()
        
        # Get SOAP notes
        soap_notes = supabase.table("soap_notes").select("*").eq("patient_id", patient_id).eq("client_id", g.tenant_id).execute()
        
        # Combine data
        patient_data = patient.data
        patient_data["visit_history"] = treatment_history.data
        patient_data["soap_notes"] = soap_notes.data
        
        return jsonify(patient_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Submit SOAP note
@doctor_bp.route("/doctor/soap", methods=["POST"])
def submit_soap_note():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        soap_data = request.json
        
        # Generate SOAP note ID
        soap_id = str(uuid.uuid4())
        
        # Set timestamps and status
        now = datetime.now().isoformat()
        is_draft = soap_data.pop("isDraft", False)
        
        # Prepare SOAP note data
        soap_note = {
            "id": soap_id,
            "client_id": g.tenant_id,
            "created_at": now,
            "status": "draft" if is_draft else "submitted",
            **soap_data
        }
        
        # Insert SOAP note
        result = supabase.table("soap_notes").insert(soap_note).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Assign technician
@doctor_bp.route("/doctor/assign-technician", methods=["POST"])
def assign_technician():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        assignment_data = request.json
        
        # Generate assignment ID
        assignment_id = str(uuid.uuid4())
        
        # Prepare assignment data
        assignment = {
            "id": assignment_id,
            "client_id": g.tenant_id,
            "assigned_at": datetime.now().isoformat(),
            "status": "assigned",
            **assignment_data
        }
        
        # Insert assignment
        result = supabase.table("technician_assignments").insert(assignment).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Upload photo
@doctor_bp.route("/doctor/photos", methods=["POST"])
def upload_photo():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would handle file upload to storage
        # For this demo, we'll just create a record
        
        patient_id = request.form.get("patientId")
        photo_type = request.form.get("type")
        session_id = request.form.get("sessionId")
        
        if not patient_id or not photo_type or not session_id:
            return jsonify({"error": "Patient ID, photo type, and session ID are required"}), 400
            
        # Generate photo ID
        photo_id = str(uuid.uuid4())
        
        # Mock file data
        file = request.files.get("file")
        file_name = file.filename if file else "photo.jpg"
        file_size = len(file.read()) if file else 0
        
        # Prepare photo data
        photo = {
            "id": photo_id,
            "client_id": g.tenant_id,
            "patient_id": patient_id,
            "type": photo_type,
            "session_id": session_id,
            "file_name": file_name,
            "file_size": file_size,
            "uploaded_at": datetime.now().isoformat(),
            "uploaded_by": "Dr. Sarah Johnson"  # In a real app, get from auth context
        }
        
        # Insert photo record
        result = supabase.table("patient_photos").insert(photo).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get treatment history
@doctor_bp.route("/doctor/treatment-history", methods=["GET"])
def get_treatment_history():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("treatment_records").select("*").eq("client_id", g.tenant_id)
        
        patient_id = request.args.get("patientId")
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        procedure = request.args.get("procedure")
        if procedure and procedure != "all":
            query = query.eq("procedure", procedure)
            
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        # Order by date (newest first)
        query = query.order("date", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get technicians
@doctor_bp.route("/doctor/technicians", methods=["GET"])
def get_technicians():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get technicians
        query = supabase.table("staff") \
              .select("id, name, specialization, available") \
              .eq("client_id", g.tenant_id) \
              .eq("role", "technician") \
              .eq("available", True) \
              .execute()
              
        return jsonify(query.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get procedures
@doctor_bp.route("/doctor/procedures", methods=["GET"])
def get_procedures():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would fetch from the database
        # For this demo, we'll return mock data
        procedures = [
            "Laser Hair Removal",
            "PRP Treatment",
            "Chemical Peel",
            "Microneedling",
            "Botox Injection",
            "Dermal Fillers",
            "Acne Treatment",
            "Pigmentation Treatment"
        ]
        
        return jsonify(procedures), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get doctor stats
@doctor_bp.route("/doctor/stats", methods=["GET"])
def get_doctor_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Get today's appointments
        appointments_query = supabase.table("appointments") \
                           .select("*") \
                           .eq("client_id", g.tenant_id) \
                           .eq("date", today) \
                           .execute()
                           
        # Get patients
        patients_query = supabase.table("patients") \
                       .select("id") \
                       .eq("client_id", g.tenant_id) \
                       .execute()
                       
        # Get treatment records
        treatments_query = supabase.table("treatment_records") \
                         .select("*") \
                         .eq("client_id", g.tenant_id) \
                         .execute()
                         
        # Calculate stats
        today_appointments = len(appointments_query.data)
        assigned_patients = len(patients_query.data)
        completed_today = len([apt for apt in appointments_query.data if apt["status"] == "completed"])
        total_treatments = len(treatments_query.data)
        
        stats = {
            "todayAppointments": today_appointments,
            "assignedPatients": assigned_patients,
            "completedSessions": completed_today,
            "totalTreatments": total_treatments
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update appointment status
@doctor_bp.route("/doctor/appointments/<appointment_id>/status", methods=["PATCH"])
def update_appointment_status(appointment_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        status = request.json.get("status")
        
        if not status:
            return jsonify({"error": "Status is required"}), 400
            
        # Update appointment
        result = supabase.table("appointments").update({
            "status": status
        }).eq("id", appointment_id).eq("client_id", g.tenant_id).execute()
        
        if not result.data:
            return jsonify({"error": "Appointment not found"}), 404
            
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500