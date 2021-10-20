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
  import { launchCamera, launchImageLibrary} from 'react-native-image-picker';
  import { FloatingAction } from "react-native-floating-action";
  import Icon from 'react-native-vector-icons/Ionicons';

  const screenWidth = Dimensions.get('screen').width;
  const screenHeight = Dimensions.get('screen').height;

  const PredictionScreen = ({ route, navigation }) => {
    let imgData = {
        data : route.params.data.assets[0],
    }

    const imageType = imgData.data.type.split("/")[1];
    const base64Image = 'data:image/' + imageType + ';base64,'+ imgData.data.base64;
    const imageAspectRatio = imgData.data.width/imgData.data.height;
    let base64ImagePrediction;
    let images_bb_dict;

    useEffect( () => {
        fetch('http://10.0.2.2:4000/submit_photo', {
            method: 'POST',
            body: JSON.stringify(imgData.data.base64),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Expose-Headers': true,
            },
        })
        .then((response) => {
            if (response.ok == true) {
                console.log(response.headers.map.images_bb[0]);
                images_bb_new = JSON.parse(response.headers.map.images_bb)
                console.log(images_bb_new);
                // images_bb_dict = response.headers.map.images_bb;
                // console.log(images_bb_dict);
                base64ImagePrediction = response.resultYOLO;
                resp_json = response.json()
                // Take predictions and scores
            } else {
                // Error message
                alert(responseJSON.message);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, [])

    base64ImagePrediction = 'data:image/' + imageType + ';base64,'+ base64ImagePrediction;

    return (
        <View>
            <ScrollView>

                {/* <Text>Image Base64: {imgData.data.base64}</Text> */}
                <Image style={{...styles.predictionImg, aspectRatio: imageAspectRatio }} source={{uri: base64ImagePrediction}} />
                <Text> Image URI: {base64ImagePrediction}</Text>
            </ScrollView>
        </View>
    );
  }

  const styles = StyleSheet.create({
      predictionImg: {
          height: screenHeight/2,
          alignSelf: 'center',
      }
  });

  export default PredictionScreen;