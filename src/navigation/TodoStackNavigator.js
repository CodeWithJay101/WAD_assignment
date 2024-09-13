// src/navigation/TodoStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EditTodoScreen from '../screens/EditTodoScreen';

const Stack = createStackNavigator();

const TodoStackNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="EditTodoScreen" component={EditTodoScreen} />
  </Stack.Navigator>
);

export default TodoStackNavigator;
