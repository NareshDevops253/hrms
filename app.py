from flask import Flask
import mysql.connector

app = Flask(__name__)

connection = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="Naresh@123",
    database="hrms"
)

@app.route('/')
def home():
    return "Database Connected Successfully"

if __name__ == "__main__":
    app.run(debug=True)