// src/navigation/TodoStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import EditTodoScreen from '../screens/EditTodoScreen';
import { useTheme } from '../contexts/ThemeContext';

const Stack = createStackNavigator();

const TodoStackNavigator = () => {
  const { colors } = useTheme();

  console.log('Header Background Color:', colors.header); // Debugging line

  return (
    <Stack.Navigator 
      initialRouteName="ToDo"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="ToDo" component={HomeScreen} />
      <Stack.Screen name="EditTodoScreen" component={EditTodoScreen} />
       <Stack.Screen name="AddTodoScreen" component={AddTodoScreen} /> 
    </Stack.Navigator>
  )
};

export default TodoStackNavigator;
