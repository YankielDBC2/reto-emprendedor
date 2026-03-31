import { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            // Create user document if doesn't exist
            await setDoc(docRef, {
              email: currentUser.email,
              createdAt: new Date().toISOString(),
              hasSetup: false,
              meta: 0,
              balance: 0,
              transactions: [],
              promos: []
            });
            setUserData({
              email: currentUser.email,
              createdAt: new Date().toISOString(),
              hasSetup: false,
              meta: 0,
              balance: 0,
              transactions: [],
              promos: []
            });
          }
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const now = new Date().toISOString();
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      createdAt: now,
      hasSetup: false,
      meta: 0,
      balance: 0,
      transactions: [],
      promos: []
    });
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserData = (data) => {
    setUserData(data);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, signup, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
}