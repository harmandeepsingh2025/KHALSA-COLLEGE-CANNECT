import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInAnonymously, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'student' | 'instructor' | 'admin';
  studentId?: string;
  phoneNumber?: string;
  academicYear?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: () => Promise<FirebaseUser>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      if (!authUser) {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setProfile({ uid: user.uid, ...docSnap.data() } as UserProfile);
      } else {
        // Initial profile if it doesn't exist
        const initialProfile: Partial<UserProfile> = {
          displayName: user.displayName || 'New Scholar',
          email: user.email,
          photoURL: user.photoURL,
          role: 'student'
        };
        setProfile({ uid: user.uid, ...initialProfile } as UserProfile);
      }
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user]);

  const login = async () => {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      isLoggedIn: !!user, 
      login, 
      logout,
      updateProfile 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
