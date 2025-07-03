from flask import Blueprint, request, jsonify, g
from .extensions import supabase
import uuid
from datetime import datetime

inventory_bp = Blueprint("inventory", __name__)

# Middleware to check if module is enabled
def check_module_access():
    if not g.tenant_id:
        return jsonify({"error": "Tenant not found"}), 404
        
    if "inventory" not in g.modules:
        return jsonify({"error": "Inventory module is not enabled for this tenant"}), 403
        
    return None

# Get all products
@inventory_bp.route("/inventory/products", methods=["GET"])
def get_products():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("products").select("*").eq("client_id", g.tenant_id)
        
        category = request.args.get("category")
        if category and category != "all":
            query = query.eq("category", category)
            
        stock_level = request.args.get("stockLevel")
        if stock_level and stock_level != "all":
            if stock_level == "low":
                query = query.filter("current_stock", "lte", "min_stock_level")
            elif stock_level == "normal":
                query = query.filter("current_stock", "gt", "min_stock_level").filter("current_stock", "lte", "max_stock_level * 0.8")
            elif stock_level == "high":
                query = query.filter("current_stock", "gt", "max_stock_level * 0.8")
                
        expiry_from = request.args.get("expiryFrom")
        expiry_to = request.args.get("expiryTo")
        
        if expiry_from and expiry_to:
            query = query.gte("expiry_date", expiry_from).lte("expiry_date", expiry_to)
            
        search = request.args.get("search")
        if search:
            query = query.or_(f"name.ilike.%{search}%,batch_number.ilike.%{search}%,vendor.ilike.%{search}%")
            
        # Order by name
        query = query.order("name")
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get product details
@inventory_bp.route("/inventory/products/<product_id>", methods=["GET"])
def get_product_details(product_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        result = supabase.table("products").select("*").eq("id", product_id).eq("client_id", g.tenant_id).single().execute()
        
        if not result.data:
            return jsonify({"error": "Product not found"}), 404
            
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add stock
@inventory_bp.route("/inventory/products/<product_id>/add-stock", methods=["POST"])
def add_stock(product_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        quantity = request.json.get("quantity")
        notes = request.json.get("notes")
        
        if not quantity or int(quantity) <= 0:
            return jsonify({"error": "Valid quantity is required"}), 400
            
        # Get current product
        product = supabase.table("products").select("*").eq("id", product_id).eq("client_id", g.tenant_id).single().execute()
        
        if not product.data:
            return jsonify({"error": "Product not found"}), 404
            
        # Calculate new stock
        previous_stock = product.data["current_stock"]
        new_stock = previous_stock + int(quantity)
        
        # Update product
        product_result = supabase.table("products").update({
            "current_stock": new_stock,
            "updated_at": datetime.now().isoformat()
        }).eq("id", product_id).execute()
        
        # Add inventory log
        log_id = str(uuid.uuid4())
        log = {
            "id": log_id,
            "client_id": g.tenant_id,
            "product_id": product_id,
            "product_name": product.data["name"],
            "type": "stock-in",
            "quantity": int(quantity),
            "previous_stock": previous_stock,
            "new_stock": new_stock,
            "reason": "Stock added",
            "performed_by": "Current User",  # In a real app, get from auth context
            "created_at": datetime.now().isoformat(),
            "notes": notes
        }
        
        supabase.table("inventory_logs").insert(log).execute()
        
        return jsonify(product_result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Deduct product
@inventory_bp.route("/inventory/products/<product_id>/deduct", methods=["POST"])
def deduct_product(product_id):
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        quantity = request.json.get("quantity")
        reason = request.json.get("reason")
        treatment_id = request.json.get("treatmentId")
        patient_name = request.json.get("patientName")
        
        if not quantity or int(quantity) <= 0:
            return jsonify({"error": "Valid quantity is required"}), 400
            
        if not reason:
            return jsonify({"error": "Reason is required"}), 400
            
        # Get current product
        product = supabase.table("products").select("*").eq("id", product_id).eq("client_id", g.tenant_id).single().execute()
        
        if not product.data:
            return jsonify({"error": "Product not found"}), 404
            
        # Check if sufficient stock
        previous_stock = product.data["current_stock"]
        quantity_int = int(quantity)
        
        if previous_stock < quantity_int:
            return jsonify({"error": "Insufficient stock"}), 400
            
        # Calculate new stock
        new_stock = previous_stock - quantity_int
        
        # Update product
        now = datetime.now().isoformat()
        product_result = supabase.table("products").update({
            "current_stock": new_stock,
            "last_used": now,
            "updated_at": now
        }).eq("id", product_id).execute()
        
        # Add inventory log
        log_id = str(uuid.uuid4())
        log = {
            "id": log_id,
            "client_id": g.tenant_id,
            "product_id": product_id,
            "product_name": product.data["name"],
            "type": "auto-deduct",
            "quantity": quantity_int,
            "previous_stock": previous_stock,
            "new_stock": new_stock,
            "reason": reason,
            "treatment_id": treatment_id,
            "patient_name": patient_name,
            "performed_by": "System",
            "created_at": now
        }
        
        supabase.table("inventory_logs").insert(log).execute()
        
        return jsonify(product_result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Adjust stock
@inventory_bp.route("/inventory/products/adjust", methods=["POST"])
def adjust_stock():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        adjustment = request.json
        
        product_id = adjustment.get("productId")
        quantity = adjustment.get("quantity")
        adjustment_type = adjustment.get("type")
        reason = adjustment.get("reason")
        notes = adjustment.get("notes")
        
        if not product_id or not quantity or int(quantity) <= 0:
            return jsonify({"error": "Product ID and valid quantity are required"}), 400
            
        if not adjustment_type or adjustment_type not in ["add", "remove"]:
            return jsonify({"error": "Valid adjustment type (add/remove) is required"}), 400
            
        if not reason:
            return jsonify({"error": "Reason is required"}), 400
            
        # Get current product
        product = supabase.table("products").select("*").eq("id", product_id).eq("client_id", g.tenant_id).single().execute()
        
        if not product.data:
            return jsonify({"error": "Product not found"}), 404
            
        # Calculate new stock
        previous_stock = product.data["current_stock"]
        quantity_int = int(quantity)
        
        if adjustment_type == "add":
            new_stock = previous_stock + quantity_int
        else:  # remove
            if previous_stock < quantity_int:
                return jsonify({"error": "Stock cannot be negative"}), 400
            new_stock = previous_stock - quantity_int
            
        # Update product
        product_result = supabase.table("products").update({
            "current_stock": new_stock,
            "updated_at": datetime.now().isoformat()
        }).eq("id", product_id).execute()
        
        # Add inventory log
        log_id = str(uuid.uuid4())
        log = {
            "id": log_id,
            "client_id": g.tenant_id,
            "product_id": product_id,
            "product_name": product.data["name"],
            "type": "adjustment",
            "quantity": quantity_int,
            "previous_stock": previous_stock,
            "new_stock": new_stock,
            "reason": reason,
            "performed_by": "Current User",  # In a real app, get from auth context
            "created_at": datetime.now().isoformat(),
            "notes": notes
        }
        
        supabase.table("inventory_logs").insert(log).execute()
        
        return jsonify(product_result.data[0]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get inventory logs
@inventory_bp.route("/inventory/logs", methods=["GET"])
def get_inventory_logs():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Apply filters if provided
        query = supabase.table("inventory_logs").select("*").eq("client_id", g.tenant_id)
        
        product_id = request.args.get("productId")
        if product_id:
            query = query.eq("product_id", product_id)
            
        # Order by creation date (newest first)
        query = query.order("created_at", desc=True)
        
        result = query.execute()
        
        return jsonify(result.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get inventory stats
@inventory_bp.route("/inventory/stats", methods=["GET"])
def get_inventory_stats():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # Get products
        products_query = supabase.table("products").select("*").eq("client_id", g.tenant_id).execute()
        products = products_query.data
        
        # Get logs
        logs_query = supabase.table("inventory_logs").select("*").eq("client_id", g.tenant_id).execute()
        logs = logs_query.data
        
        # Calculate stats
        total_products = len([p for p in products if p["is_active"]])
        
        low_stock_alerts = len([
            p for p in products 
            if p["is_active"] and p["current_stock"] <= p["min_stock_level"]
        ])
        
        # Products expiring in next 30 days
        thirty_days_from_now = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        expiring_soon = len([
            p for p in products 
            if p["is_active"] and p.get("expiry_date") and p["expiry_date"] <= thirty_days_from_now
        ])
        
        # Auto-deductions today
        today = datetime.now().strftime("%Y-%m-%d")
        auto_deduct_today = len([
            log for log in logs 
            if log["type"] == "auto-deduct" and log["created_at"].startswith(today)
        ])
        
        # Calculate total value
        total_value = sum([
            p["current_stock"] * p["cost_price"] 
            for p in products if p["is_active"]
        ])
        
        # Count unique categories
        categories = set([p["category"] for p in products if p["is_active"]])
        categories_count = len(categories)
        
        stats = {
            "totalProducts": total_products,
            "lowStockAlerts": low_stock_alerts,
            "expiringSoon": expiring_soon,
            "autoDeductToday": auto_deduct_today,
            "totalValue": total_value,
            "categoriesCount": categories_count
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get vendors
@inventory_bp.route("/inventory/vendors", methods=["GET"])
def get_vendors():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would fetch from the database
        # For this demo, we'll return mock data
        vendors = [
            "MedSupply Corp",
            "Healthcare Solutions Ltd",
            "BioMed Distributors",
            "Pharma Plus",
            "Medical Equipment Co",
            "Aesthetic Supplies Inc"
        ]
        
        return jsonify(vendors), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get treatment types
@inventory_bp.route("/inventory/treatment-types", methods=["GET"])
def get_treatment_types():
    # Check module access
    module_error = check_module_access()
    if module_error:
        return module_error
        
    try:
        # In a real app, this would fetch from the database
        # For this demo, we'll return mock data
        treatment_types = [
            "Laser Hair Removal",
            "PRP Treatment",
            "Chemical Peel",
            "Microneedling",
            "Botox Injection",
            "Dermal Fillers",
            "Acne Treatment",
            "Consultation"
        ]
        
        return jsonify(treatment_types), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500