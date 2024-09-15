import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login'; // Login screen
import Register from './components/Register'; // Register screen
import TabNavigator from './components/TabNavigator'; // Import TabNavigator
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Login', headerShown: false }}
        />
        
        {/* Register Screen */}
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: 'Register', headerShown: false }}
        />
        
        {/* TabNavigator Screen - Ovo će se prikazati nakon prijave */}
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }} // Sakrij header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
