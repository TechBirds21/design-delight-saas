from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

photo_bp = Blueprint("photo_manager", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "photo_manager" not in g.modules:
        return jsonify({"error": "Photo Manager module is not enabled for this tenant"}), 403
        
    return None

# Get all patient photos
@photo_bp.route("/photo-manager/photos", methods=["GET"])
def get_all_patient_photos():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("patient_photos").select("*").eq("client_id", g.tenant_id)
        
        patient_id = request.args.get("patientId")
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        session_id = request.args.get("sessionId")
        if session_id:
            query = query.eq("session_id", session_id)
            
        photo_type = request.args.get("type")
        if photo_type:
            query = query.eq("type", photo_type)
            
        date_from = request.args.get("dateFrom")
        date_to = request.args.get("dateTo")
        
        if date_from and date_to:
            query = query.gte("session_date", date_from).lte("session_date", date_to)
            
        # Order by upload date (newest first)
        query = query.order("uploaded_at", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get photo sessions
@photo_bp.route("/photo-manager/sessions", methods=["GET"])
def get_photo_sessions():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("photo_sessions").select("*").eq("client_id", g.tenant_id)
        
        patient_id = request.args.get("patientId")
        if patient_id:
            query = query.eq("patient_id", patient_id)
            
        # Order by date (newest first)
        query = query.order("date", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get photo stats
@photo_bp.route("/photo-manager/stats", methods=["GET"])
def get_photo_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get photos
        photos_query = supabase.table("patient_photos").select("*").eq("client_id", g.tenant_id).execute()
        photos = photos_query.data
        
        # Get sessions
        sessions_query = supabase.table("photo_sessions").select("*").eq("client_id", g.tenant_id).execute()
        sessions = sessions_query.data
        
        # Calculate stats
        total_images = len(photos)
        
        # Count unique patients
        patients_with_photos = len(set([photo["patient_id"] for photo in photos]))
        
        # Count sessions with both before and after photos
        before_after_sets = len([
            session for session in sessions 
            if session["before_count"] > 0 and session["after_count"] > 0
        ])
        
        # Count photos uploaded today
        today = datetime.now().strftime("%Y-%m-%d")
        uploaded_today = len([
            photo for photo in photos 
            if photo["uploaded_at"].startswith(today)
        ])
        
        stats = {
            "totalImages": total_images,
            "patientsWithPhotos": patients_with_photos,
            "beforeAfterSets": before_after_sets,
            "uploadedToday": uploaded_today
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Upload patient photo
@photo_bp.route("/photo-manager/photos", methods=["POST"])
def upload_patient_photo():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would handle file upload to storage
        # For this demo, we'll just create a record
        
        patient_id = request.form.get("patientId")
        session_id = request.form.get("sessionId")
        photo_type = request.form.get("type")
        notes = request.form.get("notes")
        
        if not patient_id or not session_id or not photo_type:
            return jsonify({"error": "Patient ID, session ID, and photo type are required"}), 400
            
        # Get or create session
        session = supabase.table("photo_sessions").select("*").eq("id", session_id).eq("client_id", g.tenant_id).single().execute()
        
        if not session.data:
            # Create new session
            session_data = {
                "id": session_id,
                "client_id": g.tenant_id,
                "patient_id": patient_id,
                "patient_name": "Unknown Patient",  # This would be fetched from patient data in a real app
                "date": datetime.now().strftime("%Y-%m-%d"),
                "procedure": "Unknown Procedure",
                "doctor_id": "dr1",
                "doctor_name": "Dr. Sarah Johnson",
                "before_count": 1 if photo_type == "before" else 0,
                "after_count": 1 if photo_type == "after" else 0,
                "in_progress_count": 1 if photo_type == "in-progress" else 0
            }
            
            supabase.table("photo_sessions").insert(session_data).execute()
            session_obj = session_data
        else:
            # Update existing session
            session_obj = session.data
            update_data = {}
            
            if photo_type == "before":
                update_data["before_count"] = session_obj["before_count"] + 1
            elif photo_type == "after":
                update_data["after_count"] = session_obj["after_count"] + 1
            else:
                update_data["in_progress_count"] = session_obj["in_progress_count"] + 1
                
            supabase.table("photo_sessions").update(update_data).eq("id", session_id).execute()
            
            # Update session object for response
            session_obj = {**session_obj, **update_data}
            
        # Generate photo ID
        photo_id = str(uuid.uuid4())
        
        # Mock file data
        file = request.files.get("file")
        file_name = file.filename if file else "photo.jpg"
        
        # In a real app, we would upload the file to storage and get URLs
        # For this demo, we'll use placeholder URLs
        image_url = "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=800"
        thumbnail_url = "https://images.pexels.com/photos/3764119/pexels-photo-3764119.jpeg?auto=compress&cs=tinysrgb&w=200"
        
        # Prepare photo data
        photo = {
            "id": photo_id,
            "client_id": g.tenant_id,
            "patient_id": patient_id,
            "patient_name": session_obj["patient_name"],
            "session_id": session_id,
            "session_date": session_obj["date"],
            "type": photo_type,
            "image_url": image_url,
            "thumbnail_url": thumbnail_url,
            "uploaded_by": "Current User",  # In a real app, get from auth context
            "uploaded_at": datetime.now().isoformat(),
            "notes": notes,
            "doctor_id": session_obj["doctor_id"],
            "doctor_name": session_obj["doctor_name"]
        }
        
        # Insert photo
        result = supabase.table("patient_photos").insert(photo).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete photo
@photo_bp.route("/photo-manager/photos/<photo_id>", methods=["DELETE"])
def delete_photo(photo_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get photo
        photo = supabase.table("patient_photos").select("*").eq("id", photo_id).eq("client_id", g.tenant_id).single().execute()
        
        if not photo.data:
            return jsonify({"error": "Photo not found"}), 404
            
        # Get session
        session_id = photo.data["session_id"]
        session = supabase.table("photo_sessions").select("*").eq("id", session_id).eq("client_id", g.tenant_id).single().execute()
        
        if session.data:
            # Update session counts
            update_data = {}
            
            if photo.data["type"] == "before":
                update_data["before_count"] = max(0, session.data["before_count"] - 1)
            elif photo.data["type"] == "after":
                update_data["after_count"] = max(0, session.data["after_count"] - 1)
            else:
                update_data["in_progress_count"] = max(0, session.data["in_progress_count"] - 1)
                
            # Update session
            supabase.table("photo_sessions").update(update_data).eq("id", session_id).execute()
            
            # If no photos left, remove session
            if (update_data.get("before_count", session.data["before_count"]) == 0 and
                update_data.get("after_count", session.data["after_count"]) == 0 and
                update_data.get("in_progress_count", session.data["in_progress_count"]) == 0):
                supabase.table("photo_sessions").delete().eq("id", session_id).execute()
                
        # Delete photo
        supabase.table("patient_photos").delete().eq("id", photo_id).execute()
        
        return jsonify({"message": "Photo deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500