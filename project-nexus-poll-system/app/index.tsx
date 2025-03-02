import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import '../global.css';

export default function WelcomeScreen() {
  return (
    <ImageBackground source={require('../assets/images/wave.jpeg')} className="flex-1 justify-center items-center">
      <View className="flex-1 justify-center items-center p-4 bg-white bg-opacity-80">
        <Text className="text-4xl font-bold text-center mb-6">Welcome{'\n'}to{'\n'}Nexus Poll</Text>
        
        <View className="flex-row justify-between w-full px-4">
          <Link href="/(tabs)/create" asChild>
            <TouchableOpacity className="bg-purple-600 rounded-full mx-2 py-2 px-4">
              <Text className="text-white text-center">Create a Poll</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(tabs)/vote" asChild>
            <TouchableOpacity className="bg-purple-600 rounded-full mx-2 py-2 px-4">
              <Text className="text-white text-center">Vote for a Poll</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ImageBackground>
  );
}