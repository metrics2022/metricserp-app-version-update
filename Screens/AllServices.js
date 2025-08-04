import React, { useState, useEffect } from 'react'
import {
    ScrollView,
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image,
    Alert,
    BackHandler,
    Linking,
    Platform,
} from 'react-native';

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

const AllServices = ({ navigation }) => {
    const globalReducerState = useSelector(state => state.GlobalDataReducer);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accessSalesOrder, setAccessSalesOrder] = useState('');
    const [accessWorkOrder, setAccessWorkOrder] = useState('');
    const [accessSalesQuote, setAccessSalesQuote] = useState('');
    const [getApiKeyToken, setGetApiKeyToken] = useState(null);
    const [leadType, setLeadType] = useState('');
    const [modules, setModules] = useState([]);
    const isFocused = useIsFocused();

    console.log('Loaded AllServices');



    const dispatch = useDispatch();

    const setMyLocalData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.mergeItem('uuid', jsonValue)
        } catch (e) {
            // saving error
        }
    }
    useEffect(() => {
        getMyLocalData().then((value) => {
            setGetApiKeyToken(value);
            dispatch(globalDataAction(value));
        });
    }, [dispatch, isFocused]);


    useEffect(() => {
        if (globalReducerState?.getGlobalData?.status === "Success") {
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

        const response = await axios.get(VERSION_CHECK_API_URL + '/version-check', {
            headers: {
                "X-Access-Token": "wSsVR61wrET5CPgsz2esIukxn1gBUgzyEEx"
            }
        });

        const latestVersion =  Platform.OS === 'ios' ? response?.data?.data?.ios_version : response?.data?.data?.android_version;
        const currentVersion = VersionCheck.getCurrentVersion();
        if (currentVersion < latestVersion) {
            Alert.alert(
                'Please Update',
                'Please update the MetricsERP app to leverage the latest features..',
                [
                    {
                        text: 'Update',
                        onPress: () => {
                            BackHandler.exitApp();
                            Linking.openURL(
                                Platform.OS === 'ios'
                                    ? 'https://apps.apple.com/app/metricserp/id1480100130'
                                    : 'https://play.google.com/store/apps/details?id=com.metricsERP'
                            ); // open the appropriate store depending on the platform
                        }
                    }
                ],
                { cancelable: false }
            );
        } else {
            if (menu_name == 'Sales Order') {
                navigation.navigate('tab', {
                    access: '1'
                })
            }
            if (menu_name == 'Work Order') {
                navigation.navigate('tab', {
                    access: '2'
                })
            }
            if (menu_name == 'QUOTE') {
                navigation.navigate('tab', {
                    access: '3'
                })
            }
            if (menu_name == 'Lead') {
                navigation.navigate('tab', {
                    access: '4'
                })
            }
            if (menu_name == 'MFG Tracking') {
                navigation.navigate('tab', {
                    access: '5'
                })
            }
            if (menu_name == 'Delivery') {
                navigation.navigate('tab', {
                    access: '6'
                })
            }
        }



    }

    const setModuleValue = async (menu) => {
        try {
            const jsonValue = JSON.stringify(menu)
            await AsyncStorage.setItem('moduleData', jsonValue)

        } catch (err) {
            // console.log(err)
        }
    }
    const removeModuleValue = async () => {
        try {
            await AsyncStorage.removeItem('moduleData')
        } catch (err) {
            // console.log(err)
        }


    }
    useEffect(() => {
        removeModuleValue()

    }, []);

    const removeLocalStore = async () => {
        try {
            await AsyncStorage.removeItem('uuid');
        } catch (e) {
        }
    };

    const logout = async () => {
        Alert.alert(
            'Do you really want to sign out?',
            '', // <- this part is optional, you can pass an empty string
            [
                { text: 'No', onPress: () => console.log('logout') },
                {
                    text: 'Yes',
                    onPress: () => {
                        removeLocalStore(), dispatch(doLogout());
                    },
                },
            ],
        );
    };


    const renderLoader = () => {
        return (
            <>
                {
                     <View style={{ flex: 1 }}>
                       <LogoOverlay />
                    </View>
                }
            </>
        )
    }

    // console.log("modules", modules)

    return (
        <SafeAreaView style={{ flex: 1}}>
            {globalReducerState.isLoggedIn ? renderLoader() : (
                <>
                    <View style={{
                        paddingHorizontal: 20, position: 'relative', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8, backgroundColor: '#FFF', shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 3,
                        minHeight: 60
                    }}>
                        <View style={styles.userImage}>
                            <Image
                                source={require('../assets/m-icon.jpg')}
                                width="80"
                                height="44"
                                resizeMode="cover"
                            />
                        </View>
                        <View style={{ color: "#000", flexDirection: 'row', alignItems: 'center', paddingHorizontal: 50 }}>
                            <Text><Fontawesome name="user-circle-o" style={{ fontSize: 20, color: "gray" }} /> </Text>
                            <Text style={{ color: "#3b5998", fontSize: 14, textAlign: 'center' }}>{firstName} {lastName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => { logout() }} style={{ position: 'absolute', right: 15 }}>
                            <Icon name="logout" style={{ fontSize: 25, color: "#000" }} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.mainWrapper}>
                        <View style={styles.row}>
                            {
                                modules?.map((menu, index) => {
                                    //console.log("menu", menu)
                                    return (
                                        <View key={index} style={styles.eachbox}>
                                            
                                        </View>
                                    )
                                })
                            }
                            {/* <View style={styles.eachbox}>
                                <TouchableOpacity style={styles.btnArea} onPress={() => {
                                    navigation.navigate('tab', {
                                        access: '6'
                                    }), setModuleValue("delivery")
                                }}>
                                    <Text style={{ color: "#000", fontSize: 18, fontWeight: "600", textTransform: "uppercase", textAlign: 'center' }}>Delivery</Text>
                                </TouchableOpacity>
                            </View> */}
                        </View>
                        <View style={{marginBottom:20}}></View>
                    </ScrollView>
                </>
            )}


        </SafeAreaView>
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative",
        paddingBottom: 30,
        paddingTop: 15,
        paddingHorizontal: 20
    },
    userImage: {
        width: 70,
        height: 60,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 80,
        position: 'absolute',
        left: 0
    },
    row: {
        flexDirection: "column",
        flexWrap: "wrap",
        paddingTop:10
    },
    eachbox: {
        width: "100%",
        marginBottom: 15,
        paddingHorizontal:8
    },
    btnArea: {
        backgroundColor: "#FFF",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal:15,
        paddingVertical: 10,
        height: 80,
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    eachboxIcon:{
        width:46,
        height:46,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
        marginRight:15
    }
});

export default AllServices
