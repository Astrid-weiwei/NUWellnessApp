import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import ImageManager from '../components/ImageManager';
import LocationPicker from '../components/LocationPicker';
import { addMoodEntry, getMoodEntries, deleteMoodEntry } from '../firebaseService';

export default function MoodTrackerScreen() {
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [imageUri, setImageUri] = useState(null); // Store the image URI

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
    const fetchedEntries = await getMoodEntries();
    setEntries(fetchedEntries);
  };

  const handleSave = async () => {
    if (selectedMood && journal.trim()) {
      const newEntry = {
        mood: selectedMood,
        journal,
        imageUri, // Include image URI
        location,
        timestamp: new Date().toISOString(),
      };
      await addMoodEntry(newEntry);
      setJournal('');
      setImageUri(null); // Reset image URI
      setLocation(null); // Reset location
      fetchEntries();
    } else {
      Alert.alert('Incomplete Entry', 'Please select a mood and write a journal entry before saving.');
    }
  };

  const handleDelete = async (id) => {
    await deleteMoodEntry(id);
    fetchEntries();
  };

  const selectMood = (label) => {
    setSelectedMood(label);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Tracker</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m.label}
            onPress={() => selectMood(m.label)}
            style={[styles.moodButton, { backgroundColor: m.color }]}
          >
            <Text style={styles.moodText}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedMood && <Text style={styles.selectedMoodText}>Selected Mood: {selectedMood}</Text>}
      <Text style={styles.journalLabel}>Journal</Text>
      <TextInput
        placeholder="Write about your day..."
        value={journal}
        onChangeText={setJournal}
        style={styles.journalInput}
        multiline
      />
      <ImageManager onImageTaken={(uri) => setImageUri(uri)} />
      <LocationPicker onLocationSelected={(loc) => setLocation(loc)} />
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <View style={{ flexDirection: 'row' }}>
              <Text>{item.timestamp || ''}</Text>
              <Text>: </Text>
              <Text>{item.mood || ''}</Text>
              <Text> - </Text>
              <Text>{item.journal || ''}</Text>
            </View>
            {item.location && (
              <Text style={styles.locationText}>
                📍 {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
              </Text>
            )}
            {item.imageUri && (
              <Image
                source={{ uri: item.imageUri }}
                style={styles.entryImage}
              />
            )}
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  moodButton: { padding: 10, borderRadius: 5 },
  moodText: { color: '#fff', fontWeight: 'bold' },
  selectedMoodText: { textAlign: 'center', fontSize: 18, marginBottom: 10 },
  journalLabel: { fontWeight: 'bold', fontSize: 18, marginVertical: 10 },
  journalInput: { borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 5 },
  saveButton: { backgroundColor: '#673ab7', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 20 },
  saveButtonText: { color: '#fff', fontSize: 16 },
  entryContainer: { flexDirection: 'column', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  entryImage: { width: 100, height: 100, marginTop: 5, borderRadius: 5 },
  deleteButton: { color: 'red', marginTop: 10 },
  locationText: {
    color: '#666',
    marginTop: 5,
    fontSize: 14,
  },
});
