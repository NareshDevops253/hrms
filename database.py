import mysql.connector

try:
    connection = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="Naresh@123",
        database="hrms"
    )

    if connection.is_connected():
        print("Database Connected Successfully!")

except mysql.connector.Error as err:
    print("Error:", err)