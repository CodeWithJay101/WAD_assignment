// src/HomeScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const [editId, setEditId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchTodos();
        }, [])
    );

    const fetchTodos = async () => {
        try {
            const todos = await getTodos();
            // Filter out completed and deleted tasks
            const filteredTodos = todos.filter(todo => !todo.completed && !todo.deleted);
            console.log('Fetched todos:', todos); //debug
            setTodos(filteredTodos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleAddTodo = async () => {
        try {
            await createTodo({ task, completed: 0, starred: 0, deleted: 0 });
            setTask('');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleUpdateTodo = async (id, updates) => {
        if (!task.trim()) {
            Alert.alert('Error', 'Task cannot be empty');
            return;
        }
        if (editId === null) return;
        try {
            await updateTodo(id, updates);
            setTask('');
            setEditId(null); // Clear edit state
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

    const handleEditTodo = (id, task) => {
        setEditId(id);
        setTask(task);
    };

    const handleToggleComplete = async (id, completed) => {
        try {
            await updateTodo(id, { completed: completed ? 0 : 1 });
            fetchTodos();
        } catch (error) {
            console.error('Error updating completed status:', error);
        }
    };

    const handleToggleStar = async (id, starred) => {
        try {
            await updateTodo(id, { starred: starred ? 0 : 1 });
            fetchTodos();
        } catch (error) {
            console.error('Error updating starred status:', error);
        }
    };

    const handleToggleDelete = async (id, deleted) => {
        try {
            await updateTodo(id, { deleted: deleted ? 0 : 1 });
            fetchTodos();
        } catch (error) {
            console.error('Error updating deleted status:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={todos}
                renderItem={({ item }) => (
                    <View style={styles.todoBox}>
                        <TouchableOpacity
                            onPress={() => handleToggleComplete(item.id, item.completed)}
                        >
                            <Icon
                                name={item.completed ? "check-box" : "check-box-outline-blank"}
                                size={24}
                                color={colors.text}
                            />
                        </TouchableOpacity>

                        <Text style={[ styles.textTodo]}>{item.task}</Text>

                        <View style={styles.actionsContainer}>
                            {/* Mark as deleted */}
                            <TouchableOpacity onPress={() => handleToggleDelete(item.id, item.deleted)}>
                                <Icon
                                    name="delete"
                                    size={24}
                                    color={colors.text}
                                />
                            </TouchableOpacity>

                            {/* Edit task */}
                            <TouchableOpacity onPress={() => navigation.navigate('EditTodoScreen', { id: item.id })}>
                                <Icon name="edit" size={24} color={colors.text} />
                            </TouchableOpacity>

                            {/* Toggle starred */}
                            <TouchableOpacity onPress={() => handleToggleStar(item.id, item.starred)}>
                                <Icon
                                    name={item.starred ? "star" : "star-border"}
                                    size={24}
                                    color={colors.text}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <TextInput
                style={styles.input}
                value={task}
                onChangeText={setTask}
                placeholder="New task"
                placeholderTextColor={colors.text}
            />
            <Button title="Add Task" onPress={handleAddTodo} />
        </View>
    );
}
