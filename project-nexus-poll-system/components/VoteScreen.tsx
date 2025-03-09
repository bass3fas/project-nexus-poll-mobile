import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPolls, voteOnPoll } from '../store/slices/pollSlice';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import Lottie from 'lottie-react-native';

type RootStackParamList = {
  results: { pollId: string };
};

const VoteScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, status } = useSelector((state: RootState) => state.poll);
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedPoll, setSelectedPoll] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'results'>;
  const navigation = useNavigation<ResultsScreenNavigationProp>();

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleVote = async (pollId: string, optionId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to vote');
      return;
    }

    try {
      setSelectedPoll(pollId);
      await dispatch(voteOnPoll({ 
        pollId, 
        optionId, 
        userId: user.uid 
      })).unwrap();

      // Show animation and navigate after delay
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        navigation.navigate('results', { pollId });
        setSelectedPoll(null);
      }, 1500);

    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
      setSelectedPoll(null);
    }
  };

  const getSelectedOption = (pollId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll || !user) return null;
    return Object.entries(poll.options).find(([_, option]) => 
      option.voters.includes(user.uid)
    )?.[0];
  };

  if (status === 'loading') {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Active Polls</Text>
        
        {polls.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-500 text-lg">No active polls available</Text>
          </View>
        ) : (
          polls.map((poll) => {
            const selectedOption = getSelectedOption(poll.id);
            const isVoting = selectedPoll === poll.id;

            return (
              <View key={poll.id} className="bg-white p-4 rounded-xl shadow-md mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-2">
                  {poll.question}
                </Text>

                <View className="space-y-3">
                  {Object.entries(poll.options).map(([optionId, option]) => (
                    <TouchableOpacity
                      key={optionId}
                      onPress={() => handleVote(poll.id, optionId)}
                      disabled={status !== 'succeeded' || !!selectedOption || isVoting}
                      className={`p-3 rounded-lg border-2 ${
                        selectedOption === optionId 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-200 bg-white'
                      } ${isVoting ? 'opacity-50' : ''}`}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-800 font-medium">{option.text}</Text>
                        
                        <View className="w-6 h-6 rounded-full border-2 border-indigo-600 
                          items-center justify-center">
                          {selectedOption === optionId && (
                            <View className="w-3 h-3 rounded-full bg-indigo-600" />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('results', { pollId: poll.id })}
                  className="flex-row items-center justify-end mt-3"
                >
                  <Text className="text-indigo-600 mr-2">View Results</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#4F46E5" />
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {showAnimation && (
        <View className="absolute inset-0 bg-white/90 items-center justify-center">
          <Lottie
            source={require('../assets/animations/poll-box.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
        </View>
      )}
    </View>
  );
};

export default VoteScreen;