import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { VictoryPie } from 'victory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPolls, voteOnPoll } from '../store/slices/pollSlice';
import { useRoute } from '@react-navigation/native';

const ResultsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, status, error } = useSelector((state: RootState) => state.poll);
  const route = useRoute();
  const pollId = route.params?.pollId;
  const [selectedPoll, setSelectedPoll] = useState<string | null>(pollId || null);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  useEffect(() => {
    if (pollId) setSelectedPoll(pollId);
  }, [pollId]);

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await dispatch(voteOnPoll({ pollId, optionId })).unwrap();
      Alert.alert('Success', 'Your vote has been recorded!');
      dispatch(fetchPolls());
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    }
  };

  const calculatePercentage = (votes: number, total: number) => (total > 0 ? ((votes / total) * 100).toFixed(1) : '0');

  if (status === 'loading') {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Poll Results</Text>

      {polls.map((poll) => (
        <View key={poll.id} className="bg-white p-4 rounded-xl shadow-md mb-4">
          <TouchableOpacity onPress={() => setSelectedPoll(selectedPoll === poll.id ? null : poll.id)}>
            <Text className="text-lg font-semibold text-gray-800">{poll.question}</Text>
            <Text className="text-gray-500 text-sm mt-1">{poll.totalVotes} total votes</Text>
          </TouchableOpacity>

          {selectedPoll === poll.id && (
            <View className="mt-4">
              <VictoryPie
                data={Object.values(poll.options).map(option => ({
                  x: `${option.text}\n${calculatePercentage(option.votes, poll.totalVotes)}%`,
                  y: option.votes,
                }))}
                colorScale={["#F87171", "#60A5FA", "#FBBF24", "#34D399", "#F59E0B"]}
                width={350}
                height={350}
                padAngle={2}
                innerRadius={80}
                labelRadius={({ datum }) => 120}
                style={{
                  labels: { fill: 'black', fontSize: 14, fontWeight: 'bold', textAnchor: 'middle' },
                }}
              />

              <View className="space-y-2 mt-4">
                {Object.entries(poll.options).map(([optionId, option]) => (
                  <TouchableOpacity
                    key={optionId}
                    onPress={() => handleVote(poll.id, optionId)}
                    disabled={status === 'loading'}
                    className="bg-indigo-100 p-3 rounded-lg shadow"
                  >
                    <View className="flex-row justify-between">
                      <Text className="text-indigo-700 font-medium">{option.text}</Text>
                      <Text className="text-indigo-700">{calculatePercentage(option.votes, poll.totalVotes)}%</Text>
                    </View>
                    <View className="w-full bg-indigo-300 h-2 rounded-full mt-2 overflow-hidden">
                      <View style={{ width: `${calculatePercentage(option.votes, poll.totalVotes)}%` }} className="h-full bg-indigo-600" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

export default ResultsScreen;