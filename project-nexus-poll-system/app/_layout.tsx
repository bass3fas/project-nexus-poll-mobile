import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import LoadingScreen from '../components/LoadingScreen';
import { View } from 'react-native';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <LinearGradient colors={['#6C47FF', '#A020F0']} style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" /> {/* Welcome Screen */}
          <Stack.Screen name="signin" /> {/* Sign In Screen */}
          <Stack.Screen name="signup" /> {/* Sign Up Screen */}
          <Stack.Screen name="(tabs)" /> {/* Main app tabs */}
        </Stack>
      </LinearGradient>
    </Provider>
  );
}
