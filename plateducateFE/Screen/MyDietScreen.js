// REFERENCE: https://www.positronx.io/react-native-pick-images-from-camera-gallery-example/

import React, { Component, useState, useCallback } from 'react';
import {
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet,
  TouchableOpacity, 
  Button,
  Dimensions,
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
import { Accordion, NativeBaseProvider, NavigationContainer, Center, Box, HStack, Stack } from 'native-base';
import { flex } from 'styled-system';

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

  onDayPress = async (day) => {
    const prevDay = this.state.selectedDate
    this.setState({
      ...this.state,
      annotations: {
        ...this.state.annotations,
        [prevDay]:{
          ...this.state.annotations[prevDay],
          selected: false
        },
        [day]:{
          ...this.state.annotations[day],
          selected: true
        }
      }
    }, () => {
      this.setState({selectedDate: day})
    })
  }

  onDeletePress = (foodID) => {
    this.setState({loading: true}, () => {
      var dataToSend = {
        foodID: foodID,
      };
      fetch('http://10.0.2.2:4000/delete_food', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.ok == true) {
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
                    ...this.state,
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
        } else {
          this.setState({loading: false});
          alert(responseJson.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    })
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
              ...this.state,
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
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
          <View style={styles.container}>
            <Calendar
              onDayPress={(day) => this.onDayPress(day['dateString'])}
              markedDates={this.state.annotations}
            />
            {/* {console.log("foodRecord:")}
            {console.log(this.state.foodRecord[this.state.selectedDate])} */}
            {this.state.loading?
              (<Loader loading={this.state.loading} />)
            :
              (this.state.selectedDate in this.state.foodRecord ?
              <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
                <Text style={styles.titleStyle}>
                  Food Consumed This Day
                </Text>
                <Box m={3}>
                  <Accordion>
                    {this.state.foodRecord[this.state.selectedDate].map((food, foodID) => (
                      <Accordion.Item key={foodID}>
                        <Accordion.Summary _expanded={{ backgroundColor: '#1cccd4' }}>
                          <Box>
                          <Text style={styles.summaryName}>
                            {food['FoodName']}
                          </Text>
                          <Text style={styles.summaryTime}>
                            {food['TimeOfConsumption']}
                          </Text>
                          </Box>
                          <Accordion.Icon />
                        </Accordion.Summary>
                        <Accordion.Details>
                          <Stack space={2} justifyContent="space-between">
                            <HStack space={2} justifyContent="space-between">
                              <View>
                                <Text style={styles.foodDetails}>
                                ⚡ Energy: {food['Energy_100g']}kcal
                                </Text>
                                <Text style={styles.foodDetails}>
                                🍞 Carbs: {food['Carbs_100g']}g
                                </Text>
                                <Text style={styles.foodDetails}>
                                🥚 Protein: {food['Proteins_100g']}g
                                </Text>
                                <Text style={styles.foodDetails}>
                                🥓 Fat: {food['Fats_100g']}g
                                </Text>
                              </View>
                              <View>
                                <TouchableOpacity
                                  style={styles.buttonStyle}
                                  activeOpacity={0.5}
                                  onPress={() => this.onDeletePress(food['ID'])}
                                >
                                <Text style={styles.buttonTextStyle}>Delete</Text>
                                </TouchableOpacity>
                              </View>
                            </HStack>
                          </Stack>
                        </Accordion.Details>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Box>
              </ScrollView>
              :
              <ScrollView keyboardShouldPersistTaps="handled" style={styles.container}>
                <Text style={styles.titleStyle}>
                  No Meals Recorded
                </Text>
                <Text style={styles.textStyle}>
                  Click the + button to add one now! 
                </Text>
              </ScrollView>)
            }
            
          </View>
          </ScrollView>
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
        </SafeAreaView>
      </NativeBaseProvider>
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
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    padding: 10,
    color: '#1c9da3'
  },
  textStyle: {
    fontSize: 14,
    // fontWeight: 'bold',
    textAlign: 'center',
    padding: 30,
    color: '#1c9da3'
  },
  summaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    // textAlign: 'left',
    // padding: 10,
  },
  summaryTime: {
    fontSize: 12,
    fontWeight: 'normal',
    // textAlign: 'right',
    // padding: 10,
  },
  foodDetails: {
    fontSize: 15,
  },
  buttonStyle: {
    backgroundColor: '#e33c30',
    height: 40,
    width: 65,
    alignItems: 'center',
    borderRadius: 3,
    marginTop: 20,
  },
  buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});