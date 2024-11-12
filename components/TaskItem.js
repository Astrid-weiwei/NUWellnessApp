import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TaskItem({ task, onDelete, onComplete }) {
  return (
    <View style={styles.taskContainer}>
      <Text style={[styles.taskText, task.completed && styles.completed]}>{task.title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onComplete(task.id)} style={styles.completeButton}>
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskText: {
    fontSize: 16,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
  },
  completeButton: {
    marginRight: 10,
  },
  completeText: {
    color: '#28a745',
  },
  deleteButton: {
    marginRight: 10,
  },
  deleteText: {
    color: '#dc3545',
  },
});
