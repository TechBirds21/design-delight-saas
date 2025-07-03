from flask import Blueprint, request, jsonify, g
from .extensions import supabase

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    
    try:
        # Authenticate with Supabase Auth
        result = supabase.auth.sign_in_with_password({"email": email, "password": password})
        
        if not result.user:
            return jsonify({"error": "Invalid credentials"}), 401
            
        # Get user profile with role and client information
        profile = supabase.table("user_profiles").select("*") \
                .eq("auth_user_id", result.user.id).single().execute()
                
        if not profile.data:
            return jsonify({"error": "User profile not found"}), 404
            
        # Get client information and enabled modules
        client = None
        if profile.data.get("client_id"):
            client_result = supabase.table("clients").select("*") \
                        .eq("id", profile.data["client_id"]).single().execute()
            client = client_result.data
            
        return {
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token,
            "user": {
                "id": profile.data["id"],
                "auth_user_id": profile.data["auth_user_id"],
                "name": profile.data["name"],
                "email": email,
                "role": profile.data["role"],
                "client_id": profile.data.get("client_id"),
                "client": client
            }
        }, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/signup", methods=["POST"])
def signup():
    email = request.json.get("email")
    password = request.json.get("password")
    name = request.json.get("name")
    role = request.json.get("role", "user")
    client_id = request.json.get("client_id")
    
    try:
        # Create user in Supabase Auth
        auth_result = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        if not auth_result.user:
            return jsonify({"error": "Failed to create user"}), 400
            
        # Create user profile
        profile_data = {
            "auth_user_id": auth_result.user.id,
            "name": name,
            "email": email,
            "role": role,
            "is_active": True
        }
        
        if client_id:
            profile_data["client_id"] = client_id
            
        profile_result = supabase.table("user_profiles").insert(profile_data).execute()
        
        return {
            "message": "User created successfully",
            "user": profile_result.data[0] if profile_result.data else None
        }, 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/refresh", methods=["POST"])
def refresh_token():
    refresh_token = request.json.get("refresh_token")
    
    try:
        result = supabase.auth.refresh_session(refresh_token)
        return {
            "access_token": result.session.access_token,
            "refresh_token": result.session.refresh_token
        }, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/me", methods=["GET"])
def get_current_user():
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
                
        if not profile.data:
            return jsonify({"error": "User profile not found"}), 404
            
        # Get client information
        client = None
        if profile.data.get("client_id"):
            client_result = supabase.table("clients").select("*") \
                        .eq("id", profile.data["client_id"]).single().execute()
            client = client_result.data
            
        return {
            "user": {
                "id": profile.data["id"],
                "auth_user_id": profile.data["auth_user_id"],
                "name": profile.data["name"],
                "email": user.user.email,
                "role": profile.data["role"],
                "client_id": profile.data.get("client_id"),
                "client": client
            }
        }, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/logout", methods=["POST"])
def logout():
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing or invalid authorization header"}), 401
        
    token = auth_header.split(" ")[1]
    
    try:
        supabase.auth.sign_out(token)
        return {"message": "Logged out successfully"}, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500