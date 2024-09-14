// src/screens/TaskScreens.js
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

const TaskListScreen = ({ filter, title }) => {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const navigation = useNavigation();

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

    const handleUpdateTodo = async (id, updatedFields) => {
        try {
            await updateTodo(id, updatedFields);
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

    const renderItem = ({ item }) => (
        <View style={styles.todoBox}>
            <View style={styles.taskContainer}>
                <Text style={styles.text}>{item.task}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={() => handleUpdateTodo(item.id, { ...item, completed: !item.completed })}>
                    <Icon name={item.completed ? "check-box" : "check-box-outline-blank"} size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleUpdateTodo(item.id, { ...item, starred: !item.starred })} style={styles.icon}>
                    <Icon name={item.starred ? "star" : "star-border"} size={24} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteTodo(item.id)} style={styles.icon}>
                    <Icon name="delete" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const filteredTodos = todos.filter(filter);

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
             {/* <View>
                <TouchableOpacity onPress={handleBackPress}>
                    <Icon name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>{title}</Text> */}
            <FlatList
                data={filteredTodos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
            />
            {/* <TextInput
                style={styles.input}
                value={task}
                onChangeText={setTask}
                placeholder="New task"
                placeholderTextColor={colors.text}
            />
            <Button title="Add Task" onPress={handleAddTodo} /> */}
        </View>
    );
};

export const CompletedTasksScreen = () => (
    <TaskListScreen
        title="Completed Tasks"
        filter={todo => todo.completed && !todo.deleted}
    />
);

export const StarredTasksScreen = () => (
    <TaskListScreen
        title="Starred Tasks"
        filter={todo => todo.starred && !todo.deleted}
    />
);

export const DeletedTasksScreen = () => (
    <TaskListScreen
        title="Deleted Tasks"
        filter={todo => todo.deleted}
    />
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    todoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'space-between',
    },
    text: {
        flex: 1,
        marginRight: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
});
