import { db } from './firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "firebase/auth";

// Initialize Firebase Auth
const auth = getAuth();

// Register a new user
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Login an existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Logout the current user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Get the current logged-in user
export const getCurrentUser = () => auth.currentUser;


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

  export const getThoughtEntries = async () => {
    try {
      const querySnapshot = await getDocs(thoughtCollectionRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting thought entries: ", error);
      return [];
    }
  };


  export const deleteThoughtEntry = async (id) => {
    try {
      const thoughtDocRef = doc(db, 'thoughtEntries', id);
      await deleteDoc(thoughtDocRef);
      console.log("Thought entry deleted successfully!");
    } catch (error) {
      console.error("Error deleting thought entry: ", error);
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
export const updateMoodEntry = async (entry) => {
  try {
    const entryRef = doc(db, 'moodEntries', entry.id);
    await updateDoc(entryRef, {
      mood: entry.mood,
      journal: entry.journal,
      // Add other fields as needed
    });
  } catch (error) {
    throw error;
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

export const updateWorkTodo = async (id, updatedFields) => {
    try {
      const todoDocRef = doc(db, 'workTodos', id);
      await updateDoc(todoDocRef, updatedFields);
      console.log("Work todo updated successfully!");
    } catch (error) {
      console.error("Error updating work todo:", error);
    }
  };

  export const updateLifeTodo = async (id, updatedFields) => {
    try {
      const todoDocRef = doc(db, 'lifeTodos', id);
      await updateDoc(todoDocRef, updatedFields);
      console.log("Life todo updated successfully!");
    } catch (error) {
      console.error("Error updating life todo:", error);
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