import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import Home from './Home';
import Vehicles from './Vehicles';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Vehicles') {
            iconName = 'directions-car';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: { display: 'flex' },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Vehicles" component={Vehicles} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
