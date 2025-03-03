import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function VoteScreen() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const pollsQuery = query(collection(db, 'polls'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(pollsQuery, (snapshot) => {
      const pollsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPolls(pollsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (pollId, optionId) => {
    try {
      setVotingInProgress(true);
      const pollRef = doc(db, 'polls', pollId);

      await updateDoc(pollRef, {
        [`options.${optionId}.votes`]: increment(1),
        totalVotes: increment(1)
      });

      Alert.alert('Success', 'Your vote has been counted!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    } finally {
      setVotingInProgress(false);
    }
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/ball.jpeg')}
      className="flex-1 w-full h-full"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 bg-gray-50 p-4 bg-opacity-80">
        <Text className="text-2xl font-bold mb-6 text-gray-800">Active Polls</Text>

        {polls.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">No active polls available</Text>
          </View>
        ) : (
          polls.map(poll => (
            <View key={poll.id} className="mb-6 bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-lg font-semibold mb-4 text-gray-800">{poll.question}</Text>

              <View className="mb-4">
                <Text className="text-sm text-gray-500 mb-2">
                  {poll.totalVotes} total votes
                </Text>

                {Object.entries(poll.options).map(([optionId, option]) => (
                  <TouchableOpacity
                    key={optionId}
                    onPress={() => handleVote(poll.id, optionId)}
                    disabled={votingInProgress}
                    className="mb-3"
                  >
                    <View className="bg-purple-50 rounded-lg p-3">
                      <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-medium text-purple-800">
                          {option.text}
                        </Text>
                        <Text className="text-sm text-purple-600">
                          {calculatePercentage(option.votes, poll.totalVotes)}%
                        </Text>
                      </View>

                      <View className="h-2 bg-purple-100 rounded-full overflow-hidden">
                        <View
                          className="h-full bg-purple-500"
                          style={{
                            width: `${calculatePercentage(option.votes, poll.totalVotes)}%`
                          }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Results', { pollId: poll.id })}
                className="flex-row items-center justify-end"
              >
                <Text className="text-purple-600 mr-2">View Details</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#9333ea" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
