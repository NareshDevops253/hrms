from flask import Flask, request, jsonify, render_template
from database import get_connection
from datetime import datetime


app = Flask(__name__)


# ============================================================
# COMMON HELPER FUNCTIONS
# ============================================================

def get_json_data():
    data = request.get_json(silent=True)

    if not data:
        return None, jsonify({
            "message": "Invalid or missing JSON data"
        }), 400

    return data, None, None


def validate_date_range(start_date, end_date):

    try:
        start = datetime.strptime(start_date, "%Y-%m-%d").date()
        end = datetime.strptime(end_date, "%Y-%m-%d").date()

        if end < start:
            return False

        return True

    except ValueError:
        return False


# ============================================================
# LOGIN
# ============================================================

@app.route('/login', methods=['POST'])
def login():

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    username = str(data.get('username', '')).strip()
    password = str(data.get('password', '')).strip()

    if not username or not password:

        return jsonify({
            "message": "Username and Password are required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT *
            FROM users
            WHERE username=%s
            AND password=%s
            AND status='Active'
        """

        cursor.execute(query, (username, password))

        user = cursor.fetchone()

        if user:

            return jsonify({
                "message": "Login Successful",
                "user": user
            }), 200

        return jsonify({
            "message": "Invalid Username or Password"
        }), 401

    except Exception as e:

        print("Login Error:", e)

        return jsonify({
            "message": "Login failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# COMPANY CRUD
# ============================================================

@app.route('/company', methods=['POST'])
def create_company():

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    company_name = str(data.get('company_name', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    address = str(data.get('address', '')).strip()
    status = str(data.get('status', '')).strip()

    if not company_name:
        return jsonify({
            "message": "Company Name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not phone.isdigit() or len(phone) != 10:
        return jsonify({
            "message": "Phone number must be exactly 10 digits"
        }), 400

    if not address:
        return jsonify({
            "message": "Address is required"
        }), 400

    if not status:
        return jsonify({
            "message": "Status is required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO company
            (
                company_name,
                email,
                phone,
                address,
                status
            )
            VALUES (%s, %s, %s, %s, %s)
        """

        values = (
            company_name,
            email,
            phone,
            address,
            status
        )

        cursor.execute(query, values)

        conn.commit()

        return jsonify({
            "message": "Company Created Successfully"
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        print("Create Company Error:", e)

        return jsonify({
            "message": "Company creation failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/company', methods=['GET'])
def get_company():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM company
            ORDER BY company_id DESC
        """)

        companies = cursor.fetchall()

        return jsonify(companies), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch companies",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/company/<int:id>', methods=['PUT'])
def update_company(id):

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    company_name = str(data.get('company_name', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    address = str(data.get('address', '')).strip()
    status = str(data.get('status', '')).strip()

    if not company_name:
        return jsonify({
            "message": "Company Name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not phone.isdigit() or len(phone) != 10:
        return jsonify({
            "message": "Phone number must be exactly 10 digits"
        }), 400

    if not address:
        return jsonify({
            "message": "Address is required"
        }), 400

    if not status:
        return jsonify({
            "message": "Status is required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE company
            SET
                company_name=%s,
                email=%s,
                phone=%s,
                address=%s,
                status=%s
            WHERE company_id=%s
        """

        values = (
            company_name,
            email,
            phone,
            address,
            status,
            id
        )

        cursor.execute(query, values)

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Company not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Company Updated Successfully"
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "message": "Company update failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/company/<int:id>', methods=['DELETE'])
def delete_company(id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM company WHERE company_id=%s",
            (id,)
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Company not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Company Deleted Successfully"
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "message": "Company deletion failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# RESOURCE CRUD
# ============================================================

@app.route('/resource', methods=['POST'])
def create_resource():

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    employee_id = str(data.get('employee_id', '')).strip()
    first_name = str(data.get('first_name', '')).strip()
    last_name = str(data.get('last_name', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    designation = str(data.get('designation', '')).strip()
    company_name = str(data.get('company_name', '')).strip()
    resource_type = str(data.get('resource_type', '')).strip()
    company_id = data.get('company_id')
    status = str(data.get('status', '')).strip()
    start_date = str(data.get('start_date', '')).strip()

    if not employee_id:
        return jsonify({
            "message": "Employee ID is required"
        }), 400

    if not first_name:
        return jsonify({
            "message": "First Name is required"
        }), 400

    if not last_name:
        return jsonify({
            "message": "Last Name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not phone.isdigit() or len(phone) != 10:
        return jsonify({
            "message": "Phone number must be exactly 10 digits"
        }), 400

    if not designation:
        return jsonify({
            "message": "Designation is required"
        }), 400

    if not company_name:
        return jsonify({
            "message": "Company Name is required"
        }), 400

    if resource_type not in ['W2', 'C2C', '1099']:
        return jsonify({
            "message": "Invalid Resource Type"
        }), 400

    if not company_id:
        return jsonify({
            "message": "Company is required"
        }), 400

    if not status:
        return jsonify({
            "message": "Status is required"
        }), 400

    if not start_date:
        return jsonify({
            "message": "Start Date is required"
        }), 400

    try:

        datetime.strptime(start_date, "%Y-%m-%d")

    except ValueError:

        return jsonify({
            "message": "Invalid Start Date"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO resource
            (
                employee_id,
                first_name,
                last_name,
                email,
                phone,
                designation,
                company_name,
                resource_type,
                company_id,
                status,
                start_date
            )
            VALUES
            (
                %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
            )
        """

        values = (
            employee_id,
            first_name,
            last_name,
            email,
            phone,
            designation,
            company_name,
            resource_type,
            company_id,
            status,
            start_date
        )

        cursor.execute(query, values)

        conn.commit()

        return jsonify({
            "message": "Resource Created Successfully"
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "message": "Resource creation failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/resource', methods=['GET'])
def get_resource():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                resource_id,
                employee_id,
                first_name,
                last_name,
                email,
                phone,
                designation,
                company_name,
                resource_type,
                company_id,
                status,
                start_date
            FROM resource
            ORDER BY resource_id DESC
        """)

        resources = cursor.fetchall()

        return jsonify(resources), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch resources",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/resource/<int:id>', methods=['PUT'])
def update_resource(id):

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    employee_id = str(data.get('employee_id', '')).strip()
    first_name = str(data.get('first_name', '')).strip()
    last_name = str(data.get('last_name', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    designation = str(data.get('designation', '')).strip()
    company_name = str(data.get('company_name', '')).strip()
    resource_type = str(data.get('resource_type', '')).strip()
    company_id = data.get('company_id')
    status = str(data.get('status', '')).strip()
    start_date = str(data.get('start_date', '')).strip()

    if not employee_id:
        return jsonify({
            "message": "Employee ID is required"
        }), 400

    if not first_name:
        return jsonify({
            "message": "First Name is required"
        }), 400

    if not last_name:
        return jsonify({
            "message": "Last Name is required"
        }), 400

    if not email:
        return jsonify({
            "message": "Email is required"
        }), 400

    if not phone.isdigit() or len(phone) != 10:
        return jsonify({
            "message": "Phone number must be exactly 10 digits"
        }), 400

    if not designation:
        return jsonify({
            "message": "Designation is required"
        }), 400

    if not company_name:
        return jsonify({
            "message": "Company Name is required"
        }), 400

    if resource_type not in ['W2', 'C2C', '1099']:
        return jsonify({
            "message": "Invalid Resource Type"
        }), 400

    if not company_id:
        return jsonify({
            "message": "Company is required"
        }), 400

    if not status:
        return jsonify({
            "message": "Status is required"
        }), 400

    if not start_date:
        return jsonify({
            "message": "Start Date is required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE resource
            SET
                employee_id=%s,
                first_name=%s,
                last_name=%s,
                email=%s,
                phone=%s,
                designation=%s,
                company_name=%s,
                resource_type=%s,
                company_id=%s,
                status=%s,
                start_date=%s
            WHERE resource_id=%s
        """

        values = (
            employee_id,
            first_name,
            last_name,
            email,
            phone,
            designation,
            company_name,
            resource_type,
            company_id,
            status,
            start_date,
            id
        )

        cursor.execute(query, values)

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Resource not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Resource Updated Successfully"
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "message": "Resource update failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/resource/<int:id>', methods=['DELETE'])
def delete_resource(id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM resource WHERE resource_id=%s",
            (id,)
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Resource not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Resource Deleted Successfully"
        }), 200

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "message": "Resource deletion failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# RESOURCE DETAILS
# ============================================================

@app.route('/resource_details/<company>/<resource>', methods=['GET'])
def resource_details(company, resource):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                resource_id,
                company_name,
                first_name,
                last_name,
                resource_type,
                start_date
            FROM resource
            WHERE company_name=%s
            AND first_name=%s
        """

        cursor.execute(
            query,
            (company, resource)
        )

        data = cursor.fetchone()

        if not data:

            return jsonify({
                "message": "Resource not found"
            }), 404

        return jsonify(data), 200

    except Exception as e:

        return jsonify({
            "message": "Failed to fetch resource details",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# CLIENT MSA CRUD
# ============================================================

@app.route('/client_msa', methods=['POST'])
def post_client_msa():

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    client_name = str(data.get('client_name', '')).strip()
    msa_number = str(data.get('msa_number', '')).strip()
    start_date = str(data.get('start_date', '')).strip()
    end_date = str(data.get('end_date', '')).strip()
    status = str(data.get('status', '')).strip()

    if not client_name:
        return jsonify({
            "message": "Client Name is required"
        }), 400

    if not msa_number:
        return jsonify({
            "message": "MSA Number is required"
        }), 400

    if not start_date or not end_date:
        return jsonify({
            "message": "Start Date and End Date are required"
        }), 400

    if not validate_date_range(start_date, end_date):

        return jsonify({
            "message": "Invalid date range"
        }), 400

    if not status:
        return jsonify({
            "message": "Status is required"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO client_msa
            (
                client_name,
                msa_number,
                start_date,
                end_date,
                status
            )
            VALUES (%s,%s,%s,%s,%s)
        """

        cursor.execute(
            query,
            (
                client_name,
                msa_number,
                start_date,
                end_date,
                status
            )
        )

        conn.commit()

        return jsonify({
            "message": "Client MSA Created Successfully"
        }), 201

    except Exception as e:

        if conn:
            conn.rollback()

        return jsonify({
            "message": "Client MSA creation failed",
            "error": str(e)
        }), 500

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/client_msa', methods=['GET'])
def get_client_msa():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM client_msa
            ORDER BY id DESC
        """)

        data = cursor.fetchall()

        return jsonify(data), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/client_msa/<int:id>', methods=['PUT'])
def update_client_msa(id):

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    client_name = str(data.get('client_name', '')).strip()
    msa_number = str(data.get('msa_number', '')).strip()
    start_date = str(data.get('start_date', '')).strip()
    end_date = str(data.get('end_date', '')).strip()
    status = str(data.get('status', '')).strip()

    if not client_name or not msa_number:
        return jsonify({
            "message": "Client Name and MSA Number are required"
        }), 400

    if not validate_date_range(start_date, end_date):

        return jsonify({
            "message": "Invalid date range"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE client_msa
            SET
                client_name=%s,
                msa_number=%s,
                start_date=%s,
                end_date=%s,
                status=%s
            WHERE id=%s
        """

        cursor.execute(
            query,
            (
                client_name,
                msa_number,
                start_date,
                end_date,
                status,
                id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Client MSA not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Client MSA Updated Successfully"
        }), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/client_msa/<int:id>', methods=['DELETE'])
def delete_client_msa(id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        # FIXED: id instead of client_msa_id
        cursor.execute(
            "DELETE FROM client_msa WHERE id=%s",
            (id,)
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Client MSA not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Client MSA Deleted Successfully"
        }), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# CLIENT WORK ORDER
# ============================================================

# ============================================================
# CLIENT WORK ORDER
# ============================================================

@app.route("/client_work_order", methods=["POST"])
def create_client_work_order():

    conn = None
    cursor = None

    try:

        data = request.get_json()

        print("Received Data:", data)


        client_msa_id = data.get("client_msa_id")

        work_order_number = data.get(
            "work_order_number"
        )

        resource_id = data.get(
            "resource_id"
        )

        resource_name = data.get(
            "resource_name"
        )

        project_name = data.get(
            "project_name"
        )

        start_date = data.get(
            "start_date"
        )

        end_date = data.get(
            "end_date"
        )

        status = data.get(
            "status"
        )


        print(
            "Resource ID:",
            resource_id
        )


        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )


        # ==========================================
        # CHECK RESOURCE AND GET RESOURCE DETAILS
        # ==========================================

        cursor.execute(

            """

            SELECT

                resource_id,

                first_name,

                last_name,

                company_id,

                company_name,

                resource_type,

                start_date

            FROM resource

            WHERE resource_id = %s

            """,

            (resource_id,)

        )


        resource = cursor.fetchone()


        print(
            "Found Resource:",
            resource
        )


        if not resource:

            return jsonify({

                "message":
                "Invalid Resource"

            }), 400


        # ==========================================
        # GET RESOURCE DETAILS FROM DATABASE
        # ==========================================

        database_company_name = (

            resource["company_name"]

            or

            ""

        )


        database_resource_type = (

            resource["resource_type"]

            or

            ""

        )


        database_start_date = (

            resource["start_date"]

        )


        # ==========================================
        # RESOURCE NAME VALIDATION
        # ==========================================

        database_resource_name = (

            (

                resource["first_name"]

                or

                ""

            )

            +

            " "

            +

            (

                resource["last_name"]

                or

                ""

            )

        ).strip()


        if (

            resource_name

            and

            resource_name

            !=

            database_resource_name

        ):

            return jsonify({

                "message":
                "Invalid Resource Name"

            }), 400


        # ==========================================
        # DATE VALIDATION
        # ==========================================

        if (

            database_start_date

            and

            start_date

            <

            str(

                database_start_date

            )

        ):

            return jsonify({

                "message":

                "Work Order Start Date "

                "Cannot Be Before "

                "Resource Start Date"

            }), 400


        # ==========================================
        # INSERT
        # ==========================================

        cursor.execute(

            """

            INSERT INTO client_work_order

            (

                client_msa_id,

                work_order_number,

                company_name,

                resource_type,

                start_date,

                end_date,

                status,

                resource_name,

                project_name

            )

            VALUES

            (

                %s,

                %s,

                %s,

                %s,

                %s,

                %s,

                %s,

                %s,

                %s

            )

            """,

            (

                client_msa_id,

                work_order_number,

                database_company_name,

                database_resource_type,

                start_date,

                end_date,

                status,

                database_resource_name,

                project_name

            )

        )


        conn.commit()


        return jsonify({

            "message":

            "Client Work Order "

            "Created Successfully"

        }), 201


    except Exception as e:


        if conn:

            conn.rollback()


        print(

            "Create Client Work Order Error:",

            e

        )


        return jsonify({

            "message":

            "Client Work Order Creation Failed",

            "error":

            str(e)

        }), 500


    finally:


        if cursor:

            cursor.close()


        if conn:

            conn.close()
# ============================================================
# GET ALL CLIENT WORK ORDERS
# ============================================================

@app.route('/client_work_order', methods=['GET'])
def get_client_work_order():

    conn = None
    cursor = None


    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )


        query = """

            SELECT

                cwo.id,

                cwo.client_msa_id,

                cwo.work_order_number,

                cwo.project_name,

                cwo.company_name,

                cwo.resource_name,

                cwo.resource_type,

                cwo.start_date,

                cwo.end_date,

                cwo.status,

                cm.client_name,

                cm.msa_number

            FROM client_work_order cwo

            JOIN client_msa cm

                ON cwo.client_msa_id = cm.id

            ORDER BY cwo.id DESC

        """


        cursor.execute(
            query
        )


        data = cursor.fetchall()


        return jsonify(
            data
        ), 200


    except Exception as e:

        print(
            "Get Client Work Order Error:",
            e
        )


        return jsonify({

            "message":
            "Failed to fetch Client Work Orders",

            "error":
            str(e)

        }), 500


    finally:

        if cursor:

            cursor.close()


        if conn:

            conn.close()


# ============================================================
# UPDATE CLIENT WORK ORDER
# ============================================================

@app.route('/client_work_order/<int:id>', methods=['PUT'])
def update_client_work_order(id):

    data, error_response, error_status = get_json_data()


    if error_response:

        return error_response, error_status


    client_msa_id = data.get(
        'client_msa_id'
    )


    work_order_number = str(

        data.get(
            'work_order_number',
            ''
        )

    ).strip()


    project_name = str(

        data.get(
            'project_name',
            ''
        )

    ).strip()


    resource_type = str(

        data.get(
            'resource_type',
            ''
        )

    ).strip()


    company_name = str(

        data.get(
            'company_name',
            ''
        )

    ).strip()


    resource_name = str(

        data.get(
            'resource_name',
            ''
        )

    ).strip()


    start_date = str(

        data.get(
            'start_date',
            ''
        )

    ).strip()


    end_date = str(

        data.get(
            'end_date',
            ''
        )

    ).strip()


    status = str(

        data.get(
            'status',
            ''
        )

    ).strip()


    # ========================================================
    # VALIDATION
    # ========================================================

    if not client_msa_id:

        return jsonify({

            "message":
            "Client MSA is required"

        }), 400


    if not work_order_number:

        return jsonify({

            "message":
            "Work Order Number is required"

        }), 400


    if not project_name:

        return jsonify({

            "message":
            "Project Name is required"

        }), 400


    if not company_name:

        return jsonify({

            "message":
            "Company Name is required"

        }), 400


    if not resource_name:

        return jsonify({

            "message":
            "Resource Name is required"

        }), 400


    if not start_date or not end_date:

        return jsonify({

            "message":
            "Start Date and End Date are required"

        }), 400


    if not validate_date_range(

        start_date,
        end_date

    ):

        return jsonify({

            "message":
            "Invalid date range"

        }), 400


    conn = None
    cursor = None


    try:

        conn = get_connection()

        cursor = conn.cursor(
            dictionary=True
        )


        # ====================================================
        # CHECK RESOURCE START DATE
        # ====================================================

        cursor.execute(

            """

            SELECT start_date

            FROM resource

            WHERE company_name=%s

            AND first_name=%s

            """,

            (

                company_name,
                resource_name

            )

        )


        resource = cursor.fetchone()


        if not resource:

            return jsonify({

                "message":
                "Invalid Resource"

            }), 400


        work_order_date = datetime.strptime(

            start_date,
            "%Y-%m-%d"

        ).date()


        resource_date = resource["start_date"]


        if work_order_date < resource_date:

            return jsonify({

                "message":

                "Client Work Order Start Date should be on or after Resource Start Date"

            }), 400


        # ====================================================
        # UPDATE
        # ====================================================

        query = """

            UPDATE client_work_order

            SET

                client_msa_id=%s,

                work_order_number=%s,

                project_name=%s,

                company_name=%s,

                resource_name=%s,

                resource_type=%s,

                start_date=%s,

                end_date=%s,

                status=%s

            WHERE id=%s

        """


        values = (

            client_msa_id,

            work_order_number,

            project_name,

            company_name,

            resource_name,

            resource_type,

            start_date,

            end_date,

            status,

            id

        )


        cursor.execute(

            query,
            values

        )


        if cursor.rowcount == 0:

            return jsonify({

                "message":
                "Client Work Order not found"

            }), 404


        conn.commit()


        return jsonify({

            "message":
            "Client Work Order Updated Successfully"

        }), 200


    except Exception as e:

        if conn:

            conn.rollback()


        print(

            "Update Client Work Order Error:",

            e

        )


        return jsonify({

            "message":
            "Client Work Order update failed",

            "error":
            str(e)

        }), 500


    finally:

        if cursor:

            cursor.close()


        if conn:

            conn.close()


# ============================================================
# DELETE CLIENT WORK ORDER
# ============================================================

@app.route('/client_work_order/<int:id>', methods=['DELETE'])
def delete_client_work_order(id):

    conn = None
    cursor = None


    try:

        conn = get_connection()

        cursor = conn.cursor()


        cursor.execute(

            """

            DELETE FROM client_work_order

            WHERE id=%s

            """,

            (id,)

        )


        if cursor.rowcount == 0:

            return jsonify({

                "message":
                "Client Work Order not found"

            }), 404


        conn.commit()


        return jsonify({

            "message":
            "Client Work Order Deleted Successfully"

        }), 200


    except Exception as e:

        if conn:

            conn.rollback()


        return jsonify({

            "message":
            "Delete failed",

            "error":
            str(e)

        }), 500


    finally:

        if cursor:

            cursor.close()


        if conn:

            conn.close()

# ============================================================
# SUPPLIER MSA CRUD
# ============================================================

@app.route('/supplier_msa', methods=['POST'])
def post_supplier_msa():

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    supplier_name = str(data.get('supplier_name', '')).strip()
    msa_number = str(data.get('msa_number', '')).strip()
    start_date = str(data.get('start_date', '')).strip()
    end_date = str(data.get('end_date', '')).strip()
    status = str(data.get('status', '')).strip()

    if not supplier_name or not msa_number:
        return jsonify({
            "message": "Supplier Name and MSA Number are required"
        }), 400

    if not validate_date_range(start_date, end_date):

        return jsonify({
            "message": "Invalid date range"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            INSERT INTO supplier_msa
            (
                supplier_name,
                msa_number,
                start_date,
                end_date,
                status
            )
            VALUES (%s,%s,%s,%s,%s)
        """

        cursor.execute(
            query,
            (
                supplier_name,
                msa_number,
                start_date,
                end_date,
                status
            )
        )

        conn.commit()

        return jsonify({
            "message": "Supplier MSA Created Successfully"
        }), 201

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_msa', methods=['GET'])
def get_supplier_msa():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM supplier_msa
            ORDER BY id DESC
        """)

        data = cursor.fetchall()

        return jsonify(data), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_msa/<int:id>', methods=['PUT'])
def update_supplier_msa(id):

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    supplier_name = str(data.get('supplier_name', '')).strip()
    msa_number = str(data.get('msa_number', '')).strip()
    start_date = str(data.get('start_date', '')).strip()
    end_date = str(data.get('end_date', '')).strip()
    status = str(data.get('status', '')).strip()

    if not validate_date_range(start_date, end_date):

        return jsonify({
            "message": "Invalid date range"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        query = """
            UPDATE supplier_msa
            SET
                supplier_name=%s,
                msa_number=%s,
                start_date=%s,
                end_date=%s,
                status=%s
            WHERE id=%s
        """

        cursor.execute(
            query,
            (
                supplier_name,
                msa_number,
                start_date,
                end_date,
                status,
                id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Supplier MSA not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Supplier MSA Updated Successfully"
        }), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_msa/<int:id>', methods=['DELETE'])
def delete_supplier_msa(id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            DELETE FROM supplier_msa
            WHERE id=%s
            """,
            (id,)
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Supplier MSA not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Supplier MSA Deleted Successfully"
        }), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_msa_active', methods=['GET'])
def supplier_msa_active():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                supplier_name,
                msa_number
            FROM supplier_msa
            WHERE status='Active'
            ORDER BY id DESC
        """)

        data = cursor.fetchall()

        return jsonify(data), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


# ============================================================
# SUPPLIER PO
# ============================================================

@app.route('/supplier_po', methods=['POST'])
def save_supplier_po():

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    resource_id = data.get('resource_id')
    supplier_msa_id = data.get('supplier_msa_id')
    po_number = str(data.get('po_number', '')).strip()
    project_name = str(data.get('project_name', '')).strip()
    start_date = str(data.get('start_date', '')).strip()
    end_date = str(data.get('end_date', '')).strip()
    amount = data.get('amount')
    status = str(data.get('status', '')).strip()

    if not resource_id:
        return jsonify({
            "message": "Resource is required"
        }), 400

    if not supplier_msa_id:
        return jsonify({
            "message": "Supplier MSA is required"
        }), 400

    if not validate_date_range(start_date, end_date):

        return jsonify({
            "message": "Invalid date range"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT start_date
            FROM resource
            WHERE resource_id=%s
            """,
            (resource_id,)
        )

        resource = cursor.fetchone()

        if not resource:

            return jsonify({
                "message": "Invalid Resource"
            }), 400

        po_date = datetime.strptime(
            start_date,
            "%Y-%m-%d"
        ).date()

        if po_date < resource["start_date"]:

            return jsonify({
                "message": "Supplier PO Start Date should be on or after Resource Start Date"
            }), 400

        query = """
            INSERT INTO supplier_po
            (
                supplier_msa_id,
                resource_id,
                po_number,
                project_name,
                start_date,
                end_date,
                amount,
                status
            )
            VALUES
            (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        cursor.execute(
            query,
            (
                supplier_msa_id,
                resource_id,
                po_number,
                project_name,
                start_date,
                end_date,
                amount,
                status
            )
        )

        conn.commit()

        return jsonify({
            "message": "Supplier PO Saved Successfully"
        }), 201

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_po', methods=['GET'])
def get_supplier_po():

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                supplier_po.*,
                supplier_msa.supplier_name,
                supplier_msa.msa_number
            FROM supplier_po
            JOIN supplier_msa
                ON supplier_po.supplier_msa_id = supplier_msa.id
            ORDER BY supplier_po.id DESC
        """

        cursor.execute(query)

        data = cursor.fetchall()

        return jsonify(data), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_po/<int:id>', methods=['PUT'])
def update_supplier_po(id):

    data, error_response, error_status = get_json_data()

    if error_response:
        return error_response, error_status

    resource_id = data.get('resource_id')
    supplier_msa_id = data.get('supplier_msa_id')
    po_number = str(data.get('po_number', '')).strip()
    project_name = str(data.get('project_name', '')).strip()
    start_date = str(data.get('start_date', '')).strip()
    end_date = str(data.get('end_date', '')).strip()
    amount = data.get('amount')
    status = str(data.get('status', '')).strip()

    if not validate_date_range(start_date, end_date):

        return jsonify({
            "message": "Invalid date range"
        }), 400

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT start_date
            FROM resource
            WHERE resource_id=%s
            """,
            (resource_id,)
        )

        resource = cursor.fetchone()

        if not resource:

            return jsonify({
                "message": "Invalid Resource"
            }), 400

        po_date = datetime.strptime(
            start_date,
            "%Y-%m-%d"
        ).date()

        if po_date < resource["start_date"]:

            return jsonify({
                "message": "Supplier PO Start Date should be on or after Resource Start Date"
            }), 400

        query = """
            UPDATE supplier_po
            SET
                supplier_msa_id=%s,
                resource_id=%s,
                po_number=%s,
                project_name=%s,
                start_date=%s,
                end_date=%s,
                amount=%s,
                status=%s
            WHERE id=%s
        """

        cursor.execute(
            query,
            (
                supplier_msa_id,
                resource_id,
                po_number,
                project_name,
                start_date,
                end_date,
                amount,
                status,
                id
            )
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Supplier PO not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Supplier PO Updated Successfully"
        }), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


@app.route('/supplier_po/<int:id>', methods=['DELETE'])
def delete_supplier_po(id):

    conn = None
    cursor = None

    try:

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            DELETE FROM supplier_po
            WHERE id=%s
            """,
            (id,)
        )

        if cursor.rowcount == 0:

            return jsonify({
                "message": "Supplier PO not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Supplier PO Deleted Successfully"
        }), 200

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()

@app.route("/resource_details_by_name/<resource_name>", methods=["GET"])
def resource_details_by_name(resource_name):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    try:

        query = """

            SELECT
                first_name,
                last_name,
                company_name,
                resource_type,
                start_date

            FROM resource

            WHERE CONCAT(first_name, ' ', last_name) = %s

        """

        cursor.execute(

            query,

            (resource_name,)

        )


        resource = cursor.fetchone()


        if not resource:

            return jsonify({

                "error": "Resource not found"

            }), 404


        return jsonify({

            "company_name":

                resource["company_name"],

            "resource_type":

                resource["resource_type"],

            "start_date":

                resource["start_date"].strftime("%Y-%m-%d")

                if resource["start_date"]

                else ""

        })


    except Exception as e:

        print("RESOURCE DETAILS ERROR:", e)

        return jsonify({

            "error": str(e)

        }), 500


    finally:

        cursor.close()

        conn.close()
# ==========================================
# TIMESHEET MODULE
# ==========================================
# ==========================================
# CREATE TIMESHEET
# ==========================================

@app.route("/timesheet", methods=["POST"])
def create_timesheet():

    try:

        data = request.get_json()

        print("Received Timesheet Data:", data)

        resource_id = data.get("resource_id")

        project_name = data.get("project_name")

        week_start_date = data.get("week_start_date")

        week_end_date = data.get("week_end_date")

        monday_hours = data.get("monday_hours", 0) or 0

        tuesday_hours = data.get("tuesday_hours", 0) or 0

        wednesday_hours = data.get("wednesday_hours", 0) or 0

        thursday_hours = data.get("thursday_hours", 0) or 0

        friday_hours = data.get("friday_hours", 0) or 0

        saturday_hours = data.get("saturday_hours", 0) or 0

        sunday_hours = data.get("sunday_hours", 0) or 0

        description = data.get("description")

        status = data.get("status", "Draft")


        # ==============================
        # VALIDATION
        # ==============================

        if not resource_id:

            return jsonify({

                "error": "Resource is required"

            }), 400


        if not week_start_date:

            return jsonify({

                "error": "Week start date is required"

            }), 400


        if not week_end_date:

            return jsonify({

                "error": "Week end date is required"

            }), 400


        if status not in ["Draft", "Submitted"]:

            return jsonify({

                "error": "Invalid status"

            }), 400


        # ==============================
        # HOURS VALIDATION
        # ==============================

        hours = [

            monday_hours,

            tuesday_hours,

            wednesday_hours,

            thursday_hours,

            friday_hours,

            saturday_hours,

            sunday_hours

        ]


        for hour in hours:

            if float(hour) < 0 or float(hour) > 24:

                return jsonify({

                    "error": "Daily hours must be between 0 and 24"

                }), 400


        # ==============================
        # CALCULATE TOTAL HOURS
        # ==============================

        total_hours = sum(

            float(hour)

            for hour in hours

        )


        # ==============================
        # DATABASE CONNECTION
        # ==============================

        conn = get_connection()

        cursor = conn.cursor()


        query = """

            INSERT INTO timesheet (

                resource_id,

                project_name,

                week_start_date,

                week_end_date,

                monday_hours,

                tuesday_hours,

                wednesday_hours,

                thursday_hours,

                friday_hours,

                saturday_hours,

                sunday_hours,

                total_hours,

                description,

                status

            )

            VALUES (

                %s, %s, %s, %s,

                %s, %s, %s, %s,

                %s, %s, %s,

                %s, %s, %s

            )

        """


        values = (

            resource_id,

            project_name,

            week_start_date,

            week_end_date,

            monday_hours,

            tuesday_hours,

            wednesday_hours,

            thursday_hours,

            friday_hours,

            saturday_hours,

            sunday_hours,

            total_hours,

            description,

            status

        )


        cursor.execute(query, values)


        conn.commit()


        timesheet_id = cursor.lastrowid


        cursor.close()

        conn.close()


        return jsonify({

            "message": "Timesheet created successfully",

            "timesheet_id": timesheet_id,

            "total_hours": total_hours,

            "status": status

        }), 201


    except Exception as e:

        print("Create Timesheet Error:", str(e))


        return jsonify({

            "error": str(e)

        }), 500
		
# ==========================================
# SUBMIT TIMESHEET
# ==========================================
@app.route("/timesheet", methods=["GET"])
def get_timesheets():

    try:

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT
                t.timesheet_id,
                t.resource_id,
                CONCAT(r.first_name, ' ', r.last_name) AS resource_name,
                t.project_name,
                t.week_start_date,
                t.week_end_date,
                t.monday_hours,
                t.tuesday_hours,
                t.wednesday_hours,
                t.thursday_hours,
                t.friday_hours,
                t.saturday_hours,
                t.sunday_hours,
                t.total_hours,
                t.description,
                t.status,
                t.created_at

            FROM timesheet t

            LEFT JOIN resource r
                ON t.resource_id = r.resource_id

            ORDER BY t.timesheet_id DESC
        """

        cursor.execute(query)

        timesheets = cursor.fetchall()

        cursor.close()

        conn.close()

        return jsonify(timesheets), 200


    except Exception as e:

        print("Get Timesheets Error:", str(e))

        return jsonify({

            "error": str(e)

        }), 500

@app.route("/timesheet/<int:id>/submit", methods=["PUT"])
def submit_timesheet(id):

    try:

        cursor = mysql.connection.cursor(

            dictionary=True

        )


        # ==============================
        # CHECK TIMESHEET
        # ==============================

        cursor.execute(

            """

            SELECT status

            FROM timesheet

            WHERE timesheet_id = %s

            """,

            (id,)

        )


        timesheet = cursor.fetchone()


        if not timesheet:

            cursor.close()


            return jsonify({

                "error": "Timesheet not found"

            }), 404


        # Already submitted

        if timesheet["status"] == "Submitted":

            cursor.close()


            return jsonify({

                "error": "Timesheet is already submitted"

            }), 400


        # ==============================
        # SUBMIT
        # ==============================

        cursor.execute(

            """

            UPDATE timesheet

            SET status = 'Submitted'

            WHERE timesheet_id = %s

            """,

            (id,)

        )


        mysql.connection.commit()


        cursor.close()


        return jsonify({

            "message": "Timesheet submitted successfully",

            "status": "Submitted"

        }), 200


    except Exception as e:

        print("Submit Timesheet Error:", str(e))


        return jsonify({

            "error": str(e)

        }), 500
		
# ============================================================
# HTML PAGES
# ============================================================

@app.route('/')
def login_page():

    return render_template('login.html')


@app.route('/companypage')
def company_page():

    return render_template('company.html')


@app.route('/resourcepage')
def resource_page():

    return render_template('resource.html')


@app.route('/client_msa_page')
def client_msa_page():

    return render_template('client_msa.html')


@app.route('/client_work_order_page')
def client_work_order_page():

    return render_template('client_work_order.html')


@app.route('/supplier_msa_page')
def supplier_msa_page():

    return render_template('supplier_msa.html')


@app.route('/supplier_po_page')
def supplier_po_page():

    return render_template('supplier_po.html')

@app.route("/timesheet_page")
def timesheet_page():

    return render_template(

        "timesheet.html"

    )


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == '__main__':

    app.run(
        debug=True
    )