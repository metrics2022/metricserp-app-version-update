import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityType, CreateLeadActivities, leadDetailsAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextCenter from '../../Component/HeaderTextCenter';
import AlertComponent from '../../Component/AlertComponent';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown'

const AllActivity = ({ navigation, route }) => {
    const state = useSelector((state) => state.SearchLead);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);

    const [activityDetails, setActivityDetails] = useState('');
    const [selectedVal, setSelectedVal] = useState('');


    useEffect(() => {
        if (state) {
            setData(state?.leadDetails)
        }
    }, [state])    // useEffect(() => {
    //     if (state?.errorMessage?.data == '4') {
    //         AlertComponent({
    //             title: state?.errorMessage?.message,
    //             message: '',
    //             buttons: [
    //                 { text: 'ok', onPress: () => onOkPress() },

    //             ]
    //         });
    //     }
    // }, [state?.errorMessage])


    // useEffect(() => {
    //     dispatch(leadDetailsAction(route?.params?.leads_id));
    // }, []);

    // useEffect(() => {
    //     if (state) {
    //         setData(state?.leadDetails)
    //     }
    // }, [state])

    // const readItemFromStorage = async () => {
    //     try {
    //         const jsonValue = await AsyncStorage.getItem('uuid')
    //         return jsonValue != null ? JSON.parse(jsonValue) : null
    //     } catch (e) {
    //         // read error
    //     }
    // }

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

    useEffect(() => {
        dispatch(activityType());
    }, [dispatch]);

    const goBack = () => {
        navigation.goBack()
    }

    //console.log('Addactivities',route.params?.companyInfo.leads_id)

    // Function to handle form submission
    const handleSubmit = async () => {
        if (isSubmitDisabled) return;  // Prevent action if the button is disabled

        try {
            // Dispatch the CreateLeadActivities action
            await dispatch(CreateLeadActivities({
                lead_id: route.params?.companyInfo.leads_id,
                message: activityDetails,
                activity_type_id: selectedVal,
            }));

            // Navigate after successful dispatch
            navigation.navigate('AllActivities', {
                companyInfo: data
            });
        } catch (error) {
            console.error('Error submitting activity:', error);
            // Handle errors (e.g., show an error message to the user)
        }
    };

    const isSubmitDisabled = selectedVal === '' || activityDetails === '';

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
                <HeaderTextLeftRight title={"Add Activity"} goBack={goBack} fontSize={25} />
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

                    <View style={{ position: 'relative', marginTop: 30 }}>
                        <View style={{ width: "100%", marginBottom: 15 }}>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Let's start by choosing the type of activity:</Text>
                            <SelectDropdown
                                buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height: 50 }}
                                buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 16 }}
                                defaultButtonText="Select"
                                data={state?.leadActivity}
                                onSelect={(selectedItem, index) => {
                                    setSelectedVal(selectedItem.activity_id)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    //console.log("selectedItem", selectedItem)
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem.activity_name
                                }}
                                rowTextForSelection={(item, index) => {
                                    //console.log("item", item)
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item.activity_name
                                }}
                                renderDropdownIcon={() => {
                                    return <IconAnt name='caretdown' size={12} color="#000" />;
                                }}
                            />
                        </View>

                        <View style={{ width: "100%", marginBottom: 15 }}>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Please provide activity details:</Text>
                            <TextInput placeholder="Type Here..." placeholderTextColor="#1a1a1a" value={activityDetails} onChangeText={(e) => { setActivityDetails(e) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 12, height: 150, textAlignVertical: 'top' }} />
                        </View>

                        <View style={{ width: "100%", marginTop: 15 }}>
                            <TouchableOpacity style={[styles.btnSubmit, isSubmitDisabled && { backgroundColor: '#a1a1a1' }]}
                                disabled={isSubmitDisabled}
                                onPress={() => {
                                    handleSubmit()
                                }
                                } >
                                <Text style={{ color: "#FFF", fontSize: 15, textAlign: 'center' }}>Submit</Text>
                            </TouchableOpacity>
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
    },
    btnSubmit: {
        width: 120,
        backgroundColor: "#1788F0",
        borderRadius: 35,
        paddingVertical: 10,
        paddingHorizontal: 25,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
});
export default AllActivity
