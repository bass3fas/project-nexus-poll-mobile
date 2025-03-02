import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-4 bg-gray-100">
      <Text>Nexus Poll 🗳️</Text>
      
      <View>
        <Link href="/(tabs)/create" asChild>
          <Button
            title="Create New Poll"
          />
        </Link>
        
        <Link href="/(tabs)/vote" asChild>
          <Button
            title="Vote in Polls"
          />
        </Link>
      </View>
    </View>
  );
}