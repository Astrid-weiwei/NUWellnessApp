import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import ImageManager from '../components/ImageManager';
import LocationPicker from '../components/LocationPicker';
import { addMoodEntry, getMoodEntries, deleteMoodEntry } from '../firebaseService';
import * as Notifications from "expo-notifications";
import DateTimePicker from '@react-native-community/datetimepicker';
import LocationDisplay from '../components/LocationDisplay';

export default function MoodTrackerScreen() {
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [locations, setLocations] = useState([]);
  const [reminderTime, setReminderTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const moods = [
    { label: 'Bad', color: '#e57373' },
    { label: 'Poor', color: '#ffb74d' },
    { label: 'OK', color: '#fff176' },
    { label: 'Good', color: '#81c784' },
    { label: 'Great', color: '#64b5f6' },
  ];

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const fetchedEntries = await getMoodEntries();
      // Sort entries by timestamp in descending order (newest first)
      const sortedEntries = fetchedEntries.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setEntries(sortedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      Alert.alert('Error', 'Failed to load entries');
    }
  };

  const handleSave = async () => {
    if (!selectedMood || !journal.trim()) {
      Alert.alert('Incomplete Entry', 'Please select a mood and write a journal entry before saving.');
      return;
    }
  
    try {
      console.log('Current locations before save:', locations); // Debug log

      const newEntry = {
        mood: selectedMood,
        journal: journal.trim(),
        imageUri: imageUri || null,
        locations: Array.isArray(locations) ? locations.map(loc => ({
          type: loc.type || 'WELLNESS_CENTER',
          placeName: loc.placeName || '',
          latitude: Number(loc.latitude) || 0,
          longitude: Number(loc.longitude) || 0,
        })) : [], // Ensure locations is an array before mapping
        timestamp: new Date().toISOString(),
      };
  
      console.log('Saving entry:', newEntry);
      await addMoodEntry(newEntry);
      
      // Reset form
      setJournal('');
      setSelectedMood(null);
      setImageUri(null);
      setLocations([]); // Reset to empty array instead of undefined
      
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteMoodEntry(id);
              fetchEntries();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderEntry = ({ item }) => {
    if (!item) return null;

    console.log('Rendering entry with locations:', item.locations); // Debug log

    return (
      <View style={styles.entryContainer}>
        <View style={styles.entryHeader}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
          <View style={[styles.moodIndicator, { backgroundColor: moods.find(m => m.label === item.mood)?.color }]}>
            <Text style={styles.moodText}>{item.mood}</Text>
          </View>
        </View>

        <Text style={styles.journalText}>{item.journal}</Text>

        {Array.isArray(item.locations) && item.locations.length > 0 && (
        <View style={styles.locationWrapper}>
          <Text style={styles.locationHeader}>Wellness Locations:</Text>
          {item.locations.map((loc, index) => {
            console.log('Location being passed to LocationDisplay:', loc); // Debug log
            return <LocationDisplay key={index} location={loc} />;
          })}
        </View>
      )}

        {item.imageUri && (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.entryImage}
          />
        )}

        <TouchableOpacity 
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
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

  // To handle setting up the reminder
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

      // Cancel any existing mood tracker notifications
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const moodNotifications = notifications.filter(
        n => n.content.data?.type === 'mood tracker'
      );
      for (const notification of moodNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }

      // Schedule new notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Wellness Check-in Time",
          body: "Take a moment to track your mood and wellness activities",
          data: { screen: 'Mood Tracker', type: 'mood tracker' },
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
      const moodNotifications = notifications.filter(
        n => n.content.data?.type === 'mood tracker'
      );
      for (const notification of moodNotifications) {
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
      <Text style={styles.header}>Mood Tracker</Text>

      {/* Reminder Section */}
      <View style={styles.reminderSection}>
        {reminderTime ? (
          <View style={styles.activeReminder}>
            <Text style={styles .reminderText}>
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
      
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m.label}
            onPress={() => setSelectedMood(m.label)}
            style={[
              styles.moodButton,
              { backgroundColor: m.color },
              selectedMood === m.label && styles.selectedMoodButton
            ]}
          >
            <Text style={styles.moodButtonText}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Write about your day..."
        value={journal}
        onChangeText={setJournal}
        style={styles.journalInput}
        multiline
      />

      <ImageManager onImageTaken={setImageUri} />
      <LocationPicker onLocationSelected={setLocations} />

      <TouchableOpacity 
        onPress={handleSave} 
        style={[
          styles.saveButton,
          (!selectedMood || !journal.trim()) && styles.saveButtonDisabled
        ]}
        disabled={!selectedMood || !journal.trim()}
      >
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.entriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodButton: {
    padding: 10,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedMoodButton: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.84,
    elevation: 4,
  },
  moodButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  journalInput: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#673ab7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  entriesList: {
    paddingBottom: 20,
  },
  entryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timestamp: {
    color: '#666',
    fontSize: 14,
  },
  moodIndicator: {
    padding: 5,
    borderRadius: 4,
    minWidth: 60,
    alignItems: 'center',
  },
  journalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  locationsList: {
    marginVertical: 5,
  },
  locationText: {
    color: '#666',
    fontSize: 14,
    marginVertical: 2,
  },
  entryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#ff5252',
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  locationWrapper: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  locationHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  locationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  locationItem: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 2,
  },
});