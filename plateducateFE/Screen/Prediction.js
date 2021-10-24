import React, { Component, useState, useCallback, useEffect } from 'react';

import {
    View, 
    Text, 
    SafeAreaView, 
    StyleSheet,
    TouchableOpacity, 
    Button,
    Image,
    PermissionsAndroid,
    Dimensions,
    ScrollView
} from 'react-native';

import { Accordion, NativeBaseProvider, NavigationContainer, Center, Box, HStack, Stack } from 'native-base';
import { fontWeight } from 'styled-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStyleAndFilteredProps } from 'native-base/lib/typescript/theme/styled-system';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const dimensions = Dimensions.get('screen');

const overlayStartPos = dimensions.height/2.5;
const overlayHeight = dimensions.height - overlayStartPos;
const buttonInOverlayHeight = overlayHeight/2.5;

const PredictionScreen = ({ route, navigation }) => {
    const [base64Img, setBase64Img] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [foodList, setFoodList] = useState([]);
    const [addDB, setAddDB]= useState(null);
    const [isNutrientsLoading, setNutrientsLoading] = useState(true);
    const [fourNutrientsDict, setFourNutrientsDict] = useState({});
    const [nutrientsDict, setNutrientsDict] = useState({});

    let imgData = {
        data : route.params.imgResp,
    }

    const imageAspectRatio = imgData.data.width/imgData.data.height;true
    let base64ImagePrediction;
    
    function onAddPress(foodClass){
        // Async storage
        AsyncStorage.getItem('@user_id').then((user_id) => {
            var dataToSend = {
                userID: user_id,
                food_name: foodClass,
                energy: fourNutrientsDict[foodClass]['energy'],
                protein: fourNutrientsDict[foodClass]['protein'],
                carbs: fourNutrientsDict[foodClass]['carbs'],
                fat: fourNutrientsDict[foodClass]['fat'],
            };

            fetch('http://10.0.2.2:4000/add_food', {
                method: 'POST',
                body: JSON.stringify(dataToSend),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            .then((response) => response.json())
            .then((responseJSON) => {
                if (responseJSON.ok == true) {
                    setAddDB({...addDB, [foodName]: false});
                    console.log("Successfully added to DB");
                }
                else {
                    alert(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
        })
    }

    
    async function getPredictions(base64Str) {
        try {
            const response = await fetch('http://10.0.2.2:4000/submit_photo', {
                method: 'POST',
                body: JSON.stringify(base64Str),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Access-Control-Expose-Headers': true,
                },
            });
            const response_1 = response;
            const responseJSON = await response_1.json();
            if (responseJSON.ok = true) {
                base64ImagePrediction = responseJSON.resultYOLO.base64_str
                base64ImagePrediction = 'data:' + imgData.data.mime + ';base64,'+ base64ImagePrediction;
                setBase64Img(base64ImagePrediction);

                var tempFoodList = (responseJSON.resultYOLO.class_with_scores);
                // Reorder predictions based on highest to lowest pred score
                tempFoodList.sort(function(a, b) {
                    return ((a.score > b.score) ? -1 : ((a.score == b.score) ? 0 : 1));
                });
                // If there are more than one predictions for the same class, only take the highest one with highest confidence
                var newTempFoodList = tempFoodList.filter((a, index) =>
                    index === tempFoodList.findIndex((t) => (
                        t.class_name === a.class_name
                    ))
                );
                setFoodList(newTempFoodList);  
                
                var addDBDict = {}
                var classNames = []          
                for (var k=0; k < newTempFoodList.length; k++) {
                    classNames.push(newTempFoodList[k]["class_name"])
                    addDBDict[newTempFoodList[k]["class_name"]] = false
                }
                setAddDB(addDBDict);
                console.log(classNames);
                return classNames
            } else {
                console.log("getPrediction response not OK")
            }
        } catch (error) {
            console.log("error here in class w score catch")
            console.error(error);
        }
    }

    function getNutrients(foodNames) {
        fetch('http://10.0.2.2:4000/nut_fetching', {
            method: 'POST',
            body: JSON.stringify(foodNames),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Expose-Headers': true,
            },
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            if (responseJSON.ok ==true) {
                const nutrients = responseJSON.food_nutritions;
                getAndSetFourNutrients(nutrients);
                setNutrientsDict(nutrients);
            }
            else {
                alert(response.message);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    function getAndSetFourNutrients(nutrients) {
        var tempDict = {}
        for (var class_name of Object.keys(nutrients)) {
            if ("carbohydrates_serving" in nutrients[class_name]) {
                var carbohydrates = nutrients[class_name]["carbohydrates_serving"];
            } else {
                var carbohydrates = nutrients[class_name]["carbohydrates_100g"];
            }
            if ("proteins_serving" in nutrients[class_name]) {
                var proteins = nutrients[class_name]["proteins_serving"];
            } else {
                var proteins = nutrients[class_name]["proteins_100g"];
            }
            if ("fat_serving" in nutrients[class_name]) {
                var fats = nutrients[class_name]["fat_serving"];
            } else {
                var fats = nutrients[class_name]["fat_100g"];
            }
            if (nutrients[class_name]["energy_unit"] == "kj") {
                var cals = ((parseInt(nutrients[class_name]["energy"]))*0.24).toString();
            } else {
                var cals = nutrients[class_name]["energy"];
            }
            

            tempDict[class_name] = {
                "carbs" : carbohydrates,
                "protein": proteins,
                "fat": fats,
                "energy": cals
            }

        }
        setFourNutrientsDict(tempDict);

        
    }

    useEffect( () => {
        const base64Str = imgData.data.data;
        getPredictions(base64Str).then(
            class_with_scores => getNutrients(class_with_scores)
        )
        .then(() => {
            console.log("finally")
            console.log(foodList);
            console.log(nutrientsDict);
            
            console.log("finished")
        })
        .catch((error) => {
            console.error(error);
        })
        
    },[])

    useEffect( () => {
        if ((base64Img != null) && (foodList.length)) {
            setLoading(false);
        }
    }, [base64Img, foodList])


    useEffect( () => {
        console.log(fourNutrientsDict);
        console.log(Object.keys(nutrientsDict).length)
        console.log(Object.keys(fourNutrientsDict).length == Object.keys(nutrientsDict).length)
        console.log(Object.keys(fourNutrientsDict))
        if ((Object.keys(nutrientsDict).length) && (Object.keys(fourNutrientsDict).length == Object.keys(nutrientsDict).length)) {
            setNutrientsLoading(false);
        }
    }, [nutrientsDict, fourNutrientsDict])

    return (
        <NativeBaseProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                {isLoading ? <Text>Loading for Predictions...</Text> :
                    <View style={styles.container}>
                        <Image style={{...styles.predictionImg, aspectRatio: imageAspectRatio }} source={{uri: base64Img}} />
                        <View style={styles.overlay}>
                            <Text style={styles.predictionTitle}>Choose Food</Text>
                            <ScrollView style={styles.predictionScroll}>
                                <Box m={foodList.length} bg={'white'} >
                                    <Accordion allowMultiple={true}>
                                        {foodList.map((prediction, index) => 
                                            <Accordion.Item key={index}>
                                                <Accordion.Summary  bg={'#00afb7'} _expanded={accordion.summaryExpanded} _text={accordion.summaryText}>
                                                {prediction.class_name}
                                                <Accordion.Icon />
                                                </Accordion.Summary>
                                                {isNutrientsLoading ? 
                                                <Accordion.Details>Loading Nutrients...</Accordion.Details> : 
                                                <Accordion.Details>
                                                    <Stack space={2} justifyContent="space-between">
                                                        <HStack space={2} justifyContent="space-between">
                                                            <View>
                                                                <Text style={{fontWeight:"bold"}}>Nutrition Content: </Text>
                                                                <Text>
                                                                ⚡ Energy: { 
                                                                    JSON.stringify(fourNutrientsDict[prediction.class_name]["energy"])
                                                                    
                                                                } kcal
                                                                </Text>
                                                                <Text>
                                                                🍞 Carbohydrates: { 
                                                                    JSON.stringify(fourNutrientsDict[prediction.class_name]["carbs"])
                                                                }g
                                                                </Text>
                                                                <Text>
                                                                🥚 Protein: { 
                                                                    JSON.stringify(fourNutrientsDict[prediction.class_name]["protein"])
                                                                }g
                                                                </Text>
                                                                <Text>
                                                                🥓 Fat: { 
                                                                    JSON.stringify(fourNutrientsDict[prediction.class_name]["fat"])
                                                                }g
                                                                </Text>
                                                            </View>
                                                            <View>
                                                                <TouchableOpacity
                                                                    style={styles.buttonStyle}
                                                                    activeOpacity={0.5}
                                                                    onPress={() => onAddPress(prediction.class_name)}
                                                                >
                                                                    <Text style={styles.buttonTextStyle}>Add Food</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </HStack>
                                                    </Stack>
                                                </Accordion.Details>
                                                
                                                } 
                                            </Accordion.Item>


                                        )}
                                    
                                    </Accordion>
                                </Box>
                            </ScrollView>
                        </View>
        
                    </View>
                
                    }
                </View>

            </SafeAreaView>
        </NativeBaseProvider>
    );
}


const styles = StyleSheet.create({
    predictionImg: {
        top: 0.1,
    //   height: screenHeight/2.5,
        width: screenWidth,
        alignSelf: 'center',
    },
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        flexDirection: "column",
        position: 'absolute',
        padding:10,
        justifyContent: 'flex-start',
        top: screenWidth,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        opacity: 1,
    },
    predictionTitle: {
        alignSelf: 'flex-start',
        paddingLeft: 12,
        paddingBottom: 10,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#003a3d'
    },
    buttonStyle: {
        backgroundColor: '#007176',
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
        textAlign: 'center'
    },

});

const accordion = {
    summaryExpanded : {
        backgroundColor: '#007176', 
        _text: {
            bold: true, 
            color: 'white',
            fontSize: 'md',
        },
    }, 
    summaryText : {
        fontSize: 'md',
        color: '#003a3d',
        bold: true,
    }
}

export default PredictionScreen;