// REFERENCE: https://www.positronx.io/react-native-pick-images-from-camera-gallery-example/

import React, { Component, useState, useCallback } from 'react';
import {
  View, 
  Text, 
  SafeAreaView, 
  StyleSheet,
  TouchableOpacity, 
  RefreshControl,
  ScrollView,
  PermissionsAndroid
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import ImagePicker from 'react-native-image-crop-picker';
import { FloatingAction } from "react-native-floating-action";
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Components/Loader';
import { Accordion, NativeBaseProvider, Box, HStack, Stack } from 'native-base';

// const NOW = 
const actions = [
  {
    text: "Add from camera",
    icon: require("../static/camera.png"),
    name: "camera-btn",
    position: 1,
    color: '#00afb7',
  },
  {
    text: "Add from gallery",
    icon: require("../static/gallery.png"),
    name: "gallery-btn",
    position: 2,
    color: '#00afb7',
  },
];

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export default class MyDietScreen extends Component  {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      imgResponse: null,
      selectedDate: moment().format("YYYY-MM-DD"),
      foodRecord: {},
      refreshing: false,
      annotations: {
        [moment().format("YYYY-MM-DD")]: {selected: true},
        
      }
    } 
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getData();
    wait(1500).then(() => this.setState({refreshing: false}));
  }

  onImageLibraryPress = async () => {
    const options = {
      cropping: true,
      width: 300,
      height: 300,
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
        ImagePicker.openPicker(options).then(response => {
          if (response) {
            // console.log(response);
            this.setState({imgResponse: response});
            this.props.navigation.navigate('Prediction', {
              imgResp: this.state.imgResponse,
            });
          } else {
            console.log("no image opened")
          }
        }).catch((error) => {
          console.log(error);
        })
      } else {
        console.log("Camera roll permission denied");
      }

    } catch (err) {
      console.warn(err);
    }

  }

  onCameraPress = async () => {
    const options = {
      cropping: true,
      width: 300,
      height: 300,
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
        ImagePicker.openCamera(options).then(response => {
          if (response) {
            console.log(response);
            this.setState({imgResponse: response});
            this.props.navigation.navigate('Prediction', {
              imgResp: this.state.imgResponse,
            });
          } else {
            console.log("no image opened")
          }
        }).catch((error) => {
          console.log(error);
        })
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
          this.setState({
            ...this.state,
            annotations: {
              ...this.state.annotations,
              [this.state.selectedDate]:{
                ...this.state.annotations[this.state.selectedDate],
                marked: false
              },
            }
          })
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

  getData = async() => {
    AsyncStorage.getItem('@user_id').then((user_id) => {
      // console.log(user_id);
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

  componentDidMount = () => {
    this.getData();
    setInterval(this.getData, 30000); // runs every 5 seconds.
  }

  render() {
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView 
          keyboardShouldPersistTaps="handled" 
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          >
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
                    Food Consumed Today
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
              buttonSize={50}
              color={'#006166'}
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