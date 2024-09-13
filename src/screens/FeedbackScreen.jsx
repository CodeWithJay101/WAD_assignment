// src/screens/FeedbackScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { createFeedback } from '../api/api'; // Ensure you have this API method

export default function FeedbackScreen() {
    const { colors } = useTheme();
    const styles = createStyles(colors);

    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState([
        { label: 'Bug', value: 'bug' },
        { label: 'Improvement', value: 'improvement' },
        { label: 'Feature Request', value: 'feature_request' }
    ]);

    const [open, setOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState(null);

    // State to track validation errors
    const [errors, setErrors] = useState({
        email: false,
        category: false,
        description: false,
    });

    const handleSubmitFeedback = async () => {
        //Reset errors
        setErrors({ email: false, category: false, description: false })
        let hasErrors = false;

        //Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors((prev) => ({ ...prev, email: true }));
            hasErrors = true;
        }

        // Check if fields are empty
        if (!feedbackType) {
            setErrors((prev) => ({ ...prev, category: true }));
            hasErrors = true;
        }

        if (!description.trim()) {
            setErrors((prev) => ({ ...prev, description: true }));
            hasErrors = true;
        }

        if (hasErrors) {
            Alert.alert('Error', 'Please fix the errors before submitting.');
            return;
        }

        try {
            await createFeedback({ email, category: feedbackType, description });
            setEmail('');
            setFeedbackType(null); //Reset feedbackType
            setDescription('');
            Alert.alert('Success', 'Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', 'An error occurred while submitting feedback.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, errors.email && styles.errorInput]}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCompleteType="email"
                placeholderTextColor={colors.text}
            />
            {errors.email && <Text style={styles.errorText}>Invalid email address</Text>}

            <Text style={styles.label}>Feedback Type</Text>
            <DropDownPicker
                open={open}
                value={feedbackType}
                items={[
                    { label: 'Bug', value: 'bug' },
                    { label: 'Improvement', value: 'improvement' },
                    { label: 'Feature Request', value: 'feature_request' },
                ]}
                setOpen={setOpen}
                setValue={setFeedbackType}
                style={{ backgroundColor: colors.button, borderColor: colors.button }}
                textStyle={{ color: colors.text }}
                dropDownContainerStyle={{ backgroundColor: colors.background }}
                placeholder="Select feedback type"
                containerStyle={{ marginBottom: 20 }}
            />
            {errors.category && <Text style={styles.errorText}>Category is required</Text>}

            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea, errors.description && styles.errorInput]}
                placeholder="Enter feedback description"
                multiline
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
                placeholderTextColor={colors.text}
            />
            {errors.description && <Text style={styles.errorText}>Description is required</Text>}

            <Button title="Submit Feedback" onPress={handleSubmitFeedback} color="#007BFF" />
        </View>
    );
}
