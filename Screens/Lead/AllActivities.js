import React, { useState, useEffect, useCallback } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LeadActivities, leadDetailsAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextCenter from '../../Component/HeaderTextCenter';
import AlertComponent from '../../Component/AlertComponent';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';


const screenHeight = Dimensions.get('window').height;

const AllActivities = ({ navigation, route }) => {
    const state = useSelector((state) => state.SearchLead);
    const dispatch = useDispatch();

    // console.log(state.newLeadActivities, "sdsdsds")
    const [leadsId, setLeadsId] = useState(null);

    // Function to get leads_id from AsyncStorage
    const getLeadsId = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('leads_id');
            if (jsonValue !== null) {
                setLeadsId(JSON.parse(jsonValue));
            }
        } catch (error) {
            console.error('Error retrieving leads_id:', error);
        }
    };

    useEffect(() => {
        getLeadsId();
    }, []);


    useFocusEffect(
        useCallback(() => {
            if (leadsId != null) {
                dispatch(LeadActivities({
                    "value": leadsId
                }));
            }
        }, [leadsId])
    );

    // useEffect(() => {
    //     dispatch(LeadActivities({"value": route.params?.companyInfo?.leads_id}))
        
    // }, []);
    const goBack = () => {
        navigation.goBack()
    }

    //console.log('activities',state.newLeadActivities)
    

    const formatDate = (timestamp) => {
        const isoDateString = timestamp.replace(' ', 'T');
        const dateObj = new Date(isoDateString);

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
            console.error("Invalid date format:", timestamp);
            return timestamp;
        }

        // Get the month name
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[dateObj.getMonth()];

        // Get the day, year, hours, and minutes
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();

        let hours = dateObj.getHours();
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? String(hours).padStart(2, '0') : '12'; // the hour '0' should be '12'

        return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    }

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
                <HeaderTextLeftRight title={"All Activities"} goBack={goBack} fontSize={25} component={
                    <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('AddActivity', {
                        companyInfo: route.params?.companyInfo
                    })}>
                        <Text style={{ color: '#FFF', fontSize: 14 }}><IconAnt name="plus" size={24} /></Text>
                    </TouchableOpacity>} />
                <ScrollView>
                    <View style={styles.custInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconAnt name="user" size={15} color="#1788F0" /><Text style={{ color: '#626F7F', fontSize: 15, fontWeight: '700', marginLeft: 5 }}>{route.params?.companyInfo?.name}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconAnt name="mail" size={15} color="#1788F0" /><Text style={{ color: '#626F7F', fontSize: 15, fontWeight: '700', marginLeft: 5 }}>{route.params?.companyInfo?.email}</Text></View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconFeather name="phone" size={15} color="#1788F0" /><Text style={{ color: '#626F7F', fontSize: 15, fontWeight: '700', marginLeft: 5 }}>{route.params?.companyInfo?.phonenumber}</Text></View>
                    </View>

                    {
                        state.newLeadActivities?.length > 0 ? (
                            <View style={{ position: 'relative', marginTop: 30 }}>
                                <View style={{ position: 'absolute', left: '10%', top: 5, width: 1, height: "96%", backgroundColor: '#626F7F' }}></View>
                                {state.newLeadActivities?.map((elem, index, arr) => {
                                    return (
                                        <View style={styles.activitiesBox} key={index}>
                                            <View style={styles.activitiesBoxIcon}></View>
                                            <Text style={{ color: '#626F7F', fontSize: 13, marginBottom: 5 }}>{formatDate(elem.timestamp)}</Text>
                                            {
                                                elem.activity_name !== null && <Text style={{ color: '#626F7F', fontSize: 16, fontWeight: '700', marginBottom: 5 }}>{elem.activity_name}</Text>
                                            }
                                            {elem.message !== null && <Text style={{ color: '#626F7F', fontSize: 14 }}>{elem.message}</Text>}
                                        </View>
                                    )
                                })}
                            </View>

                        ) : (
                            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 50 }}>
                                <Text style={{ color: "#6c6c6c", fontSize: 20, fontWeight: '700' }}>No Activity Found!</Text>
                            </View>
                        )

                    }


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
    custInfo: {
        backgroundColor: "#F2F1F8",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 8
    },
    Desc: {
        paddingHorizontal: 14,
        paddingVertical: 10
    },
    activitiesBox: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 5,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        marginBottom: 20,
        borderRadius: 8,
        position: 'relative'
    },
    activitiesBoxIcon: {
        width: 15,
        height: 15,
        position: 'absolute',
        left: '-16%',
        top: 5,
        backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#1788F0',
        borderRadius: 15
    },
    btn: {
        width: 60,
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 12,
        paddingVertical: 8,
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 3,
        borderRadius: 30
    }
});
export default AllActivities
