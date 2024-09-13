// src/screens/FeedbackListScreen.js
import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { getFeedbacks } from '../api/api';
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
        }, [])
    );

    const renderFeedbackItem = ({ item }) => (
        <View style={styles.container}>
            <Text style={styles.label}>Email: {item.email}</Text>
            <Text style={styles.label}>Category: {CATEGORY_LABELS[item.category] || item.category}</Text>
            <Text style={styles.label}>Description: {item.description}</Text>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color={colors.text}/>;
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
            <Text style={styles.title}>Submitted Feedback</Text>
            <FlatList
                data={feedbacks}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
});
