from flask import Flask, request, jsonify
from database import get_connection
from flask import render_template

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():

    data = request.get_json(force=True)
    print(data)

    username = data['username']
    password = data['password']

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT * FROM users
    WHERE username=%s
    AND password=%s
    AND status='Active'
    """

    cursor.execute(query, (username, password))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user:
        return jsonify({
            "message": "Login Successful",
            "user": user
        })

    else:
        return jsonify({
            "message": "Invalid Username or Password"
        }), 401
@app.route('/company', methods=['POST'])
def create_company():

    data = request.get_json()

    company_name = data['company_name']
    email = data['email']
    phone = data['phone']
    address = data['address']
    status = data['status']

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO company(company_name, email, phone, address, status)
    VALUES (%s, %s, %s, %s, %s)
    """

    values = (company_name, email, phone, address, status)

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Company Created Successfully"
    }), 201
@app.route('/company', methods=['GET'])
def get_company():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM company")

    companies = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(companies)
@app.route('/company/<int:id>', methods=['PUT'])
def update_company(id):

    data = request.get_json()

    company_name = data['company_name']
    email = data['email']
    phone = data['phone']
    address = data['address']
    status = data['status']

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE company
    SET company_name=%s,
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
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Company Updated Successfully"})
@app.route('/company/<int:id>', methods=['DELETE'])
def delete_company(id):

    conn = get_connection()
    cursor = conn.cursor()

    query = "DELETE FROM company WHERE company_id=%s"

    cursor.execute(query, (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Company Deleted Successfully"
    })
@app.route('/resource', methods=['POST'])
def create_resource():

    data = request.get_json()

    print("Received Data:", data)
    print("Data Type:", type(data))

    employee_id = str(data.get('employee_id', '')).strip()
    first_name = str(data.get('first_name', '')).strip()
    last_name = str(data.get('last_name', '')).strip()
    email = str(data.get('email', '')).strip()
    phone = str(data.get('phone', '')).strip()
    designation = str(data.get('designation', '')).strip()
    resource_type = str(data.get('resource_type', '')).strip()
    company_id = data.get('company_id')
    status = str(data.get('status', '')).strip()

    # Validation
    if employee_id == "":
        return jsonify({"message": "Employee ID is required"}), 400

    if first_name == "":
        return jsonify({"message": "First Name is required"}), 400

    if last_name == "":
        return jsonify({"message": "Last Name is required"}), 400

    if email == "":
        return jsonify({"message": "Email is required"}), 400

    if len(phone) != 10:
        return jsonify({"message": "Phone number must be 10 digits"}), 400

    if designation == "":
        return jsonify({"message": "Designation is required"}), 400
    if resource_type == "":
        return jsonify({"message": "Please select a resource type"}), 400

    if not company_id:
        return jsonify({"message": "Please select a company"}), 400

    if status == "":
        return jsonify({"message": "Please select a status"}), 400

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
        resource_type,
        company_id,
        status
    )
    VALUES
    (
        %s,%s,%s,%s,%s,%s,%s,%s,%s
    )
    """

    cursor.execute(query, (
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        designation,
        resource_type,
        company_id,
        status
    ))

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Resource Created Successfully"
    }), 201
@app.route('/resource', methods=['GET'])
def get_resource():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
    SELECT
        r.resource_id,
        r.employee_id,
        r.first_name,
        r.last_name,
        r.email,
        r.phone,
        r.designation,
        r.resource_type,
        r.status,
        c.company_name
    FROM resource r
    JOIN company c
    ON r.company_id = c.company_id
    """

    cursor.execute(query)

    resources = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(resources)
@app.route('/resource/<int:id>', methods=['PUT'])
def update_resource(id):

    data = request.get_json()

    employee_id = data['employee_id']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    phone = data['phone']
    designation = data['designation']
    resource_type = str(data.get('resource_type', '')).strip()
    company_id = data['company_id']
    status = data['status']

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE resource
    SET employee_id=%s,
        first_name=%s,
        last_name=%s,
        email=%s,
        phone=%s,
        designation=%s,
        resource_type=%s,
        company_id=%s,
        status=%s
    WHERE resource_id=%s
    """

    values = (
        employee_id,
        first_name,
        last_name,
        email,
        phone,
        designation,
        resource_type,
        company_id,
        status,
        id
    )

    cursor.execute(query, values)
    print("Rows Updated:", cursor.rowcount)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Resource Updated Successfully"})
@app.route('/resource/<int:id>', methods=['DELETE'])
def delete_resource(id):

    conn = get_connection()
    cursor = conn.cursor()

    query = "DELETE FROM resource WHERE resource_id=%s"

    cursor.execute(query, (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Resource Deleted Successfully"})

@app.route('/client_msa', methods=['POST'])
def post_client_msa():

    data = request.get_json()

    client_name = data['client_name']
    msa_number = data['msa_number']
    start_date = data['start_date']
    end_date = data['end_date']
    status = data['status']

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO client_msa
    (client_name, msa_number, start_date, end_date, status)
    VALUES (%s, %s, %s, %s, %s)
    """

    values = (
        client_name,
        msa_number,
        start_date,
        end_date,
        status
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Client MSA Created Successfully"})
@app.route('/client_msa', methods=['GET'])
def get_client_msa():

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM client_msa"

    cursor.execute(query)
    client_msa = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(client_msa)

@app.route('/client_msa/<int:id>', methods=['PUT'])
def update_client_msa(id):

    data = request.get_json(force=True)

    client_name = data['client_name']
    msa_number = data['msa_number']
    start_date = data['start_date']
    end_date = data['end_date']
    status = data['status']

    conn = get_connection()
    cursor = conn.cursor()

    query = """
    UPDATE client_msa
    SET
        client_name = %s,
        msa_number = %s,
        start_date = %s,
        end_date = %s,
        status = %s
    WHERE id = %s
    """

    values = (
        client_name,
        msa_number,
        start_date,
        end_date,
        status,
        id
    )

    cursor.execute(query, values)
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Client MSA Updated Successfully"})

@app.route('/client_msa/<int:id>', methods=['DELETE'])
def delete_client_msa(id):

    conn = get_connection()
    cursor = conn.cursor()

    query = "DELETE FROM client_msa WHERE client_msa_id=%s"

    cursor.execute(query, (id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Client MSA Deleted Successfully"})

@app.route("/companypage")
def company_page():
    return render_template("company.html")
@app.route("/")
def login_page():   
    return render_template("login.html")
@app.route("/resourcepage")
def resource_page():
    return render_template("resource.html")
@app.route('/client_msa_page')
def client_msa_page():
    return render_template('client_msa.html')
if __name__ == "__main__":
    app.run(debug=True)