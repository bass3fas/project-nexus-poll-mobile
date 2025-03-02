import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-gray-100">
      <Text className="text-3xl font-bold mb-8">Nexus Poll 🗳️</Text>
      
      <View className="w-full max-w-sm gap-4">
        <Link href="/create" asChild>
          <Button
            title="Create New Poll"
            color="#3b82f6"
            className="py-3 rounded-lg"
          />
        </Link>
        
        <Link href="/vote" asChild>
          <Button
            title="Vote in Polls"
            color="#4f46e5"
            className="py-3 rounded-lg"
          />
        </Link>
      </View>
    </View>
  );
}