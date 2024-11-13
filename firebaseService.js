// // firebaseService.js
// import { db } from './firebaseConfig';

// // Mood CRUD operations
// export const addMoodEntry = async (moodEntry) => {
//   await db.collection('MoodEntries').add(moodEntry);
// };

// export const getMoodEntries = async () => {
//   const snapshot = await db.collection('MoodEntries').get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// // Habit CRUD operations
// export const addHabit = async (habit) => {
//   await db.collection('Habits').add(habit);
// };

// export const getHabits = async () => {
//   const snapshot = await db.collection('Habits').get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// // Task CRUD operations
// export const addTask = async (task) => {
//   await db.collection('Tasks').add(task);
// };

// export const getTasks = async () => {
//   const snapshot = await db.collection('Tasks').get();
//   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
// };

// export const deleteTask = async (id) => {
//   await db.collection('Tasks').doc(id).delete();
// };

// export const completeTask = async (id) => {
//   await db.collection('Tasks').doc(id).update({ completed: true });
// };
// firebaseService.js
import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

// Collection references
const moodCollectionRef = collection(db, 'moodEntries');
const workTodosCollectionRef = collection(db, 'workTodos');
const lifeTodosCollectionRef = collection(db, 'lifeTodos');
const toolCollectionRef = collection(db, 'tools');
const thoughtCollectionRef = collection(db, 'thoughtEntries');

// Add a new mood entry
export const addMoodEntry = async (entry) => {
  try {
    await addDoc(moodCollectionRef, entry);
    console.log("Mood entry added successfully!");
  } catch (error) {
    console.error("Error adding mood entry: ", error);
  }
};

export const addThoughtEntry = async (entry) => {
    try {
      await addDoc(thoughtCollectionRef, entry);
      console.log("Thought entry added successfully!");
    } catch (error) {
      console.error("Error adding thought entry: ", error);
    }
  };

// Get all mood entries
export const getMoodEntries = async () => {
  try {
    const querySnapshot = await getDocs(moodCollectionRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting mood entries: ", error);
    return [];
  }
};

// Update an existing mood entry
export const updateMoodEntry = async (id, updatedEntry) => {
  try {
    const moodDocRef = doc(db, 'moodEntries', id);
    await updateDoc(moodDocRef, updatedEntry);
    console.log("Mood entry updated successfully!");
  } catch (error) {
    console.error("Error updating mood entry: ", error);
  }
};

// Delete a mood entry
export const deleteMoodEntry = async (id) => {
  try {
    const moodDocRef = doc(db, 'moodEntries', id);
    await deleteDoc(moodDocRef);
    console.log("Mood entry deleted successfully!");
  } catch (error) {
    console.error("Error deleting mood entry: ", error);
  }
};

// Add a new activity log
export const addActivityLog = async (activity) => {
  try {
    await addDoc(activityCollectionRef, activity);
    console.log("Activity log added successfully!");
  } catch (error) {
    console.error("Error adding activity log: ", error);
  }
};

// Get all activity logs
export const getActivityLogs = async () => {
  try {
    const querySnapshot = await getDocs(activityCollectionRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting activity logs: ", error);
    return [];
  }
};

// Add a new tool entry (if tools are dynamically added)
export const addTool = async (tool) => {
  try {
    await addDoc(toolCollectionRef, tool);
    console.log("Tool added successfully!");
  } catch (error) {
    console.error("Error adding tool: ", error);
  }
};

// Get all tools
export const getTools = async () => {
  try {
    const querySnapshot = await getDocs(toolCollectionRef);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting tools: ", error);
    return [];
  }
};

export const addWorkTodo = async (todo) => {
    try {
      await addDoc(workTodosCollectionRef, todo);
      console.log("Work to-do added successfully!");
    } catch (error) {
      console.error("Error adding work to-do: ", error);
    }
  };
  
  export const getWorkTodos = async () => {
    try {
      const querySnapshot = await getDocs(workTodosCollectionRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting work to-dos: ", error);
      return [];
    }
  };
  
  export const deleteWorkTodo = async (id) => {
    try {
      const todoDocRef = doc(db, 'workTodos', id);
      await deleteDoc(todoDocRef);
      console.log("Work to-do deleted successfully!");
    } catch (error) {
      console.error("Error deleting work to-do: ", error);
    }
  };
  
  // Life Todos CRUD
  export const addLifeTodo = async (todo) => {
    try {
      await addDoc(lifeTodosCollectionRef, todo);
      console.log("Life to-do added successfully!");
    } catch (error) {
      console.error("Error adding life to-do: ", error);
    }
  };
  
  export const getLifeTodos = async () => {
    try {
      const querySnapshot = await getDocs(lifeTodosCollectionRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting life to-dos: ", error);
      return [];
    }
  };
  
  export const deleteLifeTodo = async (id) => {
    try {
      const todoDocRef = doc(db, 'lifeTodos', id);
      await deleteDoc(todoDocRef);
      console.log("Life to-do deleted successfully!");
    } catch (error) {
      console.error("Error deleting life to-do: ", error);
    }
  };