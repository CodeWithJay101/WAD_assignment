import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
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

  useEffect(() => {
    const fetchRandomUserName = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users');
        const data = await response.json();
        const users = data.users; 

        if (users.length > 0) {
          const randomIndex = Math.floor(Math.random() * users.length);
          const randomUser = users[randomIndex];
          
          setName(`${randomUser.firstName} ${randomUser.lastName}`);
        } else {
          console.error('No users found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRandomUserName(); 

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
    <View style={styles.container}>
      <Text style={styles.text}>Name: {name}</Text>

      <ScrollView>
        <Text style={styles.text}>{chatroom}</Text>
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
          });
          setMessage('');
        }}
      />
    </View>
  );
}

export default App;
