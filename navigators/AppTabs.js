import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import { useNavigation, CommonActions } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ToolsStackNavigator from './ToolsStackNavigator';
import ActivitiesStackNavigator from './ActivitiesStackNavigator';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const navigation = useNavigation();

  useEffect(() => {
    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Set up notification response listener
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data?.screen;
      
      if (screen) {
        switch (screen) {
          // Tools Stack Screens
          case 'MoodTrackerScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Tools' },
                  {
                    name: 'Tools',
                    state: {
                      routes: [
                        { name: 'ToolsHome' },
                        { name: 'Mood Tracker' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'ChallengingNegativeThoughtsScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Tools' },
                  {
                    name: 'Tools',
                    state: {
                      routes: [
                        { name: 'ToolsHome' },
                        { name: 'Challenging Negative Thoughts' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'MeditationScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Tools' },
                  {
                    name: 'Tools',
                    state: {
                      routes: [
                        { name: 'ToolsHome' },
                        { name: 'Meditation' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'SelfAssessmentScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Tools' },
                  {
                    name: 'Tools',
                    state: {
                      routes: [
                        { name: 'ToolsHome' },
                        { name: 'Self-Assessment' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'PHQ9Screen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Tools' },
                  {
                    name: 'Tools',
                    state: {
                      routes: [
                        { name: 'ToolsHome' },
                        { name: 'Self-Assessment' },
                        { name: 'PHQ9' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'GAD7Screen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Tools' },
                  {
                    name: 'Tools',
                    state: {
                      routes: [
                        { name: 'ToolsHome' },
                        { name: 'Self-Assessment' },
                        { name: 'GAD7' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          // Activities Stack Screens
          case 'WorkScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Activities' },
                  {
                    name: 'Activities',
                    state: {
                      routes: [
                        { name: 'Activities' },
                        { name: 'Work' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'LifeScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'Activities' },
                  {
                    name: 'Activities',
                    state: {
                      routes: [
                        { name: 'Activities' },
                        { name: 'Life' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          case 'TaskManagerScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Activities',
                    state: {
                      routes: [
                        { name: 'Activities' },
                        { name: 'TaskManager' }
                      ]
                    }
                  }
                ]
              })
            );
            break;

          // Home Screen
          case 'HomeScreen':
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Home' }]
              })
            );
            break;

          default:
            console.log('Unknown screen:', screen);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.remove();
    };
  }, [navigation]);

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tools" component={ToolsStackNavigator} />
      <Tab.Screen name="Activities" component={ActivitiesStackNavigator} />
    </Tab.Navigator>
  );
}