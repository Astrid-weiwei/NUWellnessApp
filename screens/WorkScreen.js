import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { addWorkTodo, getWorkTodos, deleteWorkTodo, updateWorkTodo } from '../firebaseService';

export default function WorkScreen() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const todosList = await getWorkTodos();
    setTodos(todosList);
  };

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      await addWorkTodo({ text: newTodo, completed: false });
      setNewTodo('');
      fetchTodos();
    }
  };

  const handleDeleteTodo = async (id) => {
    await deleteWorkTodo(id);
    fetchTodos();
  };

  const handleToggleComplete = async (id, currentStatus) => {
    const updatedStatus = !currentStatus;
    await updateWorkTodo(id, { completed: updatedStatus });
    fetchTodos();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Work To-Do List</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        value={newTodo}
        onChangeText={setNewTodo}
      />
      <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <TouchableOpacity
              onPress={() => handleToggleComplete(item.id, item.completed)}
              style={[
                styles.checkbox,
                item.completed && styles.checkboxCompleted,
              ]}
            >
              <Text style={styles.checkmark}>{item.completed ? '✅' : ''}</Text>
            </TouchableOpacity>
            <View style={styles.todoTextContainer}>
              <Text style={[styles.todoText, item.completed && styles.completedText]}>
                {item.text}
              </Text>
              {item.completed && <Text style={styles.completedLabel}>Completed</Text>}
            </View>
            <TouchableOpacity onPress={() => handleDeleteTodo(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 10, borderRadius: 5 },
  addButton: { backgroundColor: '#673ab7', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 20 },
  addButtonText: { color: '#fff', fontSize: 16 },
  todoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd' 
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#673ab7',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  checkboxCompleted: {
    backgroundColor: '#e0e0e0',
  },
  checkmark: {
    fontSize: 16,
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: { 
    fontSize: 18, 
  },
  completedText: { 
    textDecorationLine: 'line-through', 
    color: 'gray' 
  },
  completedLabel: {
    fontSize: 14,
    color: 'green',
    marginTop: 5,
  },
  deleteButton: { 
    color: 'red', 
    marginLeft: 10 
  },
});
