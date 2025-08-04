import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { leadDetailsAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextCenter from '../../Component/HeaderTextCenter';
import AlertComponent from '../../Component/AlertComponent';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';


const LeadDetails = ({ navigation, route }) => {
    const state = useSelector((state) => state.SearchLead);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [getGlobalData, setGetGlobalData] = useState('');

    const onOkPress = () => {
        dispatch({ type: "LEAD_SUBMIT_RESET" });
        navigation.navigate('Search');
    };
    useEffect(() => {
        if (state?.errorMessage?.data == '4') {
            AlertComponent({
                title: state?.errorMessage?.message,
                message: '',
                buttons: [
                    { text: 'ok', onPress: () => onOkPress() },

                ]
            });
        }
    }, [state?.errorMessage])


    useEffect(() => {
        dispatch(leadDetailsAction(route?.params?.leads_id));
    }, []);

    useEffect(() => {
        if (state) {
            setData(state?.leadDetails)
        }
    }, [state])

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((value) => { setGetGlobalData(value) });

    }, []);
    const goBack = () => {
        navigation.goBack()
    }

    //console.log('data',route?.params?.leads_id)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                state.isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)" }}>
                        <View style={{
                            paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5
                        }}>
                            <Image source={require('../../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                        </View>
                    </View>
                )
            }

            <View style={styles.mainWrapper}>
                <HeaderTextLeftRight title={"Lead Details"} goBack={goBack} fontSize={25} component={
                    <TouchableOpacity
                    style={styles.btn}
                    onPress={async () => {
                      try {
                        await AsyncStorage.setItem('leads_id', JSON.stringify(data.leads_id));
                        navigation.navigate('AllActivities', {
                          companyInfo: data,
                        });
                      } catch (error) {
                        console.error('Error saving leads_id:', error);
                      }
                    }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 10 }}>ACTIVITIES</Text>
                  </TouchableOpacity>
                  }
                 
                />
                <ScrollView>
                    <View style={{ borderRadius: 10, overflow: "hidden", backgroundColor: "#F9F9F9" }}>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Name</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.name}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Gender</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.gender}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Date Of Birth</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.date_of_birth}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Company</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.company}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Phone Number</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.country_phone_code + + data?.phonenumber?.replace(/\s+/g, '')}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Email</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.email}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ SafeAreaView >
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    Row: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 15,
        borderBottomColor: "#e1e1e1",
        borderBottomWidth: 1,
        borderStyle: "solid",
        marginBottom: 15
    },
    line: {
        width: 50,
        height: 4,
        backgroundColor: "#1788F0",
        borderRadius: 3,
        marginTop: 10
    },
    Heading: {
        fontSize: 26,
        fontWeight: "500",
        color: "#252525",
        textAlign: "center"
    },
    para: {
        fontSize: 14,
        color: "#000",
        fontWeight: "400",
        marginBottom: 15
    },
    price: {
        position: "absolute",
        top: 0,
        right: 10,
        color: "#000"
    },
    Label: {
        backgroundColor: "#F2F1F8",
        paddingHorizontal: 14,
        paddingVertical: 8
    },
    Desc: {
        paddingHorizontal: 14,
        paddingVertical: 10
    },
    btn:{
        width:90,
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        position: "absolute",
        top:0,
        right:0,
        zIndex: 3,
        borderRadius: 30
    }
});
export default LeadDetails
