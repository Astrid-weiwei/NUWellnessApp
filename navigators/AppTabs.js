import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ToolsStackNavigator from './ToolsStackNavigator'; // Nested stack for Tools
import ActivitiesStackNavigator from './ActivitiesStackNavigator'; // Nested stack for Activities

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={ToolsStackNavigator} />
      <Tab.Screen name="Activities" component={ActivitiesStackNavigator} />
    </Tab.Navigator>
  );
}
