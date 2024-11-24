import { Alert, Button, StyleSheet, Text, View, Platform, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import DateTimePicker from '@react-native-community/datetimepicker';

// Configure how notifications should be handled
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function NotificationManager() {
  const [hasPermission, setHasPermission] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [currentNotificationType, setCurrentNotificationType] = useState(null);
  const [activeNotifications, setActiveNotifications] = useState([]);

  // Check permissions when component mounts
  useEffect(() => {
    checkPermissions();
    loadActiveNotifications();
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

  async function loadActiveNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      setActiveNotifications(notifications);
    } catch (err) {
      console.log("Load notifications error:", err);
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

  const notificationConfigs = {
    wellness: {
      type: 'mood tracker',
      title: "Wellness Check-in Time",
      body: "Take a moment to track your mood and wellness activities",
      screen: 'MoodTrackerScreen',
    },
    task: {
      type: 'task',
      title: "Task Reminder",
      body: "Check your pending tasks and stay organized!",
      screen: 'TaskManagerScreen',
    },
    meditation: {
      type: 'meditation',
      title: "Meditation Time",
      body: "Take a peaceful break for meditation",
      screen: 'MeditationScreen',
    },
  };

  const showTimePickerFor = (type) => {
    setCurrentNotificationType(type);
    setShowTimePicker(true);
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    
    if (selectedDate) {
      setSelectedTime(selectedDate);
      scheduleNotification(notificationConfigs[currentNotificationType], selectedDate);
    }
  };

  async function scheduleNotification(config, time) {
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
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
        },
      });

      // Refresh active notifications
      await loadActiveNotifications();
      
      Alert.alert(
        "Success", 
        `${config.type} reminder set for ${time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })} daily!`
      );
    } catch (err) {
      console.log(`Schedule ${config.type} notification error:`, err);
      Alert.alert("Error", `Failed to set ${config.type} reminder`);
    }
  }

  async function cancelAllReminders() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setActiveNotifications([]);
      Alert.alert("Success", "All reminders have been cancelled");
    } catch (err) {
      console.log("Cancel notifications error:", err);
      Alert.alert("Error", "Failed to cancel reminders");
    }
  }

  async function sendTestNotification() {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification! 🔔",
          sound: true,
        },
        trigger: null, // null means send immediately
      });
    } catch (err) {
      console.log("Test notification error:", err);
      Alert.alert("Error", "Failed to send test notification");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      
      {/* Test Notification Button */}
      <View style={styles.testSection}>
        <Text style={styles.subtitle}>Test Notifications</Text>
        <TouchableOpacity 
          style={styles.testButton}
          onPress={sendTestNotification}
        >
          <Text style={styles.buttonText}>Send Test Notification</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Types */}
      <Text style={styles.subtitle}>Set Daily Reminders</Text>
      <TouchableOpacity 
        style={styles.reminderButton}
        onPress={() => showTimePickerFor('wellness')}
      >
        <Text style={styles.reminderTitle}>Wellness Check-in</Text>
        <Text style={styles.reminderDescription}>Daily mood and wellness tracking</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.reminderButton}
        onPress={() => showTimePickerFor('task')}
      >
        <Text style={styles.reminderTitle}>Task Reminder</Text>
        <Text style={styles.reminderDescription}>Stay organized with your tasks</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.reminderButton}
        onPress={() => showTimePickerFor('meditation')}
      >
        <Text style={styles.reminderTitle}>Meditation Time</Text>
        <Text style={styles.reminderDescription}>Daily meditation reminder</Text>
      </TouchableOpacity>

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeChange}
        />
      )}

      {/* Active Notifications */}
      {activeNotifications.length > 0 && (
        <View style={styles.activeNotificationsContainer}>
          <Text style={styles.subtitle}>Active Reminders:</Text>
          {activeNotifications.map((notification) => (
            <View key={notification.identifier} style={styles.notificationItem}>
              <Text style={styles.notificationTitle}>
                {notification.content.title}
              </Text>
              <Text style={styles.notificationDetails}>
                Time: {new Date(notification.trigger.nextTriggerDate).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Cancel All Button */}
      <TouchableOpacity 
        style={styles.cancelButton}
        onPress={cancelAllReminders}
      >
        <Text style={styles.cancelButtonText}>Cancel All Reminders</Text>
      </TouchableOpacity>

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
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  testSection: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reminderButton: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  reminderDescription: {
    color: '#666',
    fontSize: 14,
  },
  activeNotificationsContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  notificationDetails: {
    color: '#666',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionWarning: {
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
});