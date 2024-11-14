import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ToolsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Mood Tracker')}>
        <Text style={styles.toolItem}>Mood Tracker</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Challenging Negative Thoughts')}>
        <Text style={styles.toolItem}>Challenging Negative Thoughts</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Meditation')}>
        <Text style={styles.toolItem}>Meditation</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Self-Assessment')}>
        <Text style={styles.toolItem}>Self-Assessment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toolItem: {
    fontSize: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
