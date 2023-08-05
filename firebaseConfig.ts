import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRhBMCpwC0TnHvqmK17bqmUZ0vI-WcFZY",
  authDomain: "balanced-team-generator.firebaseapp.com",
  projectId: "balanced-team-generator",
  storageBucket: "balanced-team-generator.appspot.com",
  messagingSenderId: "23742490184",
  appId: "1:23742490184:web:850f515543521fe660da7d",
};

const app = initializeApp(firebaseConfig);

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
