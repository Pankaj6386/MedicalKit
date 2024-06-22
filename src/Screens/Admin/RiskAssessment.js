import {
  Image,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AdminStyle from "./AdminStyle";
import TextView from "../../Components/TextView";
import Colors from "../../Styles/Colors";
import {
  moderateScale,
  moderateScaleVertical,
} from "../../Styles/responsiveSize";
import Loading from "../../Components/Loading";
import navigationString from "../../Navigations/navigationString";
import { call_KisStatus_API } from "../../redux/action/ManageKits";
import { useDispatch } from "react-redux";

const RiskAssessment = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoadings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [LeicesterDates, setLeicesterDate] = useState([]);

  const productNames = [1, 2, 3];
  const productName4 = [1, 2, 3, 4];

  useEffect(() => {
    kitDetails();
  }, []);

  console.log("LeicesterDates---Risk ass--", JSON.stringify(LeicesterDates));

  // call Kist status details api
  const kitDetails = () => {
    setIsLoadings(true);
    dispatch(call_KisStatus_API())
      .then((res) => {
        console.log("999", JSON.stringify(res.payload));
        if (res.payload.status === 200) {
          setIsLoadings(false);
          setLeicesterDate(res.payload.locations);
        } else {
          setIsLoadings(false);
          console.log("err ", res.payload.message);
        }
      })
      .catch((err) => {
        setIsLoadings(false);
        console.log(err);
      });
  };

  const handleRefresh = () => {
    // Set refreshing state to true
    setIsRefreshing(true);
    kitDetails();
    setIsRefreshing(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 2,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary]} // Customize the colors of the refresh indicator
          />
        }>
        <Modal animated={true} transparent={true} visible={isLoading}>
          <Loading />
        </Modal>
        <View
          style={{
            paddingHorizontal: moderateScale(20),
            marginTop: moderateScaleVertical(10),
          }}>
          <TextView heading headingTextSty={AdminStyle.generateQuote}>
            All Areas Identified In The Business
          </TextView>
          {LeicesterDates?.map((item, ind) => {
            console.log("item,----", item);
            return (
              <View>
                <TextView
                  heading
                  headingTextSty={{
                    ...AdminStyle.generateQuote,
                    textAlign: "left",
                  }}>
                  {/* [Location Name] */}
                  {item?.name}
                </TextView>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.blackOpacity10,
                    marginTop: 1,
                  }}
                />
                {item?.kits?.map((areaStatus, index) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 15,
                        padding: 10,
                        backgroundColor:
                          index % 2 == 0 ? null : Colors.greenLightTint,
                      }}>
                      <TextView
                        heading
                        headingTextSty={{
                          ...AdminStyle.generateQuote,
                          marginVertical: 0,
                          textAlign: "left",
                        }}>
                        {areaStatus.area}
                      </TextView>
                      <TextView
                        textSty={{
                          color: Colors.primary,
                          marginTop:
                            Platform.OS === "android" &&
                            areaStatus.is_assessment === false &&
                            15,
                        }}>
                        {areaStatus.is_assessment === true ? (
                          "Assessment Completed"
                        ) : (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate(
                                navigationString.areaRiskCalculator,
                                { item: areaStatus }
                              )
                            }
                            activeOpacity={0.7}
                            style={AdminStyle.startButton}>
                            <TextView
                              heading
                              headingTextSty={{
                                ...AdminStyle.generateQuote,
                                marginVertical: 0,
                              }}>
                              Start
                            </TextView>
                          </TouchableOpacity>
                        )}
                      </TextView>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default RiskAssessment;

const styles = StyleSheet.create({
  topRow: {},
});
