import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Lottie from 'lottie-react-native';
import animation from '../assets/animations/success.json';

export default function SignUpScreen() {
  const router = useRouter();
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details to Firestore in 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date(),
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        Alert.alert("Success", "Account created!");
        router.push("/signin"); // Redirect to sign-in page
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50 p-6">
        <ScrollView className="flex-1 p-4">
          <Text className="text-2xl font-bold text-black mb-6">Sign Up</Text>
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
              {isSubmitting ? 'Creating...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {showSuccess && (
          <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50">
            <Lottie
              source={animation}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 4,
  },
});
