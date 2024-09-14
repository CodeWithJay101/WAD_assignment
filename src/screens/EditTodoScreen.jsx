import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getTodo, updateTodo } from '../api/api';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function EditTodoScreen({ navigation }) {
    const { colors } = useTheme();

    const route = useRoute();
    const { id } = route.params;
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
                "completed": originalCompleted,
                "starred": originalStarred,
                "deleted": originalDeleted
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error updating todo:', error);
            Alert.alert('Error', 'Failed to update todo');
        }
    };

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: colors.background }}>
            <Icon 
                name="arrow-back" 
                size={24} 
                color={colors.text} 
                onPress={() => navigation.goBack()} 
                style={{ marginBottom: 10 }}
            />
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.text }}>
                Edit Todo
            </Text>
            <TextInput
                style={{
                    height: 40,
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10,
                    color: colors.text,
                    marginBottom: 10,
                    paddingHorizontal: 8,
                }}
                value={task}
                onChangeText={setTask}
                placeholder="Update task"
                placeholderTextColor={colors.text}
            />
            <Button title="Update Task" onPress={handleUpdateTodo} />
        </View>
    );
}

