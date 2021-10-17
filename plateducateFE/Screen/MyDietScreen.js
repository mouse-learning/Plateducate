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
import Icon from 'react-native-vector-icons/Ionicons';


export default function MyDietScreen() {
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

  const [pickerResponse, setPickerResponse] = useState(null);
  const [visible, setVisible] = useState(false);

  const onImageLibraryPress = useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary(options, setPickerResponse);
  }, []);

  const onCameraPress = useCallback(async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
    };
    
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message:"App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchCamera(options, (response) => {
          console.log('Response = ', response);
    
          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.errorMessage) {
            console.log('ImagePicker Error: ', response.errorMessage);
          } else {
            console.log('response', JSON.stringify(response));
            // console.log(response.assets[0].uri);
            // console.log(response.assets[0].base64);
            setPickerResponse(response);
          }
          
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }    
  }, []);

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;
  console.log(uri);

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
        <Image 
          source={{uri: uri}}/>
        <FloatingAction
          // ref={(ref) => { this.floatingAction = ref; }}
          actions={actions}
          onPressItem={name => {
            if (name == 'camera-btn') {
              onCameraPress();
            } else if (name == 'gallery-btn') {
              onImageLibraryPress();
            }
            console.log(`selected button: ${name}`);
          }}
        />
        
      </View>
    </SafeAreaView>
  );
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
// const MyDietScreen = () => {
//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={{flex: 1, padding: 16}}>
//         <View
//           style={{
//             flex: 1,
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}>
//           <Text
//             style={{
//               fontSize: 20,
//               textAlign: 'center',
//               marginBottom: 16,
//             }}>
//             This is the My Diet Screen
//           </Text>
//         </View>
//         <Text
//           style={{
//             fontSize: 18,
//             textAlign: 'center',
//             color: 'grey',
//           }}>
//           Splash, Login and Register Example{'\n'}React Native
//         </Text>
//         <Text
//           style={{
//             fontSize: 16,
//             textAlign: 'center',
//             color: 'grey',
//           }}>
//           www.aboutreact.com
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default MyDietScreen;