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
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            note TEXT
        );
    ''')
    conn.commit()
    conn.close()
    print("Database created and schema initialized.")

init_db()

@app.route('/note', methods=['GET'])
def get_note():
    conn = get_db_connection()
    notes = conn.execute('SELECT * FROM notes').fetchall()
    conn.close()
    return jsonify([dict(note) for note in notes])

@app.route('/note', methods=['POST'])
def create_note():
    new_note = request.get_json()
    note = new_note.get('note')
    conn = get_db_connection()
    conn.execute('INSERT INTO notes (note) VALUES (?)', (note,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note created'}), 201

@app.route('/note', methods=['PUT'])
def update_note():
    updated_note = request.get_json()
    note = updated_note.get('note')
    conn = get_db_connection()
    conn.execute('UPDATE notes SET note = ? WHERE id = 1', (note,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Note updated'})

if __name__ == '__main__':
    app.run(debug=True, port=6000)
