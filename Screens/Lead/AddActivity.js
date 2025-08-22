import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableOpacity,
    TextInput
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityType, CreateLeadActivities, leadDetailsAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import LogoOverlay from '../../Component/LoaderComponent';

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
    }, [state]);

    const [leadsId, setLeadsId] = useState(null);

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

    const handleSubmit = async () => {
        if (isSubmitDisabled) return;

        try {
            await dispatch(CreateLeadActivities({
                lead_id: route.params?.companyInfo.leads_id,
                message: activityDetails,
                activity_type_id: selectedVal,
            }));

            navigation.navigate('AllActivities', {
                companyInfo: data
            });
        } catch (error) {
            console.error('Error submitting activity:', error);
        }
    };

    const isSubmitDisabled = selectedVal === '' || activityDetails === '';

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {state.isLoading && <LogoOverlay />}

            <View style={styles.mainWrapper}>
                <HeaderTextLeftRight title={"Add Activity"} goBack={goBack} fontSize={20} />
                <ScrollView>
                    <View style={styles.custInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconAnt name="user" size={15} color="#1788F0" />
                            <Text style={{ color: '#626F7F', fontSize: 15, fontWeight: '700', marginLeft: 5 }}>
                                {route.params?.companyInfo?.name}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconAnt name="mail" size={15} color="#1788F0" />
                            <Text style={{ color: '#626F7F', fontSize: 15, fontWeight: '700', marginLeft: 5 }}>
                                {route.params?.companyInfo?.email}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconAnt name="phone" size={15} color="#1788F0" />
                            <Text style={{ color: '#626F7F', fontSize: 15, fontWeight: '700', marginLeft: 5 }}>
                                {route.params?.companyInfo?.phonenumber}
                            </Text>
                        </View>
                    </View>

                    <View style={{ position: 'relative', marginTop: 30 }}>
                        <View style={{ width: "100%", marginBottom: 15 }}>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>
                                Let's start by choosing the type of activity:
                            </Text>
                            
                            {/* Replaced SelectDropdown with Picker */}
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedVal}
                                    onValueChange={(itemValue) => setSelectedVal(itemValue)}
                                    style={styles.picker}
                                    dropdownIconColor="#000"
                                >
                                    <Picker.Item label="Select Activity Type" value="" />
                                    {state?.leadActivity?.map((item, index) => (
                                        <Picker.Item 
                                            key={index} 
                                            label={item.activity_name} 
                                            value={item.activity_id} 
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        <View style={{ width: "100%", marginBottom: 15 }}>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>
                                Please provide activity details:
                            </Text>
                            <TextInput 
                                placeholder="Type Here..." 
                                placeholderTextColor="#1a1a1a" 
                                value={activityDetails} 
                                onChangeText={(e) => { setActivityDetails(e) }} 
                                style={{ 
                                    backgroundColor: "#e1e2e3", 
                                    fontSize: 15, 
                                    color: "#000", 
                                    paddingHorizontal: 12, 
                                    paddingTop: 12, 
                                    height: 150, 
                                    textAlignVertical: 'top',
                                    borderRadius: 5
                                }} 
                                multiline
                            />
                        </View>

                        <View style={{ width: "100%", marginTop: 15 }}>
                            <TouchableOpacity 
                                style={[styles.btnSubmit, isSubmitDisabled && { backgroundColor: '#a1a1a1' }]}
                                disabled={isSubmitDisabled}
                                onPress={handleSubmit}
                            >
                                <Text style={{ color: "#FFF", fontSize: 15, textAlign: 'center' }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    custInfo: {
        backgroundColor: "#F2F1F8",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 8
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
    pickerContainer: {
        backgroundColor: '#e1e2e3',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 10,
    },
    picker: {
        width: '100%',
        height: 50,
        color: '#000',
    },
    // ... keep your other existing styles
});

export default AllActivity;