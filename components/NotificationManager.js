import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

export default function NotificationManager() {
  const [hasPermission, setHasPermission] = useState(false);

  // Check permissions when component mounts
  useEffect(() => {
    checkPermissions();
  }, []);

  async function checkPermissions() {
    try {
      const permissionResponse = await Notifications.getPermissionsAsync();
      setHasPermission(permissionResponse.granted);
    } catch (err) {
      console.log("Check permissions error:", err);
      setHasPermission(false);
    }
  }

  async function verifyPermission() {
    try {
      if (hasPermission) return true;
      
      const requestedPermission = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      
      setHasPermission(requestedPermission.granted);
      return requestedPermission.granted;
    } catch (err) {
      console.log("Verify permission error:", err);
      return false;
    }
  }

  async function scheduleNotification(config) {
    try {
      const permitted = await verifyPermission();
      if (!permitted) {
        Alert.alert(
          "Permission Required",
          `Please enable notifications to receive ${config.type} reminders`
        );
        return;
      }

      // Cancel existing notifications of this type
      const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const typeNotifications = existingNotifications.filter(
        notification => notification.content.data?.type === config.type
      );
      
      for (const notification of typeNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      // Schedule new notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: config.title,
          body: config.body,
          data: { 
            screen: config.screen,
            type: config.type 
          },
          sound: true,
        },
        trigger: {
          hours: config.hours,
          repeats: true,
        },
      });

      Alert.alert("Success", `${config.type} reminder set!`);
    } catch (err) {
      console.log(`Schedule ${config.type} notification error:`, err);
      Alert.alert("Error", `Failed to set ${config.type} reminder`);
    }
  }

  const notificationConfigs = {
    wellness: {
      type: 'mood tracker',
      title: "Wellness Check-in Time",
      body: "Take a moment to track your mood and wellness activities",
      screen: 'MoodTrackerScreen',
      hours: 24,
    },
    task: {
      type: 'task',
      title: "Task Reminder",
      body: "Check your pending tasks and stay organized!",
      screen: 'TaskManagerScreen',
      hours: 12,
    },
    meditation: {
      type: 'meditation',
      title: "Meditation Time",
      body: "Take a peaceful break for meditation",
      screen: 'MeditationScreen',
      hours: 8,
    },
  };

  async function cancelAllReminders() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert("Success", "All reminders have been cancelled");
    } catch (err) {
      console.log("Cancel notifications error:", err);
      Alert.alert("Error", "Failed to cancel reminders");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Set Daily Wellness Reminder"
          onPress={() => scheduleNotification(notificationConfigs.wellness)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Task Reminder"
          onPress={() => scheduleNotification(notificationConfigs.task)}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Meditation Reminder"
          onPress={() => scheduleNotification(notificationConfigs.meditation)}
        />
      </View>

      <View style={[styles.buttonContainer, styles.cancelButton]}>
        <Button
          title="Cancel All Reminders"
          onPress={cancelAllReminders}
          color="#ff4444"
        />
      </View>

      {!hasPermission && (
        <Text style={styles.permissionWarning}>
          ⚠️ Notifications are currently disabled. Please enable them in your device settings.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  cancelButton: {
    marginTop: 30,
  },
  permissionWarning: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  }
});