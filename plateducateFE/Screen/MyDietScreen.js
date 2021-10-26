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
    color: '#8f3b76',
  },
  {
    text: "Add from gallery",
    icon: require("../static/gallery.png"),
    name: "gallery-btn",
    position: 2,
    color: '#8f3b76',
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
        
      },
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
      cropperToolbarWidgetColor: '#ffffff',
      cropperToolbarColor: '#2f3b52',
      cropperActiveWidgetColor: '#f5487f'
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
      cropperToolbarWidgetColor: '#ffffff',
      cropperToolbarColor: '#2f3b52',
      cropperActiveWidgetColor: '#f5487f'
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

  componentWillUnmount() {
    this.setState = (state,callback)=>{
      return;
    };
  }

  render() {
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          {/* <ScrollView 
          keyboardShouldPersistTaps="handled" 
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
          > */}
            <View style={styles.container}>
              <Calendar
                onDayPress={(day) => this.onDayPress(day['dateString'])}
                markedDates={this.state.annotations}
                style={{
                  // height: 350,
                  borderRadius: 10,
                  // borderColor: '#8f3b76',
                  // borderWidth: 1,
                }}
                theme={{
                  calendarBackground: '#2f3b52',
                  dayTextColor: 'white',
                  textDisabledColor: '#5b7086',
                  selectedDayBackgroundColor: '#f5487f',
                  monthTextColor: '#ffffff',
                  todayTextColor: '#c7417b',
                  selectedDotColor: '#ffffff',
                  dotColor: '#f5487f',
                  arrowColor: '#f5487f',
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                }}
              />
              {/* {console.log("foodRecord:")}
              {console.log(this.state.foodRecord[this.state.selectedDate])} */}
              {this.state.loading?
                (<Loader loading={this.state.loading} />)
              :
                (this.state.selectedDate in this.state.foodRecord ?
                <View style={styles.container}>
                  <Text style={styles.titleStyle}>
                    Food Consumed Today
                  </Text>
                  <ScrollView 
                    keyboardShouldPersistTaps="handled" 
                    style={styles.foodScroll}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                      />
                    }
                  >
                    <Box m={3}>
                      <Accordion borderWidth={0} borderBottomColor={'#f5487f'}>
                        {this.state.foodRecord[this.state.selectedDate].map((food, foodID) => (
                          <Accordion.Item key={foodID}> 
                            <Accordion.Summary bg={'#2f3b52'} _expanded={{ backgroundColor: '#c7417b' }}>
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
                            <Accordion.Details bg={'#ffffff'}>
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
                </View>
                :
                <ScrollView 
                keyboardShouldPersistTaps="handled" 
                style={styles.foodScroll}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                  />
                }
                >
                  <Text style={styles.titleStyle}>
                    No Meals Recorded
                  </Text>
                  <Text style={styles.textStyle}>
                    Click the + button to add one now! 
                  </Text>
                </ScrollView>)
              }
              
            </View>
          {/* </ScrollView> */}
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
              buttonSize={40}
              color={'#f5487f'}
              distanceToEdge={20}
              />
        </SafeAreaView>
      </NativeBaseProvider>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242e42',
    padding: 10,
  },
  titleStyle: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    paddingBottom: 10,
    color: '#ffffff'
  },
  textStyle: {
    fontSize: 14,
    // fontWeight: 'bold',
    textAlign: 'center',
    padding: 30,
    color: '#5b7086'
  },
  summaryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
    // textAlign: 'left',
    // padding: 10,
  },
  summaryTime: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#5b7086'
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
  calendarTheme: {
    color: '#2f3b52'
  },
  foodScroll: {
    paddingTop: 0,
    backgroundColor:'#242e42',
    borderRadius: 10,
  }
});