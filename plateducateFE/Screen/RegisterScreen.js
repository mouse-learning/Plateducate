

// Import React and Component
import React, {useState, createRef} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import Loader from './Components/Loader';

const RegisterScreen = ({navigation}) => {
  const [userName, setUserName] = useState('fe');
  const [userEmail, setUserEmail] = useState('fe@email.com');
  const [userPassword, setUserPassword] = useState('fe');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('fe');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const usernameInputRef = createRef();
  const emailInputRef = createRef();
  const passwordInputRef = createRef();
  const passwordConfirmInputRef = createRef();

  const styles = StyleSheet.create({
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
      marginBottom: 20,
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
    errorTextStyle: {
      color: 'red',
      textAlign: 'center',
      fontSize: 14,
    },
    successTextStyle: {
      color: '#ffffff',
      textAlign: 'center',
      fontSize: 18,
      padding: 30,
    },
    registerTextStyle: {
      color: '#307ECC',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      alignSelf: 'center',
      padding: 10,
    },
  });

  const handleSubmitButton = () => {
    setErrortext('');
    // if (!userName) {
    //   alert('Please fill Name');
    //   return;
    // }
    // if (!userEmail) {
    //   alert('Please fill Email');
    //   return;
    // }
    // if (!userPassword) {
    //   alert('Please fill Address');
    //   return;
    // }
    // if (userPassword != userPasswordConfirm) {
    //   console.log(userPassword)
    //   console.log(userPasswordConfirm)
    //   alert('Password does not match');
    //   return;
    // }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      username: userName,
      email: userEmail,
      password: userPassword,
      confirm: userPasswordConfirm,
    };
    // console.log(dataToSend)

    var formData = new FormData()
    for (var key in dataToSend) {
      // console.log(key, dataToSend[key])
      formData.append(key, dataToSend[key])
    }
    console.log(formData)
    // console.log(JSON.stringify(dataToSend))

    fetch('http://10.0.2.2:4000/register', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.ok) {
        setIsRegistrationSuccess(true)
        setLoading(false)
      }
      else {
        setLoading(false)
        alert(`Registration Unsuccessful. \n${responseJson.message}`)
      }
    })
    .catch((error) => {
      setLoading(false);
      alert(error);
    });
  };
  // .then((response) => response.text())
  // .then((responseJson) => console.log(responseJson))
  // .then((data) => console.log(data))
  // .then((response) => response.json())
  // .then((responseJson) => {
  //   //Hide Loader
  //   setLoading(false);
  //   console.log(responseJson);
  //   // If server response message same as Data Matched
  //   if (responseJson.status == 200) {
  //     setisRegistrationSuccess(true);
  //     console.log('Registration Successful. Please Login to proceed');
  //   } else {
  //     setErrortext('Registration Unsuccessful');
  //   }
  // })
  if (isRegistrationSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#242e42',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../static/logo.png')}
          style={{height: 70, resizeMode: 'contain', alignSelf: 'center'}}
        />
        <Text style={styles.successTextStyle}>Registration Successful.</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: '#242e42'}}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../static/logo.png')}
            style={{
              width: 300,
              height: 200,
              resizeMode: 'contain',
              margin: 30,
            }}
          />
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Username"
              placeholderTextColor="#5b7086"
              ref={usernameInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                usernameInputRef.current && usernameInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(UserEmail) => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#5b7086"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(userPassword) => setUserPassword(userPassword)}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#5b7086"
              secureTextEntry={true}
              ref={passwordInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(userPasswordConfirm) => setUserPasswordConfirm(userPasswordConfirm)}
              underlineColorAndroid="#f000"
              placeholder="Confirm Password"
              placeholderTextColor="#5b7086"
              secureTextEntry={true}
              ref={passwordConfirmInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordConfirmInputRef.current && passwordConfirmInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>

          {errortext != '' ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <Text
          style={styles.registerTextStyle}
          onPress={() => navigation.navigate('LoginScreen')}>
          Have an account? Login Here
        </Text>
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;