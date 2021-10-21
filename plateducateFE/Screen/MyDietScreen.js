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
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { FloatingAction } from "react-native-floating-action";
import moment from "moment";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Components/Loader';

// const NOW = 
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
      loading: true,
      imgResponse: null,
      selectedDate: moment().format("YYYY-MM-DD"),
      foodRecord: {},
      annotations: {
        [moment().format("YYYY-MM-DD")]: {selected: true},
        
      }
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

  componentDidMount = () => {
    AsyncStorage.getItem('@user_id').then((user_id) => {
      fetch('http://10.0.2.2:4000/fetch_food/'+user_id, {
          method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson.result)
          this.setState({foodRecord: responseJson.result})
          for (const [key, value] of Object.entries(this.state.foodRecord)) {
            this.setState({
              // ...this.state,
              annotations: {
                ...this.state.annotations,
                [key]:{
                  ...this.state.annotations[key],
                  marked: true
                }
              }
            })
            // console.log(this.state.annotations)
          }
          this.setState({loading: false})
        })
        .catch((error) => {
          console.error(error);
          this.setState({loading: false})
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({loading: false})
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Calendar
            onDayPress={(day) => {
              this.setState({selectedDate: day["dateString"]})
              // this.setState({marked: })
            }}
            markedDates={this.state.annotations}
          />
          {console.log("foodRecord:")}
          {console.log(this.state.foodRecord[this.state.selectedDate])}
          {this.state.loading?
            (<Loader loading={this.state.loading} />)
          :
            (this.state.selectedDate in this.state.foodRecord ?
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
              <Text style={styles.titleStyle}>
                Record Exists
              </Text>
              {/* <Text style={styles.textStyle}>
                {this.state.foodRecord[this.state.selectedDate]}
              </Text> */}
            </ScrollView>
            :
            <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
              <Text style={styles.titleStyle}>
                Record Does Not Exist
              </Text>
            </ScrollView>)
          }
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