import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// CRUD for `users`
export const createUser = async (userData) => {
  return await addDoc(collection(db, "users"), userData);
};

// CRUD for `moodEntries`
export const addMoodEntry = async (entryData) => {
  return await addDoc(collection(db, "moodEntries"), entryData);
};

export const getMoodEntries = async (userId) => {
  const querySnapshot = await getDocs(collection(db, "moodEntries").where("userId", "==", userId));
  const entries = [];
  querySnapshot.forEach(doc => entries.push({ id: doc.id, ...doc.data() }));
  return entries;
};

// CRUD for `tasks`
export const addTask = async (taskData) => {
  return await addDoc(collection(db, "tasks"), taskData);
};
