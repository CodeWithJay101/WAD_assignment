import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import CompareScreen from './src/screens/CompareScreen';
import InfoScreen from './src/screens/InfoScreen';
import ChatScreen from './src/screens/ChatScreen';
import TodoStackNavigator from './src/navigation/TodoStackNavigator';
//import HomeScreen from './src/screens/HomeScreen';
//import EditTodoScreen from './src/screens/EditTodoScreen';


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={TodoStackNavigator} />
        <Drawer.Screen name="Compare" component={CompareScreen} />
        <Drawer.Screen name="Info" component={InfoScreen} />
        <Drawer.Screen name="Chat" component={ChatScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}