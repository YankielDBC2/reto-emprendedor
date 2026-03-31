import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCZQieJkYabfNQUHvcZcmkjNq8EAQlyq0Y",
  authDomain: "reto-emprendedor.firebaseapp.com",
  projectId: "reto-emprendedor",
  storageBucket: "reto-emprendedor.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);