// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAdHC-O1ELX_6cwYuijRjPa59ghqWFqYBs",
  authDomain: "human-error-shield.firebaseapp.com",
  projectId: "human-error-shield",
  storageBucket: "human-error-shield.firebasestorage.app",
  messagingSenderId: "779577295336",
  appId: "1:779577295336:web:176249057bbba0be4e645d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();