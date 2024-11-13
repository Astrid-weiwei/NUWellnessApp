// screens/MoodTrackerScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function MoodTrackerScreen() {
  const [mood, setMood] = useState('');
  const [selectedMood, setSelectedMood] = useState(null); // Track the selected mood

  const moods = [
    { label: 'Bad', color: '#e57373' },
    { label: 'Poor', color: '#ffb74d' },
    { label: 'OK', color: '#fff176' },
    { label: 'Good', color: '#81c784' },
    { label: 'Great', color: '#64b5f6' },
  ];

  const selectMood = (label) => {
    setSelectedMood(label); // Update the selected mood
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
      {selectedMood && (
        <Text style={styles.selectedMoodText}>Selected Mood: {selectedMood}</Text>
      )}
      <Text style={styles.journalLabel}>Journal</Text>
      <TextInput
        placeholder="Write about your day..."
        value={mood}
        onChangeText={setMood}
        style={styles.journalInput}
        multiline
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
});
