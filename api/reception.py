from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

reception_bp = Blueprint("reception", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "reception" not in g.modules:
        return jsonify({"error": "Reception module is not enabled for this tenant"}), 403
        
    return None

# Get today's appointments
@reception_bp.route("/reception/appointments/today", methods=["GET"])
def get_today_appointments():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Get appointments for today
        result = supabase.table("appointments").select("*").eq("client_id", g.tenant_id).eq("date", today).execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Register patient
@reception_bp.route("/reception/patients", methods=["POST"])
def register_patient():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        patient_data = request.json
        
        # Generate patient ID
        patient_id = str(uuid.uuid4())
        
        # Prepare patient data
        new_patient = {
            "id": patient_id,
            "client_id": g.tenant_id,
            "registered_at": datetime.now().isoformat(),
            **patient_data
        }
        
        # Insert patient
        result = supabase.table("patients").insert(new_patient).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Book appointment
@reception_bp.route("/reception/appointments", methods=["POST"])
def book_appointment():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        appointment_data = request.json
        
        # Generate appointment ID
        appointment_id = str(uuid.uuid4())
        
        # Get doctor name
        doctor_id = appointment_data.get("doctorId")
        doctor_query = supabase.table("staff").select("name").eq("id", doctor_id).single().execute()
        doctor_name = doctor_query.data["name"] if doctor_query.data else "Unknown Doctor"
        
        # Prepare appointment data
        new_appointment = {
            "id": appointment_id,
            "client_id": g.tenant_id,
            "doctor_name": doctor_name,
            "status": "confirmed",
            "booked_at": datetime.now().isoformat(),
            **appointment_data
        }
        
        # Insert appointment
        result = supabase.table("appointments").insert(new_appointment).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get queue list
@reception_bp.route("/reception/queue", methods=["GET"])
def get_queue_list():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("queue").select("*").eq("client_id", g.tenant_id).execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update patient status in queue
@reception_bp.route("/reception/queue/<patient_id>/status", methods=["PATCH"])
def update_patient_status(patient_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        new_status = request.json.get("status")
        
        if not new_status:
            return jsonify({"error": "Status is required"}), 400
            
        # Update patient status
        result = supabase.table("queue").update({
            "status": new_status
        }).eq("id", patient_id).eq("client_id", g.tenant_id).execute()
        
        if not result.data:
            return jsonify({"error": "Patient not found in queue"}), 404
            
        # Get updated queue
        queue = supabase.table("queue").select("*").eq("client_id", g.tenant_id).execute()
        
        return jsonify(queue.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add patient to queue
@reception_bp.route("/reception/queue", methods=["POST"])
def add_to_queue():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        patient_data = request.json
        
        # Generate queue entry ID
        entry_id = str(uuid.uuid4())
        
        # Get current queue to determine queue number
        queue_query = supabase.table("queue").select("*").eq("client_id", g.tenant_id).execute()
        queue_number = len(queue_query.data) + 1
        
        # Prepare queue entry data
        queue_entry = {
            "id": entry_id,
            "client_id": g.tenant_id,
            "status": "waiting",
            "checked_in_at": datetime.now().isoformat(),
            "queue_number": queue_number,
            **patient_data
        }
        
        # Insert queue entry
        result = supabase.table("queue").insert(queue_entry).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Upload consent form
@reception_bp.route("/reception/consent", methods=["POST"])
def upload_consent():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would handle file upload to storage
        # For this demo, we'll just create a record
        
        patient_id = request.form.get("patientId")
        patient_name = request.form.get("patientName")
        signature = request.form.get("signature")
        
        if not patient_id or not patient_name:
            return jsonify({"error": "Patient ID and name are required"}), 400
            
        # Generate consent form ID
        form_id = str(uuid.uuid4())
        
        # Mock file data
        file = request.files.get("file")
        file_type = file.content_type if file else "application/pdf"
        file_name = file.filename if file else "consent.pdf"
        
        # Prepare consent form data
        consent_form = {
            "id": form_id,
            "client_id": g.tenant_id,
            "patient_id": patient_id,
            "patient_name": patient_name,
            "file_type": file_type,
            "file_name": file_name,
            "signature": signature,
            "uploaded_at": datetime.now().isoformat()
        }
        
        # Insert consent form
        result = supabase.table("consent_forms").insert(consent_form).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get doctors
@reception_bp.route("/reception/doctors", methods=["GET"])
def get_doctors():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get doctors
        result = supabase.table("staff") \
               .select("id, name, specialization, available") \
               .eq("client_id", g.tenant_id) \
               .eq("role", "doctor") \
               .execute()
               
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get available time slots
@reception_bp.route("/reception/time-slots", methods=["GET"])
def get_available_time_slots():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        date = request.args.get("date")
        doctor_id = request.args.get("doctorId")
        
        if not date or not doctor_id:
            return jsonify({"error": "Date and doctor ID are required"}), 400
            
        # Get booked slots
        booked_query = supabase.table("appointments") \
                     .select("time") \
                     .eq("client_id", g.tenant_id) \
                     .eq("date", date) \
                     .eq("doctor_id", int(doctor_id)) \
                     .execute()
                     
        booked_slots = [appointment["time"] for appointment in booked_query.data]
        
        # All possible time slots
        all_slots = [
            "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
            "16:00", "16:30", "17:00", "17:30"
        ]
        
        # Filter out booked slots
        available_slots = [slot for slot in all_slots if slot not in booked_slots]
        
        return jsonify(available_slots), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get reception stats
@reception_bp.route("/reception/stats", methods=["GET"])
def get_reception_stats():
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
                           
        # Get today's registrations
        registrations_query = supabase.table("patients") \
                            .select("*") \
                            .eq("client_id", g.tenant_id) \
                            .gte("registered_at", f"{today}T00:00:00") \
                            .execute()
                            
        # Get queue
        queue_query = supabase.table("queue") \
                    .select("*") \
                    .eq("client_id", g.tenant_id) \
                    .execute()
                    
        # Calculate stats
        today_appointments = len(appointments_query.data)
        walk_ins_registered = len(registrations_query.data)
        patients_in_queue = len(queue_query.data)
        completed_appointments = len([a for a in appointments_query.data if a["status"] == "completed"])
        
        stats = {
            "todayAppointments": today_appointments,
            "walkInsRegistered": walk_ins_registered,
            "patientsInQueue": patients_in_queue,
            "completedAppointments": completed_appointments
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500