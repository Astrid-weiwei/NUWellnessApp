// Navigation.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import SafeSpaceScreen from './screens/SafeSpaceScreen';
import ResourcesScreen from './screens/ResourcesScreen';

const Tab = createBottomTabNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="SafeSpace" component={SafeSpaceScreen} />
        <Tab.Screen name="Resources" component={ResourcesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
