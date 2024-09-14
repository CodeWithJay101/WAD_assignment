import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  ScrollView,
  View,
  Button,
} from 'react-native';
import io from 'socket.io-client';
import { createStyles } from '../styles/themeStyles';
import { useTheme } from '../contexts/ThemeContext';

var socket = io('http://10.0.2.2:5000/chat', {
    transports: ['websocket'],
});


const App = () => {

  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
    const [chatroom, setChatroom] = useState('');
    const { colors } = useTheme();
    const styles = createStyles(colors);

  useEffect(()=>{
    // When connected, emit a message to the server to inform that this client has connected to the server.
    // Display a Toast to inform user that connection was made.
    socket.on('connect', () => {

      console.log(socket.id); // undefined
      socket.emit('mobile_client_connected', {connected: true}, (response)=>{
        console.log(response)
      });
      ToastAndroid.show('Connected to server', ToastAndroid.LONG);
    });

    socket.on('connect_to_client', (data) => {
      let greets=JSON.parse(data)
      console.log(greets)
    });

    // Handle connection error
    socket.on('error', (error) => {
        ToastAndroid.show('Failed to connect to server', ToastAndroid.LONG);
    });

    // Receive chat broadcast from server.
    socket.on('message_broadcast', (data) => {
      console.log(data);
      let messageBag = JSON.parse(data);

      setChatroom(chatroom => chatroom + `Message from ${messageBag.sender} at ${messageBag.timestamp}: \n${messageBag.message}\n\n`);
    });
  },[]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={name}
                selectTextOnFocus={true}
                onChangeText={(name) => { setName(name) }}
            />
            <ScrollView>
                <Text style={styles.text}>{ chatroom }</Text>
            </ScrollView>
            <TextInput
                style={styles.input}
                placeholder="Enter message"
                value={message}
                selectTextOnFocus={true}
                onChangeText={(message) => { setMessage(message) }}
            />
            <Button
                title="Send"
                onPress={() => {
                    socket.emit('message_sent', {
                        sender: name,
                        message: message,
                    })
                }} />
      
        </View>
    );
}


export default App;