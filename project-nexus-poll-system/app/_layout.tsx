import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Stack } from "expo-router";
import LoadingScreen from '../components/LoadingScreen';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> {/* Welcome Screen */}
        <Stack.Screen name="(tabs)" /> {/* Main app tabs */}
      </Stack>
    </Provider>
  );
}