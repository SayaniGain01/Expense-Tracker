import mysql.connector

def get_connection():
    conn = mysql.connector.connect(
        host="localhost",      # or your IP, e.g., "127.0.0.1"
        user="root",  # the one you use in Workbench
        password="Sayani@2001",
        database="expense_manager"  # the one you created in Workbench
    )
    return conn

def run_query(query, params=None):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(query, params or ())

    # 🔁 If it's a SELECT, fetch results
    if query.strip().lower().startswith("select"):
        results = cursor.fetchall()
    else:
        conn.commit()
        results = {"affected_rows": cursor.rowcount, "last_insert_id": cursor.lastrowid}

    cursor.close()
    conn.close()
    return results


