import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function ChallengingNegativeThoughtsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Challenging Negative Thoughts</Text>
      {['What’s on your mind?', 'How do you feel about this?', 'Worst possible outcome?', 'Best possible outcome?', 'Most likely outcome?', 'What can you do?'].map((question, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{question}</Text>
          <TextInput style={styles.input} placeholder="Type your response here..." multiline />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  questionContainer: { marginVertical: 10 },
  questionText: { fontSize: 16, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, borderRadius: 5 },
});
