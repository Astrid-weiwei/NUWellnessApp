import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet } from 'react-native';
import { addMoodEntry, getMoodEntries } from '../firebaseService';

export default function MoodTrackerScreen() {
  const [mood, setMood] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);

  const addMood = async () => {
    await addMoodEntry({ mood, date: new Date().toISOString() });
    setMood('');
    fetchMoodEntries();
  };

  const fetchMoodEntries = async () => {
    const entries = await getMoodEntries();
    setMoodEntries(entries);
  };

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="How are you feeling?"
        value={mood}
        onChangeText={setMood}
        style={styles.input}
      />
      <Button title="Add Mood" onPress={addMood} />
      <FlatList
        data={moodEntries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.mood}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
});
