import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ToolsStackNavigator from './navigators/ToolsStackNavigator';
import ActivitiesStackNavigator from './navigators/ActivitiesStackNavigator';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tools" component={ToolsStackNavigator} />
        <Tab.Screen name="Activities" component={ActivitiesStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
