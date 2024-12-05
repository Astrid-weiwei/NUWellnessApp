import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AppTabs from './navigators/AppTabs';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Set up notification listeners
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // Handle notification tap
        const data = response.notification.request.content.data;
        console.log('Notification tapped:', data);
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppTabs"
          component={AppTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}