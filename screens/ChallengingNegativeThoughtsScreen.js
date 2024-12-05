import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { addThoughtEntry, getThoughtEntries, deleteThoughtEntry } from '../firebaseService';

export default function ChallengingNegativeThoughtsScreen() {
  const [thoughtData, setThoughtData] = useState({
    mind: '',
    feeling: '',
    worst: '',
    best: '',
    likely: '',
    action: '',
  });

  const [thoughtEntries, setThoughtEntries] = useState([]);

  useEffect(() => {
    fetchThoughtEntries();
  }, []);

  const fetchThoughtEntries = async () => {
    try {
      const entries = await getThoughtEntries();
      setThoughtEntries(entries);
    } catch (error) {
      console.error('Error fetching thought entries:', error);
    }
  };

  const handleSave = async () => {
    await addThoughtEntry(thoughtData);
    setThoughtData({ mind: '', feeling: '', worst: '', best: '', likely: '', action: '' });
    fetchThoughtEntries(); // Refresh the list
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteThoughtEntry(id);
              fetchThoughtEntries(); // Refresh the list after deletion
            } catch (error) {
              console.error('Error deleting thought entry:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderEntry = ({ item }) => (
    <View style={styles.entryContainer}>
      <Text style={styles.entryText}>Mind: {item.mind}</Text>
      <Text style={styles.entryText}>Feeling: {item.feeling}</Text>
      <Text style={styles.entryText}>Worst Outcome: {item.worst}</Text>
      <Text style={styles.entryText}>Best Outcome: {item.best}</Text>
      <Text style={styles.entryText}>Likely Outcome: {item.likely}</Text>
      <Text style={styles.entryText}>Action: {item.action}</Text>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={[{ id: 'form' }, ...thoughtEntries]}
      keyExtractor={(item, index) => item.id || `form-${index}`}
      renderItem={({ item }) =>
        item.id === 'form' ? (
          <View style={styles.container}>
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
          </View>
        ) : (
          renderEntry({ item })
        )
      }
      contentContainerStyle={styles.flatListContainer}
    />
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
  entryContainer: { padding: 10, marginVertical: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  entryText: { fontSize: 14, marginBottom: 5 },
  deleteButton: { backgroundColor: '#ff5252', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  deleteButtonText: { color: '#fff', fontSize: 14 },
  flatListContainer: { padding: 20 },
});
