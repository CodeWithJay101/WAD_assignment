// src/HomeScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/api';

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
            console.log('Fetched todos:', todos); //debug
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

    const handleUpdateTodo = async () => {
        if (!task.trim()) {
            Alert.alert('Error', 'Task cannot be empty');
            return;
        }
        if (editId === null) return;
        try {
            await updateTodo(editId, { task });
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

    return (
        <View style={styles.container}>
            <FlatList
                data={todos}
                renderItem={({ item }) => (
                    <View style={styles.todoContainer}>
                        <Text style={styles.text}>{item.task}</Text>
                        <Button
                            title="Edit"
                            onPress={() => navigation.navigate('EditTodoScreen', { id: item.id })}
                        />
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
                placeholderTextColor={colors.text}
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
