import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import WorkScreen from '../screens/WorkScreen';
import LifeScreen from '../screens/LifeScreen';

const Stack = createStackNavigator();

export default function ActivitiesStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Activities">
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="Work" component={WorkScreen} />
      <Stack.Screen name="Life" component={LifeScreen} />
    </Stack.Navigator>
  );
}
