
// Import React and Component
import React from 'react';
import LoginScreen from './Screen/LoginScreen'; 
import RegisterScreen from './Screen/RegisterScreen';
import SplashScreen from './Screen/SplashScreen';
import HomeScreen from './Screen/HomeScreen';
import MyDietScreen from './Screen/MyDietScreen';

// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';


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

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          title: 'Register', //Set Header Title
          headerStyle: {
            backgroundColor: '#fff', //Set Header color
          },
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Homepage" component={HomeScreen} />
            <HomeStack.Screen name="MyDiet" component={MyDietScreen}/>
            {/* <HomeStack.Screen name="Recommendation" component={RecommendationScreen}/> */}
        </HomeStack.Navigator>
    )
}

function LoggedIn() {
    return (
        <Tab.Navigator>
            {/* List of tabs at bottom of screen */}
            <Tab.Screen name="Home" component={HomeStackScreen} options={{headerShown: false}}/>
            {/* <Tab.Screen name="Profile"/> */}
        </Tab.Navigator>
    )
}

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="SplashScreen">
                {/* Splash screen appearing for a few seconds */}
                <Stack.Screen 
                    name="SplashScreen" 
                    component={SplashScreen} 
                    options={{headerShown: false}}    
                />

               <Stack.Screen
                name="Auth"
                component={Auth}
                options={{headerShown: false}}
                />

                <Stack.Screen 
                name="LoggedIn" 
                component={LoggedIn}
                options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
}


export default App; 