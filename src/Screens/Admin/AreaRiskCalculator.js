import {
  StyleSheet,
  Text,
  View,
  Modal,
  RefreshControl,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import imagePath from "../../Constant/imagePath";
import Loading from "../../Components/Loading";
import IncidentStyle from "../Incident/IncidentStyle";
import Colors from "../../Styles/Colors";
import TextView from "../../Components/TextView";
import AdminStyle from "./AdminStyle";
import Button from "../../Components/Button";
import navigationString from "../../Navigations/navigationString";
import InputFields from "../../Components/InputFields";
import CustomAlert from "../../Components/CustomAlert";

const AreaRiskCalculator = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnableds, setIsEnableds] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [staffQuantity, setStaffQuantity] = useState("");
  const [areaTotal, setAreaTotal] = useState("");

  const [switchData, setSwitchData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]); // To keep track of the order of selections

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  console.log(route?.params?.item, "-------route params", selectedItems);

  useEffect(() => {
    // Fetch your JSON data here or load it from a file
    const jsonData = {
      Agriculture: {
        check: false,
        text: "",
      },
      Assembly_Work: {
        check: false,
        text: "e.g. production line, joinery etc.",
      },
      Commercial_Catering: {
        check: false,
        text: "e.g. restaurant, employee canteen etc.",
      },
      Construction: {
        check: false,
        text: "",
      },
      Education: {
        check: false,
        text: "e.g. schools, universities, colleges, nurseries, pre-schools etc.",
      },
      Engineering: {
        check: false,
        text: "",
      },
      "Entertainment/Leisure Venue": {
        check: false,
        text: "e.g. Theatre, concert venue, Cinema, sports clubs etc.",
      },
      Food_Processing: {
        check: false,
        text: "e.g. food production line, bakery etc.",
      },
      Forestry: {
        check: false,
        text: "",
      },
      Healthcare: {
        check: false,
        text: "",
      },
      Manufacturing: {
        check: false,
        text: "",
      },
      Retail: {
        check: false,
        text: "e.g. shops, supermarkets, trade merchants etc.",
      },
      "Site Management": {
        check: false,
        text: "e.g. grounds, maintenance etc.",
      },
      Transport: {
        check: false,
        text: "e.g. bus/train station, airport, coach, train etc.",
      },
      Warehouse: {
        check: false,
        text: "",
      },
      // Other: {
      //   check: false,
      //   text: "",
      // },
    };
    // Set the JSON data to state
    setSwitchData(jsonData);
  }, []);

  const lowRisktoggleSwitchItem = (key) => {
    // setSwitchData((prevState) => ({
    //   ...prevState,
    //   [key]: {
    //     ...prevState[key],
    //     check: !prevState[key].check,
    //   },
    // }));

    // setSwitchData((prevState) => {
    //   const selectedCount = Object.values(prevState).filter(
    //     (item) => item.check
    //   ).length;

    //   // Check if the item is already selected or if the count is less than 2
    //   if (prevState[key].check || selectedCount < 2) {
    //     return {
    //       ...prevState,
    //       [key]: {
    //         ...prevState[key],
    //         check: !prevState[key].check,
    //       },
    //     };
    //   }

    //   return prevState; // Return the previous state if not allowed to toggle
    // });

    setSwitchData((prevState) => {
      let newSelectedItems = [...selectedItems];
      let newState = { ...prevState };

      if (prevState[key].check) {
        // If the item is already selected, remove it from the selection order
        newSelectedItems = newSelectedItems.filter((item) => item !== key);
      } else {
        // If the item is not selected, add it to the selection order
        if (newSelectedItems.length >= 2) {
          // Remove the first selected item if we already have 2 selected
          const firstSelectedItem = newSelectedItems.shift();
          newState = {
            ...newState,
            [firstSelectedItem]: {
              ...newState[firstSelectedItem],
              check: false,
            },
          };
        }
        newSelectedItems.push(key);
      }

      // Toggle the selected item
      newState = {
        ...newState,
        [key]: {
          ...newState[key],
          check: !newState[key].check,
        },
      };

      // Update the selection order state
      setSelectedItems(newSelectedItems);

      return newState;
    });

    // const updatedPotential = { ...switchData };

    // // Set the value of the toggled switch to true
    // updatedPotential[key].check = true;

    // // Set the values of all other switches to false
    // Object.keys(updatedPotential).forEach((potentialKey) => {
    //   if (potentialKey !== key) {
    //     updatedPotential[potentialKey].check = false;
    //   }
    // });

    // // Update the state with the new values
    // setSwitchData(updatedPotential);
  };

  const [Potential, setPotential] = useState({
    // Body_Spills: false,
    Biohazards: false,
    Burns: false,
    Chemicals: false,
    // Cutting_Equipment: false,
    "Eye injury": false,
    Heavy_Machinery: false,
    // Plant_Equipment: false,
    // Power_Tools: false,
    "Public Accessibility": false,
    Sharp_Objects: false,
    "Vehicles (including warehouse forklifts)": false,
    // Other: false,
  });

  const toggleSwitchs = (key) => {
    // setPotential((prevSwitches) => ({
    //   ...prevSwitches,
    //   [key]: !prevSwitches[key],
    // }));
    // Create a copy of the Potential state
    const updatedPotential = { ...Potential };

    // Set the value of the toggled switch to true
    updatedPotential[key] = true;

    // Set the values of all other switches to false
    Object.keys(updatedPotential).forEach((potentialKey) => {
      if (potentialKey !== key) {
        updatedPotential[potentialKey] = false;
      }
    });

    // Update the state with the new values
    setPotential(updatedPotential);
  };

  // Function to format the switch name
  const formatSwitchName = (name) => {
    // Replace underscores with spaces
    return name.replace(/_/g, " ");
  };

  const staffData = [
    {
      id: "1",
      name: "Security Staff",
      number: "Security",
    },
    {
      id: "2",
      name: "Cleaners",
      number: "Cleaners",
    },
    {
      id: "3",
      name: "First Aiders",
      number: "First Aiders",
    },
  ];

  const findTrueItem = (obj) => {
    for (let key in obj) {
      if (obj[key] === true) {
        return key;
      }
    }
    return null; // If no item is true
  };
  const trueItem = findTrueItem(Potential);
  console.log(switchData, "true Item ----", trueItem);

  const [inputValues, setInputValues] = useState({});

  // const handleTextChange = (name, text) => {
  //   setInputValues((prevState) => ({
  //     ...prevState,
  //     [name]: text,
  //   }));
  // };
  const handleTextChange = (name, text) => {
    setInputValues((prevState) => {
      if (text.trim() === "") {
        // Create a copy of the current state without the key if the text is empty
        const { [name]: _, ...rest } = prevState;
        return rest;
      }
      return {
        ...prevState,
        [name]: text,
      };
    });
  };
  // Initialize state with default values from staffData
  // const [inputValues, setInputValues] = useState(
  //   staffData.reduce((acc, item) => {
  //     acc[item.id] = item.name;
  //     return acc;
  //   }, {})
  // );

  // const handleTextChange = (id, text) => {
  //   setInputValues((prevState) => ({
  //     ...prevState,
  //     [id]: text,
  //   }));
  // };

  console.log("inputValues---", inputValues);
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoading}>
        <Loading />
      </Modal>
      <CustomAlert
        visible={showAlert}
        message={alertMessage} // Pass the dynamic message
        onClose={handleCloseAlert}
      />
      <Header
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack({ areaRisk: "areaRisk" })}
      />

      <View style={{ flex: 1 }}>
        {/* Green section */}
        <TextView
          heading
          headingTextSty={{
            ...IncidentStyle.headingContainer,
            marginBottom: 20,
          }}>
          {route.params?.item?.area} Risk {"\n"} Calculator
        </TextView>

        {/* Rest of the content */}
        <View style={IncidentStyle.buttonContainer}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                // onRefresh={handleRefresh}
                colors={[Colors.primary]} // Customize the colors of the refresh indicator
              />
            }
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={true}>
            <View style={{ paddingHorizontal: 20 }}>
              <TextView
                textSty={{ fontSize: 14, lineHeight: 21, marginVertical: 25 }}>
                Please ensure all questions are accurately answered as
                inaccuracies could result in safety kits being inadequately
                prepared.
              </TextView>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 0,
                }}>
                Area Personnel
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.65 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Maximum Employees
                  </TextView>
                  <TextView
                    heading
                    headingTextSty={{ fontSize: 8, lineHeight: 12 }}>
                    The highest possible number of your team who frequents this
                    area.
                  </TextView>
                </View>
                <View
                  style={{
                    flex: 0.35,

                    // alignItems: "flex-end",
                  }}>
                  {/* <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Staff Quantity
                  </TextView> */}

                  <InputFields
                    placeholder={"Staff Quantity"}
                    keyboardType="numeric"
                    value={staffQuantity}
                    onChangeText={(e) => setStaffQuantity(e)}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.65 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Total Personnel
                  </TextView>
                  <TextView
                    heading
                    headingTextSty={{ fontSize: 8, lineHeight: 12 }}>
                    Everyone including employees, customers, visitors, couriers,
                    the public, etc.
                  </TextView>
                </View>
                <View
                  style={{
                    flex: 0.35,
                    // alignItems: "flex-end",
                  }}>
                  {/* <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Area Total
                  </TextView> */}
                  <InputFields
                    placeholder={"Area Total"}
                    keyboardType="numeric"
                    value={areaTotal}
                    onChangeText={(e) => setAreaTotal(e)}
                  />
                </View>
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 25,
                }}>
                Activities Performed in Area
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              {/* <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 15,
                }}>
                Select all that apply.
              </TextView> */}

              <View style={{}}>
                {Object.keys(switchData).map((key) => {
                  console.log(switchData[key], "select -key -", key);
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 15,
                      }}>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor:
                            switchData[key].check === true
                              ? Colors.secondary
                              : Colors.white,

                          // elevation: 0.01,
                          borderColor: Colors.lightgray,
                          borderWidth: 0.7,
                          borderRadius: 20,
                        }}>
                        <Switch
                          thumbColor={"#ffffff"}
                          trackColor={{
                            true: Colors.secondary,
                            false: Colors.white,
                          }}
                          value={switchData[key].check}
                          onValueChange={() => lowRisktoggleSwitchItem(key)}
                        />
                      </View>
                      <View marginLeft={5}>
                        <Text
                          style={{
                            fontWeight: "400",
                            fontSize: 14,
                            lineHeight: 21,
                            color: Colors.black,
                          }}>
                          {formatSwitchName(key)}
                        </Text>
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 8,
                            lineHeight: 12,
                            fontFamily: "OpenSans-Bold",
                            color: "#A8A8BD",
                          }}>
                          {switchData[key].text}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 25,
                }}>
                Potential Risks
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              {/* <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 15,
                }}>
                Select all that apply.
              </TextView> */}

              <View style={{}}>
                {Object.keys(Potential).map((key) => {
                  console.log("select -key -", key);
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 15,
                      }}>
                      <View
                        style={{
                          alignSelf: "flex-start",
                          backgroundColor:
                            Potential[key] == false
                              ? Colors.white
                              : Colors.secondary,

                          // elevation: 0.01,
                          borderColor: Colors.lightgray,
                          borderWidth: 0.7,
                          borderRadius: 20,
                        }}>
                        <Switch
                          thumbColor={"#ffffff"}
                          trackColor={{
                            true: Colors.secondary,
                            false: Colors.white,
                          }}
                          value={Potential[key]}
                          onValueChange={() => toggleSwitchs(key)}
                        />
                      </View>
                      <TextView
                        textSty={{
                          marginLeft: 5,
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {formatSwitchName(key)}
                      </TextView>
                    </View>
                  );
                })}
              </View>
              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 35,
                }}>
                AED
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor:
                      isEnabled == false ? Colors.white : Colors.secondary,
                    borderColor: Colors.lightgray,
                    borderWidth: 0.7,
                    borderRadius: 20,
                  }}>
                  <Switch
                    trackColor={{
                      false: Colors.white,
                      true: Colors.secondary,
                    }}
                    thumbColor={Colors.white}
                    onValueChange={() => setIsEnabled(!isEnabled)}
                    value={isEnabled}
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                <View marginLeft={5} flex={1}>
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: 14,
                      lineHeight: 21,
                      color: Colors.black,
                    }}>
                    Can you access an AED within 2 minutes?
                  </Text>
                  <Text
                    style={{
                      fontWeight: "700",
                      fontSize: 8,
                      lineHeight: 12,
                      fontFamily: "OpenSans-Bold",
                      color: "#A8A8BD",
                    }}>
                    Consider public access AEDs
                  </Text>
                </View>
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 35,
                }}>
                Evacuation Chair
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 15,
                }}>
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor:
                      isEnableds == false ? Colors.white : Colors.secondary,
                    borderColor: Colors.lightgray,
                    borderWidth: 0.7,
                    borderRadius: 20,
                  }}>
                  <Switch
                    trackColor={{
                      false: Colors.white,
                      true: Colors.secondary,
                    }}
                    thumbColor={Colors.white}
                    onValueChange={() => setIsEnableds(!isEnableds)}
                    value={isEnableds}
                    style={{
                      transform: [{ scaleX: 1 }, { scaleY: 1 }],
                    }}
                  />
                </View>
                <View flex={1}>
                  <TextView
                    textSty={{
                      marginLeft: 5,
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Do you have stairs anywhere in your building?
                  </TextView>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 15,
                  flex: 1,
                }}>
                <View style={{ flex: 0.7 }}>
                  <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    If yes, how many sets of stairs are in your building?
                  </TextView>
                </View>
                <View style={{ flex: 0.3 }}>
                  {/* <TextView
                    textSty={{
                      fontSize: 14,
                      lineHeight: 21,
                    }}>
                    Area Total
                  </TextView> */}
                  <InputFields
                    placeholder={"Area Total"}
                    keyboardType="numeric"
                    editDisabled={isEnableds ? true : false}
                    textInputFocused={{ marginTop: 0 }}
                    textInput={{ marginTop: 0 }}
                  />
                </View>
              </View>

              <TextView
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 35,
                }}>
                Auxiliary Staff
              </TextView>

              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />
              <TextView
                textSty={{
                  fontSize: 14,
                  lineHeight: 21,
                  marginTop: 10,
                }}>
                Please enter the number of
              </TextView>

              {staffData.map((item) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 15,
                      flex: 1,
                    }}>
                    <View style={{ flex: 0.7 }}>
                      <TextView
                        textSty={{
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {item?.name}
                      </TextView>
                    </View>
                    <View flex={0.3}>
                      {/* <TextView
                        textSty={{
                          fontSize: 14,
                          lineHeight: 21,
                        }}>
                        {item?.number}
                      </TextView> */}
                      <InputFields
                        placeholder={item?.number}
                        keyboardType="numeric"
                        // editDisabled={isEnableds ? true : false}
                        textInputFocused={{ marginTop: 0 }}
                        textInput={{ marginTop: 0 }}
                        value={inputValues[item.name] || ""}
                        onChangeText={(text) =>
                          handleTextChange(item.name, text)
                        }
                      />
                    </View>
                  </View>
                );
              })}

              <Button
                allButtonSty={{
                  width: "70%",
                  alignSelf: "center",
                  marginVertical: 20,
                }}
                buttonColor={Colors.black}
                btnName="Get Results"
                onClick={() => {
                  pattern = /^\d+$/; // Regular expression to match integer values

                  const highRisk = (obj) => {
                    for (let key in obj) {
                      if (obj[key].check === true) {
                        return key;
                      }
                    }
                    return null; // If no item is true
                  };
                  const highRiskStatus = highRisk(switchData);

                  if (staffQuantity === "") {
                    return handleShowAlert("Staff quantity is required.");
                  }
                  if (isNaN(staffQuantity) || !pattern.test(staffQuantity)) {
                    setStaffQuantity(staffQuantity);
                    return handleShowAlert(
                      "Staff quantity must be a numeric value."
                    );
                  }
                  if (areaTotal === "") {
                    return handleShowAlert("Total area is required.");
                  }
                  if (highRiskStatus == null) {
                    return handleShowAlert("Select activities performed area.");
                  }

                  navigation.navigate(navigationString.areaRiskCalculator2, {
                    maxQuantity: staffQuantity,
                    areaTotal: areaTotal,
                    potential: Potential, // Pass the updated Potential state
                    switchData: switchData,
                    item: route?.params?.item,
                    AED: isEnabled === true ? "AED" : "",
                    Evacuation_Chair:
                      isEnableds === true ? "Evacuation Chair" : "",
                    lowRisk: selectedItems,
                    auxiliaryStaff: inputValues,
                  });
                  //   setManageLocationScreens("Risk_Assessment");
                  //   dispatch(NewLocation({ New_Location: "Risk Assessment" }));
                  //   dispatch(addCompInfoVal("aa"));
                }}></Button>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AreaRiskCalculator;

const styles = StyleSheet.create({});

// import {
//   StyleSheet,
//   Text,
//   View,
//   Modal,
//   RefreshControl,
//   ScrollView,
//   Switch,
//   SafeAreaView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import Header from "../../Components/Header";
// import imagePath from "../../Constant/imagePath";
// import Loading from "../../Components/Loading";
// import IncidentStyle from "../Incident/IncidentStyle";
// import Colors from "../../Styles/Colors";
// import TextView from "../../Components/TextView";
// import AdminStyle from "./AdminStyle";
// import Button from "../../Components/Button";
// import navigationString from "../../Navigations/navigationString";
// import InputFields from "../../Components/InputFields";
// import CustomAlert from "../../Components/CustomAlert";

// const AreaRiskCalculator = ({ navigation, route }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEnabled, setIsEnabled] = useState(false);
//   const [isEnableds, setIsEnableds] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const [staffQuantity, setStaffQuantity] = useState("");
//   const [areaTotal, setAreaTotal] = useState("");

//   const [switchData, setSwitchData] = useState({});
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   const handleShowAlert = (message) => {
//     setAlertMessage(message); // Set the dynamic message
//     setShowAlert(true);
//   };

//   const handleCloseAlert = () => {
//     setShowAlert(false);
//   };

//   console.log(route?.params?.item, "-------route params");

//   useEffect(() => {
//     // Fetch your JSON data here or load it from a file
//     const jsonData = {
//       Agriculture: {
//         check: false,
//         text: "",
//       },
//       Assembly_Work: {
//         check: false,
//         text: "e.g. production line, joinery etc.",
//       },
//       Commercial_Catering: {
//         check: false,
//         text: "e.g. restaurant, employee canteen etc.",
//       },
//       Construction: {
//         check: false,
//         text: "",
//       },
//       Education: {
//         check: false,
//         text: "e.g. schools, universities, colleges, nurseries, pre-schools etc.",
//       },
//       Engineering: {
//         check: false,
//         text: "",
//       },
//       "Entertainment/Leisure Venue": {
//         check: false,
//         text: "e.g. Theatre, concert venue, Cinema, sports clubs etc.",
//       },
//       Food_Processing: {
//         check: false,
//         text: "e.g. food production line, bakery etc.",
//       },
//       Forestry: {
//         check: false,
//         text: "",
//       },
//       Healthcare: {
//         check: false,
//         text: "",
//       },
//       Manufacturing: {
//         check: false,
//         text: "",
//       },
//       Retail: {
//         check: false,
//         text: "e.g. shops, supermarkets, trade merchants etc.",
//       },
//       "Site Management": {
//         check: false,
//         text: "e.g. grounds, maintenance etc.",
//       },
//       Transport: {
//         check: false,
//         text: "e.g. bus/train station, airport, coach, train etc.",
//       },
//       Warehouse: {
//         check: false,
//         text: "",
//       },
//       Other: {
//         check: false,
//         text: "",
//       },
//     };
//     // Set the JSON data to state
//     setSwitchData(jsonData);
//   }, []);
//   const toggleSwitchItem = (key) => {
//     setSwitchData((prevState) => ({
//       ...prevState,
//       [key]: {
//         ...prevState[key],
//         check: !prevState[key].check,
//       },
//     }));
//   };

//   const [Potential, setPotential] = useState({
//     Body_Spills: false,
//     Burns: false,
//     Chemicals: false,
//     Cutting_Equipment: false,
//     Heavy_Machinery: false,
//     Plant_Equipment: false,
//     Power_Tools: false,
//     Sharp_Objects: false,
//     "Vehicles (including warehouse forklifts)": false,
//     Other: false,
//   });

//   const toggleSwitchs = (key) => {
//     setPotential((prevSwitches) => ({
//       ...prevSwitches,
//       [key]: !prevSwitches[key],
//     }));
//   };

//   // Function to format the switch name
//   const formatSwitchName = (name) => {
//     // Replace underscores with spaces
//     return name.replace(/_/g, " ");
//   };

//   const staffData = [
//     {
//       id: "1",
//       name: "Security Staff",
//       number: "Security",
//     },
//     {
//       id: "2",
//       name: "Cleaners",
//       number: "Cleaners",
//     },
//     {
//       id: "3",
//       name: "First Aiders",
//       number: "First Aiders",
//     },
//   ];

//   const findTrueItem = (obj) => {
//     for (let key in obj) {
//       if (obj[key] === true) {
//         return key;
//       }
//     }
//     return null; // If no item is true
//   };
//   const trueItem = findTrueItem(Potential);
//   console.log("true Item ----", trueItem);
//   const [switchValue, setSwitchValue] = useState(false);

//   const toggleSwitch = (value) => {
//     //To handle switch toggle
//     setSwitchValue(value);
//     //State changes according to switch
//   };

//   return (
//     <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
//       <Modal animated={true} transparent={true} visible={isLoading}>
//         <Loading />
//       </Modal>
//       <CustomAlert
//         visible={showAlert}
//         message={alertMessage} // Pass the dynamic message
//         onClose={handleCloseAlert}
//       />
//       <Header
//         backIcon={imagePath.backArrow}
//         editHeader={() => navigation.goBack({ areaRisk: "areaRisk" })}
//       />

//       <View style={{ flex: 1 }}>
//         {/* Green section */}
//         <TextView
//           heading
//           headingTextSty={{
//             ...IncidentStyle.headingContainer,
//             marginBottom: 20,
//           }}>
//           {route.params?.item?.area} Risk {"\n"} Calculator
//         </TextView>

//         {/* Rest of the content */}
//         <View style={IncidentStyle.buttonContainer}>
//           <ScrollView
//             refreshControl={
//               <RefreshControl
//                 refreshing={isRefreshing}
//                 // onRefresh={handleRefresh}
//                 colors={[Colors.primary]} // Customize the colors of the refresh indicator
//               />
//             }
//             showsVerticalScrollIndicator={false}
//             automaticallyAdjustKeyboardInsets={true}>
//             <View style={{ paddingHorizontal: 20 }}>
//               <TextView
//                 textSty={{ fontSize: 14, lineHeight: 21, marginVertical: 25 }}>
//                 Please ensure all questions are accurately answered as
//                 inaccuracies could result in safety kits being inadequately
//                 prepared.
//               </TextView>

//               <TextView
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 0,
//                 }}>
//                 Area Personnel
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />

//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginTop: 15,
//                   flex: 1,
//                 }}>
//                 <View style={{ flex: 0.65 }}>
//                   <TextView
//                     textSty={{
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     Maximum Employees
//                   </TextView>
//                   <TextView
//                     heading
//                     headingTextSty={{ fontSize: 8, lineHeight: 12 }}>
//                     The highest possible number of your team who frequents this
//                     area.
//                   </TextView>
//                 </View>
//                 <View
//                   style={{
//                     flex: 0.35,

//                     // alignItems: "flex-end",
//                   }}>
//                   {/* <TextView
//                     textSty={{
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     Staff Quantity
//                   </TextView> */}

//                   <InputFields
//                     placeholder={"Staff Quantity"}
//                     keyboardType="numeric"
//                     value={staffQuantity}
//                     onChangeText={(e) => setStaffQuantity(e)}
//                   />
//                 </View>
//               </View>

//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginTop: 15,
//                   flex: 1,
//                 }}>
//                 <View style={{ flex: 0.65 }}>
//                   <TextView
//                     textSty={{
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     Total Personnel
//                   </TextView>
//                   <TextView
//                     heading
//                     headingTextSty={{ fontSize: 8, lineHeight: 12 }}>
//                     Everyone including employees, customers, visitors, couriers,
//                     the public, etc.
//                   </TextView>
//                 </View>
//                 <View
//                   style={{
//                     flex: 0.35,
//                     // alignItems: "flex-end",
//                   }}>
//                   {/* <TextView
//                     textSty={{
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     Area Total
//                   </TextView> */}
//                   <InputFields
//                     placeholder={"Area Total"}
//                     keyboardType="numeric"
//                     value={areaTotal}
//                     onChangeText={(e) => setAreaTotal(e)}
//                   />
//                 </View>
//               </View>

//               <TextView
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 25,
//                 }}>
//                 Activities Performed in Area
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />

//               <TextView
//                 textSty={{
//                   fontSize: 14,
//                   lineHeight: 21,
//                   marginTop: 15,
//                 }}>
//                 Select all that apply.
//               </TextView>

//               <View style={{}}>
//                 {Object.keys(switchData).map((key) => {
//                   console.log("select -key -", key);
//                   return (
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginTop: 15,
//                       }}>
//                       <View
//                         style={{
//                           alignSelf: "flex-start",
//                           backgroundColor:
//                             switchData[key].check === true
//                               ? Colors.secondary
//                               : Colors.white,

//                           // elevation: 0.01,
//                           borderColor: Colors.lightgray,
//                           borderWidth: 0.7,
//                           borderRadius: 20,
//                         }}>
//                         <Switch
//                           thumbColor={"#ffffff"}
//                           trackColor={{
//                             true: Colors.secondary,
//                             false: Colors.white,
//                           }}
//                           value={switchData[key].check}
//                           onValueChange={() => toggleSwitchItem(key)}
//                         />
//                       </View>
//                       <View marginLeft={5}>
//                         <Text
//                           style={{
//                             fontWeight: "400",
//                             fontSize: 14,
//                             lineHeight: 21,
//                             color: Colors.black,
//                           }}>
//                           {formatSwitchName(key)}
//                         </Text>
//                         <Text
//                           style={{
//                             fontWeight: "700",
//                             fontSize: 8,
//                             lineHeight: 12,
//                             fontFamily: "OpenSans-Bold",
//                             color: "#A8A8BD",
//                           }}>
//                           {switchData[key].text}
//                         </Text>
//                       </View>
//                     </View>
//                   );
//                 })}
//               </View>

//               <TextView
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 25,
//                 }}>
//                 Potential Risks
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />

//               <TextView
//                 textSty={{
//                   fontSize: 14,
//                   lineHeight: 21,
//                   marginTop: 15,
//                 }}>
//                 Select all that apply.
//               </TextView>

//               <View style={{}}>
//                 {Object.keys(Potential).map((key) => {
//                   console.log("select -key -", key);
//                   return (
//                     <View
//                       style={{
//                         flexDirection: "row",
//                         alignItems: "center",
//                         marginTop: 15,
//                       }}>
//                       <View
//                         style={{
//                           alignSelf: "flex-start",
//                           backgroundColor:
//                             Potential[key] == false
//                               ? Colors.white
//                               : Colors.secondary,

//                           // elevation: 0.01,
//                           borderColor: Colors.lightgray,
//                           borderWidth: 0.7,
//                           borderRadius: 20,
//                         }}>
//                         <Switch
//                           thumbColor={"#ffffff"}
//                           trackColor={{
//                             true: Colors.secondary,
//                             false: Colors.white,
//                           }}
//                           value={Potential[key]}
//                           onValueChange={() => toggleSwitchs(key)}
//                         />
//                       </View>
//                       <TextView
//                         textSty={{
//                           marginLeft: 5,
//                           fontSize: 14,
//                           lineHeight: 21,
//                         }}>
//                         {formatSwitchName(key)}
//                       </TextView>
//                     </View>
//                   );
//                 })}
//               </View>
//               <TextView
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 35,
//                 }}>
//                 AED
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />

//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginTop: 15,
//                 }}>
//                 <View
//                   style={{
//                     alignSelf: "flex-start",
//                     backgroundColor:
//                       isEnabled == false ? Colors.white : Colors.secondary,
//                     borderColor: Colors.lightgray,
//                     borderWidth: 0.7,
//                     borderRadius: 20,
//                   }}>
//                   <Switch
//                     trackColor={{
//                       false: Colors.white,
//                       true: Colors.secondary,
//                     }}
//                     thumbColor={Colors.white}
//                     onValueChange={() => setIsEnabled(!isEnabled)}
//                     value={isEnabled}
//                     style={{
//                       transform: [{ scaleX: 1 }, { scaleY: 1 }],
//                     }}
//                   />
//                 </View>
//                 <View marginLeft={5} flex={1}>
//                   <Text
//                     style={{
//                       fontWeight: "400",
//                       fontSize: 14,
//                       lineHeight: 21,
//                       color: Colors.black,
//                     }}>
//                     Can you access an AED within 2 minutes?
//                   </Text>
//                   <Text
//                     style={{
//                       fontWeight: "700",
//                       fontSize: 8,
//                       lineHeight: 12,
//                       fontFamily: "OpenSans-Bold",
//                       color: "#A8A8BD",
//                     }}>
//                     Consider public access AEDs
//                   </Text>
//                 </View>
//               </View>

//               <TextView
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 35,
//                 }}>
//                 Evacuation Chair
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginTop: 15,
//                 }}>
//                 <View
//                   style={{
//                     alignSelf: "flex-start",
//                     backgroundColor:
//                       isEnableds == false ? Colors.white : Colors.secondary,
//                     borderColor: Colors.lightgray,
//                     borderWidth: 0.7,
//                     borderRadius: 20,
//                   }}>
//                   <Switch
//                     trackColor={{
//                       false: Colors.white,
//                       true: Colors.secondary,
//                     }}
//                     thumbColor={Colors.white}
//                     onValueChange={() => setIsEnableds(!isEnableds)}
//                     value={isEnableds}
//                     style={{
//                       transform: [{ scaleX: 1 }, { scaleY: 1 }],
//                     }}
//                   />
//                 </View>
//                 <View flex={1}>
//                   <TextView
//                     textSty={{
//                       marginLeft: 5,
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     Do you have stairs anywhere in your building?
//                   </TextView>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                   marginTop: 15,
//                   flex: 1,
//                 }}>
//                 <View style={{ flex: 0.7 }}>
//                   <TextView
//                     textSty={{
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     If yes, how many sets of stairs are in your building?
//                   </TextView>
//                 </View>
//                 <View style={{ flex: 0.3 }}>
//                   {/* <TextView
//                     textSty={{
//                       fontSize: 14,
//                       lineHeight: 21,
//                     }}>
//                     Area Total
//                   </TextView> */}
//                   <InputFields
//                     placeholder={"Area Total"}
//                     keyboardType="numeric"
//                     editDisabled={isEnableds ? true : false}
//                     textInputFocused={{ marginTop: 0 }}
//                     textInput={{ marginTop: 0 }}
//                   />
//                 </View>
//               </View>

//               <TextView
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 35,
//                 }}>
//                 Auxiliary Staff
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />
//               <TextView
//                 textSty={{
//                   fontSize: 14,
//                   lineHeight: 21,
//                   marginTop: 10,
//                 }}>
//                 Please enter the number of
//               </TextView>

//               {staffData.map((item) => {
//                 return (
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginTop: 15,
//                       flex: 1,
//                     }}>
//                     <View style={{ flex: 0.7 }}>
//                       <TextView
//                         textSty={{
//                           fontSize: 14,
//                           lineHeight: 21,
//                         }}>
//                         {item?.name}
//                       </TextView>
//                     </View>
//                     <View flex={0.3}>
//                       {/* <TextView
//                         textSty={{
//                           fontSize: 14,
//                           lineHeight: 21,
//                         }}>
//                         {item?.number}
//                       </TextView> */}
//                       <InputFields
//                         placeholder={item?.number}
//                         keyboardType="numeric"
//                         // editDisabled={isEnableds ? true : false}
//                         textInputFocused={{ marginTop: 0 }}
//                         textInput={{ marginTop: 0 }}
//                       />
//                     </View>
//                   </View>
//                 );
//               })}

//               <Button
//                 allButtonSty={{
//                   width: "70%",
//                   alignSelf: "center",
//                   marginVertical: 20,
//                 }}
//                 buttonColor={Colors.black}
//                 btnName="Get Results"
//                 onClick={() => {
//                   pattern = /^\d+$/; // Regular expression to match integer values
//                   if (staffQuantity === "") {
//                     return handleShowAlert("Staff quantity is required.");
//                   }
//                   if (isNaN(staffQuantity) || !pattern.test(staffQuantity)) {
//                     setStaffQuantity(staffQuantity);
//                     return handleShowAlert(
//                       "Staff quantity must be a numeric value."
//                     );
//                   }
//                   if (areaTotal === "") {
//                     return handleShowAlert("Total area is required.");
//                   }

//                   navigation.navigate(navigationString.areaRiskCalculator2, {
//                     maxQuantity: staffQuantity,
//                     areaTotal: areaTotal,
//                     potential: Potential, // Pass the updated Potential state
//                     switchData: switchData,
//                     item: route?.params?.item,
//                   });
//                   //   setManageLocationScreens("Risk_Assessment");
//                   //   dispatch(NewLocation({ New_Location: "Risk Assessment" }));
//                   //   dispatch(addCompInfoVal("aa"));
//                 }}></Button>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default AreaRiskCalculator;

// const inline_styles = StyleSheet.create({
//   switchEnableBorder: {
//     borderColor: "red",
//     borderWidth: 15,
//   },

//   switchDisableBorder: {
//     borderColor: "red",
//     borderWidth: 1,
//   },
// });