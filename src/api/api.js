// src/api.js
const API_URL = 'http://127.0.0.1:5000'; // Replace with your Flask server URL

export const getTodos = async () => {
    try {
        console.log(`API URL: ${API_URL}`);
        const response = await fetch(`${API_URL}/todos`);
        console.log(response)
        if (!response.ok) {
            // Log the response status and text for debugging
            const errorText = await response.text();
            
            console.error(`Error response status: ${response.status}`);
            console.error(`Error response text: ${errorText}`);
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        // Attempt to parse the JSON
        console.log('hi')
        const data = await response.json();
        console.log('bye')
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
        const response = await fetch(`${API_URL}/todos/${id}`);
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
        const response = await fetch(`${API_URL}/todos`, {
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
        const response = await fetch(`${API_URL}/todos/${id}`, {
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
        const response = await fetch(`${API_URL}/todos/${id}`, {
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
