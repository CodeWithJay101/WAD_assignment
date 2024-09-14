import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import DropDownPicker from 'react-native-dropdown-picker';
import { createFeedback } from '../api/api'; // Ensure you have this API method

export default function FeedbackScreen() {
    const { colors } = useTheme();

    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState(null);

    const [errors, setErrors] = useState({
        email: false,
        category: false,
        description: false,
    });

    const MIN_DESC_LENGTH = 10;
    const MAX_DESC_LENGTH = 100;

    const handleSubmitFeedback = async () => {
        setErrors({ email: false, category: false, description: false });
        let hasErrors = false;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrors(prev => ({ ...prev, email: true }));
            hasErrors = true;
        }

        if (!feedbackType) {
            setErrors(prev => ({ ...prev, category: true }));
            hasErrors = true;
        }

        if (!description.trim() || description.length < MIN_DESC_LENGTH || description.length > MAX_DESC_LENGTH) {
            setErrors(prev => ({ ...prev, description: true }));
            hasErrors = true;
            const errorMessage = description.length < MIN_DESC_LENGTH
                ? `Description must be at least ${MIN_DESC_LENGTH} characters long.`
                : `Description must be less than ${MAX_DESC_LENGTH} characters long.`;
            Alert.alert('Error', errorMessage);
        }

        if (hasErrors) {
            Alert.alert('Error', 'Please fix the errors before submitting.');
            return;
        }

        try {
            await createFeedback({ email, category: feedbackType, description });
            setEmail('');
            setFeedbackType(null);
            setDescription('');
            Alert.alert('Success', 'Feedback submitted successfully!');
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert('Error', 'An error occurred while submitting feedback.');
        }
    };

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
            <Text style={{ fontSize: 16, color: colors.text, marginBottom: 8 }}>Email</Text>
            <TextInput
                style={[{
                    height: 40,
                    borderColor: errors.email ? 'red' : colors.border,
                    borderWidth: 1,
                    marginBottom: 10,
                    paddingHorizontal: 8,
                    color: colors.text,
                }, errors.email && { borderColor: 'red' }]}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCompleteType="email"
                placeholderTextColor={colors.text}
            />
            {errors.email && <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>Invalid email address</Text>}

            <Text style={{ fontSize: 16, color: colors.text, marginBottom: 8 }}>Feedback Type</Text>
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
            {errors.category && <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>Category is required</Text>}

            <Text style={{ fontSize: 16, color: colors.text, marginBottom: 8 }}>Description</Text>
            <TextInput
                style={[{
                    height: 100,
                    borderColor: errors.description ? 'red' : colors.border,
                    borderWidth: 1,
                    marginBottom: 10,
                    paddingHorizontal: 8,
                    color: colors.text,
                }, errors.description && { borderColor: 'red' }]}
                placeholder="Enter feedback description"
                multiline
                numberOfLines={5}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
                placeholderTextColor={colors.text}
            />
            {errors.description && <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>Description is required</Text>}

            <Button title="Submit Feedback" onPress={handleSubmitFeedback} color="#007BFF" />
        </View>
    );
}

