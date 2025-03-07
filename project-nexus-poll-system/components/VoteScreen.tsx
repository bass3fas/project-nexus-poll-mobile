import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPolls, voteOnPoll } from '../store/slices/pollSlice';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

  
type RootStackParamList = {
  results: { pollId: string };
};

const VoteScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, status } = useSelector((state: RootState) => state.poll);
  
  type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'results'>;
  
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  
  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await dispatch(voteOnPoll({ pollId, optionId })).unwrap();
      Alert.alert('Success', 'Your vote has been recorded!');
      dispatch(fetchPolls());
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    }
  };

  if (status === 'loading') {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Active Polls</Text>
      {polls.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-20">
          <Text className="text-gray-500 text-lg">No active polls available</Text>
        </View>
      ) : (
        polls.map((poll) => (
          <View key={poll.id} className="bg-white p-4 rounded-xl shadow-md mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-2">{poll.question}</Text>
            <Text className="text-gray-500 text-sm mb-4">{poll.totalVotes} total votes</Text>
            <View className="space-y-3">
              {Object.entries(poll.options).map(([optionId, option]) => (
                <TouchableOpacity
                  key={optionId}
                  onPress={() => handleVote(poll.id, optionId)}
                  disabled={status !== 'succeeded'}
                  className="bg-indigo-100 p-3 rounded-lg shadow"
                >
                  <View className="flex-row justify-between">
                    <Text className="text-indigo-700 font-medium">{option.text}</Text>
                    <Text className="text-indigo-700">{option.votes} votes</Text>
                  </View>
                  <View className="w-full bg-indigo-300 h-2 rounded-full mt-2 overflow-hidden">
                    <View style={{ width: `${(option.votes / poll.totalVotes) * 100}%` }} className="h-full bg-indigo-600" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('results', { pollId: poll.id })}
              className="flex-row items-center justify-end mt-3"
            >
              <Text className="text-indigo-600 mr-2">View Details</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default VoteScreen;
