import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { addThoughtEntry, getThoughtEntries, deleteThoughtEntry, updateThoughtEntry } from '../firebaseService';

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
  const [editingId, setEditingId] = useState(null);

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
    try {
      if (editingId) {
        // Update existing entry
        const updatedEntry = {
          ...thoughtData,
          timestamp: new Date().getTime()
        };
        await updateThoughtEntry(editingId, updatedEntry);
        setEditingId(null);
      } else {
        // Add new entry
        const entryWithTimestamp = {
          ...thoughtData,
          timestamp: new Date().getTime()
        };
        await addThoughtEntry(entryWithTimestamp);
      }
      setThoughtData({ mind: '', feeling: '', worst: '', best: '', likely: '', action: '' });
      fetchThoughtEntries();
    } catch (error) {
      Alert.alert('Error', 'Failed to save the entry. Please try again.');
      console.error('Error saving thought entry:', error);
    }
  };

  const handleEdit = (item) => {
    setThoughtData({
      mind: item.mind,
      feeling: item.feeling,
      worst: item.worst,
      best: item.best,
      likely: item.likely,
      action: item.action,
    });
    setEditingId(item.id);
    // Scroll to top where the form is
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
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
              if (editingId === id) {
                setEditingId(null);
                setThoughtData({ mind: '', feeling: '', worst: '', best: '', likely: '', action: '' });
              }
              fetchThoughtEntries();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the entry. Please try again.');
              console.error('Error deleting thought entry:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const flatListRef = React.createRef();

  const renderEntry = ({ item }) => (
    <View style={styles.entryContainer}>
      {item.timestamp && (
        <Text style={styles.timestampText}>
          {new Date(item.timestamp).toLocaleString()}
        </Text>
      )}
      <View style={styles.entryContent}>
        <Text style={styles.entryText}>Mind: {item.mind}</Text>
        <Text style={styles.entryText}>Feeling: {item.feeling}</Text>
        <Text style={styles.entryText}>Worst Outcome: {item.worst}</Text>
        <Text style={styles.entryText}>Best Outcome: {item.best}</Text>
        <Text style={styles.entryText}>Likely Outcome: {item.likely}</Text>
        <Text style={styles.entryText}>Action: {item.action}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={[{ id: 'form' }, ...thoughtEntries.sort((a, b) => b.timestamp - a.timestamp)]}
      keyExtractor={(item, index) => item.id || `form-${index}`}
      renderItem={({ item }) =>
        item.id === 'form' ? (
          <View style={styles.container}>
            <Text style={styles.header}>
              {editingId ? 'Edit Entry' : 'Challenging Negative Thoughts'}
            </Text>
            {[
              { label: "What's on your mind?", key: 'mind' },
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
            <View style={styles.formButtonContainer}>
              <TouchableOpacity 
                onPress={handleSave} 
                style={[styles.saveButton, editingId && styles.updateButton]}
              >
                <Text style={styles.buttonText}>
                  {editingId ? 'Update Entry' : 'Save Entry'}
                </Text>
              </TouchableOpacity>
              {editingId && (
                <TouchableOpacity 
                  onPress={() => {
                    setEditingId(null);
                    setThoughtData({ mind: '', feeling: '', worst: '', best: '', likely: '', action: '' });
                  }} 
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel Edit</Text>
                </TouchableOpacity>
              )}
            </View>
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
  saveButton: { backgroundColor: '#673ab7', padding: 10, borderRadius: 5, flex: 1 },
  updateButton: { backgroundColor: '#4CAF50' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  entryContainer: { padding: 10, marginVertical: 10, backgroundColor: '#f9f9f9', borderRadius: 5 },
  entryText: { fontSize: 14, marginBottom: 5 },
  deleteButton: { backgroundColor: '#ff5252', padding: 10, borderRadius: 5, flex: 1, marginLeft: 10 },
  editButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, flex: 1 },
  flatListContainer: { padding: 20 },
  timestampText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  entryContent: {
    marginVertical: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10
  }
});