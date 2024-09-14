// src/screens/HomeScreen.js
import React, { useCallback, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getTodos, deleteTodo } from '../api/api';

export default function HomeScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [todos, setTodos] = useState([]);

    useFocusEffect(
        useCallback(() => {
            fetchTodos();
        }, [])
    );

    const fetchTodos = async () => {
        try {
            const todos = await getTodos();
            setTodos(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
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
                        <Text style={styles.text}>{item.task}</Text>
                        <Button
                            title="Edit"
                            onPress={() => navigation.navigate('EditTodo', { id: item.id })}
                        />
                        <Button title="Delete" onPress={() => handleDeleteTodo(item.id)} />
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            {/* Button to navigate to AddTodoScreen */}
            <Button title="Add New Task" onPress={() => navigation.navigate('AddTodo')} />
        </View>
    );
}

const createStyles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.background,
    },
    todoContainer: {
        marginBottom: 10,
    },
    text: {
        color: colors.text,
    },
});

