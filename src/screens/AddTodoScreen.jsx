// src/AddTodoScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createTodo } from '../api/api';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';

export default function AddTodoScreen() {
    const { colors } = useTheme();
    const styles = createStyles(colors);
    const navigation = useNavigation();
    const [task, setTask] = useState('');

    const handleAddTodo = async () => {
        if (!task.trim()) {
            Alert.alert('Error', 'Task cannot be empty');
            return;
        }

        try {
            await createTodo({ task });
            setTask('');
            navigation.goBack(); 
        } catch (error) {
            console.error('Error adding todo:', error);
            Alert.alert('Error', 'Something went wrong while adding the task');
        }
    };

    return (
        <View style={styles.container}>
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
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
});
