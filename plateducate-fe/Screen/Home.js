import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Rating, AirbnbRating } from "react-native-ratings";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Radio } from "native-base";

class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#000033" style="light" />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.reviewView}>
            <Rating
              ratingCount={5}
              imageSize={22}
              disabled={false}
              ratingColor="red"
              startingValue={5}
              style={{
                paddingVertical: 20,
                alignSelf: "flex-end",
                marginHorizontal: 16,
              }}
            />
            <Text style={styles.introTitle}>Generation of 5-Star</Text>
            <Text style={styles.introTitle2}>Home Screen</Text>
          </View>

          <View style={styles.review_card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginVertical: 25,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text>FR</Text>
                <Radio selected={true} />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text>IN</Text>
                <Radio selected={false} />
              </View>
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-evenly" }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text>M</Text>
                <Radio selected={true} />
              </View>

              <View style={{ flexDirection: "row" }}>
                <Text>MRS</Text>
                <Radio selected={false} />
              </View>
            </View>

            <Text style={styles.input_labal}>Last name and first name</Text>
            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <FontAwesome name="user" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter the Name and first name" //Name & First Name
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            <Text style={styles.input_labal}>Cellular</Text>
            <View style={styles.SectionStyle}>
              <View style={styles.inputIcon}>
                <Ionicons name="ios-call" size={20} color="gray" />
              </View>
              <TextInput
                style={styles.inputStyle}
                placeholder="Enter the phone number" //phone Number
                placeholderTextColor="#8b9cb5"
                autoCapitalize="none"
                keyboardType="number-pad"
                returnKeyType="next"
                underlineColorAndroid="#f000"
                blurOnSubmit={false}
              />
            </View>

            <TouchableOpacity
              style={styles.send_Btn}
              onPress={() => this.props.navigation.navigate("myprofile")}
            >
              <Text style={styles.send_Btntxt}>My Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#edeff5",
  },
  title: {
    fontSize: 20,
    padding: 20,
    fontWeight: "bold",
  },
  text: {
    fontSize: 18,
  },
  reviewView: {
    width: "100%",
    marginVertical: 40,
  },
  introTitle: {
    textAlignVertical: "center",
    fontSize: 22,
    marginLeft: 30,
  },
  introTitle2: {
    color: "#f9c740",
    marginVertical: 10,
    textAlign: "center",
    fontSize: 30,
    letterSpacing: 2,
  },
  review_card: {
    marginVertical: 30,
    justifyContent: "center",
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
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
  input_labal: {
    marginHorizontal: 35,
    marginTop: 20,
    fontWeight: "bold",
  },
  send_Btn: {
    backgroundColor: "#4b83be",
    padding: 16,
    width: "84%",
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 5,
  },
  send_Btntxt: {
    color: "white",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 20,
  },
});
