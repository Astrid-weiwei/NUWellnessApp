import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SelfAssessmentScreen({ navigation }) {
  const assessments = [
    { 
      name: 'PHQ-9 Depression Assessment',
      route: 'PHQ9',
      description: 'Evaluate symptoms of depression over the past two weeks'
    },
    { 
      name: 'GAD-7 Anxiety Assessment',
      route: 'GAD7',
      description: 'Assess anxiety levels and symptoms over the past two weeks'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Self-Assessment Tools</Text>
      <Text style={styles.subtitle}>
        Select an assessment to begin. Your responses are private and will help track your mental health over time.
      </Text>
      
      {assessments.map((assessment, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.assessmentOption}
          onPress={() => navigation.navigate(assessment.route)}
        >
          <Text style={styles.assessmentTitle}>{assessment.name}</Text>
          <Text style={styles.assessmentDescription}>{assessment.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  assessmentOption: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  assessmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  assessmentDescription: {
    fontSize: 14,
    color: '#666',
  },
});