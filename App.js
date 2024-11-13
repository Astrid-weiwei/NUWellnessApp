import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ToolsScreen from './screens/ToolsScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import MoodTrackerScreen from './screens/MoodTrackerScreen';
import ChallengingNegativeThoughtsScreen from './screens/ChallengingNegativeThoughtsScreen';
import MeditationScreen from './screens/MeditationScreen';
import SelfAssessmentScreen from './screens/SelfAssessmentScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tools" component={ToolsStackNavigator} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Nested Stack Navigator for the Tools section
import { createStackNavigator } from '@react-navigation/stack';

const ToolsStack = createStackNavigator();

function ToolsStackNavigator() {
  return (
    <ToolsStack.Navigator>
      <ToolsStack.Screen name="Tools" component={ToolsScreen} />
      <ToolsStack.Screen name="Mood Tracker" component={MoodTrackerScreen} />
      <ToolsStack.Screen name="Challenging Negative Thoughts" component={ChallengingNegativeThoughtsScreen} />
      <ToolsStack.Screen name="Meditation" component={MeditationScreen} />
      <ToolsStack.Screen name="Self-Assessment" component={SelfAssessmentScreen} />
    </ToolsStack.Navigator>
  );
}
