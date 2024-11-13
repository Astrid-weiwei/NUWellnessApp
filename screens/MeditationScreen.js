import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MeditationScreen() {
  const meditationTypes = ['Box Breathing', 'Belly Breathing', 'Basic Body Scan', 'Five Senses Check-in'];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meditation</Text>
      {meditationTypes.map((meditation, index) => (
        <TouchableOpacity key={index} style={styles.meditationOption}>
          <Text style={styles.meditationText}>{meditation}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  meditationOption: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  meditationText: { fontSize: 18 },
});
