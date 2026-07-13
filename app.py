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
@app.route("/companypage")
def company_page():
    return render_template("company.html")



if __name__ == "__main__":
    app.run(debug=True)