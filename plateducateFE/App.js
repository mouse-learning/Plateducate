
// Import React and Component
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import Screens
import LoginScreen from './Screen/LoginScreen'; 
import RegisterScreen from './Screen/RegisterScreen';
import SplashScreen from './Screen/SplashScreen';
import HomeScreen from './Screen/HomeScreen';
import MyDietScreen from './Screen/MyDietScreen';
import RecommendationScreen from './Screen/RecommendationScreen';
import PredictionScreen from './Screen/Prediction';
import ProfileScreen from './Screen/ProfileScreen';

// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


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
          headerShown: false,
        }}
        />
    </Stack.Navigator>
  );
};

const HomeStack = createNativeStackNavigator();

function HomeScreenStack() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Homepage" component={HomeScreen} options={{
              headerShown: true,
              headerTitleAlign: 'center',
              title: 'Plateducate',
              headerStyle: {
                backgroundColor: '#2f3b52', //Set Header color
              },
              headerTintColor: '#f5487f',
            }}/>
        </HomeStack.Navigator>
    )
}

const DietStack = createNativeStackNavigator();

function DietScreenStack() {
  return(
    <DietStack.Navigator>
      <DietStack.Screen name="MyDiet" component={MyDietScreen} options={{headerShown: false }}/>
      <DietStack.Screen name="Prediction" component={PredictionScreen} options={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#2f3b52', //Set Header color
        },
        headerTintColor: 'white',
        }}/>
    </DietStack.Navigator>
  )
}

function LoggedIn() {
    return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused
                  ? 'home'
                  : 'home-outline';
              } else if (route.name === 'My Diet') {
                iconName = focused ? 'calendar' : 'calendar-outline';
              }
              else if (route.name === 'Profile') {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }

              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#f5487f',
            tabBarInactiveTintColor: '#5b7086',
            tabBarStyle: {
              backgroundColor: '#2f3b52'
            },
          }
          
          )}
          >
            {/* List of tabs at bottom of screen */}
            <Tab.Screen name="Home" component={HomeScreenStack} options={{headerShown: false}}/>
            <Tab.Screen name="My Diet" component={DietScreenStack} options={{headerShown: false}}/>
            <Tab.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
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