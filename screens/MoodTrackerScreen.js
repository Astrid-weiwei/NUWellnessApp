import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { addMoodEntry, getMoodEntries, deleteMoodEntry } from '../firebaseService';

export default function MoodTrackerScreen() {
  const [mood, setMood] = useState('');
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);

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
        timestamp: new Date().toISOString(),
      };
      await addMoodEntry(newEntry);
      setMood('');
      setJournal('');
      fetchEntries();
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
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <Text>{`${item.timestamp}: ${item.mood} - ${item.journal}`}</Text>
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
  entryContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  deleteButton: { color: 'red', marginLeft: 10 },
});
