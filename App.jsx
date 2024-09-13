import React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import FeedbackScreen from './src/screens/FeedbackScreen';
import FeedbackListingScreen from './src/screens/FeedbackListScreen';
import ChatScreen from './src/screens/ChatScreen';
import TodoStackNavigator from './src/navigation/TodoStackNavigator';
import SettingsScreen from './src/screens/SettingsScreen';
import NotesScreen from './src/screens/NotesScreen';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {

  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.background,
        },
        drawerContentOptions: {
          activeTintColor: 'blue',
          inactiveTintColor: colors.text,
        },
        drawerLabelStyle: {
          color: colors.text,
        },
        headerStyle: {
          backgroundColor: colors.header,
        },
        headerTintColor: colors.text,
      }}
    >
      <Drawer.Screen name="Home" component={TodoStackNavigator} />
      <Drawer.Screen name="Notes" component={NotesScreen}/>
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="Feedback Listing" component={FeedbackListingScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
          <AppNavigator />
      </NavigationContainer>
    </ThemeProvider>
);
}