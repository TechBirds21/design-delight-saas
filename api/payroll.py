from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

payroll_bp = Blueprint("payroll", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "payroll" not in g.modules:
        return jsonify({"error": "Payroll module is not enabled for this tenant"}), 403
        
    return None

# Get payslips
@payroll_bp.route("/payroll/payslips/<user_id>", methods=["GET"])
def get_payslips(user_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("payslips").select("*").eq("staff_id", user_id).eq("client_id", g.tenant_id)
        
        month = request.args.get("month")
        if month is not None:
            query = query.eq("month", int(month))
            
        year = request.args.get("year")
        if year is not None:
            query = query.eq("year", int(year))
            
        # Sort by date (newest first)
        query = query.order("year", desc=True).order("month", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get payslip details
@payroll_bp.route("/payroll/payslips/details/<payslip_id>", methods=["GET"])
def get_payslip_details(payslip_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("payslips").select("*").eq("id", payslip_id).eq("client_id", g.tenant_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Payslip not found"}), 404
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Download payslip
@payroll_bp.route("/payroll/payslips/download/<payslip_id>", methods=["GET"])
def download_payslip(payslip_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get payslip
        payslip = supabase.table("payslips").select("*").eq("id", payslip_id).eq("client_id", g.tenant_id).single().execute()
        
        if not payslip.data:
            return jsonify({"error": "Payslip not found"}), 404
            
        # In a real app, this would generate a PDF and return a download URL
        # For this demo, we'll just return a mock URL
        
        url = f"payslip_{payslip.data['month'] + 1}_{payslip.data['year']}_{payslip.data['employee_id']}.pdf"
        
        return jsonify({"url": url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get leave balance
@payroll_bp.route("/payroll/leave-balance/<staff_id>", methods=["GET"])
def get_leave_balance(staff_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("leave_balances").select("*").eq("staff_id", staff_id).eq("client_id", g.tenant_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Leave balance not found"}), 404
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get payroll stats
@payroll_bp.route("/payroll/stats", methods=["GET"])
def get_payroll_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get payslips
        payslips_query = supabase.table("payslips").select("*").eq("client_id", g.tenant_id).execute()
        
        # Filter to current month
        current_month = datetime.now().month
        current_year = datetime.now().year
        
        current_month_payslips = [
            p for p in payslips_query.data 
            if p["month"] == current_month and p["year"] == current_year
        ]
        
        # Calculate stats
        total_payroll = sum([p["net_salary"] for p in current_month_payslips])
        
        employees_processed = len([
            p for p in current_month_payslips 
            if p["payment_status"] == "processed"
        ])
        
        pending_payslips = len([
            p for p in current_month_payslips 
            if p["payment_status"] == "pending"
        ])
        
        processed_payslips = [
            p for p in current_month_payslips 
            if p["payment_status"] == "processed"
        ]
        
        average_salary = total_payroll / len(processed_payslips) if processed_payslips else 0
        
        # Mock department breakdown
        department_breakdown = {
            "Medical": 25000,
            "Administration": 18000,
            "Technical": 12000,
            "Support": 8000
        }
        
        stats = {
            "totalPayroll": total_payroll,
            "employeesProcessed": employees_processed,
            "pendingPayslips": pending_payslips,
            "averageSalary": average_salary,
            "departmentBreakdown": department_breakdown
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500