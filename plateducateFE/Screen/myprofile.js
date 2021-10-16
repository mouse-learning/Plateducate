import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

class StatisticsScreen extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <StatusBar backgroundColor="#000033" style="light" />
          <View style={styles.statistics_View}>
            <Text style={styles.introTitle}>Update</Text>
            <Text style={styles.introTitle2}>Profile here</Text>
          </View>

          <View>
            {/*=============== total Cards ============= */}
            <Text style={styles.main_title}>In total</Text>
            <Text style={styles.input_labal}>First name</Text>

            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Name" //Name & First Name
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <Text style={styles.input_labal}>Last name</Text>

            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Name" //Name & First Name
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <Text style={styles.input_labal}>Gender</Text>
            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Gender" //Gender
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>
            <Text style={styles.input_labal}>Date of Birth</Text>
            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter the Name and first name" //Date of Birth
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="numeric"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            <Text style={styles.input_labal}>Date of Birth</Text>
            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter the Name and first name" //Phone Number
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="numeric"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            <Text style={styles.input_labal}>Date of Birth</Text>
            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter the Name and first name" //Date of Birth
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="numeric"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={() => this.props.navigation.navigate('LoginScreen')}
              >
              <Text style={styles.buttonTextStyle}>Update</Text>
            </TouchableOpacity>

        </View> 
        </View>
      </ScrollView>
    );
  }
}

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edeff5",
  },

  statistics_View: {
    flexDirection: "row",
    width: "100%",
    marginTop: 60,
  },
  introTitle: {
    fontSize: 30,
    marginLeft: 30,
  },
  introTitle2: {
    color: "#3e5cbc",
    marginVertical: 12,
    textAlign: "center",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  main_title: {
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 27,
  },
  main_title2: {
    fontSize: 20,
    marginVertical: 10,
    marginTop: 40,
    marginHorizontal: 27,
  },
  SectionStyle: {
    flexDirection: "row",
    height: 40,
    marginTop: 10,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  inputIcon: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    borderRadius: 1,
    borderColor: "gray",
    borderWidth: 1,
  },
  inputStyle: {
    flex: 1,
    color: "black",
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#dadae8",
    backgroundColor: "#f8f8f8",
  },
  input_labal: {
    marginHorizontal: 35,
    marginTop: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sent_emailtxt: {
    marginHorizontal: 10,
    marginVertical: 5,
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
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
