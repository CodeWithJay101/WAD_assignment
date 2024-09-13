from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = 'todos.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
    ''')
    conn.commit()
    conn.close()
    print("Database created and schema initialized.")

init_db()

@app.route('/lists', methods=['GET'])
def get_lists():
    conn = get_db_connection()
    lists = conn.execute('SELECT * FROM lists').fetchall()
    conn.close()
    return jsonify([dict(list) for list in lists])

@app.route('/lists', methods=['POST'])
def create_list():
    new_list = request.get_json()
    name = new_list['name']
    conn = get_db_connection()
    conn.execute('INSERT INTO lists (name) VALUES (?)', (name,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'New list created'}), 201

@app.route('/lists/<int:id>', methods=['PUT'])
def update_list(id):
    updated_list = request.get_json()
    name = updated_list.get('name')
    conn = get_db_connection()
    conn.execute('UPDATE lists SET name = ? WHERE id = ?', (name, id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'List updated'})

@app.route('/lists/<int:id>', methods=['DELETE'])
def delete_list(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM lists WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'List deleted'})

if __name__ == '__main__':
    app.run(debug=True, port=3344)
