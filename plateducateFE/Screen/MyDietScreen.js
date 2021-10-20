// REFERENCE: https://www.positronx.io/react-native-pick-images-from-camera-gallery-example/

import React, { Component, useState, useCallback } from 'react';
import {
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet,
  TouchableOpacity, 
  Button,
  Image,
  PermissionsAndroid
} from 'react-native';
import { launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { FloatingAction } from "react-native-floating-action";


const actions = [
  {
    text: "Add from camera",
    icon: require("../static/camera.png"),
    name: "camera-btn",
    position: 1,
  },
  {
    text: "Add from gallery",
    icon: require("../static/gallery.png"),
    name: "gallery-btn",
    position: 2
  },
];

export default class MyDietScreen extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      imgResponse: null,
    } 
  }

  onImageLibraryPress = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
    };

    
    try {
      const galleryGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Access Camera Roll',
          message: 'App needs access to camera roll',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK'
        }
      );
      if (galleryGranted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera roll permission given");
        launchImageLibrary(options, (response) => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            console.log('Image Picker Error: ', response.errorMessage);
          } else {
            this.setState({imgResponse: response});
            this.props.navigation.navigate('Prediction', {
              data: this.state.imgResponse,
            });
          }
        });
      } else {
        console.log("Camera roll permission denied");
      }

    } catch (err) {
      console.warn(err);
    }

  }

  onCameraPress = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
    };
    
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (cameraGranted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchCamera(options, (response) => {    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            this.setState({imgResponse: response});
            this.props.navigation.navigate('Prediction', {
              data: this.state.imgResponse,
            });
          }
          
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }    
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.titleStyle}>
            Example of Floating Action Button
            with Multiple Option in React Native
          </Text>
          <Text style={styles.textStyle}>
            Click on Action Button to see Alert
          </Text>
          <FloatingAction
            actions={actions}
            onPressItem={name => {
              if (name == 'camera-btn') {
                this.onCameraPress();
              } else if (name == 'gallery-btn') {
                this.onImageLibraryPress();
              }
              console.log(`selected button: ${name}`);
            }}
          />
          
        </View>
      </SafeAreaView>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  titleStyle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  textStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});