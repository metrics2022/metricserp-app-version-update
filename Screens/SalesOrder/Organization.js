import React, { useState, useEffect, useCallback } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    Modal
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllOrganizationAction } from '../../Redux/Actions/AllOrganizationAction';
import { getCustOutstandingBalance,getCustPendingSalesInvoicesAction } from '../../Redux/Actions/SalesOrderAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import SelectDropdown from 'react-native-select-dropdown';
import { customerInfoAction, salesQuoteCustomerAction } from '../../Redux/Actions/SalesQuoteAction';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';



const OrganizationSearch = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesQuote);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);
    const soState = useSelector((state) => state.AllSalesOrders);

    const dispatch = useDispatch()
    const [customerId, setCustomerId] = useState(''); // login customer id
    const [customerName, setCustomerName] = useState(''); // login customer name
    const [inputVal, setInputVal] = useState('');
    const [isVisible, setIsvisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [orgId, setOrgId] = useState('');
    const isFocused = useIsFocused();
    const [isLoading, setisLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if(globalReducerState?.getGlobalData?.data?.emp_org?.length > 1){
                setModalVisible(true);
            }else{
                setOrgId(globalReducerState?.getGlobalData?.data?.emp_org[0]?.org_id);
            }
            setIsvisible(false);
            setBtnDisabled(true);
            setInputVal('');
        }, [isFocused])
    );

    useEffect(() => {
        if (soState?.custOutstanding) {
            setisLoading(false);
        }
    }, [soState?.custOutstanding]);

    // console.log(inputVal, "inputVal")
    useEffect(() => {
        if (inputVal.length > 2) {
            dispatch(salesQuoteCustomerAction({
                "value": inputVal
            }));
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [inputVal]);

    const removeLocalStore = async () => {
        try {
            await AsyncStorage.removeItem('customer_id');
        } catch (e) {
        }
    };

    useEffect(() => {
        if (customerId !== "") {
            dispatch(AllOrganizationAction(customerId));
            dispatch(getCustOutstandingBalance({
                "customerId":customerId,
                "org_id":orgId,
            }));
        }
    }, [customerId]);

    const setCustomerData = async (item) => {
        setInputVal(item.customer_name);
        setCustomerName(item.customer_name);
        setCustomerId(item.customer_id);
        setIsvisible(false);
        setBtnDisabled(false);  // Enable button once a customer is selected
        removeLocalStore();
        try {
            await AsyncStorage.setItem('customer_id', item.customer_id.toString());
        } catch (error) {
            console.error('Error saving customer_id to AsyncStorage:', error);
        }
        Keyboard.dismiss();
    };

    const goBack = () => {
        navigation.goBack()
    }

    const handleClose = (index) => {
        setModalVisible(false);
    }

    const OutstandingHandlePress = () => {
        const totalUnpaid = soState?.custOutstanding?.total_unpaid ?? 0;

        if (totalUnpaid === 0) {
            return; // Do nothing if total_unpaid is 0
        }

        dispatch({type:"CUST_OUTSTANDING_RESET"})
        setCustomerId('');
        dispatch(getCustPendingSalesInvoicesAction({
            customerId: customerId,
            org_id: orgId,
            page: 1
        }));

        navigation.navigate('CustPendingInvoices', {
            customerId: customerId,
            orgId: orgId,
        });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                soState?.custOutstanding?.isLoading && (
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
                <HeaderTextLeft title={"Customer"} goBack={goBack} fontSize={25} />
                <View style={styles.line}></View>

                <Text style={styles.Heading}>Let's Find Your Customer</Text>


                <View style={{ zIndex: 9999 }}>
                    {/* Input field */}
                    <TextInput
                        placeholder="Type here..."
                        placeholderTextColor="#000"
                        value={inputVal}
                        onChangeText={(e) => {
                            setInputVal(e);
                            setIsvisible(e.length > 2); // Only show dropdown for input length > 2
                        }}

                        style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50 }}
                    />

                    {/* Autocomplete dropdown */}
                    {state.sqCustomerSearchResult && state.sqCustomerSearchResult.length > 0 && isVisible && (
                        <View style={{
                            marginTop: 5, // Adds spacing between the input and dropdown
                            backgroundColor: "#ededed",
                            maxHeight: 150, // Set max height to allow scrolling
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 4,
                        }}>
                            {/* FlatList to render search results */}
                            <FlatList
                                data={state.sqCustomerSearchResult}
                                keyExtractor={(item) => item.customer_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableWithoutFeedback onPress={() => setCustomerData(item)}>
                                        <Text
                                            style={{
                                                color: "#000",
                                                fontSize: 15,
                                                paddingHorizontal: 10,
                                                paddingVertical: 5,
                                                borderBottomColor: '#ccc',
                                                borderBottomWidth: 1,
                                            }}
                                        >
                                            {item.customer_name}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                )}
                                style={{ maxHeight: 150 }}
                                showsVerticalScrollIndicator={true}
                            />
                        </View>
                    )}
                </View>
                {customerId != ""  &&(

                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.singleButton}
                            onPress={() => {
                                dispatch({type:"CUST_OUTSTANDING_RESET"});
                                navigation.navigate('SearchProducts', {
                                    vendorId: customerId,
                                    customerName: customerName,
                                    orgId: orgId
                                });
                                setCustomerId('');
                            }}
                        >
                        <Text style={[styles.singleButtonText, { color: "white" }]}>
                            New Sales Order
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.singleButton} onPress={OutstandingHandlePress}>
                            <View>
                                {isLoading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={[styles.singleButtonText, { color: "white" }]}>
                                        {soState.custOutstanding.currency_code}{" "}
                                        {parseFloat(soState.custOutstanding.total_unpaid ?? 0).toFixed(2)}
                                    </Text>
                                )}
                                <Text style={[styles.singleButtonText, { fontSize: 15, fontWeight: "700", color: "white" }]}>
                                    Outstanding
                                </Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                )}

            </View>



            <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    // onRequestClose={(index) => {
                    //     setModalVisible(!modalVisible);
                    // }}
                >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <View style={styles.modalView}>
                            {/* <TouchableOpacity onPress={() => { handleClose(); setOrgId(''); }} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity> */}
                            <Text style={{ color: "#626F7F", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>Please choose organization:</Text>
                            <SelectDropdown
                                buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height: 50 }}
                                buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 16 }}
                                defaultButtonText="Select"
                                data={globalReducerState?.getGlobalData?.data?.emp_org}
                                onSelect={(selectedItem, index) => {
                                    setOrgId(selectedItem.org_id);
                                    setModalVisible(!modalVisible);
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    //console.log("selectedItem", selectedItem)
                                    // text represented after item is selected
                                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                                    return selectedItem.org_name;
                                }}
                                rowTextForSelection={(item, index) => {
                                    //console.log("item", item)
                                    // text represented for each item in dropdown
                                    // if data array is an array of objects then return item.property to represent item in dropdown
                                    return item.org_name
                                }}
                                renderDropdownIcon={() => {
                                    return <AntDesign name='caretdown' size={12} color="#000" />;
                                }}
                            />

                            {/* <TouchableOpacity style={[styles.btnSubmit, { backgroundColor: orgId == '' ? "#9d9d9d" : "#1788F0" }]} onPress={() => {
                                navigation.push('searchLeadCustomerScreen', {
                                    pageTitle: navigatePage,
                                    orgId: orgId
                                });
                                setOrgId("");
                                setModalVisible(!modalVisible);
                            }}>
                                <Text style={styles.btnSubmitText}>Next</Text>
                            </TouchableOpacity> */}
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
        // alignItems: "center",
        backgroundColor: '#FFF',
        position: "relative",
        paddingTop: 30,
        paddingBottom: 10,
        paddingHorizontal: 20
    },
    Heading: {
        fontSize: 20,
        fontWeight: "500",
        color: "#252525",
        marginBottom: 35
    },
    // line: {
    //     width: 34,
    //     height: 4,
    //     backgroundColor: "#1788F0",
    //     borderRadius: 3,
    //     marginTop: 10,
    //     marginBottom: 30
    // },
    row: {
      flexDirection: "row",
      alignItems: "center",
      marginTop:80,
    },
    singleButton: {
        width: "48%",
        height: 200,
        marginHorizontal: "1%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1788F0",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    singleButtonText: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
    },
    singleButtonText1: {
        fontSize: 20,
        fontWeight:"700",
        marginLeft:18
    },
    Row: {
      flexDirection: "row",
      marginHorizontal: -5,
      flexWrap: "wrap"
    },
    listItem: {
        fontSize: 15,
        padding: 0
    },
    btnSubmit: {
        width: 170,
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        paddingHorizontal: 18,
        paddingVertical: 12,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: "500",
        textTransform: "uppercase"
    },
    eachbox: {
        width: "100%",
        paddingHorizontal: 5,
        marginBottom: 30
    },
    btnArea: {
        backgroundColor: "#3b5998",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 160,
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

});

export default OrganizationSearch
