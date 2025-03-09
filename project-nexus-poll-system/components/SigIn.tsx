import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { signIn } from "../store/slices/authSlice";
import { styles } from "../assets/styles";

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await dispatch(signIn({ email, password })).unwrap();
      Alert.alert("Welcome", `Hello ${result.email}!`);
      router.push("/"); // Redirect to main app
    } catch (error: any) {
      setErrorMessage(error.message || "Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Sign In</Text>
        </View>
        <ScrollView className="flex-1 p-4">
          <TextInput
            placeholder="Email"
            className="bg-white p-4 rounded-xl text-md border border-gray-300 shadow-md mb-4"
            onChangeText={setEmail}
            value={email}
          />
          <TextInput
            placeholder="Password"
            className="bg-white p-4 rounded-xl text-md border border-gray-300 shadow-md mb-1"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isSubmitting}
            className="bg-purple-600 p-4 rounded-xl flex-row justify-center items-center shadow-md mt-4"
          >
            <Text className="text-white text-lg font-semibold">
              {isSubmitting ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <Text style={styles.signInText}>or Sign up here</Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
