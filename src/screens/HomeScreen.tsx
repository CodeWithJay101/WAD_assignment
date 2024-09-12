// src/TodoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/api';

export default function HomeScreen() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const todos = await getTodos();
            setTodos(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleAddTodo = async () => {
        try {
            await createTodo({ task });
            setTask('');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleUpdateTodo = async (id, updatedTask) => {
        try {
            await updateTodo(id, { task: updatedTask });
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const handleDeleteTodo = async (id) => {
        try {
            await deleteTodo(id);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={todos}
                renderItem={({ item }) => (
                    <View style={styles.todoContainer}>
                        <Text>{item.task}</Text>
                        <Button title="Edit" onPress={() => setEditId(item.id)} />
                        <Button title="Delete" onPress={() => handleDeleteTodo(item.id)} />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <TextInput
                style={styles.input}
                value={task}
                onChangeText={setTask}
                placeholder="New task"
            />
            <Button title="Add Task" onPress={handleAddTodo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    todoContainer: {
        marginBottom: 10,
    },
});
