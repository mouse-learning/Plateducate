// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useState, useEffect, useRef } from 'react';
import {
  View, 
  TouchableOpacity,
  Text, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground} 
from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { VictoryPie, VictoryLabel } from 'victory-native';
import moment from "moment";
import { marginBottom } from 'styled-system';
import Loader from './Components/Loader';

const dimensions = Dimensions.get('screen');

const overlayStartPos = dimensions.height/2.4;
const overlayHeight = dimensions.height - overlayStartPos;
const buttonInOverlayHeight = overlayHeight/2.5;

const Separator = () => (
  <View style={styles.separator} />
);

const defaultGraphicData = [{ x: "Carbs", y: 90 }, { x: "Fat", y: 5 }, { x: "Protein", y: 5 }];
const defaultFoodData = {'energy': {x: "Energy", y: 0}, 'carbs': {x: "Carbs", y: 0}, 'fat': {x: "Fat", y: 0},'protein': {x: "Protein", y: 0}}
const graphicColor = ['gold', '#f5487f', '#d1e6ff'];

const HomeScreen = ({ navigation: { navigate } }) => {
  const [loading, setLoading] = useState(true)
  const [graphicData, setGraphicData] = useState(defaultGraphicData);
  const [foodData, setFoodData] = useState(defaultFoodData)
  const isMounted = useRef(false)

  useEffect(() => {
    AsyncStorage.getItem('@user_id').then((user_id) => {
      fetch('http://10.0.2.2:4000/fetch_food/'+user_id, {
          method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
          const recordToday = responseJson.result[moment().format("YYYY-MM-DD")]
          var results = {
            'energy': {x: "Energy", y: 0},
            'carbs': {x: "Carbs", y: 30},
            'fat': {x: "Fat", y: 30},
            'protein': {x: "Protein", y: 30}
          }
          var graphData = []
          if (recordToday) {
            // console.log("record found")
            // console.log(recordToday)
            for (const food of recordToday) {
              results["energy"]["y"] = results["energy"]["y"] + parseInt(food["Energy_100g"]) || parseInt(food["Energy_100g"])
              results["carbs"]["y"] = results["carbs"]["y"] + parseInt(food["Carbs_100g"]) || parseInt(food["Carbs_100g"])
              results["fat"]["y"] = results["fat"]["y"] + parseInt(food["Fats_100g"]) || parseInt(food["Fats_100g"])
              results["protein"]["y"] = results["protein"]["y"] + parseInt(food["Proteins_100g"]) || parseInt(food["Proteins_100g"])
            }
            graphData.push(results["carbs"],results["fat"],results["protein"],) 
            setGraphicData(graphData)
            
            // console.log("results")
            // console.log(results)
            setFoodData(results)
          } else {
            console.log("no record found")
            graphData.push(results["carbs"],results["fat"],results["protein"],) 
            setGraphicData(graphData)
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading({loading: false})
        });
      })
      .catch((error) => {
        console.error(error);
        setLoading({loading: false})
    });
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      console.log("useEffect")
      console.log(foodData)
      setLoading(false)
    }
    else { 
      isMounted.current = true;
    }
  }, [foodData, graphicData])

    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.pieContainer}>
          <VictoryPie
            animate={{ easing: 'exp' }}
            data={graphicData}
            width={325}
            height={325}
            colorScale={graphicColor}
            innerRadius={50}
            padding={{ left: 70, right: 70 }}
            padAngle={3}
            radius={({ datum }) => 95 + datum.y * 0.05}
            labelComponent={<VictoryLabel inline style={{ fill: "white", fontSize: "15", fontWeight: "bold" }} />}
            />          
        {loading ?
        (<Loader loading={loading} />)
          :
          <View style={styles.summaryContainer} >
            <View style={styles.summaryHeader}>
              <Text style={styles.header}>
                Nutrition Breakdown
              </Text>
            </View>
            {/* {console.log(foodData)} */}
            {/* <View style={styles.nutritionDetail}> */}
            {foodData['energy']['y'] ?
            <View>
              <Text style={styles.nutritionTexts}>
                <Text style={styles.btnTextHeader}>Energy: </Text>
                <Text style={styles.btnTextBody}>{foodData['energy']['y']} kcal</Text>   
              </Text>
              <Separator />
              <Text style={styles.nutritionTexts}>
                <Text style={styles.btnTextHeader}>Carbohydrates: </Text>
                <Text style={styles.btnTextBody}>{foodData['carbs']['y']} g</Text>   
              </Text>
              <Separator />
              <Text style={styles.nutritionTexts}>
                <Text style={styles.btnTextHeader}>Fat: </Text>
                <Text style={styles.btnTextBody}>{foodData['fat']['y']} g</Text>   
              </Text>
              <Separator />
              <Text style={styles.nutritionTexts}>
                <Text style={styles.btnTextHeader}>Protein: </Text>
                <Text style={styles.btnTextBody}>{foodData['protein']['y']} g</Text>   
              </Text>
              <Separator />
            </View>
            :
            <View style={styles.noRecordContainer}>
              <Text style={styles.noRecordHeader}>
                No meals recorded today.
              </Text>
              <Text style={styles.noRecordText}>Log your food on the Diet page!</Text>   
            </View>
              }
          </View> 
        }
        </View>
      </SafeAreaView>
    );
  };
  

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'lightgray',
    backgroundColor: '#252e42',
  },
  header: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
    padding: 15
  },
  pieContainer: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'white',
    backgroundColor: '#2e3a51',
    borderRadius: 25,
    justifyContent: 'center',
    margin: 18
  },
  summaryContainer: {
    flex: 1,
    flexDirection: "column",
    // padding: 25,
    position: 'absolute',
    top: overlayStartPos,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0.9,
    borderRadius: 25
  },
  summaryHeader: {
    // flex: 1,
    // flexDirection: 'row',
    // backgroundColor: 'white',
    backgroundColor: '#c7417b',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // justifyContent: 'center',
    // margin: 18
  },
  
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnTextHeader: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  btnTextBody : {
    fontSize: 18,
    fontWeight: 'bold',
    // color: 'white',
  },
  nutritionDetail: {
    flex: 1,
    textAlign: 'center',
    justifyContent: 'space-evenly'
  },
  nutritionTexts: {
    margin: 5,
    padding: 5
  },
  box: {
    height: 20,
    width: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  noRecordContainer: {
    margin: 15,
    padding: 15
  },
  noRecordHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 15
  },
  noRecordText: {
    fontSize: 16,
    // fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default HomeScreen;