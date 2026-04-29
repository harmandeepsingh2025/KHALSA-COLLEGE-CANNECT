import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'student' | 'instructor' | 'admin';
  studentId?: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [loading, setLoading] = useState(false);

  const mockProfile: UserProfile = {
    uid: 'mock-user-123',
    displayName: 'Demo Student',
    email: 'student@khalsacollege.edu',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    role: 'student',
    studentId: '2024-KCA-8892',
    phoneNumber: '+91 98765-43210',
  };

  const login = async () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return (
    <AuthContext.Provider value={{ 
      user: isLoggedIn ? { uid: 'mock-user-123' } : null, 
      profile: isLoggedIn ? mockProfile : null, 
      loading, 
      isLoggedIn, 
      login, 
      logout 
    }}>
      {children}
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
