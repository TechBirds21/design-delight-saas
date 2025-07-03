from flask import Flask
from flask_cors import CORS
from .middleware import resolve_tenant

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Tenant resolver
    @app.before_request
    def before():
        resolve_tenant()

    # Tenant endpoint
    @app.route("/api/tenant", methods=["GET"])
    def get_tenant():
        from flask import g, jsonify
        if hasattr(g, 'client_data') and g.client_data:
            return jsonify(g.client_data)
        else:
            return jsonify({"error": "Tenant not found"}), 404

    # --------- register blueprints -------------
    from .auth import auth_bp
    from .super_admin import super_admin_bp
    from .admin import admin_bp
    from .billing import billing_bp
    from .crm import crm_bp
    from .doctor import doctor_bp
    from .hr import hr_bp
    from .inventory import inventory_bp
    from .payroll import payroll_bp
    from .photo_manager import photo_bp
    from .reception import reception_bp
    from .technician import tech_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(super_admin_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")
    app.register_blueprint(billing_bp, url_prefix="/api")
    app.register_blueprint(crm_bp, url_prefix="/api")
    app.register_blueprint(doctor_bp, url_prefix="/api")
    app.register_blueprint(hr_bp, url_prefix="/api")
    app.register_blueprint(inventory_bp, url_prefix="/api")
    app.register_blueprint(payroll_bp, url_prefix="/api")
    app.register_blueprint(photo_bp, url_prefix="/api")
    app.register_blueprint(reception_bp, url_prefix="/api")
    app.register_blueprint(tech_bp, url_prefix="/api")
    return app