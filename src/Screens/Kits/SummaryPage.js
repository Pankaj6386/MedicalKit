import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import Colors from "../../Styles/Colors";
import imagePath from "../../Constant/imagePath";
import Header from "../../Components/Header";
import TextView from "../../Components/TextView";
import AllStrings from "../../Constant/AllStrings";
import navigationString from "../../Navigations/navigationString";
import kitsStyles from "./kitsStyles";
import Button from "../../Components/Button";
import MiniCard from "../../Components/MiniCard";
import ModalScreen from "../../Components/ModalScreen";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { call_AddLocation_API } from "../../redux/action/KitInstallationAction";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import ImageResizer from "react-native-image-resizer";
import Loading from "../../Components/Loading";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";

const SummaryPage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  console.log("----route value---", route.params);
  const [isLoadings, setIsLoadings] = useState(false);
  const [showSuccess, setshowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );
  console.log(
    // listData,
    "summary screen show data ",
    JSON.stringify(installKitDetails.data)
  );

  const expiryDate = installKitDetails?.data?.kit?.expiry_date;
  const formattedDate = moment(expiryDate).format("MMM YYYY");

  // call complete button funtionality
  const handleComplete = async () => {
    const payload = new FormData();
    payload.append(
      "location_name",
      route.params?.payload.location.location_name
    );
    const compressedImage = await ImageResizer.createResizedImage(
      route.params?.payload.img || "",
      300, // Set the maximum width
      400, // Set the maximum height
      "JPEG", // Set the output format ('JPEG' or 'PNG')
      80 // Set the compression quality (0 - 100)
    );

    payload.append("area", route.params?.payload.area);
    payload.append("kit_id", installKitDetails?.data.kit._id);
    payload.append("is_moving", route.params?.payload.isMoving);
    payload.append("location_id", route.params?.payload.location._id);
    // payload.append("kit_location_pic", {
    //   uri: route.params?.payload.img,
    //   name: "image.jpg",
    //   type: "image/jpeg",
    // });
    {
      route.params?.payload.img !== null &&
        payload.append("kit_location_pic", {
          uri: compressedImage.uri,
          name: "image.jpg",
          type: "image/jpeg",
        });
    }
    console.log(JSON.stringify(payload), "-----------pai");

    setIsLoadings(true);
    dispatch(call_AddLocation_API(payload))
      .then((res) => {
        console.log("summary screen--", JSON.stringify(res));
        if (res.payload.status === 200) {
          setIsLoadings(false);
          setshowSuccess(true);
        } else {
          setIsLoadings(false);
          alert(res?.payload?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoadings(false);
      });
  };

  const renderItem = ({ item, index }) => {
    // console.log("index", index);
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 14,
          paddingHorizontal: 5,
          backgroundColor: index % 2 == 0 ? null : Colors.greenLightTint,
        }}>
        <View style={{ flex: 0.5 }}>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "left",
            }}>
            {item?.product_code} - {item.description}
          </TextView>
        </View>
        <View
          style={{
            flex: 0.25,
          }}>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "center",
            }}>
            {item.current_quantity}
          </TextView>
        </View>
        <View
          style={{
            flex: 0.25,
          }}>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "center",
            }}>
            {item?.expiry_date === null
              ? ""
              : moment(item?.expiry_date).format("MMM YYYY")}
          </TextView>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Header
        back={() => navigation.navigate(navigationString.profile)}
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack()}
      />
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>

      <View style={kitsStyles.container}>
        <View
          style={{
            ...kitsStyles.heading,
            marginTop: 15,
            marginHorizontal: 20,
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ marginTop: 0 }}>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  lineHeight: 21,
                }}>
                {AllStrings.InstallationDetails}
              </TextView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 10,
                }}
              />
              <View style={{ alignSelf: "center", marginTop: 10 }}>
                <Image
                  source={
                    route.params?.payload.img
                      ? { uri: route.params?.payload.img }
                      : imagePath.NoIcon
                  }
                  style={{
                    // alignSelf: "center",
                    height: responsiveHeight(25),
                    width: responsiveWidth(90),
                    marginBottom: 10,
                  }}
                  resizeMode="cover"
                />
                {/* <Image
                  source={imagePath.Frame}
                  resizeMode="contain"
                  style={{ marginTop: 5 }}
                /> */}
                {/* {console.log(
                  "route.params?.payload?.latitude,",
                  route.params?.payload
                )} */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={{
                      height: responsiveHeight(25),
                      width: responsiveWidth(50),
                    }}
                    initialRegion={{
                      latitude:
                        Platform.OS === "ios"
                          ? route.params?.payload?.location?.latitude
                          : parseFloat(
                              route.params?.payload?.location?.latitude
                            ),
                      longitude:
                        Platform.OS === "ios"
                          ? route.params?.payload?.location?.longitude
                          : parseFloat(
                              route.params?.payload?.location?.longitude
                            ),
                      // latitude: 30.733315,
                      // longitude: 76.779419,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}>
                    {/* Marker */}
                    <Marker
                      coordinate={{
                        latitude:
                          Platform.OS === "ios"
                            ? route.params?.payload?.location?.latitude
                            : parseFloat(
                                route.params?.payload?.location?.latitude
                              ),
                        longitude:
                          Platform.OS === "ios"
                            ? route.params?.payload?.location?.longitude
                            : parseFloat(
                                route.params?.payload?.location?.longitude
                              ),
                        // latitude: route.params?.payload?.location?.latitude,
                        // longitude: route.params?.payload?.location?.longitude,
                      }}
                      // title={kitDetails?.location_name}
                      // description={"Your Marker Description"}
                    />
                  </MapView>

                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        textAlign: "left",
                        lineHeight: 18,

                        marginTop: 0,
                      }}>
                      {route.params?.payload?.location?.location_name}
                    </TextView>
                    <TextView
                      heading
                      headingTextSty={{
                        ...kitsStyles.headingText,
                        textAlign: "left",
                        lineHeight: 18,

                        marginTop: 0,
                      }}>
                      {route.params?.payload?.area}
                    </TextView>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <TextView
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "left",
                  lineHeight: 21,
                }}>
                {AllStrings.KitContentDetails}
              </TextView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                  marginTop: 10,
                }}
              />
            </View>

            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Image
                // source={
                //   installKitDetails?.data?.kit?.kit_picture
                //     ? { uri: installKitDetails?.data.kit?.kit_picture }
                //     : imagePath.productImg
                // }
                source={
                  installKitDetails?.data.kit?.kit_picture !== ""
                    ? { uri: installKitDetails?.data.kit?.kit_picture }
                    : imagePath.NoIcon
                  // imagePath.NoIcon
                }
                resizeMode="contain"
                style={{
                  height: responsiveHeight(25),
                  width: responsiveWidth(90),
                }}
              />
            </View>

            <View style={{ width: "80%", alignSelf: "center" }}>
              <TextView
                onPress={() => {}}
                heading
                headingTextSty={{
                  ...kitsStyles.headingText,
                  textAlign: "center",
                  lineHeight: 21,
                }}>
                {(installKitDetails?.data?.kit?.brand == "false"
                  ? ""
                  : installKitDetails?.data?.kit?.brand) +
                  " " +
                  (installKitDetails?.data?.kit?.model_number == "false"
                    ? ""
                    : installKitDetails?.data?.kit?.model_number) +
                  " " +
                  installKitDetails?.data?.kit?.product_name}
              </TextView>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
                gap: 2,
              }}>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.BatchNumber}
                  // text={installKitDetails?.data.kit?.product_code}
                  text={
                    installKitDetails?.data.kit?.product_code == "false"
                      ? null
                      : installKitDetails?.data.kit?.product_code
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.LOTNumber}
                  // text={installKitDetails?.data.kit?.lot_number}
                  text={
                    installKitDetails?.data.kit?.lot_number == "false"
                      ? null
                      : installKitDetails?.data.kit?.lot_number
                  }
                />
              </View>
              <View style={{ flex: 4 }}>
                <MiniCard
                  heading={AllStrings.ExpiryDate}
                  text={formattedDate}
                />
              </View>
            </View>

            <View>
              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: Colors.greenTint,
                  paddingHorizontal: 10,
                  paddingVertical: 12,
                  marginTop: 20,
                }}>
                <TextView
                  heading
                  headingTextSty={{
                    lineHeight: 15,
                    fontSize: 10,
                    color: Colors.white,
                  }}>
                  {AllStrings.KitContents}
                </TextView>
                <TextView
                  heading
                  headingTextSty={{
                    lineHeight: 15,
                    fontSize: 10,
                    color: Colors.white,
                  }}>
                  {AllStrings.Quantity}
                </TextView>
              </View> */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: Colors.greenTint,
                  paddingHorizontal: moderateScale(10),
                  paddingVertical: moderateScaleVertical(12),
                  marginTop: moderateScaleVertical(15),
                }}>
                <View style={{ flex: 0.5 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}>
                    {AllStrings.KitContents}
                  </TextView>
                </View>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      textAlign: "center",
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                    }}>
                    {AllStrings.Quantity}
                  </TextView>
                </View>
                <View style={{ flex: 0.25 }}>
                  <TextView
                    heading
                    headingTextSty={{
                      lineHeight: 15,
                      fontSize: 10,
                      color: Colors.white,
                      textAlign: "center",
                    }}>
                    {AllStrings.Expire_Date}
                  </TextView>
                </View>
              </View>
              <View>
                <FlatList
                  data={installKitDetails?.data.relatedProducts}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.key}
                  style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 15,
                marginTop: 30,
              }}>
              <Button
                onClick={() => {
                  setShowModal(true);
                }}
                allButtonSty={{
                  backgroundColor: Colors.black,
                  borderRadius: 10,
                  width: "35%",
                  marginHorizontal: 0,
                }}
                buttonColor={Colors.white}
                btnName="Cancel"
              />
              <Button
                onClick={() => {
                  handleComplete();
                }}
                allButtonSty={{
                  alignSelf: "center",
                  width: "60%",
                  marginHorizontal: 0,
                  borderRadius: 10,
                }}
                buttonColor={Colors.black}
                btnName="Complete"
              />
            </View>
            {showModal && (
              <ModalScreen
                visible={showModal}
                modalheading={AllStrings.CancelKitInstallation}
                modalText={AllStrings.cancelinstallationkit}
                btnName="No"
                btnName1="Yes"
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  navigation.navigate(
                    navigationString.kitsFound
                    // {
                    // qrCode: route?.params?.qrCode,
                    // }
                  );
                }}
                modalButton={() => setShowModal(false)}
              />
            )}
            {showSuccess && (
              <ModalScreen
                success
                visible={showSuccess}
                modalheading={AllStrings.PleaseConfirm}
                modalText={AllStrings.Successfullyarchived}
                btnName1="Continue"
                buttonColor={Colors.white}
                btnStyle={{ backgroundColor: Colors.black }}
                modalButton1={() => {
                  setshowSuccess(false);
                  navigation.navigate(navigationString.Home);
                }}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SummaryPage;

const styles = StyleSheet.create({});
