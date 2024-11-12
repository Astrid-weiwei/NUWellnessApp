import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function HabitsTrackerScreen() {
  const [habit, setHabit] = useState('');
  const [habits, setHabits] = useState([]);

  const addHabit = () => {
    setHabits([...habits, habit]);
    setHabit('');
  };

  return (
    <View style={styles.container}>
      <Text>Habits Tracker</Text>
      <TextInput
        placeholder="New Habit"
        value={habit}
        onChangeText={setHabit}
        style={styles.input}
      />
      <Button title="Add Habit" onPress={addHabit} />
      {habits.map((habit, index) => (
        <Text key={index}>{habit}</Text>
      ))}
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
