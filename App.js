import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import MoodTrackerScreen from './screens/MoodTrackerScreen';
import HabitsTrackerScreen from './screens/HabitsTrackerScreen';
import TaskManagerScreen from './screens/TaskManagerScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import ToolsScreen from './screens/ToolsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Mood Tracker" component={MoodTrackerScreen} />
        <Tab.Screen name="Habits Tracker" component={HabitsTrackerScreen} />
        <Tab.Screen name="Task Manager" component={TaskManagerScreen} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} />
        <Tab.Screen name="Tools" component={ToolsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
