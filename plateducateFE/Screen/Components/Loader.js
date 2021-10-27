

// Import React and Component
import React from 'react';
import {StyleSheet, View, Modal, ActivityIndicator} from 'react-native';
import AnimatedLoader from "react-native-animated-loader";


const Loader = (props) => {
  const {loading, ...attributes} = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal');
      }}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          {/* <AnimatedLoader
            visible={loading}
            overlayColor="rgba(36, 46, 66)"
            source={require("../../static/loader-pink.json")}
            animationStyle={styles.lottie}
            speed={1}
          /> */}
          <ActivityIndicator
            animating={true}
            color="#f5487f"
            size="large"
            style={styles.activityIndicator}
          />
        </View>
      </View>
    </Modal>
    // <View style={styles.container}>
    //   <AnimatedLoader
    //     visible={loading}
    //     overlayColor="rgba(36, 46, 66)"
    //     source={require("../../static/loader-pink.json")}
    //     animationStyle={styles.lottie}
    //     speed={1}
    //   />
    //   <ActivityIndicator
    //     animating={animating}
    //     color="#FFFFFF"
    //     size="large"
    //     style={styles.activityIndicator}
    //   />
    // </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'rgba(47, 59, 82, 0.5)',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
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