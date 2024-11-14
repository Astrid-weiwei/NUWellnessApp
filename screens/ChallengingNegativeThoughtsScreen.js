import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { addThoughtEntry } from '../firebaseService';

export default function ChallengingNegativeThoughtsScreen() {
  const [thoughtData, setThoughtData] = useState({
    mind: '',
    feeling: '',
    worst: '',
    best: '',
    likely: '',
    action: ''
  });

  const handleSave = async () => {
    await addThoughtEntry(thoughtData);
    setThoughtData({ mind: '', feeling: '', worst: '', best: '', likely: '', action: '' });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Challenging Negative Thoughts</Text>
      {[
        { label: 'What’s on your mind?', key: 'mind' },
        { label: 'How do you feel about this?', key: 'feeling' },
        { label: 'Worst possible outcome?', key: 'worst' },
        { label: 'Best possible outcome?', key: 'best' },
        { label: 'Most likely outcome?', key: 'likely' },
        { label: 'What can you do?', key: 'action' },
      ].map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.label}</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your response here..."
            value={thoughtData[question.key]}
            onChangeText={(text) => setThoughtData({ ...thoughtData, [question.key]: text })}
            multiline
          />
        </View>
      ))}
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  questionContainer: { marginVertical: 10 },
  questionText: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5, marginBottom: 10 },
  saveButton: { backgroundColor: '#673ab7', padding: 10, borderRadius: 5, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16 },
});
