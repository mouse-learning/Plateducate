

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

const RegisterScreen = (props) => {
  const [userName, setUserName] = useState('fe');
  const [userEmail, setUserEmail] = useState('fe@email.com');
  const [userPassword, setUserPassword] = useState('fe');
  const [userPasswordConfirm, setUserPasswordConfirm] = useState('fe');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistrationSuccess, setisRegistrationSuccess] = useState(false);

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
      backgroundColor: '#7DE24E',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#7DE24E',
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
      color: 'black',
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
      color: 'green',
      textAlign: 'center',
      fontSize: 18,
      padding: 30,
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

    fetch('http://10.0.2.2:5000/register', {
      method: 'POST',
      body: JSON.stringify(dataToSend),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => setLoading(false))
    .catch((error) => {
      setLoading(false);
      console.error(error);
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
          backgroundColor: '#fff',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../static/logo.png')}
          style={{height: 150, resizeMode: 'contain', alignSelf: 'center'}}
        />
        <Text style={styles.successTextStyle}>Registration Successful.</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
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
              width: '50%',
              height: 100,
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
              placeholderTextColor="#8b9cb5"
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
              placeholderTextColor="#8b9cb5"
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
              placeholderTextColor="#8b9cb5"
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
              placeholderTextColor="#8b9cb5"
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
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;