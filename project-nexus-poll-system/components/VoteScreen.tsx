import { View, Text, Button } from 'react-native';

export default function VoteScreen() {
  // Temporary data - replace with Firebase data
  const polls = [
    {
      id: '1',
      question: 'Best Programming Language?',
      options: [
        { id: '1', text: 'JavaScript', votes: 12 },
        { id: '2', text: 'Python', votes: 8 },
      ]
    }
  ];

  return (
    <View className="p-4">
      {polls.map(poll => (
        <View key={poll.id} className="mb-6 p-4 bg-white rounded-lg shadow">
          <Text className="text-lg font-bold mb-2">{poll.question}</Text>
          {poll.options.map(option => (
            <Button
              key={option.id}
              title={`${option.text} (${option.votes})`}
              onPress={() => {/* Add voting logic */}}
              color="#4f46e5"
              className="mb-2"
            />
          ))}
        </View>
      ))}
    </View>
  );
}