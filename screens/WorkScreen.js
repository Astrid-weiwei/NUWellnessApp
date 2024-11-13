// screens/WorkScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { addWorkTodo, getWorkTodos, deleteWorkTodo } from '../firebaseService';

export default function WorkScreen() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const fetchedTodos = await getWorkTodos();
    setTodos(fetchedTodos);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addWorkTodo({ text: newTodo });
      setNewTodo('');
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteWorkTodo(id);
    fetchTodos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Work To-Do List</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text>{item.text}</Text>
            <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TextInput
        placeholder="Add a new task..."
        value={newTodo}
        onChangeText={setNewTodo}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
  addButton: { backgroundColor: '#673ab7', padding: 10, borderRadius: 5, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16 },
  todoItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  deleteButton: { color: 'red' },
});
