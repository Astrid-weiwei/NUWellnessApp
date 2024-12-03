import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import * as Notifications from "expo-notifications";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MeditationScreen() {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(null);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const meditationTypes = ['Box Breathing', 'Belly Breathing', 'Basic Body Scan', 'Five Senses Check-in'];

  const meditationInstructions = {
    'Box Breathing': [
      'Find a comfortable position',
      'Inhale for 4 counts',
      'Hold for 4 counts',
      'Exhale for 4 counts',
      'Hold for 4 counts',
      'Repeat the cycle'
    ],
    'Belly Breathing': [
      'Lie down or sit comfortably',
      'Place one hand on your belly',
      'Inhale deeply through your nose',
      'Feel your belly rise',
      'Exhale slowly through your mouth',
      'Feel your belly lower'
    ],
    'Basic Body Scan': [
      'Lie down comfortably',
      'Close your eyes',
      'Focus on your toes',
      'Slowly move attention upward',
      'Notice sensations in each area',
      'Release tension as you go'
    ],
    'Five Senses Check-in': [
      'Notice 5 things you can see',
      'Notice 4 things you can touch',
      'Notice 3 things you can hear',
      'Notice 2 things you can smell',
      'Notice 1 thing you can taste'
    ]
  };

  // Timer Functions
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Meditation Functions
  const startMeditation = (meditation) => {
    setSelectedMeditation(meditation);
    setShowModal(true);
    setTimer(0);
    setIsActive(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMeditation(null);
    setTimer(0);
    setIsActive(false);
  };

  // Reminder Functions
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

  // Timer Effect
  React.useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

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

      {/* Meditation Options */}
      {meditationTypes.map((meditation, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => startMeditation(meditation)} 
          style={styles.meditationOption}
        >
          <Text style={styles.meditationText}>{meditation}</Text>
        </TouchableOpacity>
      ))}

      {/* Meditation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{selectedMeditation}</Text>
            
            <View style={styles.timerSection}>
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
              <TouchableOpacity 
                style={[styles.timerButton, isActive && styles.activeTimer]} 
                onPress={toggleTimer}
              >
                <Text style={styles.timerButtonText}>
                  {isActive ? 'Pause' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.instructionsContainer}>
              {selectedMeditation && meditationInstructions[selectedMeditation].map((instruction, index) => (
                <Text key={index} style={styles.instruction}>
                  • {instruction}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>End Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionsContainer: {
    marginVertical: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 24,
  },
  timerSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  timerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  activeTimer: {
    backgroundColor: '#ff9500',
  },
  timerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});