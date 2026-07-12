from flask import Flask, request, jsonify
from database import get_connection

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

if __name__ == "__main__":
    app.run(debug=True)