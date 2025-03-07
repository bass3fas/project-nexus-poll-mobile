import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import "../global.css";

export default function WelcomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <LinearGradient colors={['#6C47FF', '#A020F0']} className="flex-1 justify-center items-center px-6">
        {/* Animated Poll Icon */}
        
        <LottieView
          source={require('../assets/animations/chart.json')} // Add a poll-related animation
          autoPlay
          loop
          style={{ width: 50, height: 50 }} // Adjust the size here
        />
        

        {/* Welcome Text */}
        <Text className="text-4xl font-bold text-white text-center mb-4 mt-1">
          Welcome to Nexus Poll
        </Text>

        {/* Action Buttons */}
        <View className="flex-row justify-center w-1/2 px-2 mb-10">
          <Link href="/create" asChild>
            <TouchableOpacity className="border border-white rounded-full mx-2 py-3 px-6">
              <Text className="text-white text-center text-lg">Create a Poll</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/vote" asChild>
            <TouchableOpacity className="bg-white rounded-full mx-2 py-3 px-6 shadow-lg">
              <Text className="text-purple-600 text-center text-lg font-semibold">Vote Now</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
