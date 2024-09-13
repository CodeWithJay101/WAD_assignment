// src/screens/NotesScreen.jsx
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import { getNote, createNote, updateNote } from '../api/api';

export default function NotesScreen() {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const fetchNote = async () => {
                try {
                    setLoading(true);
                    const data = await getNote();
                    if (data.note) {
                        setNote(data.note); // Initialize the note with the fetched note
                    }
                } catch (error) {
                    setError('Failed to load note');
                    console.error('Error fetching note:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchNote();
        }, [])
    );

    const handleUpdateNote = async () => {
        if (!note.trim()) {
            Alert.alert('Error', 'Note cannot be empty');
            return;
        }

        try {
            await updateNote(note);
            Alert.alert('Success', 'Note updated successfully!');
        } catch (error) {
            console.error('Error updating note:', error);
            Alert.alert('Error', 'An error occurred while updating the note.');
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color={colors.text} />;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.noteInput]}
                placeholder="Enter your note here"
                multiline
                value={note}
                onChangeText={setNote}
                placeholderTextColor={colors.text}
                textAlignVertical="top"
            />
            <Button title="Update Note" onPress={handleUpdateNote} />
        </View>
    );
}

