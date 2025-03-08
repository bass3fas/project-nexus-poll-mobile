import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { setUser } from '../store/slices/authSlice';
import { AppDispatch } from '../store/store';
import LoadingScreen from './LoadingScreen';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Handle auth state persistence
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          dispatch(setUser({ uid: user.uid, email: user.email }));
        } else {
          dispatch(setUser(null));
        }
      } catch (error) {
        console.error('Auth state error:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

export default AuthProvider;