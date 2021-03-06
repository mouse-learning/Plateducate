// Import React and Component
import React, { useState, createRef } from 'react';
import {
   StyleSheet,
   TextInput,
   View,
   Text,
   ScrollView,
   Image,
   Keyboard,
   TouchableOpacity,
   KeyboardAvoidingView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'

import Loader from './Components/Loader';

const LoginScreen = ({ navigation }) => {
   const [username, setUsername] = useState('');
   const [userPassword, setUserPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [errortext, setErrortext] = useState('');

   const passwordInputRef = createRef();
   const usernameInputRef = createRef();

   const handleSubmitBUtton = () => {
      setErrortext('');
      if (!username) {
        alert('Please fill Username');
        return;
      }
      if (!userPassword) {
        alert('Please fill Password');
        return;
      }
      setLoading(true);
      
      var dataToSend = {
         username: username,
         password: userPassword,
       };
       console.log(dataToSend)

      fetch('http://10.0.2.2:4000/login', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
        headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json',
       },
      })
        .then((response) => response.json())
        .then((responseJson) => {
           if (responseJson.ok == true) {
              console.log(responseJson)
              setLoading(false);
              AsyncStorage.setItem('@user_token', responseJson.access_token);
              AsyncStorage.setItem('@username', dataToSend['username']);
              AsyncStorage.setItem('@user_id', responseJson.user_id);
              navigation.replace('LoggedIn');
            } else {
               setLoading(false);
               alert(responseJson.message);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    };

   return (
      <View style={styles.mainBody}>
         {/* {loading ? <Loader loading={loading} /> : */}
         
         <ScrollView
            keyboardShouldPersistTaps="handled"
            >
            <View style={{backgroundColor: '#242e42', alignSelf:'center' }}>
               <KeyboardAvoidingView enabled>
                  <View >
                     <Image
                        source={require('../static/logo.png')}
                        style={{
                           width: 300,
                           height: 300,
                           resizeMode: 'contain',
                           margin: 42,
                        }}
                     />
                  </View>
                  <View style={styles.SectionStyle}>
                     <TextInput
                        style={styles.inputStyle}
                        onChangeText={(username) => setUsername(username)}
                        placeholder="Enter Username"
                        placeholderTextColor="#5b7086"
                        autoCapitalize="none"
                        keyboardType="default"
                        returnKeyType="next"
                        ref={usernameInputRef}
                        onSubmitEditing={() =>
                           usernameInputRef.current && usernameInputRef.current.focus()
                        }
                        underlineColorAndroid="#f000"
                        blurOnSubmit={false}
                     />
                  </View>
                  <View style={styles.SectionStyle}>
                     <TextInput
                        style={styles.inputStyle}
                        onChangeText={(UserPassword) => setUserPassword(UserPassword)}
                        placeholder="Enter Password"
                        placeholderTextColor="#5b7086"
                        keyboardType="default"
                        ref={passwordInputRef}
                        onSubmitEditing={() =>
                           passwordInputRef.current && passwordInputRef.current.focus()
                        }
                        blurOnSubmit={false}
                        secureTextEntry={true}
                        underlineColorAndroid="#f000"
                        returnKeyType="next"
                     />
                  </View>
                  {errortext != '' ? (
                     <Text style={styles.errorTextStyle}> {errortext} </Text>
                  ) : null}
                  <TouchableOpacity
                     style={styles.buttonStyle}
                     activeOpacity={0.5}
                     onPress={handleSubmitBUtton}
                  >
                     <Text style={styles.buttonTextStyle}>LOGIN</Text>
                  </TouchableOpacity>
                  <Text
                     style={styles.registerTextStyle}
                     onPress={() => navigation.navigate('RegisterScreen')}>
                     New Here ? Register
                  </Text>
               </KeyboardAvoidingView>
            </View>
         </ScrollView>
         {/* } */}
      </View>
   );
};

const styles = StyleSheet.create({
   mainBody: {
      flex: 1,
      backgroundColor: '#242e42',
   },
   SectionStyle: {
      flexDirection: 'row',
      height: 40,
      marginTop: 20,
      marginLeft: 35,
      marginRight: 35,
      margin: 10,
   },
   buttonStyle: {
      backgroundColor: '#f5487f',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#f5487f',
      height: 40,
      alignItems: 'center',
      borderRadius: 3,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
      marginBottom: 25,
   },
   buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
   },
   inputStyle: {
      flex: 1,
      color: 'white',
      paddingLeft: 15,
      paddingRight: 15,
      borderWidth: 1,
      borderRadius: 3,
      borderColor: '#dadae8',
   },
   registerTextStyle: {
      color: '#307ECC',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      alignSelf: 'center',
      padding: 10,
   },
   errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
   },
});

export default LoginScreen;