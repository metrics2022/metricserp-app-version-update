import React, { useState, useEffect, useMemo } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Button,
} from 'react-native';
import axios from "axios";
import { API_URL } from "@env"
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from "moment";
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderTextCenter from '../../Component/HeaderTextCenter';
import { ResourceTransactionsDetailsAction } from '../../Redux/Actions/ResourceTransactionsAction';

const ResourceTransactionDetaile = ({ navigation, route }) => {
    const state = useSelector((state) => state.ResourceTransaction);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [routingData, setRoutingData] = useState([]);
    const [getGlobalData, setGetGlobalData] = useState('');

    // console.log("Resource_id", route.params.resource_transaction_id);

    useEffect(() => {
        dispatch(ResourceTransactionsDetailsAction(route.params.resource_transaction_id));
    }, []);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    useEffect(() => {
        readItemFromStorage().then((value) => { setGetGlobalData(value), console.log('stotageData', value) });

    }, []);

    useEffect(() => {
        // console.log('hi', data);
        if (state) {
            setData(state.ResourceTransactionDetails);
            setRoutingData(state.ResourceTransactionDetails.routing);
            // console.log('workorderdetails', state.ResourceTransactionDetails);
        }
    }, [state]);

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                state.isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.4)" }}>
                        <View style={{
                            backgroundColor: "#FFF", paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5, shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.12,
                            shadowRadius: 4.65,
                            elevation: 6,
                        }}>
                            <ActivityIndicator size="large" color="#1788F0" />
                        </View>
                    </View>
                )
            }
            <View style={styles.mainWrapper}>
                <HeaderTextCenter title={"Resource Transaction Details"} goBack={goBack}fontSize={20}  />
                <ScrollView>
                    <View style={{ borderRadius: 10, overflow: "hidden", backgroundColor: "#F9F9F9" }}>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Resource Id</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.resource_transaction_id}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Name</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.work_order_description}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
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
    }
});
export default ResourceTransactionDetaile