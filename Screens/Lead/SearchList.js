import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    FlatList,
    Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchLeadAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import AlertComponent from '../../Component/AlertComponent';
import IconAnt from 'react-native-vector-icons/AntDesign';


const LeadSearchList = ({ navigation, route }) => {

    const state = useSelector((state) => state.SearchLead)
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [leadType, setLeadType] = useState('');


    //console.log("route?.params", route?.params)
    const getLeadType = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (error) {
        }
    }

    useEffect(() => {
        getLeadType().then((e) => setLeadType(e.default_lead_type));
    }, []);

    const onOkPress = () => {
        dispatch({ type: "LEAD_SUBMIT_RESET" });
        navigation.navigate('Search');
    };
    useEffect(() => {
        if (state?.errorMessage?.data == '1') {
            AlertComponent({
                title: state?.errorMessage?.message,
                message: '',
                buttons: [
                    { text: 'ok', onPress: () => onOkPress() },
                ]
            });
        }
    }, [state?.errorMessage])


    //console.log("state?.leadSearchResult",  state?.leadSearchResult?.data.length)

    useEffect(() => {
        if (state?.leadSearchResult?.data?.length > 0) {
            setData([...data, ...state?.leadSearchResult?.data])
        }
    }, [state?.leadSearchResult?.data])

    useEffect(() => {
        if (page > 1) {
            dispatch(SearchLeadAction({
                "name":route?.params?.name,
                "email":route?.params?.email,
                "company":route?.params?.company,
                "phone":route?.params?.phone,
                page: page
            }));
        }
    }, [page]);

    const goBack = () => {
        navigation.goBack()
    }
    const renderItem = ({ item }) => {

    
        if (data != 0) {
            return (
              
                <TouchableOpacity onPress={async () => {
                    // Save leads_id to AsyncStorage
                    try {
                        await AsyncStorage.setItem('leads_id', JSON.stringify(item.leads_id));
                        navigation.navigate('Details', { leads_id: item.leads_id });
                    } catch (error) {
                        console.error('Error saving leads_id:', error);
                    }
                }} style={styles.Row}>
                    <View style={{ width: "100%" }}>
                        {item?.name !== "" && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <IconAnt name="user" size={15} color="#1788F0" /><Text style={{ color: "#626F7F", fontSize: 15, marginLeft: 5 }}>{item?.name.concat(" ", item?.l_name)}</Text>
                        </View>}
                        {
                            item?.email !== "" && <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                <IconAnt name="mail" size={15} color="#1788F0" /><Text style={{ color: "#626F7F", fontSize: 15, marginLeft: 5 }}>{item?.email}</Text>
                            </View>
                        }

                    </View>
                    <Icon size={26} color="#626F7F" name="angle-right" style={{ position: "absolute", top: "38%", right: 0 }} />
                </TouchableOpacity>
            )
           
        }
    }
    const handleLoadMore = ()=> {
        if (state?.isLoading || state?.leadSearchResult?.data?.length >= state?.leadSearchResult?.total_count) {
            // console.log("No more data to load or data is still loading");
            return;
        }
        if (state?.leadSearchResult?.data?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }

    }
    const renderFooter = () => {
        return (
            state?.isLoading ? <View style={{ marginTop: 20 }}><ActivityIndicator size="large" color="#1788F0" /></View> : null
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
        {
            state?.isLoading && (
                <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%",   justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)" }}>
                <View style={{
                    paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5
                    }}>
                <Image source={require('../../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                </View>
                </View>
            )
        }
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"All Leads"} goBack={goBack} fontSize={25} />
                {
                    // state?.leadSearchResult === "0" ? (
                        state?.leadSearchResult?.data?.length == 0 ? (
                        <View style={{ justifyContent: "center", marginTop: 40 }}>
                            <View style={{ justifyContent: "center", flexDirection: "row" }}>
                                <Image
                                    source={require('../../assets/warning.png')}
                                    width="10"
                                    height="10"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 }}>Sorry! No Result Found</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                {
                                    leadType == '1' ? (
                                        <TouchableOpacity style={styles.btnSubmit} onPress={() => {
                                            navigation.navigate('Company', {
                                                phone_number: route?.params?.phone,
                                                email_address:route?.params?.email,
                                            })
                                        }}>
                                            <Text style={{ color: "#FFF", fontSize: 15 }}>Create New Lead</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.btnSubmit} onPress={() => {
                                            //
                                            navigation.navigate('Contact', {
                                                phone_number: route?.params?.phone,
                                                email_address:route?.params?.email,
                                            })
                                        }}>
                                            <Text style={{ color: "#FFF", fontSize: 15 }}>Create New Lead</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </View>
                    )
                        : (
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={handleLoadMore}
                                ListFooterComponent={renderFooter}
                                onEndReachedThreshold={0.5}
                                
                            />
                        )
                }
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
    btnSubmit: {
        backgroundColor: "#1788F0",
        borderRadius: 35,
        paddingVertical: 10,
        paddingHorizontal: 25
    },
});
export default LeadSearchList
