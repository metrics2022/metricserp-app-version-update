import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  BackHandler,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStackScreen from './Screens/AuthStackScreen';
import TabScreen from './Screens/TabScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import AllServices from './Screens/AllServices';
import { enableScreens } from 'react-native-screens';
import VersionCheck from 'react-native-version-check';
import checkVersion from 'react-native-store-version';
import {useNetInfo} from "@react-native-community/netinfo";
import { doVersionCheck } from './Redux/Actions/AuthActions';
// import { VERSION_CHECK_API_URL } from "@env"
import axios from "axios";
import { useIsFocused } from '@react-navigation/native';

const RootStack = createNativeStackNavigator();

const RootStackScreen = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const verifyState = useSelector(state=> state.Verify); //Added just for initialize this state

  const isFocused = useIsFocused();

  // enableScreens()
  const readItemFromStorage = async (data) => {
    try {
      const loggedInUser = await AsyncStorage.getItem("uuid");
      //console.log("localstoragedata", loggedInUser);
      if (loggedInUser !== null) {
        setIsLoggedIn(loggedInUser);
      }else{
        setIsLoggedIn(data);
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
    }
  }

  useEffect(() => {
    readItemFromStorage(verifyState?.verifyData?.data);
    setTimeout(() => {
      setIsloading(false);
    }, 1500);

  }, [verifyState]);


 console.log("verifyState", verifyState)
 console.log("isLoggedIn", isLoggedIn)

  const MINUTE_MS = 10000;
  let alertPresent = false;
  const updatePress = async () => {
     //console.log('press');
     alertPresent = false;
  }

  // useEffect(() => {
  //   const init = async () => {
  //     const response = await axios.get(VERSION_CHECK_API_URL, {
  //       headers: {
  //           "X-Access-Token": "wSsVR61wrET5CPgsz2esIukxn1gBUgzyEEx"
  //       }
  //     });

  //     const latestVersion =  Platform.OS === 'ios' ? response?.data?.data?.ios_version : response?.data?.data?.android_version;
  //     const currentVersion = VersionCheck.getCurrentVersion();
  //     // console.log(latestVersion)
  //     if(currentVersion < latestVersion){
  //       if(alertPresent == false){
  //         alertPresent = true;
  //       Alert.alert(
  //         'Please Update',
  //         'Please update the MetricsERP app to leverage the latest features..',
  //         [
  //           {
  //             text: 'Update',
  //             onPress: () => {
  //               updatePress();
  //               BackHandler.exitApp();
  //               Linking.openURL(
  //                 Platform.OS === 'ios'
  //                   ? 'https://apps.apple.com/app/metricserp/id1480100130'
  //                   : 'https://play.google.com/store/apps/details?id=com.metricsERP'
  //               ); // open the appropriate store depending on the platform
  //             }
  //           }
  //         ],
  //         { cancelable: false }
  //       );
  //       }else{
  //         alertPresent = false;
  //       }

  //     }
  //   };
  //   init();
  // }, []);


  if (isloading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: "#FFF" }}>
        <Image
          source={require('./assets/splash-screen.jpg')}
          resizeMode="cover"
        />
      </View>
    )
  };
  return (
    <RootStack.Navigator screenOptions={{
      headerShown: false
    }}>
      {
        isLoggedIn ? (
          < >
          <RootStack.Screen name="service" component={AllServices} />
          <RootStack.Screen name="tab" component={TabScreen} />
          </>

        ) : (
          <RootStack.Screen name="auth" component={AuthStackScreen} />
        )
      }
    </RootStack.Navigator>
  )
}



const App = () => {
  const netInfo = useNetInfo();
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        {
          netInfo.isConnected ? <RootStackScreen /> :
          <View style={{backgroundColor:"#FFF", flex:1, flexDirection:"column", alignItems:"center", justifyContent:"center", paddingHorizontal:25}}>
            <Text style={{color:"#000", fontSize:24, fontWeight:"700"}}>Connection Error</Text>
            <Text style={{color:"#000", fontSize:15, textAlign:"center"}}>Opps! Looks like your device is not connected to the Internet.</Text>
          </View>
        }
      </NavigationContainer>
    </SafeAreaProvider>
  );
};


export default App;