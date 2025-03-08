import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Stack } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import AuthProvider from '../components/AuthProvider';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <LinearGradient colors={['#6C47FF', '#A020F0']} style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signin" />
            <Stack.Screen name="signup" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </LinearGradient>
      </AuthProvider>
    </Provider>
  );
}
