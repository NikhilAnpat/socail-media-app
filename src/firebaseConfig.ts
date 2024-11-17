import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAvqRuAWogZdcnMZUyIKxXP85M0UsjyQV4",
  authDomain: "social-media-app-3510a.firebaseapp.com",
  projectId: "social-media-app-3510a",
  storageBucket: "social-media-app-3510a.appspot.com",
  messagingSenderId: "178218390666",
  appId: "1:178218390666:web:f19180e50988e5e4c3c973",
  measurementId: "G-WWW5TZT4K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export const storage = getStorage(app); // Export Firebase Storage


// Set authentication persistence to local (persists even on page reload)
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});
