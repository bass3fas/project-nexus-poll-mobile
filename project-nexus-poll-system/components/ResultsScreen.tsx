import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { VictoryPie } from 'victory';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchPolls, voteOnPoll } from '../store/slices/pollSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ResultsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { polls, status, error } = useSelector((state: RootState) => state.poll);
  const navigation = useNavigation();
  const [selectedPoll, setSelectedPoll] = React.useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await dispatch(voteOnPoll({ pollId, optionId })).unwrap();
      Alert.alert('Success', 'Your vote has been recorded!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit vote. Please try again.');
    }
  };

  const calculatePercentage = (votes: number, total: number) => {
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Active Polls</Text>

      {polls.map((poll) => (
        <View key={poll.id} style={styles.pollContainer}>
          <TouchableOpacity
            onPress={() => setSelectedPoll(selectedPoll === poll.id ? null : poll.id)}
            style={styles.pollHeader}
          >
            <Text style={styles.pollQuestion}>{poll.question}</Text>
            <Text style={styles.totalVotes}>{poll.totalVotes} total votes</Text>
          </TouchableOpacity>

          {selectedPoll === poll.id && (
            <>
              <View style={styles.chartContainer}>
                <VictoryPie
                  data={Object.values(poll.options).map(option => ({
                    x: option.text,
                    y: option.votes,
                    label: `${option.text}\n${calculatePercentage(option.votes, poll.totalVotes)}%`
                  }))}
                  colorScale={["#f87171", "#60a5fa", "#fbbf24", "#34d399", "#f59e0b"]}
                  width={350}
                  height={350}
                  padAngle={2}
                  innerRadius={80}
                  labelRadius={({ datum }) => 120}
                  style={{
                    labels: {
                      fill: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                      textAnchor: 'middle'
                    }
                  }}
                />
              </View>

              <View style={styles.optionsContainer}>
                {Object.entries(poll.options).map(([optionId, option]) => (
                  <TouchableOpacity
                    key={optionId}
                    onPress={() => handleVote(poll.id, optionId)}
                    disabled={status === 'loading'}
                    style={styles.optionButton}
                  >
                    <View style={styles.optionContent}>
                      <Text style={styles.optionText}>{option.text}</Text>
                      <Text style={styles.voteCount}>{calculatePercentage(option.votes, poll.totalVotes)}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          { width: `${calculatePercentage(option.votes, poll.totalVotes)}%` }
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('Results', { pollId: poll.id })}
                style={styles.detailsButton}
              >
                <Text style={styles.detailsText}>Detailed Analysis</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#9333ea" />
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24
  },
  pollContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  pollHeader: {
    marginBottom: 16
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b'
  },
  totalVotes: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
    transform: [{ scale: 0.9 }]
  },
  optionsContainer: {
    gap: 12
  },
  optionButton: {
    backgroundColor: '#f5f3ff',
    borderRadius: 8,
    padding: 16
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  optionText: {
    fontSize: 16,
    color: '#4f46e5',
    fontWeight: '500'
  },
  voteCount: {
    fontSize: 14,
    color: '#6366f1'
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e7ff',
    borderRadius: 2,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4f46e5'
  },
  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 16
  },
  detailsText: {
    color: '#4f46e5',
    marginRight: 8,
    fontWeight: '500'
  }
});

export default ResultsScreen;