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
    ScrollView,
	Alert,
} from 'react-native';

import { Accordion, NativeBaseProvider, NavigationContainer, Center, Box, HStack, Stack } from 'native-base';
import { fontWeight } from 'styled-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStyleAndFilteredProps } from 'native-base/lib/typescript/theme/styled-system';

import Loader from './Components/Loader';
import NutrientLimitCheck from './NutrientLimitCheck';

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

	function addFood(foodClass, dataToSend) {
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
				setAddDB({...addDB, [foodClass]: true});
				console.log("Successfully added to DB");
			}
			else {
				alert(response.message);
			}
		})
		.catch((error) => {
			console.error(error);
		});
	}

	function getNutritionAlert(nutrientLimitCheck) {
		var nutAlert = '';
		for (var key of Object.keys(nutrientLimitCheck.overBy)) {
			var unit;
			if (key == 'energy') {
				unit = 'kcal'
			} else {
				unit = 'grams'
			}
			const amountOverBy = nutrientLimitCheck.overBy[key];
			const temp = key.charAt(0).toUpperCase() + key.slice(1) + ' limit over by ' + amountOverBy + " " + unit + "!";
			nutAlert = nutAlert.concat(temp, '\n')
		}
		nutAlert = nutAlert.concat('\nAre you sure you want to add food to log?')
		return nutAlert;
	}
    
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

            fetch('http://10.0.2.2:4000/fetch_food_today/'+user_id, {
                method: 'GET',
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.result)
                // DO EVERYTHING HERE
                // NUTRIENT LIMIT CHECK AND THE CONFIRMATION DIALOG, ETC.
                if (responseJson.result.isEmpty == 'True') {
                    addFood(foodClass, dataToSend);
                } else {
                    const nutrientLimitCheck = NutrientLimitCheck(dataToSend, responseJson.result);
                    console.log(nutrientLimitCheck);
    
                    if (nutrientLimitCheck.limitReached == true) {
                        console.log('limit reached');
        
                        return Alert.alert(
                            "Warning: Daily Nutrient Limit Reached ",
                            getNutritionAlert(nutrientLimitCheck),
                            [
                                {
                                    text: "Yes",
                                    onPress: () => {
                                        addFood(foodClass, dataToSend);
                                    },
                                },
                                {
                                    text: "No",
                                },
                            ]
        
                        );
                    } else {
                        console.log('limit not reached');
                        addFood(foodClass, dataToSend);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                this.setState({loading: false})
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

	function roundTwoDP(num) {
		var m = Number((Math.abs(num) * 100).toPrecision(15));
		return (Math.round(m) / 100 * Math.sign(num));
	}
	

    function getAndSetFourNutrients(nutrients) {
        var tempDict = {}
        for (var class_name of Object.keys(nutrients)) {
            if ("carbohydrates_serving" in nutrients[class_name]) {
                var carbohydrates = roundTwoDP(parseFloat(nutrients[class_name]["carbohydrates_serving"]));
            } else {
                var carbohydrates = roundTwoDP(parseFloat(nutrients[class_name]["carbohydrates_100g"]));
            }
            if ("proteins_serving" in nutrients[class_name]) {
                var proteins = roundTwoDP(parseFloat(nutrients[class_name]["proteins_serving"]));
            } else {
                var proteins = roundTwoDP(parseFloat(nutrients[class_name]["proteins_100g"]));
            }
            if ("fat_serving" in nutrients[class_name]) {
                var fats = roundTwoDP(parseFloat(nutrients[class_name]["fat_serving"]));
            } else {
                var fats = roundTwoDP(parseFloat(nutrients[class_name]["fat_100g"]));
            }
            if (nutrients[class_name]["energy_unit"] == "kj") {
                var cals = roundTwoDP((parseFloat(nutrients[class_name]["energy"]))*0.24);
            } else {
                var cals = roundTwoDP(parseFloat(nutrients[class_name]["energy"]));
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
            console.log("finished")
        })
        .catch((error) => {
            console.error(error);
        })
        return() => {
            setBase64Img(null);
            setFoodList([]);
            setAddDB(null);
            setFourNutrientsDict({});
            setNutrientsDict({});
        }
        
    },[])

    useEffect( () => {
        if ((base64Img != null) && (foodList.length)) {
            setLoading(false);
        }
        return () => {
            setLoading(true);
        }
    }, [base64Img, foodList])


    useEffect( () => {
        console.log(nutrientsDict);
        if ((Object.keys(nutrientsDict).length) && (Object.keys(fourNutrientsDict).length == Object.keys(nutrientsDict).length)) {
            setNutrientsLoading(false);
        }
        return () => {
            setNutrientsLoading(true);
        }
    }, [nutrientsDict, fourNutrientsDict])

    return (
        <NativeBaseProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                {isLoading ? (<Loader loading={isLoading} />) :
                    <View style={styles.container}>
                        <View style={styles.imgContainer}>
                            <Image style={{...styles.predictionImg, aspectRatio: imageAspectRatio }} source={{uri: base64Img}} />

                        </View>
                        <View style={styles.overlay}>
                            <Text style={styles.predictionTitle}>Choose Food</Text>
                            <ScrollView>
                                <Box m={foodList.length} >
                                    <Accordion allowMultiple={true}>
                                        {foodList.map((prediction, index) => 
                                            <Accordion.Item key={index}>
                                                <Accordion.Summary  bg={'#2f3b52'} _expanded={accordion.summaryExpanded} _text={accordion.summaryText}>
                                                {prediction.class_name}
                                                <Accordion.Icon />
                                                </Accordion.Summary>
                                                {isNutrientsLoading ? 
                                                <Accordion.Details bg={'#ffffff'}>
                                                    <Text>
                                                        Loading Nutrients...

                                                    </Text>
                                                </Accordion.Details> : 
                                                <Accordion.Details  bg={'#ffffff'}>
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
                                                                {!addDB[prediction.class_name] ? 
                                                                <TouchableOpacity
                                                                    style={styles.addButtonStyleBefore}
                                                                    activeOpacity={0.5}
                                                                    onPress={() => onAddPress(prediction.class_name)}
                                                                >
                                                                    <Text style={styles.addButtonTextStyle}>Add Food</Text> 
                                                                    
                                                                </TouchableOpacity>
                                                                :
                                                                <TouchableOpacity
                                                                    style={styles.addButtonStyleAfter}
                                                                    activeOpacity={0.5}
                                                                    
                                                                >
                                                                    <Text style={styles.addButtonTextStyle}>Added</Text> 
                                                                    
                                                                </TouchableOpacity>
                                                                    }
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
    //   height: screenHeight/2.5,
        // flex:1,
        width: screenWidth*0.72,
        alignSelf: 'center',
        borderRadius: 20,
    },
    container: {
        flex: 1,
        backgroundColor: '#242e42',
    },
    overlay: {
        flex: 1,
        flexDirection: "column",
        position: 'absolute',
        padding:5,
        justifyContent: 'flex-start',
        top: screenWidth*0.85,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#242e42',
        opacity: 1,
    },
    imgContainer: {
        top: 13,
        // padding: 10,
        flex: 1,
        flexDirection: "column",
        width: screenWidth*0.8,
        height: screenWidth*0.8,
        position: 'absolute',
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#c7417b',
        borderRadius: 20,
    },
    predictionTitle: {
        alignSelf: 'flex-start',
        paddingLeft: 14,
        paddingBottom: 10,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    addButtonStyleBefore: {
        backgroundColor: '#007176',
        height: 40,
        width: 85,
        alignItems: 'center',
        borderRadius: 3,
        marginTop: 20,
    },
    addButtonStyleAfter: {
        backgroundColor: 'red',
        height: 40,
        width: 85,
        alignItems: 'center',
        borderRadius: 3,
        marginTop: 20,
    },
    addButtonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
        textAlign: 'center'
    },

});

const accordion = {
    summaryExpanded : {
        backgroundColor: '#c7417b', 
        _text: {
            bold: true, 
            color: 'white',
            fontSize: 'md',
        },
    }, 
    summaryText : {
        fontSize: 'md',
        color: '#ffffff',
        bold: true,
    }
}

export default PredictionScreen;