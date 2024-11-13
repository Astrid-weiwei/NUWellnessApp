import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SelfAssessmentScreen() {
  const assessments = ['PHQ-9 Depression Assessment', 'GAD-7 Anxiety Assessment'];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Self-Assessment</Text>
      {assessments.map((assessment, index) => (
        <TouchableOpacity key={index} style={styles.assessmentOption}>
          <Text style={styles.assessmentText}>{assessment}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  assessmentOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  assessmentText: { fontSize: 18 },
});
