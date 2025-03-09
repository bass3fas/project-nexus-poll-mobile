import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { signOutUser } from '../store/slices/authSlice';
import useFonts from '../hooks/useFonts';
import { styles } from '../assets/styles';
import "../global.css";

export default function WelcomeScreen() {
  const fontsLoaded = useFonts();
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!fontsLoaded) {
    return null; 
  }

  const handleSignOut = () => {
    dispatch(signOutUser());
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <LinearGradient colors={['#6C47FF', '#A020F0']} className="flex-1 justify-center items-center px-6">
        {/* Animated Poll Icon */}
        <View className="flex-row justify-center mb-4">
          <LottieView
            source={require('../assets/animations/poll-box.json')} // Add a poll-related animation
            autoPlay
            loop
            style={{ width: 100, height: 100 }} 
          />
        </View>

        {/* Welcome Text */}
        <Text style={styles.welcomeText}>
          Nexus Poll
        </Text>

        {/* Welcome Message */}
        {user && (
          <Text className="text-white text-center text-lg mb-4">
            Welcome, {user.name}!
          </Text>
        )}

        {/* Action Buttons */}
        <View className="flex-row justify-center w-1/2 px-2 mb-10">
          {user ? (
            <>
              <TouchableOpacity onPress={handleSignOut} className="border border-white rounded-full mx-2 py-3 px-6">
                <Text className="text-white text-center text-lg">Sign Out</Text>
              </TouchableOpacity>
              <Link href="/create" asChild>
                <TouchableOpacity className="bg-white rounded-full mx-2 py-3 px-6 shadow-lg">
                  <Text className="text-purple-600 text-center text-lg font-semibold">Create Poll</Text>
                </TouchableOpacity>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signin" asChild>
                <TouchableOpacity className="border border-white rounded-full mx-2 py-3 px-6">
                  <Text className="text-white text-center text-lg">Sign In</Text>
                </TouchableOpacity>
              </Link>
              
              <Link href="/signup" asChild>
                <TouchableOpacity className="bg-white rounded-full mx-2 py-3 px-6 shadow-lg">
                  <Text className="text-purple-600 text-center text-lg font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </>
          )}
        </View>

        {/* Check Live Votes */}
        <Link href="/results" asChild>
          <TouchableOpacity>
            <Text style={styles.liveVotesText}>or check live votes</Text>
          </TouchableOpacity>
        </Link>
      </LinearGradient>
    </ScrollView>
  );
}
