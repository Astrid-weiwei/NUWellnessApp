import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ToolsScreen from './screens/ToolsScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import MoodTrackerScreen from './screens/MoodTrackerScreen';
import ChallengingNegativeThoughtsScreen from './screens/ChallengingNegativeThoughtsScreen';
import MeditationScreen from './screens/MeditationScreen';
import SelfAssessmentScreen from './screens/SelfAssessmentScreen';

const Tab = createBottomTabNavigator();
const ToolsStack = createStackNavigator();

function ToolsStackScreen() {
  return (
    <ToolsStack.Navigator>
      <ToolsStack.Screen name="Tools" component={ToolsScreen} />
      <ToolsStack.Screen name="MoodTracker" component={MoodTrackerScreen} />
      <ToolsStack.Screen name="ChallengingNegativeThoughts" component={ChallengingNegativeThoughtsScreen} />
      <ToolsStack.Screen name="Meditation" component={MeditationScreen} />
      <ToolsStack.Screen name="SelfAssessment" component={SelfAssessmentScreen} />
    </ToolsStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tools" component={ToolsStackScreen} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
