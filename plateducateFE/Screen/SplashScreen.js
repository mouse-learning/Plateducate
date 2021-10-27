import React, {useState, useEffect} from 'react';
import {ActivityIndicator, View, StyleSheet, Image} from 'react-native';
import AnimatedLoader from "react-native-animated-loader";
import LottieView from "lottie-react-native";

import AsyncStorage from '@react-native-async-storage/async-storage'

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      //Check if user_id is set or not
      //If not then send for Authentication
      //else send to Home Screen
      AsyncStorage.getItem('@user_id').then((value) =>
        navigation.replace(value === null ? 'Auth' : 'LoggedIn'),
      );
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../static/logo.png')}
        style={{width: '50%', resizeMode: 'contain', margin: 30}}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2f3b52',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
  lottie: {
    width: 100,
    height: 100
  }
});