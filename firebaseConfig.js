import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_zFSSHvXzoj9G9VEa6jArvKTScbzGUV4",
  authDomain: "nuwellnessapp.firebaseapp.com",
  projectId: "nuwellnessapp",
  storageBucket: "nuwellnessapp.firebasestorage.app",
  messagingSenderId: "321520657474",
  appId: "1:321520657474:web:466570a023d3d4459f79db",
  measurementId: "G-7GEWMPFYK4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Auth with persistence, only if it hasn't been initialized
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  if (error.code === "auth/already-initialized") {
    auth = getAuth(app); // Get the already-initialized Auth instance
  } else {
    throw error; // Rethrow any unexpected errors
  }
}

export { db, storage, auth };
