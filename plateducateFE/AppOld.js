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

function LandingPage({navigation}) {
    return (
    <View style={styles.container}>
        <Text style={styles.landing}>Plateducate</Text>
        <Button 
            title="Login" 
            onPress={() => navigation.navigate('LoginScreen')}
        />
        <Button 
            title="Register" 
            onPress={() => navigation.navigate('RegisterScreen')}
        />
    </View>
    )
}

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen 
                    name="Landing" 
                    component={LandingPage} 
                    options={{headerShown: false}}    
                />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;