import React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CompareScreen from './src/screens/CompareScreen';
import InfoScreen from './src/screens/InfoScreen';
import ChatScreen from './src/screens/ChatScreen';
import TodoStackNavigator from './src/navigation/TodoStackNavigator';
import SettingsScreen from './src/screens/SettingsScreen';
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
      <Drawer.Screen name="Compare" component={CompareScreen} />
      <Drawer.Screen name="Info" component={InfoScreen} />
      <Drawer.Screen name="Chat" component={ChatScreen} />
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