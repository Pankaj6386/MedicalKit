import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import imagePath from "../../Constant/imagePath";
import TextView from "../../Components/TextView";
import Header from "../../Components/Header";
import Colors from "../../Styles/Colors";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import WebView from "react-native-webview";
import { call_DetailsMessage_API } from "../../redux/action/MessagesAction";
import Loading from "../../Components/Loading";
import { useDispatch } from "react-redux";
import moment from "moment";
import navigationString from "../../Navigations/navigationString";

const NotificationDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { imageSource } = route.params;

  const [isLoadings, setisLoadings] = useState(false);
  const [data, setData] = useState(null);

  console.log(imagePath.GreenKit, "======ahjagsdadahd");

  useEffect(() => {
    setisLoadings(true);
    showdata();
    // This will run every time the screen comes into focus
    if (isFocused) {
      // Perform actions here, such as fetching data or refreshing the screen
      console.log("Screen is focused");

      showdata();
    }
  }, [isFocused]); // Re-run the effect when the isFocused value changes

  const showdata = () => {
    setisLoadings(true);
    dispatch(call_DetailsMessage_API(imageSource?._id))
      .then((res) => {
        console.log("show notification *****- ", res.payload);
        if (res.payload.status === 200) {
          setData(res.payload.data);
          setisLoadings(false);
        } else {
          setisLoadings(false);
          console.log("notification api response err---", res.payload);
        }
      })
      .catch((err) => {
        setisLoadings(false);
        console.log("show notification err- ", err);
      });
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
        <Modal animated={true} transparent={true} visible={isLoadings}>
          <Loading />
        </Modal>

        <Header
          back={() => navigation.navigate(navigationString.profile)}
          backIcon={imagePath.backArrow}
          editHeader={() => navigation.goBack()}
        />

        <View style={{ flex: 1 }}>
          {/* <View style={{ flex: 1 }}> */}
          <TextView
            heading
            headingTextSty={{
              color: "#FFFFFF",
              marginVertical: 10,
              width: "90%",
              textAlign: "center",
              alignSelf: "center",
              marginHorizontal: 15,
              letterSpacing: -1,
            }}>
            Notification centre
          </TextView>
          <View style={{ marginBottom: 15, width: "80%", alignSelf: "center" }}>
            <Text
              style={{
                fontFamily: "Open Sans",
                fontSize: 14,
                fontWeight: "400",
                lineHeight: 21,
                letterSpacing: -0.011,
                textAlign: "center",
                color: "white",
              }}>
              The latest news, training and updates to keep your businesses safe
              and compliant.
            </Text>
          </View>
          {console.log("data?.title--", data?.title)}
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flex: 1,
            }}>
            <WebView
              source={{
                html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>
                     <div style="display: flex; justify-content: center; align-items: center;">
                       <img src=${
                         data?.featured_image !== ""
                           ? data?.featured_image
                           : "https://justpaste.in/fls/fbl.jpg"
                       } style="height: 220px; margin-top:20px;" alt="image">
                     </div>
                     <p style="margin-top: 30px; font-weight: 700; font-size: 14px;">
                       ${data?.title === undefined ? "" : data?.title}
                     </p>
                     <p style="margin-top: 6px; font-weight: 400; font-size: 10px;">${moment(
                       data?.publish_on
                     ).format("DD MMM YYYY")}</p>
                     ${data?.content === undefined ? "" : data?.content}
                   </body></html>`,
              }}
              // source={{
              //   html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>
              //    <div style="display: flex; justify-content: center; align-items: center;">
              //     <img src=${
              //       data?.featured_image !== ""
              //         ? data?.featured_image
              //         : "https://justpaste.in/fls/fbl.jpg"
              //     } style=" height: 220px; margin-top:20" alt="image">
              //   </div>
              //   <p style="margin-top: 30px, font-weight: bold; font-size: 20px;">${
              //     data?.title === undefined ? "" : data?.title
              //   }</p>
              //   <p>${moment(data?.publish_on).format("DD MMM YYYY")}</p>
              //   ${
              //     data?.content === undefined ? "" : data?.content
              //   }</body></html>`,
              // }}
              style={{
                marginHorizontal: 13,
                // flex: 1,
              }}
              javaScriptEnabled={true}
              // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
              scalesPageToFit={true}
              originWhitelist={["*"]}
              // onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
            />
          </View>
        </View>

        {/* <TabRoutes /> */}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  headingText: {
    fontFamily: "Open Sans",
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 43,
    letterSpacing: -0.011,
    textAlign: "center",
    color: "#FFFFFF",
    backgroundColor: "#047835",
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    // width: 333,
    // height: "auto",
    // paddingVertical: s20,
    paddingHorizontal: 0,
    // marginTop: 10,
    flexDirection: "column",
    alignItems: "flex-start", // Align items to the left
    justifyContent: "flex-start",
    backgroundColor: "white",
  },
  text: {
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 21,
    letterSpacing: -0.011,
    textAlign: "left",
    marginLeft: 20,
    color: "#000000",
  },
  secondaryText: {
    fontFamily: "Open Sans",
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 15,
    letterSpacing: -0.011,
    textAlign: "left",
    marginLeft: 20,
    color: "#000000",
  },
  regularText: {
    fontFamily: "Open Sans",
    // fontSize: 14,
    fontSize: responsiveFontSize(2),
    fontWeight: "400",
    lineHeight: 21,
    letterSpacing: -0.011,
    textAlign: "left",
    color: "#000000",
    marginLeft: 20, // Adjust left margin for bullet points
  },
});
export default NotificationDetails;

// import {
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   SafeAreaView,
//   Modal,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import imagePath from "../../Constant/imagePath";
// import TextView from "../../Components/TextView";
// import Header from "../../Components/Header";
// import Colors from "../../Styles/Colors";
// import { useIsFocused, useRoute } from "@react-navigation/native";
// import { responsiveFontSize } from "react-native-responsive-dimensions";
// import WebView from "react-native-webview";
// import { call_DetailsMessage_API } from "../../redux/action/MessagesAction";
// import Loading from "../../Components/Loading";
// import { useDispatch } from "react-redux";
// import moment from "moment";

// const NotificationDetails = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const route = useRoute();
//   const isFocused = useIsFocused();
//   const { imageSource } = route.params;

//   const [isLoadings, setisLoadings] = useState(false);
//   const [data, setData] = useState(null);

//   console.log(imageSource?._id, "======ahjagsdadahd");

//   useEffect(() => {
//     setisLoadings(true);
//     showdata();
//     // This will run every time the screen comes into focus
//     if (isFocused) {
//       // Perform actions here, such as fetching data or refreshing the screen
//       console.log("Screen is focused");

//       showdata();
//     }
//   }, [isFocused]); // Re-run the effect when the isFocused value changes

//   const showdata = () => {
//     setisLoadings(true);
//     dispatch(call_DetailsMessage_API(imageSource?._id))
//       .then((res) => {
//         console.log("show notification *****- ", res.payload);
//         if (res.payload.status === 200) {
//           setData(res.payload.data);
//           setisLoadings(false);
//         } else {
//           setisLoadings(false);
//           console.log("notification api response err---", res.payload);
//         }
//       })
//       .catch((err) => {
//         setisLoadings(false);
//         console.log("show notification err- ", err);
//       });
//   };

//   return (
//     <>
//       <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
//         <Modal animated={true} transparent={true} visible={isLoadings}>
//           <Loading />
//         </Modal>

//         <Header
//           back={() => navigation.navigate(navigationString.profile)}
//           backIcon={imagePath.backArrow}
//           editHeader={() => navigation.goBack()}
//         />

//         <View style={{ flex: 1 }}>
//           {/* <View style={{ flex: 1 }}> */}
//           <TextView
//             heading
//             headingTextSty={{
//               color: "#FFFFFF",
//               marginVertical: 10,
//               width: "90%",
//               textAlign: "center",
//               alignSelf: "center",
//               marginHorizontal: 15,
//               letterSpacing: -1,
//             }}>
//             Notification centre
//           </TextView>
//           <View style={{ marginBottom: 15, width: "80%", alignSelf: "center" }}>
//             <Text
//               style={{
//                 fontFamily: "Open Sans",
//                 fontSize: 14,
//                 fontWeight: "400",
//                 lineHeight: 21,
//                 letterSpacing: -0.011,
//                 textAlign: "center",
//                 color: "white",
//               }}>
//               The latest news, training and updates to keep your businesses safe
//               and compliant.
//             </Text>
//           </View>
//           {/* </View> */}
//           {/* Rest of the content */}
//           <View
//             style={{
//               backgroundColor: Colors.white,
//               borderTopLeftRadius: 20,
//               borderTopRightRadius: 20,
//               flex: 1,
//             }}>
//             {/* <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={{
//                 flex: 1,
//               }}> */}
//             <Image
//               resizeMode="contain"
//               source={imagePath.GreenKit}
//               style={{
//                 width: 250,
//                 alignSelf: "center",
//                 height: 250,
//               }}></Image>

//             <Text style={styles.text}>{data?.title}</Text>
//             <Text style={styles.secondaryText}>
//               {moment(data?.publish_on).format("DD MMM YYYY")}
//             </Text>
//             <WebView
//               // source={{ html: data?.content }}
//               source={{
//                 html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${data?.content}</body></html>`,
//               }}
//               style={{
//                 marginHorizontal: 13,
//                 flex: 1,
//               }}
//               // javaScriptEnabled={true}
//               // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
//               // scalesPageToFit={true}
//               originWhitelist={["*"]}
//               // onShouldStartLoadWithRequest={shouldStartLoadWithRequest}
//             />
//             {/* </View> */}
//             {/* </ScrollView> */}
//           </View>
//         </View>

//         {/* <TabRoutes /> */}
//       </SafeAreaView>
//     </>
//   );
// };
// const styles = StyleSheet.create({
//   headingText: {
//     fontFamily: "Open Sans",
//     fontSize: 36,
//     fontWeight: "bold",
//     lineHeight: 43,
//     letterSpacing: -0.011,
//     textAlign: "center",
//     color: "#FFFFFF",
//     backgroundColor: "#047835",
//     marginBottom: 10,
//     marginTop: 10,
//   },
//   container: {
//     // width: 333,
//     // height: "auto",
//     // paddingVertical: s20,
//     paddingHorizontal: 0,
//     // marginTop: 10,
//     flexDirection: "column",
//     alignItems: "flex-start", // Align items to the left
//     justifyContent: "flex-start",
//     backgroundColor: "white",
//   },
//   text: {
//     fontFamily: "Open Sans",
//     fontSize: 14,
//     fontWeight: "700",
//     lineHeight: 21,
//     letterSpacing: -0.011,
//     textAlign: "left",
//     marginLeft: 20,
//     color: "#000000",
//   },
//   secondaryText: {
//     fontFamily: "Open Sans",
//     fontSize: 10,
//     fontWeight: "400",
//     lineHeight: 15,
//     letterSpacing: -0.011,
//     textAlign: "left",
//     marginLeft: 20,
//     color: "#000000",
//   },
//   regularText: {
//     fontFamily: "Open Sans",
//     // fontSize: 14,
//     fontSize: responsiveFontSize(2),
//     fontWeight: "400",
//     lineHeight: 21,
//     letterSpacing: -0.011,
//     textAlign: "left",
//     color: "#000000",
//     marginLeft: 20, // Adjust left margin for bullet points
//   },
// });
// export default NotificationDetails;