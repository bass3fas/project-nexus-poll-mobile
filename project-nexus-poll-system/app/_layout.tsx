import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> {/* Welcome Screen */}
        <Stack.Screen name="(tabs)" /> {/* Main app tabs */}
      </Stack>
    </Provider>
  );
}