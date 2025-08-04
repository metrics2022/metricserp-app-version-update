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
    Modal,
    Image
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { salesOrderDetailsAction } from '../Redux/Actions/SalesOrderAction';
import HeaderTextLeft from '../Component/HeaderTextLeft';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SalesOrderDetails = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesOrders);
    const dispatch = useDispatch();
    const [data, setData] = useState();
    const [currency, setCurrency] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [itemLineDesc, setItemLineDesc] = useState('');

    useEffect(() => {
        dispatch(salesOrderDetailsAction(route.params.header_id));
    }, []);

    useEffect(() => {
        //console.log('hi', state.salesOrderDetails.lines);
        if (state) {
            setData(state.salesOrderDetails);
        }
    }, [state]);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }
    useEffect(() => {
        readItemFromStorage().then((e) => setCurrency(e.currency.currency_code));
    }, []);

    const goBack = () => {
        navigation.goBack()
    }

    const handleOpen =(val)=>{
        setModalVisible(true);
        setItemLineDesc(val);
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
                {/* <View style={{ alignItems: "center", marginBottom: 30, position: "relative" }}>
                    <Text style={{ color: "#000", fontSize: 22, fontWeight: "700" }}>Sales Details</Text>
                    <View style={styles.line}></View>
                </View> */}
                <HeaderTextLeft title={"Sales Order Details"} goBack={goBack} fontSize={25}  />
                <ScrollView>

                    <View style={{ borderRadius: 10, overflow: "hidden", backgroundColor: "#F9F9F9" }}>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Sales Order#</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.so_code}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Customer Name</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.customer_name}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Date</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{data?.add_datetime}</Text>
                        </View>
                        <View style={styles.Label}>
                            <Text style={{ color: "#626F7F", fontSize: 15, fontWeight: "700" }}>Amount ({currency})</Text>
                        </View>
                        <View style={styles.Desc}>
                            <Text style={{ color: "#626F7F", fontSize: 13 }}>{parseFloat(Number(data?.so_amount) + Number(data?.so_taxamount)).toFixed(2)} (Subtotal: {Number(data?.so_amount).toFixed(2)} + Tax: {Number(data?.so_taxamount).toFixed(2)})</Text>
                        </View>
                    </View>

                    <Text style={{ color: "#626F7F", fontSize: 13, marginTop:15 }}>*All prices are tax inclusive</Text>
                    <View style={{ width: "100%", height: 1, backgroundColor: "#F2F1F8", marginVertical:10 }}></View>

                    {
                        data?.lines?.map((item, index) => {
                            return (
                                <View key={index} style={{position:"relative", paddingRight:85}}>
                                    {/* <Text style={styles.heading}>{item.item_description} X {Number(item.order_qty).toFixed(0)}</Text> */}
                                    <View style={{flexDirection:'row', marginBottom:5}}>
                                    <TouchableOpacity style={{marginRight:5}} onPress={() => handleOpen(item?.so_line_description !== undefined ? item?.so_line_description:'')}>
                                        {
                                            item?.item_description == "" ? <Image
                                                source={require('../assets/file-icon2.png')}
                                                style={{ height:20, width: 20 }}
                                            /> : <Image
                                                source={require('../assets/file-icon3.png')}
                                                style={{ height: 20, width: 20 }}
                                            />
                                        }

                                    </TouchableOpacity>
                                    <Text style={styles.heading}>{item.item_description} X {Number(item.order_qty).toFixed(0)}</Text>
                                    </View>
                                    <Text style={styles.para}>{item.measure_name}</Text>
                                    <Text style={styles.price}>
                                    {Number(item.line_subtotal).toFixed(2)}</Text>
                                </View>
                            )
                        })
                    }

                </ScrollView>
            </View>
            <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={(index) => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => {  setModalVisible(false); }} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, paddingHorizontal:0, position: "relative", fontWeight: "700" }}>Line Note</Text>
                            <View style={styles.line}></View>
                            <View style={{marginTop:15}}>
                                <TextInput placeholder="Type quote description"
                                    editable={false}
                                    selectTextOnFocus={false}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical='top'
                                    placeholderTextColor="#a1a1a1"
                                    style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 150, borderRadius: 10 }}
                                    value={itemLineDesc}
                                    defaultValue={itemLineDesc}
                                    onChangeText={(e) => setItemLineDesc(e)}
                                />
                            </View>

                        </View>

                    </View>
                </Modal>
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
    // line: {
    //     width: 50,
    //     height: 4,
    //     backgroundColor: "#1788F0",
    //     borderRadius: 3,
    //     marginTop: 10
    // },
    heading: {
        fontSize: 15,
        color: "#767677",
        fontWeight: "700"
    },
    para: {
        fontSize: 14,
        color: "#000",
        fontWeight: "400",
        marginBottom: 15
    },
    price:{
        position:"absolute",
        top:0,
        right:10,
        color:"#000"
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
    centeredView: {
        width: "100%",
        height: "100%",
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        width: "85%",
        margin: 0,
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 25,
        paddingVertical: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});

export default SalesOrderDetails
