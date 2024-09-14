// src/ChatScreen.js
import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { createStyles } from '../styles/themeStyles';
import ChatBubble from 'react-native-chat-bubble';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('http://192.168.1.9:5000'); // Your Flask server address

export default function ChatScreen() {
    const { colors, toggleTheme } = useTheme();
    const styles = createStyles(colors);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        socket.emit('message', message);
        setMessage('');
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) =>
                    <ChatBubble
                        isOwnMessage={true}
                        bubbleColor='#1084ff'
                        tailColor='#1084ff'
                        withTail={true}
                        onPress={() => console.log("Bubble Pressed!")}
                    >
                        <Text style={ styles.text}>{item}</Text>
                    </ChatBubble>
                }
                keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
                style={styles.text}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
                placeholderTextColor={colors.text}
            />
            <Button title="Send" onPress={sendMessage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
});
