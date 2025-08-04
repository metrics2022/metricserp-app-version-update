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
import { getCustPendingSalesInvoicesAction } from '../../Redux/Actions/SalesOrderAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';



const CustPendingInvoices = ({ navigation, route }) => {

    const state = useSelector((state) => state.AllSalesOrders);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (state?.custPendingInvoices?.data?.length > 0) {
            setData(page === 1 ? state?.custPendingInvoices?.data : prevData => {
                const mergedData = [...prevData, ...state?.custPendingInvoices?.data];
                return Array.from(new Map(mergedData.map(item => [item.si_code, item])).values());
            });
        }
    }, [state?.custPendingInvoices?.data]);
    
    useEffect(() => {
        if (page > 1) {
            dispatch(getCustPendingSalesInvoicesAction({
                "customerId":route?.params?.customerId,
                "org_id":route?.params?.orgId,
                "page": page
            }));
        }
    }, [page]);

    const goBack = () => {
        navigation.goBack()
    }

    //console.log("state.allSalesOrders", state?.custPendingInvoices)
    const renderItem = ({ item }) => {

    
        if (data != 0) {
            return (
              
                <TouchableOpacity style={styles.Row}>
                <View style={{ width: "100%" }}>
                    <Text style={{ color: "#1f1f1f", fontWeight: "500", fontSize: 20, marginBottom: 5 }}>ID #{item.si_code}</Text>
                    <Text style={{ color: "#1f1f1f", fontWeight: "500", fontSize: 16, marginBottom: 5 }}>INVOICE DATE: {item.invoice_date}</Text>
                    <Text style={{ color: "#1f1f1f", fontWeight: "500", fontSize: 16, marginBottom: 5 }}>DUE DATE: {item.invoice_due_date}</Text>
                    <Text style={{ color: "#1f1f1f", fontWeight: "500", fontSize: 16, marginBottom: 5 }}>PENDING AMOUNT: {item.currency_code} {parseFloat(item.total_unpaid).toFixed(2)}</Text>
                    {/* <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>TAG {item.reference1}</Text> */}
                </View>
                
              </TouchableOpacity>
            )
           
        }
    }
  
    const handleLoadMore = () => {
        const totalCount = state?.custPendingInvoices?.total_count || 0;
        const currentCount = data.length;
    
        if (state.isLoading || currentCount >= totalCount) {
            return; // Stops loading new data but keeps previous items scrollable
        }
    
        if (state?.custPendingInvoices?.data?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }
    };
    
    const renderFooter = () => {
        return (
            state?.isLoading && data.length > 0 ? (
                <View style={{ marginTop: 20 }}>
                    <ActivityIndicator size="large" color="#1788F0" />
                </View>
            ) : null
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
                {state?.isLoading && data.length === 0 && (
                    <View style={{
                        flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", 
                        justifyContent: "center", height: "100%", alignItems: "center",
                        backgroundColor: "rgba(255,255,255,0.9)"
                    }}>
                        <Image source={require('../../assets/logoSmall.png')} 
                            style={{ width: 45, height: 45, resizeMode: "cover" }} 
                        />
                    </View>
                )}
                <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"All Pending Invoices"} goBack={goBack} fontSize={25} />
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
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 }}>No Pending Invoices !</Text>
                        </View>
                    )
                    :(
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={renderFooter}
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
export default CustPendingInvoices
