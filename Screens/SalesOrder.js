import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    FlatList
} from 'react-native';

import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

import { useDispatch, useSelector } from 'react-redux';
import { salesOrderAction } from '../Redux/Actions/SalesOrderAction';

import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTextLeft from '../Component/HeaderTextLeft';
const SalesOrder = ({ navigation }) => {

    const state = useSelector((state) => state.AllSalesOrders);
    const salesOrderSubmitState = useSelector(state => state.SalesOrderSubmitReducers);
    const dispatch = useDispatch();

    const [customerId, setCustomerId] = useState('');
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    //console.log('sales-order', data.length);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((e) => setCustomerId(e.emp_data.emp_id));
    }, []);

    useEffect(() => {
        if (customerId != "") {
            dispatch(salesOrderAction({customerId, page}));
        }
    }, [customerId]);

    useEffect(() => {
        if(page > 1){
            dispatch(salesOrderAction({customerId, page}));
        }
    }, [page]);

    // console.log("state.allSalesOrders", state?.allSalesOrders?.total_count)

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={()=> navigation.navigate('Sales-order-details', {
                header_id: item.so_header_id
            })} style={styles.Row}>
                <View style={{ width: "100%" }}>
                    <Text style={{ color: "#1f1f1f", fontWeight: "700", fontSize: 16, marginBottom: 5 }}>#{item.so_code}</Text>
                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>ORDER DATE: {item.add_datetime}</Text>
                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>CUSTOMER: {item.customer_name}</Text>
                    {/* <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>TAG {item.reference1}</Text> */}
                </View>
                <Icon size={26} color="#626F7F" name="angle-right" style={{ position: "absolute", top: "38%", right: 0 }} />
            </TouchableOpacity>
        )
    }


    const handleLoadMore = ()=> {
        // if(state?.allSalesOrders?.orders_query?.length >= 10){
        //     console.log('load more', page);
        //     setPage(page + 1);
        // }
        if (state.isLoading || state?.allSalesOrders?.orders_query?.length >= state?.allSalesOrders?.total_count) {
            // console.log("No more data to load or data is still loading");
            return;
        }
        if (state?.allSalesOrders?.orders_query?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }

    }

    const renderFooter = ()=> {
        return(
            state.isLoading ? <View style={{marginTop:20}}><ActivityIndicator size="large" color="#1788F0" /></View> : null
        )
    }

    const goBack = () => {
        navigation.goBack()
    }


    return (
        <>
            <View style={styles.mainWrapper}>
                {/* <View style={{ alignItems: "center", marginBottom: 25, position: "relative" }}>
                    <Text style={{ color: "#000", fontSize: 22, fontWeight: "700" }}>Sales Order</Text>
                    <View style={styles.line}></View>
                    </View> */}

                <HeaderTextLeft title={"Sales Orders"} goBack={goBack} fontSize={25} />
                <TouchableOpacity onPress={() => navigation.navigate('Organization')} style={{ position: "absolute", right: 15, top: 32 }}><Icon name='plus-square' color="#1788F0" size={25} /></TouchableOpacity>

                {/* <ScrollView>

                    {
                    state.allSalesOrders?.reverse().map((item, index, arr) => (
                        arr.length > 0 ? (
                            <TouchableOpacity onPress={()=> navigation.navigate('Sales-order-details', {
                                header_id: item.so_header_id
                            })} key={index} style={styles.Row}>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ color: "#1f1f1f", fontWeight: "700", fontSize: 16, marginBottom: 5 }}>#{item.so_code}</Text>
                                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>{item.add_datetime}</Text>
                                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>{item.customer_name}</Text>
                                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Tag {item.reference1}</Text>
                                </View>
                                <Icon size={26} color="#626F7F" name="angle-right" style={{ position: "absolute", top: "38%", right: 0 }} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                                <Text style={{ color: "#000", fontSize: 20, fontWeight: "700" }}>No Orders Found</Text>
                            </View>
                        )
                    ))
                }


                </ScrollView> */}
                <FlatList
                    data={state?.allSalesOrders?.orders_query}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={renderFooter}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700" }}>No Orders Found</Text>
                        </View>
                    }
                />
            </View>
        </>
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 30,
        paddingBottom:10,
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
    // line: {
    //     width: 50,
    //     height: 4,
    //     backgroundColor: "#1788F0",
    //     borderRadius: 3,
    //     marginTop: 10
    // },
});

export default SalesOrder