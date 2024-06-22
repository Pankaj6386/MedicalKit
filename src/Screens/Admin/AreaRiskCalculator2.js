//if highRiskStatus===null then select low risk toggle, else heigh risk toggle
import {
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "../../Styles/Colors";
import Loading from "../../Components/Loading";

import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import IncidentStyle from "../Incident/IncidentStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { useDispatch } from "react-redux";
import {
  call_get_kit_pictures,
  call_update_risk_assessment,
} from "../../redux/action/AdminAction";
import navigationString from "../../Navigations/navigationString";
import InputFields from "../../Components/InputFields";
import CustomAlert from "../../Components/CustomAlert";
import index from "../..";

const AreaRiskCalculator2 = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [isLoadings, setisLoadings] = useState(false);
  const [kitPictures, setKitPictures] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [evacuation, setEvacuation] = useState([]);
  const [aed, setAED] = useState([]);

  const handleShowAlert = (message) => {
    setAlertMessage(message); // Set the dynamic message
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  console.log("---route params----", route.params);
  const highRisk = (obj) => {
    for (let key in obj) {
      if (obj[key] === true) {
        return key;
      }
    }
    return null; // If no item is true
  };
  const highRiskStatus = highRisk(route.params?.potential);

  const highfewer5KitsName = () => {
    //for group 1
    const safetyItems = [];
    if (
      (lowRiskStatus[0] === "Commercial_Catering" ||
        lowRiskStatus[0] === "Education" ||
        lowRiskStatus[0] === "Retail") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (
        highRiskStatus !== "Vehicles (including warehouse forklifts)" &&
        Object.keys(route?.params?.auxiliaryStaff).length === 0 &&
        (route.params.maxQuantity <= 3 ||
          route.params.maxQuantity <= 8 ||
          route.params.maxQuantity <= 16)
      ) {
        safetyItems.push({
          name: "1 x BS8599-1 Small Workplace First Aid Kit in Green Aura3 Box- 330 ",
          code: "330",
        });
      }
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "1 x BS8599-1 Small Workplace First Aid Kit in Green Aura3 Box- 330 ",
          code: "330",
        });
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
    //for group 2
    if (
      (lowRiskStatus[0] === "Manufacturing" ||
        lowRiskStatus[0] === "Construction" ||
        lowRiskStatus[0] === "Warehouse" ||
        lowRiskStatus[0] === "Assembly_Work" ||
        lowRiskStatus[0] === "Engineering" ||
        lowRiskStatus[0] === "Food_Processing" ||
        lowRiskStatus[0] === "Transport") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (
        highRiskStatus !== "Vehicles (including warehouse forklifts)" &&
        Object.keys(route?.params?.auxiliaryStaff).length === 0 &&
        (route.params.maxQuantity <= 3 ||
          route.params.maxQuantity <= 8 ||
          route.params.maxQuantity <= 16)
      ) {
        safetyItems.push({
          name: "1 x BS8599-1 Small Workplace First Aid Kit (New Box - Titan)- 366",
          code: "366",
        });
      }
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "1 x BS8599-1 Small Workplace First Aid Kit (New Box - Titan)- 366",
          code: "366",
        });
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }

      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x  BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Deluxe Eyewash Station complete In Small Titan Box -955",
          code: "955",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
    //for group 3
    if (
      lowRiskStatus[0] === "Entertainment/Leisure Venue" &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
    //for group 4
    if (
      (lowRiskStatus[0] === "Healthcare" ||
        lowRiskStatus[0] === "Agriculture" ||
        lowRiskStatus[0] === "Site Management" ||
        lowRiskStatus[0] === "Forestry") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
  };

  const highfewer25KitsName = () => {
    const safetyItems = [];
    //for group 1
    if (
      (lowRiskStatus[0] === "Commercial_Catering" ||
        lowRiskStatus[0] === "Education" ||
        lowRiskStatus[0] === "Retail") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (
        highRiskStatus !== "Vehicles (including warehouse forklifts)" &&
        Object.keys(route?.params?.auxiliaryStaff).length === 0 &&
        (route.params.maxQuantity <= 3 ||
          route.params.maxQuantity <= 8 ||
          route.params.maxQuantity <= 16 ||
          route.params.maxQuantity <= 24)
      ) {
        safetyItems.push({
          name: "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343",
          code: "343",
        });
      }
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        if (highRiskStatus !== "Vehicles (including warehouse forklifts)") {
          safetyItems.push({
            name: "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343",
            code: "343",
          });
        }
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }

      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x  BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        } else {
          safetyItems.push({
            name: "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343",
            code: "343",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }
      return safetyItems;
    }
    // if (
    //   lowRiskStatus === "Commercial_Catering" ||
    //   lowRiskStatus === "Education" ||
    //   lowRiskStatus === "Retail"
    // ) {
    //   return "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343";
    // }
    //for group 2
    if (
      (lowRiskStatus[0] === "Manufacturing" ||
        lowRiskStatus[0] === "Construction" ||
        lowRiskStatus[0] === "Warehouse" ||
        lowRiskStatus[0] === "Assembly_Work" ||
        lowRiskStatus[0] === "Engineering" ||
        lowRiskStatus[0] === "Food_Processing" ||
        lowRiskStatus[0] === "Transport") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (
        highRiskStatus !== "Vehicles (including warehouse forklifts)" &&
        Object.keys(route?.params?.auxiliaryStaff).length === 0 &&
        (route.params.maxQuantity <= 3 ||
          route.params.maxQuantity <= 8 ||
          route.params.maxQuantity <= 16 ||
          route.params.maxQuantity <= 24)
      ) {
        safetyItems.push({
          name: "1 x BS8599-1 Medium Workplace First Aid Kit (New Box - Titan) - 380",
          code: "380",
        });
      }
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        if (highRiskStatus !== "Vehicles (including warehouse forklifts)") {
          safetyItems.push({
            name: "1 x BS8599-1 Medium Workplace First Aid Kit (New Box - Titan) - 380",
            code: "380",
          });
        }
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x  BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Deluxe Eyewash Station complete In Small Titan Box -955",
          code: "955",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        } else {
          safetyItems.push({
            name: "1 x BS8599-1 Medium Workplace First Aid Kit (New Box - Titan) - 380",
            code: "380",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }
      return safetyItems;
    }

    //for group 3
    if (
      lowRiskStatus[0] === "Entertainment/Leisure Venue" &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
    //for group 4
    if (
      (lowRiskStatus[0] === "Healthcare" ||
        lowRiskStatus[0] === "Agriculture" ||
        lowRiskStatus[0] === "Site Management" ||
        lowRiskStatus[0] === "Forestry") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns Kit in Compact Aura Box (2030)",
          code: "2030",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "ADD 1 x Reliance Sharps Kit 2 Application in Large Compact Aura  -2721",
          code: "2721",
        });
      } else if (highRiskStatus == "Biohazards") {
        safetyItems.push({
          name: "ADD 1 x Reliance 2 Application Body Fluid Clean-up Kit in Yellow Aura3 Box- 2717",
          code: "2717",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
  };

  const highMorethan50KitsName = () => {
    const safetyItems = [];
    //for group 1
    if (
      (lowRiskStatus[0] === "Commercial_Catering" ||
        lowRiskStatus[0] === "Education" ||
        lowRiskStatus[0] === "Retail") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      safetyItems.push({
        name: "1 x BS8599-1 Large Workplace Kit in Green Aura3 Box- 348",
        code: "348",
      });
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        // if (highRiskStatus !== "Vehicles (including warehouse forklifts)") {
        //   safetyItems.push({
        //     name: "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343",
        //     code: "343",
        //   });
        // }
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }

      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns First Aid Kit in Orange Aura3 Box (124)",
          code: "124",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x  BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "1 x ADD 5 Application Combination Clean-up Kit in Yellow Aura3 Box- 988",
          code: "988",
        });
      } else if (
        highRiskStatus == "Biohazards" &&
        route.params.maxQuantity >= 24
      ) {
        safetyItems.push({
          name: "ADD 1 x Reliance Bio-Hazard 5 application kit in Aura3 Box - 718",
          code: "718",
          addProduct:
            "ADD 1 x 5 Application Combination Clean-up Kit in Yellow Aura3 Box - 983",
          addProductCode: "983",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }
      return safetyItems;
    }
    //for group 2
    if (
      (lowRiskStatus[0] === "Manufacturing" ||
        lowRiskStatus[0] === "Construction" ||
        lowRiskStatus[0] === "Warehouse" ||
        lowRiskStatus[0] === "Assembly_Work" ||
        lowRiskStatus[0] === "Engineering" ||
        lowRiskStatus[0] === "Food_Processing" ||
        lowRiskStatus[0] === "Transport") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      safetyItems.push({
        name: "1 x BS8599-1 Large Workplace First Aid Kit In Titan Box -384",
        code: "384",
      });
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        // if (highRiskStatus !== "Vehicles (including warehouse forklifts)") {
        //   safetyItems.push({
        //     name: "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343",
        //     code: "343",
        //   });
        // }
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }

      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns First Aid Kit in Orange Aura3 Box (124)",
          code: "124",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        burns =
          "ADD 1 x  BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766";
        safetyItems.push({
          name: "ADD 1 x  BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "124",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Deluxe Eyewash Station complete In Small Titan Box -955",
          code: "955",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "1 x ADD 5 Application Combination Clean-up Kit in Yellow Aura3 Box- 988",
          code: "988",
        });
      } else if (
        highRiskStatus == "Biohazards" &&
        route.params.maxQuantity >= 24
      ) {
        safetyItems.push({
          name: "ADD 1 x Reliance Bio-Hazard 5 application kit in Aura3 Box - 718",
          code: "718",
          addProduct:
            "ADD 1 x 5 Application Combination Clean-up Kit in Yellow Aura3 Box - 983",
          addProductCode: "983",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }
      return safetyItems;
    }
    //for group 3
    if (
      lowRiskStatus[0] === "Entertainment/Leisure Venue" &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns First Aid Kit in Orange Aura3 Box (124)",
          code: "124",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "1 x ADD 5 Application Combination Clean-up Kit in Yellow Aura3 Box- 988",
          code: "988",
        });
      } else if (
        highRiskStatus == "Biohazards" &&
        route.params.maxQuantity >= 24
      ) {
        safetyItems.push({
          name: "ADD 1 x Reliance Bio-Hazard 5 application kit in Aura3 Box - 718",
          code: "718",
          addProduct:
            "ADD 1 x 5 Application Combination Clean-up Kit in Yellow Aura3 Box - 983",
          addProductCode: "983",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
    //for group 4
    if (
      (lowRiskStatus[0] === "Healthcare" ||
        lowRiskStatus[0] === "Agriculture" ||
        lowRiskStatus[0] === "Site Management" ||
        lowRiskStatus[0] === "Forestry") &&
      (highRiskStatus == "Burns" ||
        highRiskStatus == "Heavy_Machinery" ||
        highRiskStatus == "Chemicals" ||
        highRiskStatus == "Eye injury" ||
        highRiskStatus == "Sharp_Objects" ||
        highRiskStatus == "Biohazards" ||
        highRiskStatus == "Vehicles (including warehouse forklifts)" ||
        highRiskStatus == "Public Accessibility" ||
        highRiskStatus == "Body_Spills" ||
        highRiskStatus == "Cutting_Equipment" ||
        highRiskStatus == "Plant_Equipment" ||
        highRiskStatus == "Power_Tools" ||
        highRiskStatus == "Other")
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1: 2019 Critical Injury Pack - in Thigh Bag -6772",
          code: "6772",
        });
      }
      if (highRiskStatus == "Burns") {
        safetyItems.push({
          name: "ADD 1 x Burns First Aid Kit in Orange Aura3 Box (124)",
          code: "124",
        });
      } else if (highRiskStatus == "Heavy_Machinery") {
        safetyItems.push({
          name: "ADD 1 x BS8599-1: 2019 Critical Injury Pack - in Titan Box -6766",
          code: "6766",
        });
      } else if (highRiskStatus == "Chemicals") {
        safetyItems.push({
          name: "ADD 1 x VISION Chemical Splash Station inc Mirror - Complete - 5996",
          code: "5996",
          addProduct:
            "RELIWASH Eye Care Point Complete (2 x Eye Wash/Eye Pads  & Mirror)- 906, ",
          addProductCode: "906",
          addProduct2:
            "RELIWASH Eye Care Pod Station Complete (8 x 20ml pods & 2 eye pads boxed)- 908",
          addProductCode2: "908",
        });
      } else if (highRiskStatus == "Eye injury") {
        safetyItems.push({
          name: "ADD 1 x Double Eye Wash Station in Blue Aura3 Box - Complete-904.",
          code: "904",
        });
      } else if (highRiskStatus == "Sharp_Objects") {
        safetyItems.push({
          name: "1 x ADD 5 Application Combination Clean-up Kit in Yellow Aura3 Box- 988",
          code: "988",
        });
      } else if (
        highRiskStatus == "Biohazards" &&
        route.params.maxQuantity >= 24
      ) {
        safetyItems.push({
          name: "ADD 1 x Reliance Bio-Hazard 5 application kit in Aura3 Box - 718",
          code: "718",
          addProduct:
            "ADD 1 x 5 Application Combination Clean-up Kit in Yellow Aura3 Box - 983",
          addProductCode: "983",
        });
      } else if (highRiskStatus == "Vehicles (including warehouse forklifts)") {
        if (route.params.maxQuantity <= 3) {
          safetyItems.push({
            name: "1 x BS8599-2 Motokit in extra small Aura3- 3010",
            code: "3010",
          });
        } else if (route.params.maxQuantity <= 8) {
          safetyItems.push({
            name: "1 x BS8599-1 Travel & Motoring Kit/BS8599-2 Medium in Compact Aura- 3011",
            code: "3011",
          });
        } else if (route.params.maxQuantity <= 16) {
          safetyItems.push({
            name: "1 x BS8599-2 Large Motokit in Green Aura3 Box- 3012",
            code: "3012",
          });
        }
      } else if (highRiskStatus == "Public Accessibility") {
        if (
          2 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 0
        ) {
          safetyItems.push({
            name: "ADD 1 x PAcT Kit in Titan Box -6743",
            code: "6743",
          });
        } else if (
          6 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 2
        ) {
          safetyItems.push({
            name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
            code: "6745",
          });
        } else if (
          10 > parseInt(route.params.maxQuantity) &&
          parseInt(route.params.maxQuantity) > 6
        ) {
          safetyItems.push({
            name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
            code: "6741",
          });
        } else if (parseInt(route.params.maxQuantity) > 10) {
          safetyItems.push({
            name: `ADD ${
              parseInt(route.params.maxQuantity) / 2
            } PAcT Application- Budapest Indoor Cabinet -6741`,
            code: "6741",
          });
        }
      }

      return safetyItems;
    }
  };

  // const lowRisk = (obj) => {
  //   for (let key in obj) {
  //     if (obj[key].check === true) {
  //       return key;
  //     }
  //   }
  //   return null; // If no item is true
  // };

  // const lowRiskStatus = Object.keys(route.params?.switchData).filter(
  //   (key) => route.params?.switchData[key].check
  // );

  const lowRiskStatus = route.params?.lowRisk;

  // const lowRiskStatus = lowRisk(route.params?.switchData);
  console.log(lowRiskStatus, "lowRiskStatus status Item ----", highRiskStatus);

  const fewer25KitsName = () => {
    const safetyItems = [];

    //for group 1
    if (
      lowRiskStatus[0] === "Commercial_Catering" ||
      lowRiskStatus[0] === "Education" ||
      lowRiskStatus[0] === "Retail"
      // ||
      // value === true ||
      // value1 === true
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }

      safetyItems.push({
        name: "1 x BS8599-1 Small Workplace First Aid Kit in Green Aura3 Box- 330 ",
        code: "330",
      });

      // return "1 x BS8599-1 Small Workplace First Aid Kit in Green Aura3 Box- 330";
      return safetyItems;
    }
    //for group 2
    if (
      lowRiskStatus[0] === "Manufacturing" ||
      lowRiskStatus[0] === "Construction" ||
      lowRiskStatus[0] === "Warehouse" ||
      lowRiskStatus[0] === "Assembly_Work" ||
      lowRiskStatus[0] === "Engineering" ||
      lowRiskStatus[0] === "Food_Processing" ||
      lowRiskStatus[0] === "Transport"
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }
      safetyItems.push({
        name: "1 x BS8599-1 Small Workplace First Aid Kit (New Box - Titan)- 366",
        code: "366",
      });

      return safetyItems;
      // return "1 x BS8599-1 Small Workplace First Aid Kit (New Box - Titan)- 366";
    }
    //for group 3
    if (lowRiskStatus[0] === "Entertainment/Leisure Venue") {
      console.log(route.params.maxQuantity, "---route.params.maxQuantity");
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }

      if (
        2 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 0
      ) {
        safetyItems.push({
          name: "ADD 1 x PAcT Kit in Titan Box -6743",
          code: "6743",
        });
        // return safetyItems;
      } else if (
        6 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 2
      ) {
        safetyItems.push({
          name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
          code: "6745",
        });
        // return safetyItems;
      } else if (
        10 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 6
      ) {
        safetyItems.push({
          name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
          code: "6741",
        });
        // return safetyItems;
      } else if (parseInt(route.params.maxQuantity) > 10) {
        safetyItems.push({
          name: `ADD ${
            parseInt(route.params.maxQuantity) / 2
          } PAcT Application- Budapest Indoor Cabinet -6741`,
          code: "6741",
        });
        // return safetyItems;
      }

      return safetyItems;
    }
    //for group 4
    if (
      lowRiskStatus[0] === "Healthcare" ||
      lowRiskStatus[0] === "Agriculture" ||
      lowRiskStatus[0] === "Site Management" ||
      lowRiskStatus[0] === "Forestry"
    ) {
      safetyItems.push({
        name: `REPLACE ${parseInt(
          route.params.maxQuantity
        )} x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223`,
        code: "3223",
      });

      return safetyItems;
    }
  };

  const Kit25to100Name = () => {
    const safetyItems = [];
    //for group 1
    if (
      lowRiskStatus[0] === "Commercial_Catering" ||
      lowRiskStatus[0] === "Education" ||
      lowRiskStatus[0] === "Retail"
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }
      safetyItems.push({
        name: "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343",
        code: "343",
      });

      return safetyItems;
      // return "1 x BS8599-1 Medium Workplace Kit in Green Aura3 Box- 343";
    }
    //for group 2
    if (
      lowRiskStatus[0] === "Manufacturing" ||
      lowRiskStatus[0] === "Construction" ||
      lowRiskStatus[0] === "Warehouse" ||
      lowRiskStatus[0] === "Assembly_Work" ||
      lowRiskStatus[0] === "Engineering" ||
      lowRiskStatus[0] === "Food_Processing" ||
      lowRiskStatus[0] === "Transport"
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }

      safetyItems.push({
        name: "1 x BS8599-1 Medium Workplace First Aid Kit (New Box - Titan) - 380",
        code: "380",
      });

      return safetyItems;
      // return "1 x BS8599-1 Medium Workplace First Aid Kit (New Box - Titan) - 380";
    }
    //for group 3
    if (lowRiskStatus[0] === "Entertainment/Leisure Venue") {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }

      console.log(route.params.maxQuantity, "---route.params.maxQuantity");
      if (
        2 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 0
      ) {
        safetyItems.push({
          name: "ADD 1 x PAcT Kit in Titan Box -6743",
          code: "6743",
        });
        // return safetyItems;
      } else if (
        6 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 2
      ) {
        safetyItems.push({
          name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
          code: "6745",
        });
        // return safetyItems;
      } else if (
        10 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 6
      ) {
        safetyItems.push({
          name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
          code: "6741",
        });
        // return safetyItems;
      } else if (parseInt(route.params.maxQuantity) > 10) {
        safetyItems.push({
          name: `ADD ${
            parseInt(route.params.maxQuantity) / 2
          } PAcT Application- Budapest Indoor Cabinet -6741`,
          code: "6741",
        });
        // return safetyItems;
      }

      return safetyItems;
    }
    //for group 4
    if (
      lowRiskStatus[0] === "Healthcare" ||
      lowRiskStatus[0] === "Agriculture" ||
      lowRiskStatus[0] === "Site Management" ||
      lowRiskStatus[0] === "Forestry"
    ) {
      safetyItems.push({
        name: `REPLACE ${parseInt(
          route.params.maxQuantity
        )} x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223`,
        code: "3223",
      });
      return safetyItems;
    }
  };

  const Morethan100KitsName = () => {
    const safetyItems = [];
    //for group 1
    if (
      lowRiskStatus[0] === "Commercial_Catering" ||
      lowRiskStatus[0] === "Education" ||
      lowRiskStatus[0] === "Retail"
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }

      safetyItems.push({
        name: "1 x BS8599-1 Large Workplace Kit in Green Aura3 Box- 348",
        code: "348",
      });

      return safetyItems;
      // return "1 x BS8599-1 Large Workplace Kit in Green Aura3 Box- 348";
    }
    //for group 2
    if (
      lowRiskStatus[0] === "Manufacturing" ||
      lowRiskStatus[0] === "Construction" ||
      lowRiskStatus[0] === "Warehouse" ||
      lowRiskStatus[0] === "Assembly_Work" ||
      lowRiskStatus[0] === "Engineering" ||
      lowRiskStatus[0] === "Food_Processing" ||
      lowRiskStatus[0] === "Transport"
    ) {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }
      safetyItems.push({
        name: "1 x BS8599-1 Large Workplace First Aid Kit In Titan Box -384",
        code: "384",
      });

      return safetyItems;
      // return "1 x BS8599-1 Large Workplace First Aid Kit In Titan Box -384";
    }

    //for group 3
    if (lowRiskStatus[0] === "Entertainment/Leisure Venue") {
      if (Object.keys(route?.params?.auxiliaryStaff).length !== 0) {
        safetyItems.push({
          name: "REPLACE 1 x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223",
          code: "3223",
        });
        // return safetyItems;
      }
      console.log(route.params.maxQuantity, "---route.params.maxQuantity");
      if (
        2 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 0
      ) {
        safetyItems.push({
          name: "ADD 1 x PAcT Kit in Titan Box -6743",
          code: "6743",
        });
        // return safetyItems;
      } else if (
        6 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 2
      ) {
        safetyItems.push({
          name: "ADD 1 x 6 PAcT Application - Defibstore Bleed Control Cabinet- 6745",
          code: "6745",
        });
        // return safetyItems;
      } else if (
        10 > parseInt(route.params.maxQuantity) &&
        parseInt(route.params.maxQuantity) > 6
      ) {
        safetyItems.push({
          name: "ADD 1 x 5 PAcT Application- Budapest Indoor Cabinet -6741",
          code: "6741",
        });
        // return safetyItems;
      } else if (parseInt(route.params.maxQuantity) > 10) {
        safetyItems.push({
          name: `ADD ${
            parseInt(route.params.maxQuantity) / 2
          } PAcT Application- Budapest Indoor Cabinet -6741`,
          code: "6741",
        });
        // return safetyItems;
      }

      return safetyItems;
    }
    //for group 4
    if (
      lowRiskStatus[0] === "Healthcare" ||
      lowRiskStatus[0] === "Agriculture" ||
      lowRiskStatus[0] === "Site Management" ||
      lowRiskStatus[0] === "Forestry"
    ) {
      safetyItems.push({
        name: `REPLACE ${parseInt(
          route.params.maxQuantity
        )} x BS8599-1:2019 Personal Issue First Aid Kit in extra small Aura - 3223`,
        code: "3223",
      });
      return safetyItems;
    }
  };

  const handleRiskCalculater = () => {
    let additionalProductCodes = [];
    const valuesArray = Array.from(
      new Set(
        highMorethan50KitsName()?.flatMap((item) => [
          item.code,
          item.addProductCode,
          item.addProductCode2,
        ])
      )
    );

    setisLoadings(true);
    const payload = {
      kit_id: route.params?.item?.kit_id,
      quantity:
        highRiskStatus === null
          ? parseInt(route.params.maxQuantity) < 25
            ? 1
            : parseInt(route.params.maxQuantity) < 100
            ? 1
            : parseInt(route.params.maxQuantity / 100)
          : parseInt(route.params.maxQuantity) < 5
          ? 1
          : parseInt(route.params.maxQuantity) < 25
          ? 1
          : parseInt(route.params.maxQuantity / 25),
      product_codes:
        highRiskStatus === null
          ? route.params.maxQuantity < 25
            ? fewer25KitsName()?.map((item) => item?.code)
            : route.params.maxQuantity < 100
            ? Kit25to100Name()?.map((item) => item?.code)
            : Morethan100KitsName()?.map((item) => item?.code)
          : route.params.maxQuantity < 5
          ? highfewer5KitsName()?.flatMap((item) => [
              item.code,
              item.addProductCode,
              item.addProductCode2,
            ])
          : route.params.maxQuantity < 25
          ? highfewer25KitsName()?.flatMap((item) => [
              item.code,
              item.addProductCode,
              item.addProductCode2,
            ])
          : valuesArray,
      is_assessment: true,
    };

    // Add specific product codes based on the value of Evacuation_Chair
    // if (route.params?.Evacuation_Chair === "AED") {
    //   additionalProductCodes.push(2780);
    // }
    // if (route.params?.Evacuation_Chair === "Evacuation Chair") {
    //   additionalProductCodes.push(6038);
    // }
    if (route.params?.AED.includes("AED")) {
      additionalProductCodes.push(2780);
    }
    if (route.params?.Evacuation_Chair.includes("Evacuation Chair")) {
      additionalProductCodes.push(6038);
    }

    const cleanedPayload = {
      ...payload,
      product_codes: [
        payload.product_codes.filter((code) => code !== undefined),
        ...additionalProductCodes,
      ],
    };

    // Flatten the product_codes array
    const flattenedPayload = {
      ...cleanedPayload,
      product_codes: cleanedPayload.product_codes.flat(),
    };

    console.log("api call_update_risk_assessment payload", flattenedPayload);
    // setisLoadings(false);
    // return;
    dispatch(call_update_risk_assessment(flattenedPayload))
      .then((res) => {
        setisLoadings(false);
        console.log("api response call_update_risk_assessment", payload);
        if (res.payload.status === 200) {
          // handleShowAlert(res.payload.message);
          alert(res.payload.message);
          navigation.navigate(navigationString.admin);
        } else {
          console.log("err response ", res.payload);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log(err, "---err");
      });
  };

  console.log(
    fewer25KitsName(),
    "highfewer5KitsName9999",
    highfewer5KitsName()
  );
  const secondItem =
    highRiskStatus == "Biohazards"
      ? highMorethan50KitsName()
      : highfewer5KitsName();

  const items = highRiskStatus == "undefined" ? secondItem[1] : null;

  useEffect(() => {
    getKitPicture();
  }, highfewer5KitsName || fewer25KitsName);

  // get Picture of the all BSkits and additional product
  const getKitPicture = () => {
    const valuesArray = Array.from(
      new Set(
        highMorethan50KitsName()?.flatMap((item) => [
          item.code,
          item.addProductCode,
          item.addProductCode2,
        ])
      )
    );

    const payload = {
      // product_codes:
      //   highRiskStatus === null
      //     ? route.params.maxQuantity < 25
      //       ? fewer25KitsName()?.map((item) => item?.code)
      //       : route.params.maxQuantity < 100
      //       ? Kit25to100Name()?.map((item) => item?.code)
      //       : Morethan100KitsName()?.map((item) => item?.code)
      //     : route.params.maxQuantity < 5
      //     ? highfewer5KitsName()?.map((item) => item?.code)
      //     : route.params.maxQuantity < 25
      //     ? highfewer25KitsName()?.map((item) => item?.code)
      //     : highMorethan50KitsName()?.map((item) => item?.code),
      product_codes:
        highRiskStatus === null
          ? route.params.maxQuantity < 25
            ? fewer25KitsName()?.map((item) => item?.code)
            : route.params.maxQuantity < 100
            ? Kit25to100Name()?.map((item) => item?.code)
            : Morethan100KitsName()?.map((item) => item?.code)
          : route.params.maxQuantity < 5
          ? highfewer5KitsName()?.flatMap((item) => [
              item.code,
              item.addProductCode,
              item.addProductCode2,
            ])
          : route.params.maxQuantity < 25
          ? highfewer25KitsName()?.flatMap((item) => [
              item.code,
              item.addProductCode,
              item.addProductCode2,
            ])
          : valuesArray,
    };
    console.log(valuesArray, "get image pic ---", payload);
    dispatch(call_get_kit_pictures(payload))
      .then((res) => {
        console.log("res payload ---", res.payload);
        if (res?.payload?.status === 200) {
          setKitPictures(res.payload?.data);
        } else {
          console.log("kit pictures response err", res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("getkitPic err", err);
      });
  };

  useEffect(() => {
    const payload = {
      product_codes: [6038],
    };
    dispatch(call_get_kit_pictures(payload))
      .then((res) => {
        console.log("res payload  evacuation---", res.payload);
        if (res?.payload?.status === 200) {
          setEvacuation(res.payload?.data);
        } else {
          console.log("kit pictures response err", res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("getkitPic err", err);
      });
  }, [route.params?.Evacuation_Chair === "Evacuation Chair"]);

  useEffect(() => {
    const payload = {
      product_codes: [2780],
    };
    dispatch(call_get_kit_pictures(payload))
      .then((res) => {
        console.log("res payload  evacuation---", res.payload);
        if (res?.payload?.status === 200) {
          setAED(res.payload?.data);
        } else {
          console.log("kit pictures response err", res.payload?.message);
        }
      })
      .catch((err) => {
        console.log("getkitPic err", err);
      });
  }, [route.params?.Evacuation_Chair === "AED"]);

  console.log("evacuation----++", evacuation[0]?.kit_picture);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
      <Modal animated={true} transparent={true} visible={isLoadings}>
        <Loading />
      </Modal>
      <Header
        backIcon={imagePath.backArrow}
        editHeader={() => navigation.goBack({ areaRisk: "areaRisk" })}
      />
      <CustomAlert
        visible={showAlert}
        message={alertMessage} // Pass the dynamic message
        onClose={handleCloseAlert}
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
                heading
                headingTextSty={{
                  ...AdminStyle.generateQuote,
                  textAlign: "left",
                  marginTop: 25,
                }}>
                Results
              </TextView>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.blackOpacity10,
                }}
              />
              <TextView
                textSty={{ fontSize: 14, lineHeight: 21, marginTop: 15 }}>
                These are the minimum requirements suggested based on the
                information you provided.
              </TextView>

              <View>
                {/* <TextView
                  heading
                  headingTextSty={{
                    fontSize: 14,
                    lineHeight: 21,
                    marginTop: 15,
                    textAlign: "center",
                  }}> */}
                {/* [Name of Kit] */}

                {highRiskStatus === null
                  ? route.params.maxQuantity < 25
                    ? fewer25KitsName()?.map((item, index) => {
                        const matchedImage = kitPictures.find(
                          (image) => image.product_code === item.code
                        );
                        return (
                          <View key={index}>
                            {matchedImage ? (
                              <Image
                                source={{ uri: matchedImage.kit_picture }}
                                style={styles.imageSty} // Adjust width and height as needed
                              />
                            ) : (
                              <Image
                                source={imagePath.NoIcon}
                                style={styles.noImageSty}
                              />
                            )}

                            <Text style={styles.textStyle}>{item?.name}</Text>
                            {/* <Text style={styles.textStyle}>
                                Code: {item?.code}
                              </Text> */}
                          </View>
                        );
                      })
                    : route.params.maxQuantity < 100
                    ? Kit25to100Name()?.map((item, index) => {
                        const matchedImage = kitPictures.find(
                          (image) => image.product_code === item.code
                        );
                        return (
                          <View key={index}>
                            {matchedImage ? (
                              <Image
                                source={{ uri: matchedImage.kit_picture }}
                                style={styles.imageSty} // Adjust width and height as needed
                              />
                            ) : (
                              <Image
                                source={imagePath.NoIcon}
                                style={styles.noImageSty}
                              />
                            )}
                            <Text style={styles.textStyle}>{item?.name}</Text>
                            {/* <Text style={styles.textStyle}>
                                Code: {item?.code}
                              </Text> */}
                          </View>
                        );
                      })
                    : Morethan100KitsName()?.map((item, index) => {
                        const matchedImage = kitPictures.find(
                          (image) => image.product_code === item.code
                        );
                        return (
                          <View key={index}>
                            {matchedImage ? (
                              <Image
                                source={{ uri: matchedImage.kit_picture }}
                                style={styles.imageSty} // Adjust width and height as needed
                              />
                            ) : (
                              <Image
                                source={imagePath.NoIcon}
                                style={styles.noImageSty}
                              />
                            )}
                            <Text style={styles.textStyle}>{item?.name}</Text>
                            {/* <Text style={styles.textStyle}>
                                Code: {item?.code}
                              </Text> */}
                          </View>
                        );
                      })
                  : route.params.maxQuantity < 5
                  ? highfewer5KitsName()?.map((item, index) => {
                      const matchedImage = kitPictures.find(
                        (image) => image.product_code === item.code
                      );
                      return (
                        <View key={index}>
                          {matchedImage ? (
                            <Image
                              source={{ uri: matchedImage.kit_picture }}
                              style={styles.imageSty} // Adjust width and height as needed
                            />
                          ) : (
                            <Image
                              source={imagePath.NoIcon}
                              style={styles.noImageSty}
                            />
                          )}
                          <Text style={styles.textStyle}>{item.name}</Text>
                          {/* <Text style={styles.textStyle}>
                              Code: {item.code}
                            </Text> */}
                        </View>
                      );
                    })
                  : route.params.maxQuantity < 25
                  ? highfewer25KitsName()?.map((item, index) => {
                      const matchedImage = kitPictures.find(
                        (image) => image.product_code === item.code
                      );
                      return (
                        <View key={index}>
                          {matchedImage ? (
                            <Image
                              source={{ uri: matchedImage.kit_picture }}
                              style={styles.imageSty} // Adjust width and height as needed
                            />
                          ) : (
                            <Image
                              source={imagePath.NoIcon}
                              style={styles.noImageSty}
                            />
                          )}
                          <Text style={styles.textStyle}>
                            Name: {item.name}
                          </Text>
                          {/* <Text style={styles.textStyle}>
                             Code: {item.code} 
                            </Text> */}
                        </View>
                      );
                    })
                  : highMorethan50KitsName()?.map((item, index) => {
                      const matchedImage = kitPictures.find(
                        (image) => image.product_code === item.code
                      );
                      return (
                        <View key={index}>
                          {matchedImage ? (
                            <Image
                              source={{ uri: matchedImage.kit_picture }}
                              style={styles.imageSty} // Adjust width and height as needed
                            />
                          ) : (
                            <Image
                              source={imagePath.NoIcon}
                              style={styles.noImageSty}
                            />
                          )}
                          <Text style={styles.textStyle}>{item.name}</Text>
                          {/* <Text style={styles.textStyle}>
                              Code: {item.code} 
                            </Text> */}
                        </View>
                      );
                    })}
                {/* </TextView> */}
                <TextView
                  heading
                  headingTextSty={{
                    fontSize: 14,
                    lineHeight: 21,
                    textAlign: "center",
                  }}>
                  {/* Quantity x ## */}
                  Quantity:{" "}
                  {highRiskStatus === null
                    ? parseInt(route.params.maxQuantity) < 25
                      ? 1
                      : parseInt(route.params.maxQuantity) < 100
                      ? 1
                      : parseInt(route.params.maxQuantity / 100)
                    : parseInt(route.params.maxQuantity) < 5
                    ? 1
                    : parseInt(route.params.maxQuantity) < 25
                    ? 1
                    : parseInt(route.params.maxQuantity / 25)}
                </TextView>
              </View>
              {(highRiskStatus === "Chemicals" ||
                (highRiskStatus == "Biohazards" &&
                  route.params.maxQuantity > 25)) && (
                <View>
                  <TextView
                    textSty={{ fontSize: 14, lineHeight: 21, marginTop: 40 }}>
                    Consider the following products for your workplace:
                  </TextView>

                  {/* <Image
                    source={imagePath.NoIcon}
                    style={{ ...styles.noImageSty, marginTop: 20 }}
                  /> */}
                  <View>
                    {/* <TextView
                      heading
                      headingTextSty={{
                        fontSize: 14,
                        lineHeight: 21,
                        textAlign: "center",
                        marginTop: 20,
                      }}> */}
                    {/* Quantity:{" "} */}
                    {highRiskStatus === null
                      ? parseInt(route.params.maxQuantity) < 25
                        ? 1
                        : parseInt(route.params.maxQuantity) < 100
                        ? 1
                        : parseInt(route.params.maxQuantity / 100)
                      : parseInt(route.params.maxQuantity) < 5
                      ? highfewer5KitsName()?.map((item, index) => {
                          const matchedImage = kitPictures.find(
                            (image) =>
                              // image.product_code === item.addProductCode
                              item.addProductCode === image.product_code
                          );
                          const matchedImage2 = kitPictures.find(
                            (image) =>
                              image.product_code === item.addProductCode2
                          );
                          return (
                            <View key={index}>
                              {item.addProductCode ? (
                                matchedImage !== undefined ? (
                                  <Image
                                    source={{ uri: matchedImage.kit_picture }}
                                    style={styles.imageSty} // Adjust width and height as needed
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.NoIcon}
                                    style={styles.noImageSty}
                                  />
                                )
                              ) : null}
                              <Text style={styles.textStyle}>
                                {item.addProduct}
                              </Text>
                              <Text>{/* {item.addProductCode} */}</Text>
                              {item.addProductCode2 ? (
                                matchedImage2 !== undefined ? (
                                  <Image
                                    source={{
                                      uri: matchedImage2.kit_picture,
                                    }}
                                    style={styles.imageSty} // Adjust width and height as needed
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.NoIcon}
                                    style={styles.noImageSty}
                                  />
                                )
                              ) : null}
                              <Text style={styles.textStyle}>
                                {item.addProduct2}
                              </Text>
                              <Text>{/* {item.addProductCode2} */}</Text>
                            </View>
                          );
                        })
                      : parseInt(route.params.maxQuantity) < 25
                      ? highfewer25KitsName()?.map((item, index) => {
                          const matchedImage = kitPictures.find(
                            (image) =>
                              // image.product_code === item.addProductCode
                              item.addProductCode === image.product_code
                          );
                          const matchedImage2 = kitPictures.find(
                            (image) =>
                              image.product_code === item.addProductCode2
                          );
                          return (
                            <View key={index}>
                              {item.addProductCode ? (
                                matchedImage !== undefined ? (
                                  <Image
                                    source={{ uri: matchedImage.kit_picture }}
                                    style={styles.imageSty} // Adjust width and height as needed
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.NoIcon}
                                    style={styles.noImageSty}
                                  />
                                )
                              ) : null}
                              <Text style={styles.textStyle}>
                                {item.addProduct}
                              </Text>
                              <Text>{/* {item.addProductCode} */}</Text>
                              {item.addProductCode2 ? (
                                matchedImage2 !== undefined ? (
                                  <Image
                                    source={{
                                      uri: matchedImage2.kit_picture,
                                    }}
                                    style={styles.imageSty} // Adjust width and height as needed
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.NoIcon}
                                    style={styles.noImageSty}
                                  />
                                )
                              ) : null}
                              <Text style={styles.textStyle}>
                                {item?.addProduct2}
                              </Text>
                              <Text>{/* {item?.addProductCode2} */}</Text>
                            </View>
                          );
                        })
                      : highMorethan50KitsName()?.map((item, index) => {
                          const matchedImage = kitPictures.find((image) => {
                            // console.log(kitPictures, "-----image====", image);
                            // image.product_code === item.addProductCode;
                            item.addProductCode === image.product_code;
                          });
                          const matchedImage2 = kitPictures.find(
                            (image) =>
                              image.product_code === item.addProductCode2
                          );
                          return (
                            <View key={index}>
                              {item.addProductCode ? (
                                matchedImage !== undefined ? (
                                  <Image
                                    source={{
                                      uri: matchedImage?.kit_picture,
                                    }}
                                    style={styles.imageSty} // Adjust width and height as needed
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.NoIcon}
                                    style={styles.noImageSty}
                                  />
                                )
                              ) : null}
                              <Text style={styles.textStyle}>
                                {item.addProduct}
                              </Text>
                              <Text>{/* {item.addProductCode} */}</Text>
                              {item.addProductCode2 ? (
                                matchedImage2 !== undefined ? (
                                  <Image
                                    source={{
                                      uri: matchedImage2.kit_picture,
                                    }}
                                    style={styles.imageSty} // Adjust width and height as needed
                                  />
                                ) : (
                                  <Image
                                    source={imagePath.NoIcon}
                                    style={styles.noImageSty}
                                  />
                                )
                              ) : null}
                              <Text style={styles.textStyle}>
                                {item?.addProduct2}
                              </Text>
                              <Text>{/* {item?.addProductCode2} */}</Text>
                            </View>
                          );
                        })}
                    {/* </TextView> */}
                    {route.params?.areaTotal > 100 && (
                      <InputFields
                        textInput={{ alignSelf: "center" }}
                        placeholderTextColor
                        placeholder={"Add a separate first aid room"}
                        editDisabled={false}
                      />
                    )}
                  </View>
                </View>
              )}

              {/*for AED */}
              {route.params?.AED === "AED" && (
                <View>
                  <TextView
                    textSty={{ fontSize: 14, lineHeight: 21, marginTop: 40 }}>
                    Consider the following products for your workplace:
                  </TextView>
                  <Image
                    source={
                      aed[0]?.kit_picture
                        ? {
                            uri: aed[0]?.kit_picture,
                          }
                        : imagePath.NoIcon
                    }
                    style={styles.noImageSty}
                  />

                  <View>
                    <Text style={{ ...styles.textStyle, marginTop: 15 }}>
                      {"Mediana A15 HeartOn AED-2780, , AED Prep Kit- 2877."}
                    </Text>
                    <Text style={styles.textStyle}>
                      {console.log(route.params, "--highRiskStatus--")}
                      {/* Quantity:{" "} */}
                    </Text>
                    {route.params?.areaTotal > 100 && (
                      <InputFields
                        textInput={{ alignSelf: "center" }}
                        placeholderTextColor
                        placeholder={"Add a separate first aid room"}
                        editDisabled={false}
                      />
                    )}
                  </View>
                  <TextView
                    heading
                    headingTextSty={{
                      fontSize: 14,
                      lineHeight: 21,
                      textAlign: "center",
                    }}>
                    {/* Quantity x ## */}
                    Quantity:{" "}
                    {highRiskStatus === null
                      ? parseInt(route.params.maxQuantity) < 25
                        ? 1
                        : parseInt(route.params.maxQuantity) < 100
                        ? 1
                        : parseInt(route.params.maxQuantity / 100)
                      : parseInt(route.params.maxQuantity) < 5
                      ? 1
                      : parseInt(route.params.maxQuantity) < 25
                      ? 1
                      : parseInt(route.params.maxQuantity / 25)}
                  </TextView>
                </View>
              )}

              {route.params?.Evacuation_Chair === "Evacuation Chair" && (
                <View>
                  <TextView
                    textSty={{ fontSize: 14, lineHeight: 21, marginTop: 10 }}>
                    Consider the following products for your workplace:
                  </TextView>
                  <Image
                    source={
                      evacuation[0]?.kit_picture
                        ? { uri: evacuation[0]?.kit_picture }
                        : imagePath.NoIcon
                    }
                    style={styles.noImageSty}
                  />

                  <View>
                    <Text style={{ ...styles.textStyle, marginTop: 15 }}>
                      {
                        "CODE RED Evacuation chair 2 rear wheels (inc bracket & cover)- 6038"
                      }
                    </Text>
                    <Text style={styles.textStyle}>
                      {console.log(route.params, "--highRiskStatus--")}
                      {/* Quantity:{" "} */}
                    </Text>
                    {route.params?.areaTotal > 100 && (
                      <InputFields
                        textInput={{ alignSelf: "center" }}
                        placeholderTextColor
                        placeholder={"Add a separate first aid room"}
                        editDisabled={false}
                      />
                    )}
                  </View>
                  <TextView
                    heading
                    headingTextSty={{
                      fontSize: 14,
                      lineHeight: 21,
                      textAlign: "center",
                    }}>
                    {/* Quantity x ## */}
                    Quantity:{" "}
                    {highRiskStatus === null
                      ? parseInt(route.params.maxQuantity) < 25
                        ? 1
                        : parseInt(route.params.maxQuantity) < 100
                        ? 1
                        : parseInt(route.params.maxQuantity / 100)
                      : parseInt(route.params.maxQuantity) < 5
                      ? 1
                      : parseInt(route.params.maxQuantity) < 25
                      ? 1
                      : parseInt(route.params.maxQuantity / 25)}
                  </TextView>
                </View>
              )}

              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "space-between",
                }}>
                <Button
                  onClick={() => {
                    navigation.navigate(navigationString.admin);
                  }}
                  allButtonSty={{
                    backgroundColor: "black",
                    borderRadius: 10,
                    width: "30%",
                    marginHorizontal: 0,
                  }}
                  buttonColor={Colors.white}
                  btnColor="#fff"
                  btnName="Cancel"
                />
                <Button
                  onClick={() => {
                    handleRiskCalculater();
                  }}
                  buttonColor={Colors.black}
                  btnName={"Add to Quote & Save"}
                  allButtonSty={{
                    borderRadius: 10,
                    width: "68%",
                    marginHorizontal: 0,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AreaRiskCalculator2;

const styles = StyleSheet.create({
  textStyle: { textAlign: "center" },
  noImageSty: {
    width: 200,
    height: 200,
    alignSelf: "center",
    // marginTop: 25,
  },
  imageSty: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
});

// import {
//   Image,
//   Modal,
//   RefreshControl,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import Colors from "../../Styles/Colors";
// import Loading from "../../Components/Loading";

// import imagePath from "../../Constant/imagePath";
// import TextView from "../../Components/TextView";
// import IncidentStyle from "../Incident/IncidentStyle";
// import Header from "../../Components/Header";
// import Button from "../../Components/Button";
// import { useDispatch } from "react-redux";
// import { call_update_risk_assessment } from "../../redux/action/AdminAction";
// import navigationString from "../../Navigations/navigationString";
// import InputFields from "../../Components/InputFields";
// import CustomAlert from "../../Components/CustomAlert";

// const AreaRiskCalculator2 = ({ navigation, route }) => {
//   const dispatch = useDispatch();
//   const [isLoadings, setisLoadings] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertMessage, setAlertMessage] = useState("");

//   const handleShowAlert = (message) => {
//     setAlertMessage(message); // Set the dynamic message
//     setShowAlert(true);
//   };

//   const handleCloseAlert = () => {
//     setShowAlert(false);
//   };

//   console.log("---route params----", route.params);
//   const findTrueItem = (obj) => {
//     for (let key in obj) {
//       if (obj[key] === true) {
//         return key;
//       }
//     }
//     return null; // If no item is true
//   };
//   const trueItem = findTrueItem(route.params?.potential);
//   console.log("true Item ----", trueItem);

//   const handleRiskCalculater = () => {
//     setisLoadings(true);
//     const payload = {
//       kit_id: route.params?.item?.kit_id,
//       is_assessment: true,
//     };
//     dispatch(call_update_risk_assessment(payload))
//       .then((res) => {
//         setisLoadings(false);
//         console.log(res.payload, "api response call_update_risk_assessment");
//         if (res.payload.status === 200) {
//           handleShowAlert(res.payload.message);
//           navigation.navigate(navigationString.admin);
//         } else {
//           console.log("err response ", res.payload);
//         }
//       })
//       .catch((err) => {
//         setisLoadings(false);
//         console.log(err, "---err");
//       });
//   };

//   return (
//     <SafeAreaView style={{ height: "100%", backgroundColor: Colors.primary }}>
//       <Modal animated={true} transparent={true} visible={isLoadings}>
//         <Loading />
//       </Modal>
//       <Header
//         backIcon={imagePath.backArrow}
//         editHeader={() => navigation.goBack({ areaRisk: "areaRisk" })}
//       />
//       <CustomAlert
//         visible={showAlert}
//         message={alertMessage} // Pass the dynamic message
//         onClose={handleCloseAlert}
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
//                 heading
//                 headingTextSty={{
//                   ...AdminStyle.generateQuote,
//                   textAlign: "left",
//                   marginTop: 25,
//                 }}>
//                 Results
//               </TextView>

//               <View
//                 style={{
//                   borderWidth: 1,
//                   borderColor: Colors.blackOpacity10,
//                 }}
//               />

//               <TextView
//                 textSty={{ fontSize: 14, lineHeight: 21, marginTop: 15 }}>
//                 These are the minimum requirements suggested based on the
//                 information you provided.
//               </TextView>

//               <Image
//                 source={{ uri: "https://justpaste.in/fls/upj.png" }}
//                 style={{
//                   width: 200,
//                   height: 200,
//                   alignSelf: "center",
//                   marginTop: 25,
//                 }}
//               />

//               <View>
//                 <TextView
//                   heading
//                   headingTextSty={{
//                     fontSize: 14,
//                     lineHeight: 21,
//                     marginTop: 15,
//                     textAlign: "center",
//                   }}>
//                   {/* [Name of Kit] */}
//                   {trueItem === null
//                     ? route.params.maxQuantity < 25
//                       ? "Small BS Kit"
//                       : route.params.maxQuantity < 100
//                       ? "Medium BS Kit"
//                       : "Large BS Kit"
//                     : route.params.maxQuantity < 5
//                     ? "Small BS Kit"
//                     : route.params.maxQuantity < 25
//                     ? "Medium BS Kit"
//                     : "Large BS Kit"}
//                 </TextView>
//                 <TextView
//                   heading
//                   headingTextSty={{
//                     fontSize: 14,
//                     lineHeight: 21,
//                     textAlign: "center",
//                   }}>
//                   {/* Quantity x ## */}
//                   Quantity:{" "}
//                   {trueItem === null
//                     ? parseInt(route.params.maxQuantity) < 25
//                       ? 1
//                       : parseInt(route.params.maxQuantity) < 100
//                       ? 1
//                       : parseInt(route.params.maxQuantity / 100)
//                     : parseInt(route.params.maxQuantity) < 5
//                     ? 1
//                     : parseInt(route.params.maxQuantity) < 25
//                     ? 1
//                     : parseInt(route.params.maxQuantity / 25)}
//                 </TextView>
//               </View>
//               <TextView
//                 textSty={{ fontSize: 14, lineHeight: 21, marginTop: 40 }}>
//                 Consider the following products for your workplace:
//               </TextView>
//               <Image
//                 source={{ uri: "https://justpaste.in/fls/upj.png" }}
//                 style={{
//                   width: 200,
//                   height: 200,
//                   alignSelf: "center",
//                   marginTop: 20,
//                 }}
//               />

//               <View>
//                 <TextView
//                   heading
//                   headingTextSty={{
//                     fontSize: 14,
//                     lineHeight: 21,
//                     marginTop: 15,
//                     textAlign: "center",
//                   }}>
//                   [Bunzl Greenham Biohazard Kit]
//                 </TextView>
//                 <TextView
//                   heading
//                   headingTextSty={{
//                     fontSize: 14,
//                     lineHeight: 21,
//                     textAlign: "center",
//                   }}>
//                   Quantity:{" "}
//                   {trueItem === null
//                     ? parseInt(route.params.maxQuantity) < 25
//                       ? 1
//                       : parseInt(route.params.maxQuantity) < 100
//                       ? 1
//                       : parseInt(route.params.maxQuantity / 100)
//                     : parseInt(route.params.maxQuantity) < 5
//                     ? 1
//                     : parseInt(route.params.maxQuantity) < 25
//                     ? 1
//                     : parseInt(route.params.maxQuantity / 25)}
//                 </TextView>
//                 {route.params?.areaTotal > 100 && (
//                   <InputFields
//                     textInput={{ alignSelf: "center" }}
//                     placeholderTextColor
//                     placeholder={"Add a separate first aid room"}
//                     editDisabled={false}
//                   />
//                 )}
//               </View>

//               <View
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   flexDirection: "row",

//                   marginTop: 20,
//                   // marginHorizontal: 20,
//                   justifyContent: "space-between",
//                 }}>
//                 <Button
//                   onClick={() => {
//                     // handleDelete();
//                     navigation.navigate(navigationString.admin);
//                   }}
//                   allButtonSty={{
//                     backgroundColor: "black",
//                     borderRadius: 10,
//                     width: "30%",
//                     marginHorizontal: 0,
//                   }}
//                   buttonColor={Colors.white}
//                   btnColor="#fff"
//                   btnName="Cancel"
//                 />
//                 <Button
//                   onClick={() => {
//                     handleRiskCalculater();
//                   }}
//                   buttonColor={Colors.black}
//                   btnName={"Add to Quote & Save"}
//                   allButtonSty={{
//                     borderRadius: 10,
//                     width: "68%",
//                     marginHorizontal: 0,
//                   }}
//                 />
//               </View>
//             </View>
//           </ScrollView>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default AreaRiskCalculator2;

// const styles = StyleSheet.create({});
