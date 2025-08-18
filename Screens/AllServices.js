import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Alert,
  BackHandler,
  Linking,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyLocalData } from '../config/getLocalStorageData';
import { globalDataAction } from '../Redux/Actions/GlobalDataAction';
import { doLogout } from '../Redux/Actions/AuthActions';
import Icon from 'react-native-vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { VERSION_CHECK_API_URL } from '../config/constant';
import VersionCheck from 'react-native-version-check';
import LogoOverlay from '../Component/LoaderComponent';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';

const AllServices = ( { navigation } ) => {

  const globalReducerState = useSelector((state) => state.GlobalDataReducer);
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [accessSalesOrder, setAccessSalesOrder] = useState('');
  const [accessWorkOrder, setAccessWorkOrder] = useState('');
  const [accessSalesQuote, setAccessSalesQuote] = useState('');
  const [getApiKeyToken, setGetApiKeyToken] = useState(null);
  const [leadType, setLeadType] = useState('');
  const [modules, setModules] = useState([]);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const setMyLocalData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem('uuid', jsonValue);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    getMyLocalData().then((value) => {
      setGetApiKeyToken(value);
      dispatch(globalDataAction(value));
    });
  }, [dispatch, isFocused]);

  useEffect(() => {
    if (globalReducerState?.getGlobalData?.status === 'Success') {
      setMyLocalData(globalReducerState?.getGlobalData?.data);
      setFirstName(globalReducerState?.getGlobalData?.data?.emp_data?.emp_fname);
      setLastName(globalReducerState?.getGlobalData?.data?.emp_data?.emp_lname);
      setAccessSalesOrder(globalReducerState?.getGlobalData?.data?.sales_order_access);
      setAccessWorkOrder(globalReducerState?.getGlobalData?.data?.work_order_access);
      setAccessSalesQuote(globalReducerState?.getGlobalData?.data?.sales_quote_access);
      setModules(globalReducerState?.getGlobalData?.data?.modules);
      setLeadType(globalReducerState?.getGlobalData?.data?.default_lead_type);
    }
  }, [globalReducerState]);

  const accessModule = async (index, menu_name) => {
    const response = await axios.get(VERSION_CHECK_API_URL, {
      headers: {
        'X-Access-Token': 'wSsVR61wrET5CPgsz2esIukxn1gBUgzyEEx',
      },
    });

    const latestVersion =
      Platform.OS === 'ios' ? response?.data?.data?.ios_version : response?.data?.data?.android_version;
    const currentVersion = VersionCheck.getCurrentVersion();
    if (currentVersion < latestVersion) {
      // Alert.alert(
      //   'Please Update',
      //   'Please update the MetricsERP app to leverage the latest features.',
      //   [
      //     {
      //       text: 'Update',
      //       onPress: () => {
      //         BackHandler.exitApp();
      //         Linking.openURL(
      //           Platform.OS === 'ios'
      //             ? 'https://apps.apple.com/app/metricserp/id1480100130'
      //             : 'https://play.google.com/store/apps/details?id=com.metricsERP'
      //         );
      //       },
      //     },
      //   ],
      //   { cancelable: false }
      // );
    } else {
      if (menu_name == 'Sales Order') {
        navigation.navigate('tab', { access: '1' });
      }
      if (menu_name == 'Work Order') {
        navigation.navigate('tab', { access: '2' });
      }
      if (menu_name == 'QUOTE') {
        navigation.navigate('tab', { access: '3' });
      }
      if (menu_name == 'Lead') {
        navigation.navigate('tab', { access: '4' });
      }
      if (menu_name == 'MFG Tracking') {
        navigation.navigate('tab', { access: '5' });
      }
      if (menu_name == 'Delivery') {
        navigation.navigate('tab', { access: '6' });
      }
    }
  };

  const setModuleValue = async (menu) => {
    try {
      const jsonValue = JSON.stringify(menu);
      await AsyncStorage.setItem('moduleData', jsonValue);
    } catch (err) {
      // console.log(err)
    }
  };

  const removeModuleValue = async () => {
    try {
      await AsyncStorage.removeItem('moduleData');
    } catch (err) {
      // console.log(err)
    }
  };

  useEffect(() => {
    removeModuleValue();
  }, []);

  const removeLocalStore = async () => {
    try {
      await AsyncStorage.removeItem('uuid');
    } catch (e) {}
  };

  const logout = async () => {
    Alert.alert(
      'Do you really want to sign out?',
      '',
      [
        { text: 'No', onPress: () => console.log('logout') },
        {
          text: 'Yes',
          onPress: () => {
            removeLocalStore();
            dispatch(doLogout());
          },
        },
      ]
    );
  };

  const renderLoader = () => {
    return (
      <View style={{ flex: 1 }}>
        <LogoOverlay />
      </View>
    );
  };
  return (
    <>
    {/* Keep status bar visible */}
    <StatusBar barStyle="dark-content" backgroundColor="#050505ff" translucent={true} />

    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      {globalReducerState.isLoggedIn ? renderLoader() : (
        <>
        {/* Header */}
        <View style={styles.header}>
          {/* App Logo */}
          <View style={styles.userImage}>
            <Image
              source={require('../assets/metrics-small.webp')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          {/* User Name */}
          <View style={styles.userName}>
            <Fontawesome name="user-circle-o" size={20} color="gray" />
            <Text style={styles.nameText} >
              {firstName} {lastName}
            </Text>
          </View>

          {/* Logout */}
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Icon name="logout" size={25} color="#000" />
          </TouchableOpacity>
        </View>
        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
         <View style={styles.row}>
              {modules?.map((menu, index) => (
                <View key={index} style={styles.eachbox}>
                  <TouchableOpacity
                    disabled={menu?.user_access == '1' ? false : true}
                    style={
                      menu?.user_access == '1'
                        ? styles.btnArea
                        : [styles.btnArea, { backgroundColor: '#D4D8D6', position: 'relative' }]
                    }
                    onPress={() => {
                      accessModule(index, menu?.menu_name);
                      setModuleValue(menu);
                    }}
                  >
                    {menu?.user_access != '1' && (
                      <Fontawesome
                        name="lock"
                        color="#000"
                        size={16}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                      />
                    )}
                    <View
                      style={[styles.eachboxIcon, { backgroundColor: menu?.menu_color || '#f3722c' }]}
                    >
                      {menu?.menu_name == 'Analytics' ? (
                        <MaterialIcons name={menu?.menu_icon} color="#FFF" size={24} />
                      ) : (
                        <FontAwesome5Icon name={menu?.menu_icon} color="#FFF" size={24} />
                      )}
                    </View>
                    <View style={{ flexGrow: 1 }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 18,
                          fontWeight: '600',
                          textTransform: 'capitalize',
                          textAlign: 'left',
                        }}
                      >
                        {menu?.menu_name}
                      </Text>
                      <Text
                        style={{
                          color: '#666',
                          fontSize: 13,
                          fontWeight: '400',
                          textTransform: 'capitalize',
                          textAlign: 'left',
                          paddingRight: 80,
                        }}
                      >
                        {menu?.menu_desc}
                      </Text>
                    </View>
                    <Feather
                      name="chevron-right"
                      color="#aaa"
                      size={24}
                      style={{ position: 'absolute', right: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{ marginBottom: 20 }}></View>
        </ScrollView>
        </>
        
    )}
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    minHeight: 60,
    paddingTop: StatusBar.currentHeight || 0, // Ensures it stays below status bar
  },
  logo: {
  width: 44,
  height: 40,
  borderRadius: 22,
  overflow: 'hidden', // ensures edges are smooth
},
userImage: {
  alignItems: 'center',
  justifyContent: 'center',
},
  userName: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  nameText: {
    color: '#3b5998',
    fontSize: 14,
    marginLeft: 6,
  },
  logoutBtn: {
    position: 'absolute',
    right: 15,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    marginTop: 2,
    marginBottom: 4,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
    paddingBottom: 30,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  userImage: {
    width: 70,
    height: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 80,
    position: 'absolute',
    left: 0,
  },
  row: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingTop: 10,
  },
  eachbox: {
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  btnArea: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 80,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  eachboxIcon: {
    width: 46,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 15,
  },
});

export default AllServices;
