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
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            completed BOOLEAN NOT NULL DEFAULT 0,
            starred BOOLEAN NOT NULL DEFAULT 0,
            deleted BOOLEAN NOT NULL DEFAULT 0,
            deleted_date DATETIME,
            list_id INTEGER
        );
    ''')
    conn.commit()
    conn.close()
    print("Database created and schema initialized.")

init_db()

@app.route('/todos', methods=['GET'])
def get_todos():
    conn = get_db_connection()
    todos = conn.execute('SELECT * FROM todos').fetchall()
    conn.close()
    return jsonify([dict(todo) for todo in todos])

@app.route('/todos/<int:id>', methods=['GET'])
def get_todo(id):
    conn = get_db_connection()
    todo = conn.execute('SELECT * FROM todos WHERE id = ?', (id,)).fetchone()
    conn.close()
    if todo is None:
        return jsonify({'error': 'Todo not found'}), 404
    return jsonify(dict(todo))

@app.route('/todos', methods=['POST'])
def create_todo():
    new_todo = request.get_json()
    task = new_todo['task']
    conn = get_db_connection()
    conn.execute('INSERT INTO todos (task) VALUES (?)', (task,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo created'}), 201

@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    updated_todo = request.get_json()
    task = updated_todo.get('task')
    completed = updated_todo.get('completed')
    starred = updated_todo.get('starred')
    deleted = updated_todo.get('deleted')
    conn = get_db_connection()
    conn.execute('UPDATE todos SET task = ?, completed = ?, starred = ?, deleted = ? WHERE id = ?', (task, completed, starred, deleted, id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo updated'})

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM todos WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Todo deleted'})

if __name__ == '__main__':
    app.run(debug=True, port=3333)
