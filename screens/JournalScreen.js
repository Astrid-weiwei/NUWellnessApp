// screens/JournalScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function JournalScreen() {
  const [journal, setJournal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = ['angry', 'anxious', 'depressed', 'guilty', 'calm', 'grateful', 'happy', 'hopeful', 'loved'];

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const handleDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setShowDatePicker(false);
    setSelectedDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.journalLabel}>Journal</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>{selectedDate.toDateString()}</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <TextInput
        placeholder="Write about your day..."
        value={journal}
        onChangeText={setJournal}
        style={styles.journalInput}
        multiline
      />
      <Text style={styles.shortcutLabel}>Shortcuts</Text>
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            onPress={() => toggleTag(tag)}
            style={[
              styles.tag,
              selectedTags.includes(tag) ? styles.selectedTag : null,
            ]}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.journalButton}>
        <Text style={styles.buttonText}>My Journals</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  journalLabel: { fontWeight: 'bold', fontSize: 18 },
  dateText: { fontSize: 16, color: '#673ab7', borderWidth: 1, padding: 5, borderRadius: 5, borderColor: '#673ab7' },
  journalInput: { borderColor: '#ddd', borderWidth: 1, padding: 10, borderRadius: 5, height: 100, marginTop: 10 },
  shortcutLabel: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 5, marginRight: 5, marginBottom: 5 },
  selectedTag: { backgroundColor: '#673ab7', borderColor: '#673ab7' },
  tagText: { color: '#000' },
  journalButton: { backgroundColor: '#d1d9ff', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#673ab7', fontSize: 16, fontWeight: 'bold' },
});
