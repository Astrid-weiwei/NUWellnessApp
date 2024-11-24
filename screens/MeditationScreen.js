import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Notifications from "expo-notifications";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MeditationScreen() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);

  const meditationTypes = ['Box Breathing', 'Belly Breathing', 'Basic Body Scan', 'Five Senses Check-in'];

  const startMeditation = (meditation) => {
    console.log(`Starting ${meditation}`);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const handleTimeSelected = async (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setupDailyReminder(selectedTime);
    }
  };

  const setupDailyReminder = async (time) => {
    try {
      const permission = await Notifications.getPermissionsAsync();
      if (!permission.granted) {
        const request = await Notifications.requestPermissionsAsync();
        if (!request.granted) {
          Alert.alert('Permission Required', 'Please enable notifications to set reminders');
          return;
        }
      }

      // Cancel existing meditation notifications
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const meditationNotifications = notifications.filter(
        n => n.content.data?.type === 'meditation'
      );
      for (const notification of meditationNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      // Schedule new notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Meditation Time",
          body: "Take a peaceful break for meditation",
          data: { screen: 'Meditation', type: 'meditation' },
        },
        trigger: {
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
        },
      });

      setReminderTime(time);
      Alert.alert(
        'Reminder Set',
        `Daily reminder set for ${time.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}`
      );
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Failed to set reminder');
    }
  };

  const cancelReminder = async () => {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const meditationNotifications = notifications.filter(
        n => n.content.data?.type === 'meditation'
      );
      for (const notification of meditationNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
      setReminderTime(null);
      Alert.alert('Success', 'Reminder cancelled');
    } catch (error) {
      console.error('Error cancelling reminder:', error);
      Alert.alert('Error', 'Failed to cancel reminder');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meditation</Text>

      {/* Reminder Section */}
      <View style={styles.reminderSection}>
        {reminderTime ? (
          <View style={styles.activeReminder}>
            <Text style={styles.reminderText}>
              Reminder set for {reminderTime.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelReminder}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.setReminderButton}
            onPress={showTimePickerModal}
          >
            <Text style={styles.setReminderText}>Set Daily Reminder</Text>
          </TouchableOpacity>
        )}
      </View>

      {showTimePicker && (
        <DateTimePicker
          value={reminderTime || new Date()}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={handleTimeSelected}
        />
      )}

      {meditationTypes.map((meditation, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => startMeditation(meditation)} 
          style={styles.meditationOption}
        >
          <Text style={styles.meditationText}>{meditation}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: 10 
  },
  meditationOption: { 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' 
  },
  meditationText: { 
    fontSize: 18 
  },
  reminderSection: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  activeReminder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  reminderText: {
    fontSize: 16,
    color: '#333',
  },
  setReminderButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  setReminderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});