import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2eVN7LKlmXYXJ-DeAe625F6nGV5EncPY",
  authDomain: "reto-emprendedor-deac0.firebaseapp.com",
  projectId: "reto-emprendedor-deac0",
  storageBucket: "reto-emprendedor-deac0.firebasestorage.app",
  messagingSenderId: "868583804447",
  appId: "1:868583804447:web:82401c2aca6480137a0f2a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);