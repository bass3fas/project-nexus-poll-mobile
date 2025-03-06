import React from 'react';
import { View, StyleSheet } from 'react-native';
import Lottie from 'lottie-react-native';
import loadingAnimation from '../assets/animations/loading.json';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Lottie source={loadingAnimation} autoPlay loop style={styles.animation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  animation: {
    width: 200,
    height: 200,
  },
});

export default LoadingScreen;