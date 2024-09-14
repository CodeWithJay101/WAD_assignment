// src/screens/FeedbackListScreen.js
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getFeedbacks, deleteFeedback } from '../api/api';
import { createStyles } from '../styles/themeStyles';

const CATEGORY_LABELS = {
    bug: 'Bug',
    improvement: 'Improvement',
    feature_request: 'Feature Request',
}

export default function FeedbackListing() {
    const { colors } = useTheme();
    const styles = createStyles(colors);

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

            fetchFeedbacks();
        }, [isAuthenticated])
    );

    const handleLogin = () => {
        if (username === 'admin' && password === 'admin') {
            setIsAuthenticated(true);
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
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
    };

    const renderFeedbackItem = ({ item }) => (
        <View style={styles.container}>
            <Text style={styles.label}>Email: {item.email}</Text>
            <Text style={styles.label}>Category: {CATEGORY_LABELS[item.category] || item.category}</Text>
            <Text style={styles.label}>Description: {item.description}</Text>
            <Button title='Resolve' onPress={() => handleResolve(item.id)} />
        </View>
    );

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Admins Only</Text>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Username"
                    placeholderTextColor={colors.text}
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                    placeholderTextColor={colors.text}
                />
                <Button title="Login" onPress={handleLogin} color = "blue"/>
            </View>
        );
    }

    if (loading) {
        return <ActivityIndicator size="large" color={colors.text}/>;
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={stylesInter.error.color}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Submitted Feedback</Text>
            <FlatList
                data={feedbacks}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id.toString()}
            />
        
            <View style={styles.footer}>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </View>
    );
}

const stylesInter = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    email: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    category: {
        fontSize: 16,
    },
    description: {
        fontSize: 16,
        marginTop: 5,
    },
    error: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    text: {
        color: 'black',
    }
});
