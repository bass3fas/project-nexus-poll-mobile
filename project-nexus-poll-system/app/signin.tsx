import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "expo-router";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user details from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        console.log("User Data:", userDoc.data());
        Alert.alert("Welcome", `Hello ${userDoc.data().name}!`);
        router.push("/(tabs)"); // Redirect to main app
      } else {
        Alert.alert("Error", "User data not found.");
      }
    } catch (error) {
      Alert.alert("Error", "Invalid email or password.");
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Sign In</Text>
      <TextInput placeholder="Email" className="border w-full p-2 mb-3" onChangeText={setEmail} />
      <TextInput placeholder="Password" className="border w-full p-2 mb-3" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity className="bg-purple-600 p-3 rounded-full" onPress={handleSignIn}>
        <Text className="text-white text-center">Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}
