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
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { HandleWorkOrderSearchAction} from '../../Redux/Actions/ResourceTransactionsAction'


const WorkOrderList = ({ navigation, route }) => {

    const resourceTransactionState = useSelector((state) => state.ResourceTransaction);
    const { workOrderLists, isLoading } = resourceTransactionState;
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);

    //console.log(route.params?.workOrderNo)
    useEffect(() => {
        if(page > 1){
            let data = {
             "work_order_no": route.params?.workOrderNo,
             "page": page
            }
            dispatch(HandleWorkOrderSearchAction(data));
           
        }
    }, [page]);
   
    useEffect(() => {
        if (workOrderLists.Serach_result?.length > 0) {
            setData([...data, ...workOrderLists.Serach_result])
        }
    }, [workOrderLists.Serach_result])

    const goBack = () => {
        navigation.goBack()
    }
    const renderItem = ({ item }) => {
        if (data != 0) {
            return (
                <TouchableOpacity onPress={async () => {
                    // Save leads_id to AsyncStorage
                    try {
                        //await AsyncStorage.setItem('work_order_id', JSON.stringify(item.work_order_id));
                        navigation.navigate('Operations', { work_order_id: item.work_order_id });
                    } catch (error) {
                        console.error('Error saving leads_id:', error);
                    }
                }} style={styles.Row}>
                    <View style={{ width: "100%" }}>
                        <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                            <IconAnt name="appstore1" size={15} color="#1788F0"/><Text style={{ color: "#626F7F", fontWeight: "700",fontSize: 15, marginLeft:5}}>#{item?.work_order_no}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', marginBottom: 4}}>
                            <IconAnt name="appstore1" size={15} color="#1788F0"/><Text style={{ color: "#626F7F", fontSize: 15, marginLeft:5}}>Finished Good: {item?.item_description}</Text>
                        </View>
                    </View>
                    <Icon size={26} color="#626F7F" name="angle-right" style={{ position: "absolute", top: "38%", right: 0 }} />
                </TouchableOpacity>
            )
        }
    }
   
    const handleLoadMore = ()=> {
        if (isLoading || workOrderLists.Serach_result?.length >= workOrderLists.Serach_result?.count) {
            // console.log("No more data to load or data is still loading");
            return;
        }
        if ( workOrderLists.Serach_result?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }

    }
    const renderFooter = () => {
        return (
            isLoading ? <View style={{ marginTop: 20 }}><ActivityIndicator size="large" color="#1788F0" /></View> : null
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"All Work Orders"} goBack={goBack} fontSize={25} />
                {
                        workOrderLists.Serach_result?.length == 0 ? (
                        <View style={{ justifyContent: "center", marginTop: 40 }}>
                            <View style={{ justifyContent: "center", flexDirection: "row" }}>
                                <Image
                                    source={require('../../assets/warning.png')}
                                    width="10"
                                    height="10"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 }}>Sorry! No result Found</Text>
                        </View>
                        )
                        :
                        (
                            <FlatList
                                data={data}
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
export default WorkOrderList
