import React, { Component, useState, useCallback } from 'react';

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
        base64 : route.params.data.assets[0].base64,
        uri: route.params.data.assets[0].uri,
        width: route.params.data.assets[0].width,
        height: route.params.data.assets[0].height,
        fileSize: route.params.data.assets[0].fileSize,
        type: route.params.data.assets[0].type,
        fileName: route.params.data.assets[0].fileName,
    }

    const imageType = imgData.type.split("/")[1];
    const base64Image = 'data:image/' + imageType + ';base64,'+ imgData.base64;
    const imageAspectRatio = imgData.width/imgData.height;

    return (
        <View>
            <ScrollView>

                {/* <Text>Image Base64: {imgData.data.base64}</Text> */}
                <Image style={{...styles.predictionImg, aspectRatio: imageAspectRatio }} source={{uri: base64Image}} />
                <Text> Image URI: {base64Image}</Text>
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