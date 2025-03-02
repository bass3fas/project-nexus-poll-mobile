import { View, Text } from 'react-native';
import { VictoryPie } from 'victory';

export default function ResultsScreen() {
  // Temporary data - replace with Firebase data
  const poll = {
    question: 'Best Programming Language?',
    options: [
      { id: '1', text: 'JavaScript', votes: 12 },
      { id: '2', text: 'Python', votes: 8 },
    ]
  };

  return (
    <View className="flex-1 items-center justify-center p-4">
      <Text className="text-2xl font-bold mb-6">{poll.question}</Text>
      <VictoryPie
        data={poll.options.map(opt => ({
          x: opt.text,
          y: opt.votes
        })}
        colorScale={['#3b82f6', '#10b981']}
        width={300}
        height={300}
        padAngle={2}
        innerRadius={50}
      />
    </View>
  );
}