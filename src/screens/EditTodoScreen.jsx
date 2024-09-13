import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import { getTodo, updateTodo } from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icon library

export default function EditTodoScreen({ navigation }) {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const route = useRoute(); // Get route object from the hook
    const { id } = route.params; // Get the todo ID from route params
    const [task, setTask] = useState('');

    const [originalCompleted, setOriginalCompleted] = useState(null);
    const [originalStarred, setOriginalStarred] = useState(null);
    const [originalDeleted, setOriginalDeleted] = useState(null);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const todo = await getTodo(id);
                setTask(todo.task);
                setOriginalCompleted(todo.completed);
                setOriginalStarred(todo.starred);
                setOriginalDeleted(todo.deleted);
            } catch (error) {
                console.error('Error fetching todo:', error);
                Alert.alert('Error', 'Failed to load todo');
            }
        };

        fetchTodo();
    }, [id]);

    const handleUpdateTodo = async () => {
        if (!task.trim()) {
            Alert.alert('Error', 'Task cannot be empty');
            return;
        }
        try {
            await updateTodo(id, { 
                "task": task,
                "completed": originalCompleted,  // Preserve the original completed state
                "starred": originalStarred,      // Preserve the original starred state
                "deleted": originalDeleted       // Preserve the original deleted state
            });
            navigation.goBack(); // Navigate back to the previous screen after updating
        } catch (error) {
            console.error('Error updating todo:', error);
            Alert.alert('Error', 'Failed to update todo');
        }
    };

    return (
        <View style={styles.container}>
            <Icon 
                name="arrow-back" 
                size={24} 
                color={colors.text} 
                onPress={() => navigation.goBack()} 
                style={styles.backIcon}
            />
            <Text style={styles.text}>Edit Todo</Text>
            <TextInput
                style={styles.input}
                value={task}
                onChangeText={setTask}
                placeholder="Update task"
                placeholderTextColor={colors.text}
            />
            <Button title="Update Task" onPress={handleUpdateTodo} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
});
