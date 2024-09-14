import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, ScrollView, View, Button } from 'react-native';
import io from 'socket.io-client';
import { useTheme } from '../contexts/ThemeContext';

var socket = io('http://10.0.2.2:5000/chat', {
    transports: ['websocket'],
});

const ChatScreen = () => {
    const { colors } = useTheme();

    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [chatroom, setChatroom] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            console.log(socket.id);
            socket.emit('mobile_client_connected', { connected: true }, (response) => {
                console.log(response);
            });
            ToastAndroid.show('Connected to server', ToastAndroid.LONG);
        });

        socket.on('connect_to_client', (data) => {
            let greets = JSON.parse(data);
            console.log(greets);
        });

        socket.on('error', (error) => {
            ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
        });

        socket.on('message_broadcast', (data) => {
            console.log(data);
            let messageBag = JSON.parse(data);
            setChatroom(chatroom => chatroom + `Message from ${messageBag.sender} at ${messageBag.timestamp}: \n${messageBag.message}\n\n`);
        });
    }, []);

    return (
        <View style={{ flex: 1, padding: 10, backgroundColor: colors.background }}>
            <TextInput
                style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10,
                    color: colors.text,
                    marginBottom: 10,
                    paddingHorizontal: 8,
                }}
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
                selectTextOnFocus={true}
                placeholderTextColor={colors.text}
            />
            <ScrollView>
                <Text style={{ color: colors.text }}>{chatroom}</Text>
            </ScrollView>
            <TextInput
                style={{
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 10,
                    color: colors.text,
                    marginBottom: 10,
                    paddingHorizontal: 8,
                }}
                placeholder="Enter message"
                value={message}
                onChangeText={setMessage}
                selectTextOnFocus={true}
                placeholderTextColor={colors.text}
            />
            <Button
                title="Send"
                onPress={() => {
                    socket.emit('message_sent', {
                        sender: name,
                        message: message,
                    });
                }}
            />
        </View>
    );
}

export default ChatScreen;

