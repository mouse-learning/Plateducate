// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';

const ProfileScreen = ({navigation}) => {

	const handleSubmitButton = () => {
		AsyncStorage.clear()
		navigation.navigate('Auth')
	}

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ flex: 1, padding: 16 }}>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<Text
						style={{
							fontSize: 20,
							textAlign: 'center',
							marginBottom: 16,
						}}>
						This is the Profile Screen
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
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	buttonStyle: {
		backgroundColor: '#C70039',
		borderWidth: 0,
		color: '#FFFFFF',
		borderColor: '#7DE24E',
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
});

export default ProfileScreen;