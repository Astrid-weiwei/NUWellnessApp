import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import ImageManager from '../components/ImageManager';
import LocationPicker from '../components/LocationPicker';
import { addMoodEntry, getMoodEntries, deleteMoodEntry } from '../firebaseService';
import * as Notifications from "expo-notifications";
import DateTimePicker from '@react-native-community/datetimepicker';
import { WELLNESS_TYPES } from '../constants/wellness';

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
      setEntries(fetchedEntries);
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
      const newEntry = {
        mood: selectedMood,
        journal: journal.trim(),
        imageUri,
        locations: locations.map(loc => ({
          ...loc,
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
        })),
        timestamp: new Date().toISOString(),
      };

      await addMoodEntry(newEntry);
      setJournal('');
      setSelectedMood(null);
      setImageUri(null);
      setLocations([]);
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
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
          style: 'destructive',
        },
      ]
    );
  };

  const renderEntry = ({ item }) => (
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
      {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.entryImage} />}
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const showTimePickerModal = () => setShowTimePicker(true);

  const handleTimeSelected = async (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setupDailyReminder(selectedTime);
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
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Wellness Check-in Time",
          body: "Take a moment to track your mood and wellness activities",
          data: { type: 'mood tracker' },
        },
        trigger: { hour: time.getHours(), minute: time.getMinutes(), repeats: true },
      });
      setReminderTime(time);
      Alert.alert('Reminder Set', `Daily reminder set for ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert('Error', 'Failed to set reminder');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Mood Tracker</Text>
        <View style={styles.moodContainer}>
          {moods.map(m => (
            <TouchableOpacity
              key={m.label}
              onPress={() => setSelectedMood(m.label)}
              style={[
                styles.moodButton,
                { backgroundColor: m.color },
                selectedMood === m.label && styles.selectedMoodButton,
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
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Entry</Text>
        </TouchableOpacity>
        {/* Disable scrolling in FlatList */}
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={renderEntry}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flexGrow: 1 },
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  moodButton: { padding: 10, borderRadius: 5 },
  journalInput: { borderWidth: 1, padding: 10, marginBottom: 15 },
  saveButton: { padding: 15, backgroundColor: '#673ab7', borderRadius: 8 },
  saveButtonText: { color: '#fff', textAlign: 'center' },
  entryContainer: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5 },
  moodIndicator: { padding: 5, borderRadius: 5 },
  entryImage: { width: '100%', height: 200, marginTop: 10 },
});
