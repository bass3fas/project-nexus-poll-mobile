import React from 'react';
import { View } from 'react-native';
import Lottie from 'lottie-react-native';
import loadingAnimation from '../assets/animations/loading.json';
import { styles } from '../assets/styles';

const LoadingScreen = () => {
  return (
    <View style={styles.loadingContainer}>
      <Lottie source={loadingAnimation} autoPlay loop style={styles.loadingAnimation} />
    </View>
  );
};

export default LoadingScreen;