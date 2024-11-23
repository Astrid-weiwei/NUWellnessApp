import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Notifications from "expo-notifications";

export default function NotificationManager() {
  async function verifyPermission() {
    try {
      const permissionResponse = await Notifications.getPermissionsAsync();
      if (permissionResponse.granted) {
        return true;
      }
      const requestedPermission = await Notifications.requestPermissionsAsync();
      return requestedPermission.granted;
    } catch (err) {
      console.log("Verify permission error:", err);
      return false;
    }
  }

  async function scheduleDailyWellnessReminder() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to receive wellness reminders"
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Wellness Check-in Time",
          body: "Take a moment to track your mood and wellness activities",
          data: { screen: 'MoodTrackerScreen' },
        },
        trigger: {
          hours: 24, // Daily reminder
          repeats: true
        },
      });
      Alert.alert("Success", "Daily wellness reminder set!");
    } catch (err) {
      console.log("Schedule notification error:", err);
      Alert.alert("Error", "Failed to set reminder");
    }
  }

  async function scheduleTaskReminder() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications to receive task reminders"
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder",
          body: "Check your pending tasks and stay organized!",
          data: { screen: 'TaskManagerScreen' },
        },
        trigger: {
          hours: 12, // Twice daily reminder
          repeats: true
        },
      });
      Alert.alert("Success", "Task reminder set!");
    } catch (err) {
      console.log("Schedule task notification error:", err);
      Alert.alert("Error", "Failed to set task reminder");
    }
  }

  async function scheduleMeditationReminder() {
    try {
      const hasPermission = await verifyPermission();
      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please enable notifications for meditation reminders"
        );
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Meditation Time",
          body: "Take a peaceful break for meditation",
          data: { screen: 'MeditationScreen' },
        },
        trigger: {
          hours: 8, // Three times daily reminder
          repeats: true
        },
      });
      Alert.alert("Success", "Meditation reminder set!");
    } catch (err) {
      console.log("Schedule meditation notification error:", err);
      Alert.alert("Error", "Failed to set meditation reminder");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Set Daily Wellness Reminder"
          onPress={scheduleDailyWellnessReminder}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Task Reminder"
          onPress={scheduleTaskReminder}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Set Meditation Reminder"
          onPress={scheduleMeditationReminder}
        />
      </View>
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
  }
});