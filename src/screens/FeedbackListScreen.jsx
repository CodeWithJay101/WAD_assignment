import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, TextInput, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getFeedbacks, deleteFeedback } from '../api/api';

const CATEGORY_LABELS = {
    bug: 'Bug',
    improvement: 'Improvement',
    feature_request: 'Feature Request',
};

export default function FeedbackListScreen() {
    const { colors } = useTheme();

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchFeedbacks = async () => {
                try {
                    setLoading(true);
                    const data = await getFeedbacks();
                    setFeedbacks(data);
                } catch (error) {
                    setError('Failed to load feedbacks');
                    console.error('Error fetching feedbacks:', error);
                } finally {
                    setLoading(false);
                }
            };

            if (isAuthenticated) {
                fetchFeedbacks();
            }
        }, [isAuthenticated])
    );

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
            setError(null);
        } else {
            Alert.alert('Authentication failed', 'Only Admins can view this page.');
        }
    };

    const handleResolve = async (id) => {
        try {
            await deleteFeedback(id);
            const data = await getFeedbacks();
            setFeedbacks(data);
        } catch (error) {
            console.error('Error deleting feedback:', error);
            Alert.alert('Error', 'Failed to resolve feedback.');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
        setFeedbacks([]);
    };

    const renderFeedbackItem = ({ item }) => (
        <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.cardBackground, marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: colors.text }}>Email: {item.email}</Text>
            <Text style={{ fontSize: 16, color: colors.text }}>Category: {CATEGORY_LABELS[item.category] || item.category}</Text>
            <Text style={{ fontSize: 16, color: colors.text }}>Description: {item.description}</Text>
            <Button title="Resolve" onPress={() => handleResolve(item.id)} color="#007BFF" />
        </View>
    );

    if (!isAuthenticated) {
        return (
            <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.text }}>Admins Only</Text>
                <TextInput
                    style={{ height: 40, borderColor: colors.border, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, color: colors.text }}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor={colors.text}
                />
                <TextInput
                    style={{ height: 40, borderColor: colors.border, borderWidth: 1, marginBottom: 10, paddingHorizontal: 8, color: colors.text }}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor={colors.text}
                />
                <Button title="Login" onPress={handleLogin} color="#007BFF" />
            </View>
        );
    }

    if (loading) {
        return <ActivityIndicator size="large" color={colors.text} />;
    }

    if (error) {
        return (
            <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
                <Text style={{ color: 'red', fontSize: 16, textAlign: 'center' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: colors.text }}>Submitted Feedback</Text>
            <FlatList
                data={feedbacks}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<Text style={{ fontSize: 16, color: colors.text, textAlign: 'center', marginTop: 20 }}>No feedback available</Text>}
            />
            <View style={{ marginTop: 20, alignItems: 'center' }}>
                <Button title="Logout" onPress={handleLogout} color="#FF0000" />
            </View>
        </View>
    );
}
