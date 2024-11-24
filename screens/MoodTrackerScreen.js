import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Image } from 'react-native';
import ImageManager from '../components/ImageManager';
import LocationPicker from '../components/LocationPicker';
import { addMoodEntry, getMoodEntries, deleteMoodEntry } from '../firebaseService';

export default function MoodTrackerScreen() {
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [locations, setLocations] = useState([]);

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
      
      // Reset form
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
    try {
      await deleteMoodEntry(id);
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      Alert.alert('Error', 'Failed to delete entry');
    }
  };

  const renderLocationList = (locations) => {
    if (!locations || locations.length === 0) return null;

    return (
      <View style={styles.locationsList}>
        {locations.map((loc, index) => (
          <Text key={loc.id || index} style={styles.locationText}>
            📍 {loc.title || 'Location'}: {Number(loc.latitude).toFixed(4)}, {Number(loc.longitude).toFixed(4)}
          </Text>
        ))}
      </View>
    );
  };

  const renderEntry = ({ item }) => {
    if (!item) return null;

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

        {renderLocationList(item.locations)}

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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Tracker</Text>
      
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
    transform: [{ scale: 1.1 }],
    borderWidth: 2,
    borderColor: '#fff',
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
});