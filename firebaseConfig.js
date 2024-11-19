// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_zFSSHvXzoj9G9VEa6jArvKTScbzGUV4",
  authDomain: "nuwellnessapp.firebaseapp.com",
  projectId: "nuwellnessapp",
  storageBucket: "nuwellnessapp.firebasestorage.app",
  messagingSenderId: "321520657474",
  appId: "1:321520657474:web:466570a023d3d4459f79db",
  measurementId: "G-7GEWMPFYK4"
};

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
