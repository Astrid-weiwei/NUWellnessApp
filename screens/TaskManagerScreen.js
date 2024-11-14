import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import TaskItem from '../components/TaskItem';
import { addTask, getTasks, deleteTask, completeTask } from '../firebaseService';

export default function TaskManagerScreen() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const tasksData = await getTasks();
    setTasks(tasksData);
  };

  const addNewTask = async () => {
    await addTask({ title: task, completed: false });
    setTask('');
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleComplete = async (id) => {
    await completeTask(id);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="New Task"
        value={task}
        onChangeText={setTask}
        style={styles.input}
      />
      <Button title="Add Task" onPress={addNewTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onDelete={handleDelete} onComplete={handleComplete} />
        )}
      />
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
