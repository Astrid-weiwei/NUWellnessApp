import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ToolsScreen from '../screens/ToolsScreen';
import MoodTrackerScreen from '../screens/MoodTrackerScreen';
import ChallengingNegativeThoughtsScreen from '../screens/ChallengingNegativeThoughtsScreen';
import MeditationScreen from '../screens/MeditationScreen';
import SelfAssessmentScreen from '../screens/SelfAssessmentScreen';
import PHQ9Screen from '../screens/PHQ9Screen';
import GAD7Screen from '../screens/GAD7Screen';

const Stack = createStackNavigator();

function ToolsStackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="ToolsHome"
      screenOptions={{
        headerBackTitle: "Back",
        headerTitle: "",
        headerBackTitleVisible: true,
        headerTruncatedBackTitle: "Back"
      }}
    >
      <Stack.Screen 
        name="ToolsHome" 
        component={ToolsScreen} 
        options={{ 
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="Mood Tracker" 
        component={MoodTrackerScreen} 
      />
      <Stack.Screen 
        name="Challenging Negative Thoughts" 
        component={ChallengingNegativeThoughtsScreen} 
      />
      <Stack.Screen 
        name="Meditation" 
        component={MeditationScreen} 
      />
      <Stack.Screen 
        name="Self-Assessment" 
        component={SelfAssessmentScreen}
      />
      <Stack.Screen 
        name="PHQ9" 
        component={PHQ9Screen} 
      />
      <Stack.Screen 
        name="GAD7" 
        component={GAD7Screen} 
      />
    </Stack.Navigator>
  );
}

export default ToolsStackNavigator;
