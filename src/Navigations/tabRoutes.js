import React, { useEffect, useState } from "react";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { Image, Platform, StyleSheet, View } from "react-native";
import navigationString from "./navigationString";
import * as Screens from "../Screens";
import imagePath from "../Constant/imagePath";
import kitsStack from "./kits/KitsStack";
import HomeStack from "./home/HomeStack";
import AdminStack from "./admin/AdminStack";
import MessageStack from "./message/MessageStack";
import { responsiveHeight } from "react-native-responsive-dimensions";
import Colors from "../Styles/Colors";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BottomTab = createBottomTabNavigator();

// "superadmin", "admin", "user", "approver", "salesrepresentative"

const TabRoutes = (props) => {
  const isFocused = useIsFocused();
  // const userDatas = useSelector((state) => state.auths);
  const [userDatas, setUserDatas] = useState(null);
  // console.log("----routes tab", userDatas);

  useEffect(() => {
    if (isFocused) {
      getToken();
    }
  }, [isFocused]);

  const getToken = async () => {
    const accessGlobalData = await AsyncStorage.getItem("globalData");
    const jsonValue = JSON.parse(accessGlobalData);
    console.log("get token data tabroutes", jsonValue);
    setUserDatas(jsonValue);
  };

  return (
    <BottomTab.Navigator
      tabBarOptions={{
        // activeTintColor: "red",
        inactiveTintColor: Colors.black,
      }}
      tabBar={(tabsProps) => (
        <>
          <BottomTabBar {...tabsProps} />
        </>
      )}
      initialRouteName={navigationString.Home}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#047835",
        tabBarStyle: [
          {
            height: Platform.OS === "android" ? 50 : responsiveHeight(9.5),
            // backgroundColor: "red",
          },
        ],
        tabBarLabelStyle: {
          fontWeight: "700",
        },
      }}>
      {(!userDatas?.user?.data?.role ||
        userDatas?.data.role == "user" ||
        userDatas?.data.role == "admin" ||
        userDatas?.data.role == "superadmin" ||
        userDatas?.data.role == "rm_superadmin" ||
        userDatas?.data.role == "approver" ||
        userDatas?.data.role == "salesrepresentative") && (
        <BottomTab.Screen
          name={navigationString.Home}
          component={HomeStack}
          listeners={{
            tabPress: () => props.navigation.navigate(navigationString.Home),
          }}
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ tintColor, size, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#cde4d7" : null,
                  borderRadius: 30,
                  padding: 3,
                }}>
                <Image
                  source={imagePath.HomeIcon}
                  tintColor={focused ? "#047835" : "#000000"}
                  resizeMode="contain"
                  style={{
                    width: 31,
                    height: 31,
                    // borderBottomWidth: 2,
                  }}
                  size={size}
                />
              </View>
            ),
          }}
        />
      )}

      {(!userDatas?.data?.role ||
        userDatas?.data.role == "admin" ||
        userDatas?.data.role == "superadmin" ||
        userDatas?.data.role == "rm_superadmin" ||
        // userDatas?.data.role == "approver" ||
        userDatas?.data.role == "salesrepresentative") && (
        <BottomTab.Screen
          name={navigationString.kitsName}
          component={kitsStack}
          listeners={{
            tabPress: () =>
              props.navigation.navigate(navigationString.kitsName),
          }}
          options={{
            tabBarLabel: "Kits",
            tabBarIcon: ({ tintColor, size, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#cde4d7" : null,
                  borderRadius: 30,
                  padding: 3,
                }}>
                <Image
                  source={imagePath.kitsIcon}
                  tintColor={focused ? "#047835" : "#000000"}
                  resizeMode="contain"
                  style={{
                    width: 31,
                    height: 31,
                    // borderBottomWidth: 2,
                  }}
                  size={size}
                />
              </View>
            ),
          }}
        />
      )}

      {(!userDatas?.data.role ||
        userDatas?.data.role == "superadmin" ||
        userDatas?.data.role == "rm_superadmin" ||
        // userDatas?.data.role == "approver" ||
        userDatas?.data.role == "salesrepresentative") && (
        <BottomTab.Screen
          name={navigationString.admin}
          component={AdminStack}
          listeners={{
            tabPress: () => props.navigation.navigate(navigationString.admin),
          }}
          options={{
            tabBarLabel: "Admin",
            tabBarIcon: ({ tintColor, size, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#cde4d7" : null,
                  borderRadius: 30,
                  padding: 3,
                }}>
                <Image
                  source={imagePath.adminIcon}
                  tintColor={focused ? "#047835" : "#000000"}
                  resizeMode="contain"
                  style={{
                    width: 31,
                    height: 31,
                    // borderBottomWidth: 2,
                  }}
                  size={size}
                />
              </View>
            ),
          }}
        />
      )}

      {(!userDatas?.data.role ||
        userDatas?.data.role == "admin" ||
        userDatas?.data.role == "superadmin" ||
        userDatas?.data.role == "rm_superadmin" ||
        // userDatas?.data.role == "approver" ||
        userDatas?.data.role == "salesrepresentative") && (
        <BottomTab.Screen
          name={navigationString.incident}
          component={Screens.Incident}
          listeners={{
            tabPress: () =>
              props.navigation.navigate(navigationString.incident),
          }}
          options={{
            tabBarLabel: "Incident",
            tabBarIcon: ({ tintColor, size, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#cde4d7" : null,
                  borderRadius: 30,
                  padding: 3,
                }}>
                <Image
                  source={imagePath.incidentIcon}
                  tintColor={focused ? "#047835" : "#000000"}
                  resizeMode="contain"
                  style={{
                    width: 31,
                    height: 31,
                    // borderBottomWidth: 2,
                  }}
                  size={size}
                />
              </View>
            ),
          }}
        />
      )}

      {(!userDatas?.user?.data?.role ||
        userDatas?.data.role == "user" ||
        userDatas?.data.role == "admin" ||
        userDatas?.data.role == "superadmin" ||
        userDatas?.data.role == "rm_superadmin" ||
        userDatas?.data.role == "approver" ||
        userDatas?.data.role == "salesrepresentative") && (
        <BottomTab.Screen
          name={navigationString.Notification}
          listeners={{
            tabPress: () =>
              props.navigation.navigate(navigationString.Notification),
          }}
          component={MessageStack}
          options={{
            tabBarLabel: "Message",
            tabBarIcon: ({ tintColor, size, focused }) => (
              <View
                style={{
                  backgroundColor: focused ? "#cde4d7" : null,
                  borderRadius: 30,
                  padding: 3,
                }}>
                <Image
                  source={imagePath.MessageIcon}
                  style={{
                    width: 31,
                    height: 31,
                  }}
                  tintColor={focused ? "#047835" : "#000000"}
                  size={size}
                />
              </View>
            ),
          }}
        />
      )}
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  customBottomtabsStyle: {
    height: 50,
    backgroundColor: "red",
  },
});

export default TabRoutes;

// import React from "react";
// import {
//   createBottomTabNavigator,
//   BottomTabBar,
// } from "@react-navigation/bottom-tabs";
// import { Image, Platform, StyleSheet, View } from "react-native";
// import navigationString from "./navigationString";
// import * as Screens from "../Screens";
// import imagePath from "../Constant/imagePath";
// import kitsStack from "./kits/KitsStack";
// import HomeStack from "./home/HomeStack";
// import AdminStack from "./admin/AdminStack";
// import MessageStack from "./message/MessageStack";
// import { responsiveHeight } from "react-native-responsive-dimensions";
// import Colors from "../Styles/Colors";
// import { useSelector } from "react-redux";
// const BottomTab = createBottomTabNavigator();

// // "superadmin", "admin", "user", "approver", "salesrepresentative"

// const TabRoutes = (props) => {
//   const userDatas = useSelector((state) => state.auths);
//   console.log("----routes ", userDatas?.user?.data.role);
//   return (
//     <BottomTab.Navigator
//       tabBarOptions={{
//         // activeTintColor: "red",
//         inactiveTintColor: Colors.black,
//       }}
//       tabBar={(tabsProps) => (
//         <>
//           <BottomTabBar {...tabsProps} />
//         </>
//       )}
//       initialRouteName={navigationString.Home}
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: "#047835",
//         tabBarStyle: [
//           {
//             height: Platform.OS === "android" ? 50 : responsiveHeight(9.5),
//             // backgroundColor: "red",
//           },
//         ],
//         tabBarLabelStyle: {
//           fontWeight: "700",
//         },
//       }}>
//       {(userDatas?.user?.data.role == "user" ||
//         userDatas?.user?.data.role == "admin" ||
//         userDatas?.user?.data.role == "superadmin" ||
//         userDatas?.user?.data.role == "rm_superadmin" ||
//         userDatas?.user?.data.role == "approver" ||
//         userDatas?.user?.data.role == "salesrepresentative") && (
//         <BottomTab.Screen
//           name={navigationString.Home}
//           component={HomeStack}
//           listeners={{
//             tabPress: () => props.navigation.navigate(navigationString.Home),
//           }}
//           options={{
//             tabBarLabel: "Home",
//             tabBarIcon: ({ tintColor, size, focused }) => (
//               <View
//                 style={{
//                   backgroundColor: focused ? "#cde4d7" : null,
//                   borderRadius: 30,
//                   padding: 3,
//                 }}>
//                 <Image
//                   source={imagePath.HomeIcon}
//                   tintColor={focused ? "#047835" : "#000000"}
//                   resizeMode="contain"
//                   style={{
//                     width: 31,
//                     height: 31,
//                     // borderBottomWidth: 2,
//                   }}
//                   size={size}
//                 />
//               </View>
//             ),
//           }}
//         />
//       )}

//       {(!userDatas?.user?.data?.role ||
//         userDatas?.user?.data.role == "admin" ||
//         userDatas?.user?.data.role == "superadmin" ||
//         userDatas?.user?.data.role == "rm_superadmin" ||
//         userDatas?.user?.data.role == "approver" ||
//         userDatas?.user?.data.role == "salesrepresentative") && (
//         <BottomTab.Screen
//           name={navigationString.kitsName}
//           component={kitsStack}
//           listeners={{
//             tabPress: () =>
//               props.navigation.navigate(navigationString.kitsName),
//           }}
//           options={{
//             tabBarLabel: "Kits",
//             tabBarIcon: ({ tintColor, size, focused }) => (
//               <View
//                 style={{
//                   backgroundColor: focused ? "#cde4d7" : null,
//                   borderRadius: 30,
//                   padding: 3,
//                 }}>
//                 <Image
//                   source={imagePath.kitsIcon}
//                   tintColor={focused ? "#047835" : "#000000"}
//                   resizeMode="contain"
//                   style={{
//                     width: 31,
//                     height: 31,
//                     // borderBottomWidth: 2,
//                   }}
//                   size={size}
//                 />
//               </View>
//             ),
//           }}
//         />
//       )}

//       {(!userDatas?.user?.data.role ||
//         userDatas?.user?.data.role == "superadmin" ||
//         userDatas?.user?.data.role == "rm_superadmin" ||
//         userDatas?.user?.data.role == "approver" ||
//         userDatas?.user?.data.role == "salesrepresentative") && (
//         <BottomTab.Screen
//           name={navigationString.admin}
//           component={AdminStack}
//           listeners={{
//             tabPress: () => props.navigation.navigate(navigationString.admin),
//           }}
//           options={{
//             tabBarLabel: "Admin",
//             tabBarIcon: ({ tintColor, size, focused }) => (
//               <View
//                 style={{
//                   backgroundColor: focused ? "#cde4d7" : null,
//                   borderRadius: 30,
//                   padding: 3,
//                 }}>
//                 <Image
//                   source={imagePath.adminIcon}
//                   tintColor={focused ? "#047835" : "#000000"}
//                   resizeMode="contain"
//                   style={{
//                     width: 31,
//                     height: 31,
//                     // borderBottomWidth: 2,
//                   }}
//                   size={size}
//                 />
//               </View>
//             ),
//           }}
//         />
//       )}

//       {(!userDatas?.user?.data.role ||
//         userDatas?.user?.data.role == "admin" ||
//         userDatas?.user?.data.role == "superadmin" ||
//         userDatas?.user?.data.role == "rm_superadmin" ||
//         userDatas?.user?.data.role == "approver" ||
//         userDatas?.user?.data.role == "salesrepresentative") && (
//         <BottomTab.Screen
//           name={navigationString.incident}
//           component={Screens.Incident}
//           listeners={{
//             tabPress: () =>
//               props.navigation.navigate(navigationString.incident),
//           }}
//           options={{
//             tabBarLabel: "Incident",
//             tabBarIcon: ({ tintColor, size, focused }) => (
//               <View
//                 style={{
//                   backgroundColor: focused ? "#cde4d7" : null,
//                   borderRadius: 30,
//                   padding: 3,
//                 }}>
//                 <Image
//                   source={imagePath.incidentIcon}
//                   tintColor={focused ? "#047835" : "#000000"}
//                   resizeMode="contain"
//                   style={{
//                     width: 31,
//                     height: 31,
//                     // borderBottomWidth: 2,
//                   }}
//                   size={size}
//                 />
//               </View>
//             ),
//           }}
//         />
//       )}

//       {(userDatas?.user?.data.role == "user" ||
//         userDatas?.user?.data.role == "admin" ||
//         userDatas?.user?.data.role == "superadmin" ||
//         userDatas?.user?.data.role == "rm_superadmin" ||
//         userDatas?.user?.data.role == "approver" ||
//         userDatas?.user?.data.role == "salesrepresentative") && (
//         <BottomTab.Screen
//           name={navigationString.Notification}
//           listeners={{
//             tabPress: () =>
//               props.navigation.navigate(navigationString.Notification),
//           }}
//           component={MessageStack}
//           options={{
//             tabBarLabel: "Message",
//             tabBarIcon: ({ tintColor, size, focused }) => (
//               <View
//                 style={{
//                   backgroundColor: focused ? "#cde4d7" : null,
//                   borderRadius: 30,
//                   padding: 3,
//                 }}>
//                 <Image
//                   source={imagePath.MessageIcon}
//                   style={{
//                     width: 31,
//                     height: 31,
//                   }}
//                   tintColor={focused ? "#047835" : "#000000"}
//                   size={size}
//                 />
//               </View>
//             ),
//           }}
//         />
//       )}
//     </BottomTab.Navigator>
//   );
// };

// const styles = StyleSheet.create({
//   customBottomtabsStyle: {
//     height: 50,
//     backgroundColor: "red",
//   },
// });

// export default TabRoutes;
