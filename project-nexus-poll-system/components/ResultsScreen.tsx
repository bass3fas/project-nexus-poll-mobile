import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPolls, voteOnPoll } from '../store/slices/pollSlice';
import { useRoute } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit'; // Replace VictoryPie

const ResultsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, status, error } = useSelector((state: RootState) => state.poll);
  const { user } = useSelector((state: RootState) => state.auth);
  const route = useRoute<{ key: string; name: string; params: { pollId: string } }>();
  const pollId = route.params?.pollId;
  const [selectedPoll, setSelectedPoll] = useState<string | null>(pollId || null);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  useEffect(() => {
    if (pollId) setSelectedPoll(pollId);
  }, [pollId]);

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to vote');
      return;
    }

    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    const previousOptionId = Object.entries(poll.options).find(([_, option]) =>
      option.voters.includes(user.uid)
    )?.[0];

    if (previousOptionId === optionId) {
      // User clicked the same option, do nothing
      return;
    }

    try {
      await dispatch(voteOnPoll({ pollId, optionId, userId: user.uid })).unwrap();
      //Alert.alert('Success', 'Your vote has been recorded!');
      // dispatch(fetchPolls()) 
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    }
  };

  const calculatePercentage = (votes: number, total: number) => (total > 0 ? ((votes / total) * 100).toFixed(1) : '0');

  const getSelectedOption = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll || !user) return null;
    return Object.entries(poll.options).find(([_, option]) => 
      option.voters.includes(user.uid)
    )?.[0];
  };

  const getChartData = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return [];
    
    return Object.values(poll.options)
      .filter(option => option.votes > 0)
      .map((option, index) => ({
        name: option.text,
        population: option.votes,
        color: `rgba(${index * 50}, ${index * 100}, 200, 1)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 15
      }));
  };

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

      {polls.map((poll) => {
        const selectedOption = getSelectedOption(poll.id);

        return (
          <View key={poll.id} className="bg-white p-4 rounded-xl shadow-md mb-4">
            <TouchableOpacity onPress={() => setSelectedPoll(selectedPoll === poll.id ? null : poll.id)}>
              <Text className="text-lg font-semibold text-gray-800">{poll.question}</Text>
              <Text className="text-gray-500 text-sm mt-1">{poll.totalVotes} total votes</Text>
            </TouchableOpacity>

            {selectedPoll === poll.id && (
              <View className="mt-4">
                {poll.totalVotes > 0 ? (
                  <>
                    <PieChart
                      data={getChartData(poll.id)}
                      width={screenWidth - 32}
                      height={220}
                      chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="15"
                      absolute
                    />

                    <View className="space-y-2 mt-4">
                      {Object.entries(poll.options).map(([optionId, option]) => {
                        const percentage = calculatePercentage(option.votes, poll.totalVotes);
                        
                        return (
                          <TouchableOpacity
                            key={optionId}
                            onPress={() => handleVote(poll.id, optionId)}
                            disabled={status !== 'idle' && status !== 'succeeded' && status !== 'failed'}
                            className={`p-3 rounded-lg border-2 ${
                              selectedOption === optionId 
                                ? 'border-indigo-600 bg-indigo-50' 
                                : 'border-gray-200 bg-white'
                            }`}
                          >
                            <View className="flex-row justify-between items-center">
                              <Text className="text-gray-800 font-medium">
                                {option.text}
                              </Text>
                              <Text className="text-gray-500">
                                {option.votes} ({percentage}%)
                              </Text>
                            </View>
                            <View className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                              <View 
                              style={{ width: `${percentage}%` as `${number}%` }} 
                              className="h-full bg-indigo-600" 
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                ) : (
                  <View className="h-40 items-center justify-center">
                    <Text className="text-gray-500">No votes yet</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ResultsScreen;