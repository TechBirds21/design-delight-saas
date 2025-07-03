from flask import Blueprint, request, jsonify, g
from .extensions import supabase
from datetime import datetime, timedelta
import uuid

admin_bp = Blueprint("admin", __name__)

# Middleware to check if module is enabled
def check_module_access(module_name):
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if module_name not in g.modules:
        return jsonify({"error": f"Module '{module_name}' is not enabled for this tenant"}), 403
        
    return None

# Middleware to check if user has admin role
def require_admin_role():
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
                
        if not profile.data or profile.data["role"] != "admin":
            return jsonify({"error": "Unauthorized - Admin access required"}), 403
            
        return None
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get admin metrics
@admin_bp.route("/admin/metrics", methods=["GET"])
def get_admin_metrics():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Get today's revenue from completed invoices
        revenue_query = supabase.table("invoices") \
                      .select("paid_amount") \
                      .eq("client_id", g.tenant_id) \
                      .eq("status", "paid") \
                      .gte("paid_at", f"{today}T00:00:00") \
                      .execute()
                      
        revenue_today = sum([invoice.get("paid_amount", 0) for invoice in revenue_query.data])
        
        # Get today's appointments
        appointments_query = supabase.table("appointments") \
                           .select("id") \
                           .eq("client_id", g.tenant_id) \
                           .eq("date", today) \
                           .execute()
                           
        total_appointments = len(appointments_query.data)
        
        # Get active staff
        staff_query = supabase.table("staff") \
                    .select("id") \
                    .eq("client_id", g.tenant_id) \
                    .eq("status", "active") \
                    .execute()
                    
        active_staff = len(staff_query.data)
        
        # Get low inventory items
        inventory_query = supabase.table("products") \
                        .select("id") \
                        .eq("client_id", g.tenant_id) \
                        .filter("current_stock", "lte", "min_stock_level") \
                        .execute()
                        
        low_inventory = len(inventory_query.data)
        
        # Calculate changes (mock data for now)
        revenue_change = 12.5
        appointments_change = 8.3
        
        metrics = {
            "revenueToday": revenue_today,
            "totalAppointments": total_appointments,
            "activeStaff": active_staff,
            "lowInventory": low_inventory,
            "revenueChange": revenue_change,
            "appointmentsChange": appointments_change
        }
        
        return jsonify(metrics), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate revenue report
@admin_bp.route("/admin/reports/revenue", methods=["GET"])
def get_revenue_report():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        # Get filter parameters
        date_from = request.args.get("date_from")
        date_to = request.args.get("date_to")
        department = request.args.get("department")
        branch = request.args.get("branch")
        
        # Build query
        query = supabase.table("invoices").select("*").eq("client_id", g.tenant_id)
        
        if date_from and date_to:
            query = query.gte("created_at", date_from).lte("created_at", date_to)
            
        # Execute query
        result = query.execute()
        
        # Process data for report
        report = []
        
        # Group by date
        dates = {}
        for invoice in result.data:
            date = invoice["created_at"].split("T")[0]
            if date not in dates:
                dates[date] = {
                    "revenue": 0,
                    "patients": set(),
                }
            dates[date]["revenue"] += invoice["total_amount"]
            dates[date]["patients"].add(invoice["patient_id"])
            
        # Format report
        for date, data in dates.items():
            patients_count = len(data["patients"])
            avg_bill = data["revenue"] / patients_count if patients_count > 0 else 0
            
            report.append({
                "date": date,
                "revenue": data["revenue"],
                "patients": patients_count,
                "avgBill": avg_bill
            })
            
        # Sort by date
        report.sort(key=lambda x: x["date"])
        
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate staff performance report
@admin_bp.route("/admin/reports/performance", methods=["GET"])
def get_performance_report():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        # Get filter parameters
        role = request.args.get("role")
        
        # Build query
        query = supabase.table("staff").select("*").eq("client_id", g.tenant_id)
        
        if role and role != "all":
            query = query.eq("role", role)
            
        # Execute query
        staff_result = query.execute()
        
        # Get appointments and treatments for each staff
        report = []
        for staff in staff_result.data:
            # Get patient count
            patients_query = supabase.table("appointments") \
                           .select("patient_id") \
                           .eq("client_id", g.tenant_id) \
                           .eq("doctor_id", staff["id"]) \
                           .execute()
                           
            unique_patients = set([apt["patient_id"] for apt in patients_query.data])
            
            # Get hours worked (from shifts)
            hours_query = supabase.table("shifts") \
                        .select("*") \
                        .eq("client_id", g.tenant_id) \
                        .eq("staff_id", staff["id"]) \
                        .eq("status", "completed") \
                        .execute()
                        
            total_hours = sum([
                (datetime.fromisoformat(shift["end_time"]) - datetime.fromisoformat(shift["start_time"])).total_seconds() / 3600
                for shift in hours_query.data
            ])
            
            # Get procedures count
            procedures_query = supabase.table("treatment_records") \
                             .select("id") \
                             .eq("client_id", g.tenant_id) \
                             .eq("performed_by_id", staff["id"]) \
                             .execute()
                             
            procedures_count = len(procedures_query.data)
            
            # Get rating (mock data for now)
            rating = 4.5 + (hash(staff["id"]) % 5) / 10  # Random rating between 4.5 and 5.0
            
            report.append({
                "name": staff["name"],
                "patients": len(unique_patients),
                "hours": round(total_hours),
                "procedures": procedures_count,
                "rating": rating
            })
            
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate inventory report
@admin_bp.route("/admin/reports/inventory", methods=["GET"])
def get_inventory_report():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        # Get products with low stock
        products_query = supabase.table("products") \
                       .select("*") \
                       .eq("client_id", g.tenant_id) \
                       .execute()
                       
        # Get usage logs
        logs_query = supabase.table("inventory_logs") \
                   .select("product_id, quantity") \
                   .eq("client_id", g.tenant_id) \
                   .eq("type", "stock-out") \
                   .execute()
                   
        # Calculate usage per product
        usage = {}
        for log in logs_query.data:
            product_id = log["product_id"]
            if product_id not in usage:
                usage[product_id] = 0
            usage[product_id] += log["quantity"]
            
        # Prepare report
        report = []
        for product in products_query.data:
            product_id = product["id"]
            report.append({
                "item": product["name"],
                "used": usage.get(product_id, 0),
                "remaining": product["current_stock"],
                "reorder": "Yes" if product["current_stock"] <= product["min_stock_level"] else "No"
            })
            
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Generate CRM report
@admin_bp.route("/admin/reports/crm", methods=["GET"])
def get_crm_report():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        # Get leads
        leads_query = supabase.table("leads") \
                    .select("status") \
                    .eq("client_id", g.tenant_id) \
                    .execute()
                    
        # Count leads by status
        leads = leads_query.data
        total_leads = len(leads)
        
        # Count by status
        status_counts = {
            "new": 0,
            "contacted": 0,
            "consulted": 0,
            "converted": 0
        }
        
        for lead in leads:
            status = lead["status"]
            if status in status_counts:
                status_counts[status] += 1
                
        # Calculate conversion rates
        report = []
        
        # Leads stage
        report.append({
            "stage": "Leads",
            "count": total_leads,
            "conversion": "100%"
        })
        
        # Contacted stage
        contacted = status_counts["contacted"] + status_counts["consulted"] + status_counts["converted"]
        contacted_rate = (contacted / total_leads * 100) if total_leads > 0 else 0
        report.append({
            "stage": "Contacted",
            "count": contacted,
            "conversion": f"{contacted_rate:.1f}%"
        })
        
        # Consulted stage
        consulted = status_counts["consulted"] + status_counts["converted"]
        consulted_rate = (consulted / total_leads * 100) if total_leads > 0 else 0
        report.append({
            "stage": "Consulted",
            "count": consulted,
            "conversion": f"{consulted_rate:.1f}%"
        })
        
        # Converted stage
        converted = status_counts["converted"]
        converted_rate = (converted / total_leads * 100) if total_leads > 0 else 0
        report.append({
            "stage": "Converted",
            "count": converted,
            "conversion": f"{converted_rate:.1f}%"
        })
        
        return jsonify(report), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get activity logs
@admin_bp.route("/admin/logs", methods=["GET"])
def get_activity_logs():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        # Get filter parameters
        date_filter = request.args.get("date", "all")
        role_filter = request.args.get("role")
        action_type_filter = request.args.get("actionType")
        search = request.args.get("search")
        
        # Build query
        query = supabase.table("activity_logs").select("*").eq("client_id", g.tenant_id)
        
        # Apply date filter
        if date_filter != "all":
            now = datetime.now()
            start_of_day = datetime(now.year, now.month, now.day, 0, 0, 0).isoformat()
            
            if date_filter == "today":
                query = query.gte("timestamp", start_of_day)
            elif date_filter == "yesterday":
                yesterday = (now - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
                query = query.gte("timestamp", yesterday).lt("timestamp", start_of_day)
            elif date_filter == "week":
                week_ago = (now - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
                query = query.gte("timestamp", week_ago)
                
        # Apply role filter
        if role_filter and role_filter != "all":
            query = query.eq("user_role", role_filter)
            
        # Apply action type filter
        if action_type_filter and action_type_filter != "all":
            query = query.eq("action_type", action_type_filter)
            
        # Apply search filter
        if search:
            query = query.or_(f"user.ilike.%{search}%,module.ilike.%{search}%,action.ilike.%{search}%,ip_address.ilike.%{search}%")
            
        # Order by timestamp (newest first)
        query = query.order("timestamp", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Export report as CSV
@admin_bp.route("/admin/reports/export", methods=["GET"])
def export_report():
    # Check module access
    module_error = check_module_access("admin")
    if module_error:
        return module_error
        
    # Check admin role
    role_error = require_admin_role()
    if role_error:
        return role_error
        
    try:
        report_type = request.args.get("type")
        
        if not report_type:
            return jsonify({"error": "Report type is required"}), 400
            
        # In a real app, this would generate a CSV file
        # For this demo, we'll just return a mock URL
        
        today = datetime.now().strftime("%Y-%m-%d")
        url = f"{report_type.lower()}_report_{today}.csv"
        
        return jsonify({"url": url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500