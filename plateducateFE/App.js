import * as React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './Screen/LoginScreen'; 
import RegisterScreen from './Screen/RegisterScreen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    landing: {
        color: 'rgb(59,108,212)',
        fontSize: 42,
        fontWeight: '100',
        textAlign: 'center',
    },
    login: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    }
})

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function SplashPage({navigation}) {
    return (
        // <View style={styles.container}>
        //     <Text style={styles.landing}>Plateducate</Text>
        //     <Button 
        //         title="Login" 
        //         onPress={() => navigation.navigate('Login')}
        //         />
            <Tab.Navigator>
                <Tab.Screen name="Register Page" component={Register} />
                <Tab.Screen name="Login Page" component={Login} />
            </Tab.Navigator>
        // </View>
    )
}

function Register() {
    return (
        <View style={styles.login}>
            <Text>Register Screen</Text>
        </View>
    );
}

function Login() {
    return (
        <View style={styles.login}>
            <Text>Login Screen</Text>
        </View>
    );
}

function Profile() {
    return (
        <View style={styles.login}>
            <Text>Profile Screen</Text>
        </View>
    );
}

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
                {/* <Stack.Screen 
                    name="Landing" 
                    component={SplashPage} 
                    options={{headerShown: false}}    
                />
                <Stack.Screen name="Profile" component={Profile} /> */}
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;