import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Modal,
    ActivityIndicator,
    Image,
    SafeAreaView
} from 'react-native';
import HeaderTextLeft from '../../Component/HeaderTextLeft';

import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getMyLocalData } from '../../config/getLocalStorageData';
import Toast from 'react-native-toast-message';
import { HandleWorkOrderSearchAction } from '../../Redux/Actions/ResourceTransactionsAction';
import { API_URL } from '../../config/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { woDetailsAction } from '../../Redux/Actions/ResourceTransactionsAction';


const Operations = ({ navigation, route }) => {
    const resourceTransactionState = useSelector((state) => state.ResourceTransaction);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);
    const dispatch = useDispatch();
    const { operationLists, isLoading, headerData } = resourceTransactionState;
    const { emp_fname, emp_lname } = globalReducerState?.getGlobalData?.data?.emp_data;
    const [modalVisible, setModalVisible] = useState(false);
    const [workOrderRoutingId, setWorkOrderRoutingId] = useState('');
    const [workOrderOrderId, setWorkOrderOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [workOrderDone, setWorkOrderDone] = useState('')
    const [workOrderProgress, setWorkOrderProgress] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [loadingDone, setLoadingDone] = useState(false);
    const goBack = () => {
        navigation.goBack()
    }

    // console.log('workOrderProgress',workOrderProgress)
    // console.log('workOrderDone',workOrderDone)
    // console.log('operationLists',operationLists[1])

    const handleUpdateOperation = async (isDone, isProgress, type) => {
        if (type === 'progress') {
            setLoadingProgress(true);
        } else if (type === 'done') {
            setLoadingDone(true);
        }
        const val = await getMyLocalData();
        let data = {
            "work_order_routing_id": workOrderRoutingId,
            ...(type === 'progress'
                && { "work_order_routing_progress": type === 'progress' && isProgress == 0 ? 1 : isProgress, }),
            "work_order_routing_done": type === 'done' && isDone == 0 ? 1 : isDone,
            "work_order_id": workOrderOrderId,
            "emp_fname": emp_fname,
            "emp_lname": emp_lname,
        }

        // console.log("data", data)

        try {
            const response = await axios.post(API_URL + '/v1/update-routings', data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${val.token}`
                }
            })
            // console.log("response", response.data)
            if (response?.data?.status == "Success") {
                //dispatch({type:"WO_DETAILS_RESET"});
                Toast.show({
                    type: 'success',
                    text1: response?.data?.message,
                });
                setModalVisible(false);
                // let data = {
                //     "work_order_no": route.params?.workOrderNo,
                //     "page": pageNo
                // }
                // console.log("data", data)
                await dispatch(woDetailsAction(route?.params?.work_order_id));
            }

        } catch (error) {
            // console.log("error", error)
        } finally {
            if (type === 'progress') {
                setLoadingProgress(false);
            } else if (type === 'done') {
                setLoadingDone(false);
            }
        }
    }

    useEffect(() => {
        //console.log('CHECK')
        dispatch(woDetailsAction(route?.params?.work_order_id));
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                isLoading && (
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
                <HeaderTextLeft title={"Operations"} goBack={goBack} fontSize={25} />
                {
                    <ScrollView>
                        {
                            <View style={{ marginBottom: 15 }}>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: '#000' }}><Text style={{ color: '#1788F0' }}>Work Order#:</Text> {headerData?.work_order_no}</Text>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: '#000' }}><Text style={{ color: '#1788F0' }}>Finished Goods:</Text> {headerData?.item_description}</Text>
                                <Text style={{ fontSize: 14, fontWeight: "500", color: '#000' }}><Text style={{ color: '#1788F0' }}>Quantity:</Text> {headerData?.quantity}</Text>
                            </View>
                        }
                        {
                            operationLists?.length > 0 ? (
                                operationLists?.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => { setModalVisible(true); setWorkOrderRoutingId(item?.work_order_routing_id); setWorkOrderDone(item?.work_order_routing_done); setWorkOrderProgress(item?.work_order_routing_progress); setWorkOrderOrderId(item?.work_order_id) }} disabled={item?.work_order_routing_done == 1} style={[styles.eachbox, { backgroundColor: item?.work_order_routing_done == 1 ? '#F2F1F8' : '#FFF' }]}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Text><Fontawesome name='gears' size={20} color="#1788F0" /></Text>
                                                <Text style={{ color: "#626F7F", fontSize: 16, fontWeight: "600", marginLeft: 12 }}>{item?.operation_code}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            ) :(
                                <Text style={{ textAlign: 'center', color: '#626F7F', fontSize: 17 }}>
                                No operations available!
                                </Text>
                            )

                        
                        }

                        {/* <View style={[styles.eachbox, { backgroundColor: '#F2F1F8' }]}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text><Fontawesome name='gears' size={20} color="#1788F0" /></Text>
                                <Text style={{ color: "#626F7F", fontSize: 16, fontWeight: "600", marginLeft: 12 }}>Operation 2</Text>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                    </ScrollView>
                }


                {/* {
                    searchResults == undefined ? (
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700" }}>No Result Found</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={searchResults}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleLoadMore}
                            ListFooterComponent={renderFooter}
                            onEndReachedThreshold={0.5}
                            numColumns={2}
                            horizontal={false}
                            style={{ marginTop: 30 }}
                        />
                    )
                } */}
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
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <Text style={styles.modalText}>Please choose the current status</Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity style={[styles.btnSubmit, { backgroundColor: loadingProgress || workOrderProgress == 1 ? '#626F7F' : "#3b5998", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} disabled={loadingProgress || workOrderProgress == 1} onPress={() => handleUpdateOperation(workOrderDone, workOrderProgress, 'progress')}>
                                    {loadingProgress && <ActivityIndicator size="small" color="#FFF" />}<Text style={{ color: '#FFF', fontSize: 16, marginLeft: 5 }}>In Progress</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnSubmit, { backgroundColor: loadingDone ? '#626F7F' : "#3b5998", flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]} disabled={loadingDone} onPress={() => handleUpdateOperation(workOrderDone, workOrderProgress, 'done')}>
                                    {loadingDone && <ActivityIndicator size="small" color="#FFF" />}<Text style={{ color: '#FFF', fontSize: 16, marginLeft: 5 }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </Modal>
            </View>
            <Toast position='top' style={{ backgroundColor: "#000" }} />
        </SafeAreaView >
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative",
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    eachbox: {
        width: "98%",
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginVertical: 8,
        marginLeft: '1%',
        marginRight: '1%',
        backgroundColor: '#FFF',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    btnArea: {
        backgroundColor: "#3b5998",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 100,
        borderRadius: 10
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
    },
    modalText: {
        fontSize: 16,
        color: '#626F7F',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20
    },
    btnSubmit: {
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginHorizontal: 5
    },

});

export default Operations
