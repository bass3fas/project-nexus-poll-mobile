// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Welcome Screen */}
      <Stack.Screen name="(tabs)" /> {/* Main app tabs */}
    </Stack>
  );
}