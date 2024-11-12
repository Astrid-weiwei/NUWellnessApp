// TasksScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { firestore } from '../firebaseConfig';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Create task
  const addTask = async () => {
    if (newTask.trim()) {
      await firestore.collection('tasks').add({
        title: newTask,
        completed: false,
        dueDate: new Date(),
        userId: "user-id"  // Replace with actual user ID
      });
      setNewTask("");
      fetchTasks();
    }
  };

  // Read tasks
  const fetchTasks = async () => {
    const snapshot = await firestore.collection('tasks').get();
    const taskList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(taskList);
  };

  // Update task
  const toggleTaskCompletion = async (id, completed) => {
    await firestore.collection('tasks').doc(id).update({ completed: !completed });
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await firestore.collection('tasks').doc(id).delete();
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View>
      <TextInput
        placeholder="Add a new task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Button
              title={item.completed ? "Mark Incomplete" : "Mark Complete"}
              onPress={() => toggleTaskCompletion(item.id, item.completed)}
            />
            <Button title="Delete" onPress={() => deleteTask(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
