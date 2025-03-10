import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useRouter, Link } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Lottie from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { signUp } from "../store/slices/authSlice";
import animation from "../assets/animations/success.json";
import { styles } from "../assets/styles";

export default function SignUpScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    try {
      setIsSubmitting(true);
      const result = await dispatch(signUp({ email, password, name })).unwrap();
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        //Alert.alert("Success", "Account created!");
        router.push("/signin"); // Redirect to sign-in page
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Registration failed.");
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
          <Text style={styles.headerText}>Sign Up</Text>
        </View>
        <ScrollView className="flex-1 p-4">
          <TextInput
            placeholder="Name"
            className="bg-white p-4 rounded-xl text-md border border-gray-300 shadow-md mb-4"
            onChangeText={setName}
            value={name}
          />
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
            onPress={handleSignUp}
            disabled={isSubmitting}
            className="bg-purple-600 p-4 rounded-xl flex-row justify-center items-center shadow-md mt-4"
          >
            <Text className="text-white text-lg font-semibold">
              {isSubmitting ? "Creating..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
          <Link href="/signin" asChild>
            <TouchableOpacity>
              <Text style={styles.signInText}>or Sign in here</Text>
            </TouchableOpacity>
          </Link>
        </ScrollView>
        {showSuccess && (
          <View style={styles.successOverlay}>
            <Lottie
              source={animation}
              autoPlay
              loop={false}
              style={styles.successAnimation}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
