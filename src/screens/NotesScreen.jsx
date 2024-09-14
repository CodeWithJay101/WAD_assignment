import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getNote, createNote, updateNote } from '../api/api';

export default function NotesScreen() {
    const { colors } = useTheme();

    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasNote, setHasNote] = useState(false);  // To track if a note exists or not

    useFocusEffect(
        useCallback(() => {
            const fetchNote = async () => {
                try {
                    setLoading(true);
                    const data = await getNote();
                    if (data && data.note) {
                        setNote(data.note); // Initialize the note with the fetched note
                        setHasNote(true);    // Note exists, proceed to UI
                    } else {
                        setHasNote(false);   // No note found, show start button
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

    const handleCreateNote = async () => {
        try {
            setLoading(true);
            await createNote('');  // Create an empty note in the database
            setHasNote(true);      // Switch to note-editing UI
        } catch (error) {
            console.error('Error creating note:', error);
            Alert.alert('Error', 'An error occurred while creating the note.');
        } finally {
            setLoading(false);
        }
    };

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

    // If no note exists, show a button to start taking notes
    if (!hasNote) {
        return (
            <View style={styles.container}>
                <Button title="Start Taking Notes" onPress={handleCreateNote} />
            </View>
        );
    }

    // If a note exists, proceed with the regular note UI
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.noteInput}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    noteInput: {
        flex: 1, // Makes the input expand to fill the available space
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        color: '#000',
        textAlignVertical: 'top', // Ensures text starts at the top of the TextInput
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
