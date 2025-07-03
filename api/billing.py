from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

billing_bp = Blueprint("billing", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "billing" not in g.modules:
        return jsonify({"error": "Billing module is not enabled for this tenant"}), 403
        
    return None

# Get all invoices
@billing_bp.route("/billing/invoices", methods=["GET"])
def get_invoices():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("invoices").select("*").eq("client_id", g.tenant_id)
        
        status = request.args.get("status")
        if status and status != "all":
            query = query.eq("status", status)
            
        payment_mode = request.args.get("payment_mode")
        if payment_mode and payment_mode != "all":
            query = query.eq("payment_mode", payment_mode)
            
        doctor = request.args.get("doctor")
        if doctor and doctor != "all":
            query = query.eq("doctor_name", doctor)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"invoice_number.ilike.%{search}%,patient_name.ilike.%{search}%,doctor_name.ilike.%{search}%")
            
        # Order by creation date (newest first)
        query = query.order("created_at", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get invoice details
@billing_bp.route("/billing/invoices/<invoice_id>", methods=["GET"])
def get_invoice_details(invoice_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("invoices").select("*").eq("id", invoice_id).eq("client_id", g.tenant_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Invoice not found"}), 404
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create new invoice
@billing_bp.route("/billing/invoices", methods=["POST"])
def create_invoice():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        data = request.json
        
        # Generate invoice ID and number
        invoice_id = str(uuid.uuid4())
        
        # Generate invoice number
        date = datetime.now()
        year = date.strftime("%y")
        month = date.strftime("%m")
        random_num = hash(invoice_id) % 10000
        invoice_number = f"INV{year}{month}{random_num:04d}"
        
        # Set timestamps
        now = date.isoformat()
        
        # Prepare invoice data
        invoice_data = {
            "id": invoice_id,
            "invoice_number": invoice_number,
            "client_id": g.tenant_id,
            **data,
            "created_at": now,
            "updated_at": now
        }
        
        # Insert invoice
        result = supabase.table("invoices").insert(invoice_data).execute()
        
        return jsonify(result.data[0]), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Mark invoice as paid
@billing_bp.route("/billing/invoices/<invoice_id>/pay", methods=["POST"])
def mark_as_paid(invoice_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        payment_data = request.json
        
        # Get current invoice
        invoice = supabase.table("invoices").select("*").eq("id", invoice_id).eq("client_id", g.tenant_id).single().execute()
        
        if not invoice.data:
            return jsonify({"error": "Invoice not found"}), 404
            
        # Calculate new values
        new_paid_amount = invoice.data["paid_amount"] + payment_data["amount"]
        new_balance_amount = invoice.data["total_amount"] - new_paid_amount
        
        # Determine new status
        new_status = "paid" if new_balance_amount <= 0 else "partially-paid"
        
        # Update invoice
        now = datetime.now().isoformat()
        update_data = {
            "paid_amount": new_paid_amount,
            "balance_amount": new_balance_amount,
            "status": new_status,
            "payment_mode": payment_data["payment_mode"],
            "updated_at": now
        }
        
        # Set paid_at if fully paid
        if new_status == "paid":
            update_data["paid_at"] = now
            
        invoice_result = supabase.table("invoices").update(update_data).eq("id", invoice_id).execute()
        
        # Add payment record
        payment_record = {
            "id": str(uuid.uuid4()),
            "invoice_id": invoice_id,
            "client_id": g.tenant_id,
            "amount": payment_data["amount"],
            "payment_mode": payment_data["payment_mode"],
            "transaction_id": payment_data.get("transaction_id"),
            "paid_at": now,
            "notes": payment_data.get("notes")
        }
        
        supabase.table("payments").insert(payment_record).execute()
        
        return jsonify(invoice_result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Refund invoice
@billing_bp.route("/billing/invoices/<invoice_id>/refund", methods=["POST"])
def refund_invoice(invoice_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        refund_data = request.json
        
        # Get current invoice
        invoice = supabase.table("invoices").select("*").eq("id", invoice_id).eq("client_id", g.tenant_id).single().execute()
        
        if not invoice.data:
            return jsonify({"error": "Invoice not found"}), 404
            
        # Update invoice
        now = datetime.now().isoformat()
        update_data = {
            "status": "refunded",
            "refund_amount": refund_data["amount"],
            "refund_reason": refund_data["reason"],
            "refunded_at": now,
            "updated_at": now
        }
        
        result = supabase.table("invoices").update(update_data).eq("id", invoice_id).execute()
        
        return jsonify(result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get billing stats
@billing_bp.route("/billing/stats", methods=["GET"])
def get_billing_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get today's date
        today = datetime.now().strftime("%Y-%m-%d")
        
        # Get today's invoices
        today_invoices_query = supabase.table("invoices") \
                             .select("*") \
                             .eq("client_id", g.tenant_id) \
                             .gte("created_at", f"{today}T00:00:00") \
                             .execute()
                             
        today_invoices = today_invoices_query.data
        
        # Get all invoices
        all_invoices_query = supabase.table("invoices") \
                           .select("*") \
                           .eq("client_id", g.tenant_id) \
                           .execute()
                           
        all_invoices = all_invoices_query.data
        
        # Calculate stats
        today_revenue = sum([
            invoice["paid_amount"] for invoice in today_invoices 
            if invoice["status"] == "paid"
        ])
        
        invoices_generated = len(today_invoices)
        
        pending_payments = sum([
            invoice["balance_amount"] for invoice in all_invoices 
            if invoice["status"] in ["sent", "partially-paid", "overdue"]
        ])
        
        refunded_today = sum([
            invoice.get("refund_amount", 0) for invoice in today_invoices 
            if invoice["status"] == "refunded" and invoice.get("refunded_at", "").startswith(today)
        ])
        
        total_revenue = sum([
            invoice["paid_amount"] for invoice in all_invoices 
            if invoice["status"] == "paid"
        ])
        
        paid_invoices = [invoice for invoice in all_invoices if invoice["status"] == "paid"]
        average_invoice_value = total_revenue / len(paid_invoices) if paid_invoices else 0
        
        stats = {
            "todayRevenue": today_revenue,
            "invoicesGenerated": invoices_generated,
            "pendingPayments": pending_payments,
            "refundedToday": refunded_today,
            "totalRevenue": total_revenue,
            "averageInvoiceValue": average_invoice_value
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get procedures for invoicing
@billing_bp.route("/billing/procedures", methods=["GET"])
def get_procedures():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would fetch from the database
        # For this demo, we'll return mock data
        procedures = [
            {"id": "1", "name": "Laser Hair Removal", "unitPrice": 150},
            {"id": "2", "name": "PRP Treatment", "unitPrice": 300},
            {"id": "3", "name": "Chemical Peel", "unitPrice": 120},
            {"id": "4", "name": "Microneedling", "unitPrice": 200},
            {"id": "5", "name": "Botox Injection", "unitPrice": 400},
            {"id": "6", "name": "Dermal Fillers", "unitPrice": 500},
            {"id": "7", "name": "Acne Treatment", "unitPrice": 80},
            {"id": "8", "name": "Consultation", "unitPrice": 50}
        ]
        
        return jsonify(procedures), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500