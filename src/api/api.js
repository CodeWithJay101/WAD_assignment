// src/api.js
const API_URL = 'http://10.0.2.2'; // Replace with your Flask server URL
const TODO_PORT = 3333
const LIST_PORT = 3344
const FEEDBACK_PORT = 4444
const NOTE_PORT = 6000

export const getTodos = async () => {
    try {
        const response = await fetch(`${API_URL}:${TODO_PORT}/todos`);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Attempt to parse the JSON
        const data = await response.json();
        console.log('Fetched todos:', data);
        return data;
    } catch (error) {
        console.error('Error fetching todos:', error);
        throw error;
    }
};

// Fetch a single todo by ID
export const getTodo = async (id) => {
    try {
        const response = await fetch(`${API_URL}:${TODO_PORT}/todos/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching todo:', error);
        throw error;
    }
};

// Create a new todo
export const createTodo = async (todo) => {
    try {
        const response = await fetch(`${API_URL}:${TODO_PORT}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
    }
};

// Update a todo by ID
export const updateTodo = async (id, todo) => {
    try {
        const response = await fetch(`${API_URL}:${TODO_PORT}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
    }
};

// Delete a todo by ID
export const deleteTodo = async (id) => {
    try {
        const response = await fetch(`${API_URL}:${TODO_PORT}/todos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
    }
};
