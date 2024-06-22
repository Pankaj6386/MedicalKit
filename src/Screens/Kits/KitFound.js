import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
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
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { call_InstallKitDetails } from "../../redux/action/KitInstallationAction";
import { useIsFocused } from "@react-navigation/native";
import { addItemFromProductFound } from "../../redux/reducer/auth";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";

const KitFound = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const storeQrCode = useSelector((state) => state?.auth?.QRCode);
  console.log("kit found storeQrCode---", storeQrCode);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [listData, setData] = useState(
    installKitDetails?.data?.relatedProducts
  );
  const { isLoading, error, installKitDetails } = useSelector(
    (state) => state.InstallKitsSliceDetail
  );
  console.log(
    listData,
    "installKitDetails screen show data ",
    route?.params?.qrCode
  );

  const expiryDate = installKitDetails?.data?.kit?.expiry_date;
  const formattedDate = moment(expiryDate).format("MMM YYYY");

  useEffect(() => {
    // fetchData();
    setData(installKitDetails?.data?.relatedProducts);
  }, [installKitDetails]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const fetchData = () => {
    const data = {
      qr_code: route?.params?.qrCode || storeQrCode,
    };
    dispatch(call_InstallKitDetails(data))
      .then((res) => {
        console.log("======res=======", JSON.stringify(res));
        if (res.payload.status === 200) {
          // navigation.navigate(navigationString.kitsFound, {
          //   qrCode: scannedData.rawData,
          // });

          console.log(res, "----response------ 123 ");
          setData(installKitDetails?.data?.relatedProducts);
          setRefreshing(false);
        } else {
          setRefreshing(false);
          alert(res?.payload?.message);
        }
      })
      .catch((err) => {
        setRefreshing(false);
        console.log(err, "--------errror ----------123");
      });
  };

  // Function to handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing to true to show the spinner
    fetchData(); // Call the function to fetch new data
  };

  const renderItem = ({ item, index }) => {
    console.log(item, "---index", index);
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
            {item?.product_code} - {item?.description}
          </TextView>
        </View>
        <View style={{ flex: 0.25 }}>
          <TextView
            textSty={{
              fontSize: 12,
              textAlign: "center",
            }}>
            {item?.current_quantity}
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

      <View style={kitsStyles.container}>
        <View
          style={{
            ...kitsStyles.heading,
            marginTop: 15,
            marginHorizontal: 20,
          }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#9Bd35A", "#689F38"]}
                // tintColor="#689F38" // Android only
                // title="Pull to refresh" // iOS only
              />
            }>
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <Image
                source={
                  installKitDetails?.data.kit?.kit_picture !== ""
                    ? { uri: installKitDetails?.data.kit?.kit_picture }
                    : imagePath.NoIcon
                  // imagePath.NoIcon
                }
                resizeMode="contain"
                style={{
                  width: responsiveWidth(80),
                  height: responsiveHeight(25),
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
                  marginTop: 10,
                }}>
                {/* {AllStrings.RelianceMedicalMediumWorkplace} */}
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
                  text={
                    installKitDetails?.data?.kit?.lot_number == "false"
                      ? null
                      : installKitDetails?.data?.kit?.lot_number
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
                  data={listData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.key}
                  style={{ height: "auto", marginTop: 1, marginBottom: 10 }}
                />

                {/* copy from product found screen
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
<TouchableOpacity
          onPress={() => {
            setLocationUpdate(!locationUpdate);
            setLocationList(index);
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 14,
            paddingHorizontal: 5,
            backgroundColor:
              index % 2 == 0 ? Colors.white : Colors.greenLightTint,
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
          <View style={{ flex: 0.25 }}>
            <TextView
              textSty={{
                fontSize: 12,
                textAlign: "center",
              }}>
              {item?.current_quantity}
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
        </TouchableOpacity> */}
              </View>
            </View>
            {route?.params?.key === "scanStandardReport" ||
            route?.params?.key === "scanQuickReport" ? (
              <View
                style={{
                  // justifyContent: "center",
                  width: "100%",
                  marginVertical: 15,
                  marginTop: 30,
                }}>
                <Button
                  onClick={() => {
                    // navigation.navigate(navigationString.enterLocation, {
                    //   key: "user",
                    // });
                    route?.params?.key == "scanStandardReport"
                      ? navigation.navigate(
                          navigationString.detailedReportFirst
                        )
                      : navigation.navigate(
                          navigationString.quickReportInfoNav
                        );
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "80%",
                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Continue"
                />
              </View>
            ) : (
              <View
                style={{
                  // justifyContent: "center",
                  width: "100%",
                  alignItems: "center",
                  flexDirection: "row",
                  marginVertical: 15,
                  marginTop: 30,
                }}>
                <Button
                  onClick={() => {
                    dispatch(addItemFromProductFound("fromKitFound"));
                    navigation.navigate(navigationString.addItems, {
                      kitId: installKitDetails?.data?.kit?._id,
                    });
                  }}
                  allButtonSty={{
                    backgroundColor: Colors.black,
                    borderRadius: 10,
                    width: "40%",
                  }}
                  buttonColor={Colors.white}
                  btnName="Add Item"
                />

                <Button
                  onClick={() => {
                    navigation.navigate(navigationString.enterLocation, {
                      key: "user",
                    });
                  }}
                  allButtonSty={{
                    alignSelf: "center",
                    width: "40%",
                    borderRadius: 10,
                  }}
                  buttonColor={Colors.black}
                  btnName="Continue"
                />
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default KitFound;

const styles = StyleSheet.create({});
