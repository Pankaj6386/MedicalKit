import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Image,
  View,
  ScrollView,
  FlatList,
  Modal,
  ImageBackground,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import Button from "../../Components/Button";
import Card from "../../Components/CardSimple";
import Header from "../../Components/Header";
import Colors from "../../Styles/Colors";
import navigationString from "../../Navigations/navigationString";
import HomeStyle from "./HomeStyle";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { call_Profile_Api } from "../../redux/action/ProfileAction";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { call_News_Update_API } from "../../redux/action/AdminAction";
import Loading from "../../Components/Loading";
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [roleBase, setRoleBase] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [latestNew, setLatestNew] = useState(null);

  useEffect(() => {
    GetNewsData();
  }, []);

  useEffect(() => {
    requestHandler();
    console.log("Screen is focused");
    if (isFocused) {
      requestHandler();
      getToken();
      dispatch(call_Profile_Api());
      requestLocationPermission();
      GetNewsData();
    }
  }, [isFocused]);

  useFocusEffect(() => {
    console.log("Screen is focused useFocusEffect");
    requestHandler();
    dispatch(call_Profile_Api());
    requestLocationPermission();
  });

  const GetNewsData = () => {
    setisLoading(true);
    dispatch(call_News_Update_API())
      .then((res) => {
        // console.log(
        //   "get news data",
        //   JSON.stringify(res.payload.data.latestNews)
        // );
        setisLoading(false);
        if (res?.payload?.status === 200) {
          setisLoading(false);
          setLatestNew(res.payload?.data?.latestNews);
          setData(res.payload?.data?.oldNews);
          if (Object.keys(res.payload?.data?.latestNews)?.length === 0) {
            setLatestNew(null);
          }
        } else {
          setisLoading(false);
          console.log("get new data res", res.payload);
        }
      })
      .catch((err) => {
        setisLoading(false);
        console.log("err news data", err);
      });
  };

  const requestHandler = async () => {
    const role = await AsyncStorage.getItem("role");
    setRoleBase(role);
    console.log("---accessToken-- ", role);
  };

  const [userDatas, setUserDatas] = useState(null);
  console.log(latestNew, "---home scree async");

  const getToken = async () => {
    const accessGlobalData = await AsyncStorage.getItem("globalData");
    const jsonValue = JSON.parse(accessGlobalData);
    console.log("get token data Home", jsonValue);
    setUserDatas(jsonValue);
  };

  const [data, setData] = useState([]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigateToNotificationDetails(item, { _id: item?._id });
        // navigation.navigate(navigationString.NewsAndUpdateScreen, {
        //   keyId: item,
        // });
      }}
      style={{ flexDirection: "row", marginTop: 20, flex: 1 }}>
      <View style={{ flex: 0.4 }}>
        <Image
          source={
            item?.featured_image
              ? { uri: item?.featured_image }
              : imagePath.NoIcon
          }
          style={{ width: 140, height: 100 }}
        />
      </View>
      <View style={{ flex: 0.6, paddingLeft: Platform.OS === "android" && 8 }}>
        <TextView
          heading
          headingTextSty={{
            fontWeight: "700",
            lineHeight: 16.2,
            fontSize: 12,
            marginLeft: 10,
            textAlign: "left",
          }}>
          {item?.title}
        </TextView>
        <TextView
          ellipsizeMode="tail"
          numberOfLines={4}
          textSty={{
            marginTop: 5,
            fontSize: 12,
            marginLeft: 10,
            textAlign: "left",
          }}>
          {item?.sub_title}
          {/* {(item?.sub_title).length > 2
            ? (item?.sub_title).substring(0, 2) + "..."
            : item?.sub_title} */}
        </TextView>
      </View>
    </TouchableOpacity>
  );

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      const status = await check(permission);

      if (status === RESULTS.GRANTED) {
        console.log("Location permission granted");
        // You can proceed with location-related tasks here
      } else {
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          console.log("Location permission granted");
          // You can proceed with location-related tasks here
        } else {
          console.log("Location permission denied");
          // Handle the case where permission is denied
        }
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  // Function to handle navigation to NotificationDetails
  const navigateToNotificationDetails = (imageSource) => {
    navigation.navigate("notificationDetails", { imageSource });
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoading}>
        <Loading />
      </Modal>
      <Header back={() => navigation.navigate(navigationString.profile)} />

      <View style={{ flex: 1 }}>
        {/* Green section */}
        <TextView heading headingTextSty={HomeStyle.heading}>
          {AllStrings.Whatwouldlike}
        </TextView>

        {/* Rest of the content */}
        <View style={HomeStyle.buttonContainer}>
          <Button
            onClick={() => navigation.navigate(navigationString.incidentNav)}
            allButtonSty={HomeStyle.reportBtn}
            btnName="Report An Incident"
            buttonColor={Colors.black}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            <>
              {userDatas?.data?.role !== "user" &&
                userDatas?.data?.role !== "approver" && (
                  <Button
                    onClick={() =>
                      navigation.navigate(navigationString.kitsInstallation)
                    }
                    allButtonSty={HomeStyle.registerBtn}
                    buttonColor={Colors.white}
                    btnColor="#fff"
                    btnName="Register a First Aid Kit"
                  />
                )}
              <View style={{ paddingHorizontal: 15, height: "100%" }}>
                {latestNew !== null && (
                  <TextView
                    heading
                    headingTextSty={{ marginTop: 5, fontSize: 14 }}>
                    {AllStrings.updates}
                  </TextView>
                )}
                {data?.length === 0 && latestNew === null && (
                  <View style={styles.container}>
                    <View style={{ flex: 1 }}>
                      <ImageBackground
                        // resizeMode="contain"
                        source={imagePath.Clipboard_GRN}
                        style={styles.imageBackground}
                        imageStyle={styles.imageStyle} // Applying opacity to the image itself
                      >
                        <TextView heading headingTextSty={styles.text}>
                          No News and Updates
                        </TextView>
                      </ImageBackground>
                    </View>
                  </View>
                )}
                <Card
                  cardOnPress={() => {
                    navigateToNotificationDetails(latestNew, {
                      _id: latestNew?._id,
                    });
                    // navigation.navigate(navigationString.NewsAndUpdateScreen, {
                    //   keyId: latestNew,
                    // });
                  }}
                  imageSrc={
                    // latestNew?.featured_image
                    // ?
                    { uri: latestNew?.featured_image }
                    // : imagePath.NoIcon
                  }
                  title={latestNew?.title}
                  des={latestNew?.sub_title}
                />

                <FlatList
                  // columnWrapperStyle={{ justifyContent: "space-around" }}
                  data={data}
                  renderItem={renderItem}
                  // numColumns={3}
                  keyExtractor={(item) => item.key}
                  style={{ height: "auto", marginTop: 20, marginBottom: 10 }}
                />
              </View>
            </>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginTop: -20,
    height: Platform.OS === "ios" ? "100%" : responsiveHeight(60),
    // backgroundColor: "red",
    // flex: 1,
  },
  imageBackground: {
    height: "100%",
    justifyContent: "center", // Centering the text vertically
    alignItems: "center", // Centering the text horizontally
  },
  imageStyle: {
    opacity: 0.2,
    // width: 350,
    // height: 370,
    width: responsiveWidth(95),
    height: Platform.OS === "ios" ? responsiveHeight(57) : responsiveHeight(60),
  },
  text: {
    fontSize: 18,
    top: Platform.OS === "ios" ? 10 : -60,
    color: Colors.black,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: "OpenSans-Regular",
    letterSpacing: -1.5,
  },
});
