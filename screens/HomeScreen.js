import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to NUWellness</Text>
      <Button title="Go to Mood Tracker" onPress={() => navigation.navigate('Mood Tracker')} />
      <Button title="Go to Habits Tracker" onPress={() => navigation.navigate('Habits Tracker')} />
      <Button title="Go to Task Manager" onPress={() => navigation.navigate('Task Manager')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
