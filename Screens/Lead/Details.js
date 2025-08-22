import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { leadDetailsAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';
import AlertComponent from '../../Component/AlertComponent';
import Icon from 'react-native-vector-icons/AntDesign';
import LogoOverlay from '../../Component/LoaderComponent';

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
    }, [state?.errorMessage]);

    useEffect(() => {
        dispatch(leadDetailsAction(route?.params?.leads_id));
    }, []);

    useEffect(() => {
        if (state) {
            setData(state?.leadDetails);
        }
    }, [state]);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        readItemFromStorage().then((value) => { setGetGlobalData(value) });
    }, []);

    const goBack = () => {
        navigation.goBack();
    };

    const renderDetailRow = (label, value, iconName) => {
        return (
            <View style={styles.detailRow}>
                <View style={styles.labelContainer}>
                    {iconName && <Icon name={iconName} size={16} color="#1788F0" style={styles.icon} />}
                    <Text style={styles.labelText}>{label}</Text>
                </View>
                <Text style={styles.valueText}>{value || 'N/A'}</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {state.isLoading && (
                <LogoOverlay />
            )}

            <View style={styles.mainWrapper}>
                <HeaderTextLeftRight
                    title={"Lead Details"}
                    goBack={goBack}
                    fontSize={20}
                    component={
                        <TouchableOpacity
                            style={styles.activitiesButton}
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
                            <Text style={styles.activitiesButtonText}>ACTIVITIES</Text>
                        </TouchableOpacity>
                    }
                />

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.detailsCard}>
                        <View style={styles.cardAccent} />
                        {renderDetailRow("Name", data?.name, "user")}
                        {renderDetailRow("Gender", data?.gender, "idcard")}
                        {renderDetailRow("Date Of Birth", data?.date_of_birth, "calendar")}
                        {renderDetailRow("Company", data?.company, "isv")}
                        {renderDetailRow("Phone Number", data?.country_phone_code + data?.phonenumber?.replace(/\s+/g, ''), "phone")}
                        {renderDetailRow("Email", data?.email, "mail")}
                    </View>
               </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7FB', // soft light background
    },
    mainWrapper: {
        flex: 1,
        paddingTop: 30, // header already has padding
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 20,
    },
     detailsCard: {
        backgroundColor: "#FFF",
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    cardAccent: {
        height: 5,
        backgroundColor: "#1788F0", // accent strip
    },
    detailRow: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f4fa', // subtle bluish divider
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 10,
        color: "#1788F0",
    },
    labelText: {
        color: "#1788F0", // blue labels
        fontSize: 14,
        fontWeight: "600",
    },
    valueText: {
        color: "#333",
        fontSize: 15,
        marginLeft: 26,
    },
    activitiesButton: {
        backgroundColor: "#1788F0",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activitiesButtonText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '600',
    },
});

export default LeadDetails;
