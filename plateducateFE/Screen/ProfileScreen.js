// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ScrollView, Image, RecyclerViewBackedScrollViewBase } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({navigation}) => {

	const handleSubmitButton = () => {
		AsyncStorage.clear()
		navigation.navigate('Auth')
	}

	return (
		<View style={{flex:1, backgroundColor: '#242e42'}}>
			<ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor: '#242e42'}}> 
				<LinearGradient colors={['#c7417b', '#8f3b76', '#553772']}style={styles.linearGradient}>
					{/* <Image source={require('../static/food2.jpg')} /> */}
				</LinearGradient>
				<View style={{flex: 1, backgroundColor: '#242e42'}}>
					<View style={{alignItems:'center'}}>
						<Image 
						source={require('../static/profile.png')} 
						style={{width:140, height:140, borderRadius:100, marginTop:-70}}></Image>
					</View>
					<View style={{alignItems: 'center'}}>
						<Text style={{fontSize: 25, fontWeight:'bold', padding:10, color:'white'}}> Owen Jordan </Text>
						<Text style={{fontSize: 15, fontWeight:'bold', color:'lightgrey'}}> Platinum Level User </Text>
					</View>
					<View style={styles.profileElements}>
						<Text style={{fontSize: 15, fontWeight:'bold', color:'white'}}>
							OwenJordan11
						</Text>
					</View>
					<View style={styles.profileElements}>
						<Text style={{fontSize: 15, fontWeight:'bold', color:'white'}}>
							Owen@email.com
						</Text>
					</View>
					<View style={styles.profileElements}>
						<Text style={{fontSize: 15, fontWeight:'bold', color:'white'}}>
							Share
						</Text>
					</View>
					<TouchableOpacity
						style={styles.buttonStyle}
						activeOpacity={0.5}
						onPress={handleSubmitButton}
						>
						<Text style={styles.buttonTextStyle}>Log Out</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	linearGradient: {
		flex: 1,
		// paddingLeft: 15,
		// paddingRight: 15,
		// borderRadius: 5, 
		padding:10, 
		width:'100%', 
		height:150
	 },
	 buttonStyle: {
		backgroundColor: '#C70039',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor: '#7DE24E',
		height: 40,
		alignItems: 'center',
		borderRadius: 15,
		marginLeft: 35,
		marginRight: 35,
		marginTop: 70,
		marginBottom: 25,
	},
	buttonTextStyle: {
		color: '#FFFFFF',
		paddingVertical: 10,
		fontSize: 16,
	},
	profileElements: {
		alignSelf:'center', 
		flexDirection:'row', 
		justifyContent:'center', 
		backgroundColor:'#2e3a51', 
		width:'90%', 
		padding:20, 
		// paddingBottom:22, 
		borderRadius:10, 
		shadowOpacity:80, 
		elevation: 15, 
		margin: 10,
		
	}
});

export default ProfileScreen;