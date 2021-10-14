// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React from 'react';
import {
  View, 
  TouchableOpacity,
  Button,
  Alert,
  Text, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground} 
from 'react-native';


const dimensions = Dimensions.get('window');

const overlayStartPos = dimensions.height/2.5;
const overlayHeight = dimensions.height - overlayStartPos;
const buttonInOverlayHeight = overlayHeight/2.5;

const Separator = () => (
  <View style={styles.separator} />
);

const HomeScreen = ({ navigation: { navigate } }) => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <ImageBackground
            source={require('../static/food2.jpg')}
            resizeMode="cover"
            style={styles.image}
          >
            {/* <Text style={styles.text}>Inside</Text> */}
          </ImageBackground>
          <View style={styles.overlay} >
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={() => navigate('MyDiet')}>
              <Image
                source={require('../static/square.png')}
                style={styles.btnImage}
              />
              <View style={styles.btnText}>
                <Text style={styles.btnTextHeader}>Your Diet</Text>
                <Text style={styles.btnTextBody}>See your food log or make a new food log!</Text>   
              </View>
            </TouchableOpacity>
            <Separator />
            <TouchableOpacity
              style={{...styles.button, borderTopLeftRadius: 0, borderTopRightRadius: 0}}
              activeOpacity={0.5}
              onPress={() => navigate('Plateducate')}>
              <Image
                source={require('../static/square.png')}
                style={styles.btnImage}
              />
              <View style={styles.btnText}>
                <Text style={styles.btnTextHeader}>Food Recommendations</Text>
                <Text style={styles.btnTextBody}>What should I eat next?</Text>  
                            
              </View>
            </TouchableOpacity>
          </View> 
        </View>
      </SafeAreaView>
    );
  };
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    opacity: 0.6,
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
  overlay: {
    flex: 1,
    flexDirection: "column",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    top: overlayStartPos,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0.9,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    padding: 15,
    // display: "flex",
    // flexWrap: "wrap",
    // flexDirection: 'row',
    // justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    height: buttonInOverlayHeight,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  btnImage : {
    flex: 1,
    flexGrow: 1,
    height: buttonInOverlayHeight/2, 
    resizeMode: 'contain',
    // width: '20%',
  }, 
  btnText: {
    flex: 1,
    flexGrow: 2,
    // width: '80%',
  },
  separator: {
    // marginVertical: 8,
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnTextHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTextBody : {
    fontSize: 14,
    color: 'grey',
  },
});
export default HomeScreen;