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
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllOrganizationAction } from '../../Redux/Actions/AllOrganizationAction';
import { SearchCustomerAction } from '../../Redux/Actions/SearchCustomerAction';
import { CustomerDependencySiteAction } from '../../Redux/Actions/SearchCustomerAction';
import { CustomerDependencyContactAction } from '../../Redux/Actions/SearchCustomerAction';
import { storeIds } from '../../Redux/Actions/SalesQuoteSubmitAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft'
import SelectDropdown from 'react-native-select-dropdown'
import { Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const OrgCustomerSearch = ({ navigation, route }) => {
    const organizationState = useSelector((state) => state.AllOrganization);
    const searchCustomerState = useSelector((state) => state.SearchCustomer);
    const customerSitesState = useSelector((state) => state.SearchCustomer); // varible that store in store.js
    const customerContactsState = useSelector((state) => state.SearchCustomer);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);
    const dispatch = useDispatch();

    const [customerId, setCustomerId] = useState(''); // login employee id
    const [selectedVal, setSelectedVal] = useState(1);
    const [inputVal, setInputVal] = useState('');
    const [vendorid, setVendorid] = useState(''); // search customer id
    const [isVisible, setIsvisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [menuAccess, setMenuAccess] = useState('');
    const [delivaryVal, setDelivaryVal] = useState('');
    const [customerSitesValue, setcustomerSitesValue] = useState('');
    const [customerContactsValue, setCustomerContactsValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [navigatePage, setNavigatePage] = useState('');
    const [orgId, setOrgId] = useState('');



    const getmoduleData = async () => {
        try {
            //const value = await AsyncStorage.getItem('moduleData')
            const jsonValue = await AsyncStorage.getItem('moduleData')
            return jsonValue != null ? JSON.parse(jsonValue) : null

        } catch (err) {
            // console.log(err)
        }

    }
    useEffect(() => {
        getmoduleData().then((e) => { setMenuAccess(e) });
    }, []);

    //console.log('orgCustomer', menuAccess)

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((e) => { setCustomerId(e.emp_data.emp_id) });
    }, []);

    useEffect(() => {
        if (customerId != "") {
            dispatch(AllOrganizationAction(customerId));
        }
    }, [customerId]);




    const branchItems = () => {
        return (
            organizationState.allBranchs?.map((item, index) => {
                return (
                    <Picker.Item style={styles.listItem} key={index} label={item.org_name} value={item.org_id} />
                )
            })
        )
    }

    useEffect(() => {
        if (inputVal.length > 3) {
            dispatch(SearchCustomerAction(inputVal));
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [inputVal]);

    useEffect(() => {
        if (vendorid) {
            //console.log('cus',vendorid)
            dispatch(CustomerDependencySiteAction(vendorid));
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [vendorid]);

    useEffect(() => {
        if (vendorid) {
            //console.log('con',vendorid)
            dispatch(CustomerDependencyContactAction(vendorid));
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [vendorid]);

    useEffect(() => {
        if (inputVal == "" || customerContactsValue == '') {
            setBtnDisabled(true);
        } else {
            setBtnDisabled(false)
        }
    }, [inputVal, customerContactsValue])
    const goBack = () => {
        navigation.goBack()
    }
    const customerSiteData = () => {
        return (
            customerSitesState.customerSites?.map((item, index) => {
                //console.log('sites',item)
                return (
                    <Picker.Item style={styles.listItem} key={index} label={item.customer_site_code} value={item.customer_site_id} />
                )
            })
        )
    }
    const customerContactData = () => {
        return (
            customerContactsState.customerContacts?.map((item, index) => {
                //console.log('name',item.contact_fname.concat(" " , item.contact_lname))
                return (
                    <Picker.Item style={styles.listItem} key={index} label={item.contact_fname.concat(" ", item.contact_lname)} value={item.customer_contact_id} />
                )
            })
        )
    }


    const handleClose = (index) => {
        setModalVisible(false);
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.mainWrapper}>

                {/* <View style={{ position: "relative" }}>
                <Text style={styles.Heading}>New Sales Quote</Text>
            </View> */}
                <HeaderTextLeft title={"Sales Quote"} goBack={goBack} fontSize={25} />
                <View style={styles.line}></View>
                {/* <View style={styles.Row}>
                    <View style={{ width: "100%", paddingHorizontal: 5 }}>
                        <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Organization:</Text>
                        <Picker
                            selectedValue={selectedVal}
                            style={{ color: "#000", padding: 0, backgroundColor: "#e1e2e3" }}
                            dropdownIconColor="#000"
                            onValueChange={(itemValue, itemIndex) =>
                                setSelectedVal(itemValue)
                            }
                        >

                        <Picker.Item style={styles.listItem} label="Organization One" value="1" />
                        <Picker.Item style={styles.listItem} label="Organization Two" value="2" />
                        {branchItems()}
                        </Picker>
                        <SelectDropdown
                        buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height:50 }}
                        buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 16 }}
                        defaultButtonText="Select Option"
                        data={organizationState?.allBranchs}
                        onSelect={(selectedItem, index) => {
                            setSelectedVal(selectedItem.org_id)
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                            //console.log("selectedItem", selectedItem)
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem.org_name
                        }}
                        rowTextForSelection={(item, index) => {
                            //console.log("item", item)
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item.org_name
                        }}
                        renderDropdownIcon={()=>{
                            return <AntDesign name='caretdown' size={12} color="#000" />;
                        }}
                    />
                    </View>
                </View>
                <View style={[styles.Row, {zIndex:9999, position:'relative'}]}>
                    <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                        <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Customer:</Text>
                        <TextInput placeholder="Start Typing..." placeholderTextColor="#1a1a1a" value={inputVal} onChangeText={(e) => { setInputVal(e), setIsvisible(true) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:50 }} />

                        {
                            searchCustomerState.customerList !== undefined && (
                                searchCustomerState.customerList.length > 0 && (

                                    isVisible && (
                                        <View style={{ width: "100%", height: 150, position: "absolute", overflow: "hidden", top: "100%", zIndex: 999, left: 5, right: 0, backgroundColor: "#ededed", paddingTop: 5, paddingBottom: 8 }}>
                                            <ScrollView keyboardShouldPersistTaps='handled'>
                                                {
                                                    searchCustomerState.customerList?.map((item, index, arr) => {
                                                        if (arr.length - 1 === index) {
                                                            return (
                                                                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), setInputVal(item.customer_name), setIsvisible(false), setVendorid(item.customer_id), setBtnDisabled(false) }} key={index}>
                                                                    <Text style={{ color: "#000", fontSize: 15, paddingHorizontal: 10, paddingVertical: 5}}>{item.customer_name}</Text>
                                                                </TouchableWithoutFeedback>
                                                            )
                                                        } else {
                                                            return (
                                                                <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(), setInputVal(item.customer_name), setIsvisible(false), setVendorid(item.customer_id), setBtnDisabled(false) }} key={index}>
                                                                    <Text style={{ color: "#000", fontSize: 15, paddingHorizontal: 10, paddingVertical: 5, borderBottomColor: "#ccc", borderBottomWidth: 1}}>{item.customer_name}</Text>
                                                                </TouchableWithoutFeedback>
                                                            )
                                                        }

                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                    )
                                )
                            )
                        }

                    </View>
                </View>
                <View style={styles.Row}>
                    <View style={{width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                        <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Customer Sites:</Text>
                        <Picker
                            selectedValue={customerSitesValue}
                            style={{ color: "#000", padding: 0, backgroundColor: "#e1e2e3" }}
                            dropdownIconColor="#000"
                            onValueChange={(itemValue, itemIndex) =>
                                setcustomerSitesValue(itemValue)
                            }
                            >
                             <Picker.Item label="Select Customer Site" value="0" />
                                {
                                    customerSiteData()
                                }
                        </Picker>

                        <SelectDropdown
                            buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height:50 }}
                            buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 16 }}
                            defaultButtonText="Select Customer Site"
                            data={customerSitesState?.customerSites}
                            onSelect={(selectedItem, index) => {
                                setcustomerSitesValue(selectedItem.customer_site_id)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                //console.log("selectedItem", selectedItem)
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                return selectedItem.customer_site_code
                            }}
                            rowTextForSelection={(item, index) => {
                                //console.log("item", item)
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item.customer_site_code
                            }}
                            renderDropdownIcon={()=>{
                                return <AntDesign name='caretdown' size={12} color="#000" />;
                            }}
                    />

                    </View>
                    <View style={{width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                        <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Customer Contacts:</Text>
                        <Picker
                            selectedValue={customerContactsValue}
                            style={{ color: "#000", padding: 0, backgroundColor: "#e1e2e3" }}
                            dropdownIconColor="#000"
                            onValueChange={(itemValue, itemIndex) =>
                                setCustomerContactsValue(itemValue)
                            }
                            >
                             <Picker.Item label="Select Customer Contacts" value="0" />
                                {
                                    customerContactData()
                                }
                        </Picker>

                        <SelectDropdown
                            buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height:50 }}
                            buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 16 }}
                            defaultButtonText="Select Customer Contacts"
                            data={customerContactsState?.customerContacts}
                            onSelect={(selectedItem, index) => {
                                setCustomerContactsValue(selectedItem.customer_contact_id)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                //console.log("selectedItem", selectedItem)
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                return selectedItem.contact_fname.concat(" " , selectedItem.contact_lname)
                            }}
                            rowTextForSelection={(item, index) => {
                                //console.log("item", item)
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item.contact_fname.concat(" " , item.contact_lname)
                            }}
                            renderDropdownIcon={()=>{
                                return <AntDesign name='caretdown' size={12} color="#000" />;
                            }}
                    />

                    </View>
                    <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
                        <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Delivery Address:</Text>
                        <TextInput placeholder="Start Typing..." placeholderTextColor="#1a1a1a" value={delivaryVal} onChangeText={(e) => { setDelivaryVal(e) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:50 }} />

                    </View>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    {

                            <TouchableOpacity disabled={btnDisabled} style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#1788F0" }]} onPress={() => {
                                navigation.navigate('SearchProducts', {
                                    vendorId: vendorid
                                })
                                dispatch(storeIds({
                                    organizationId:selectedVal,
                                    customerId:vendorid,
                                    customerSiteId:customerSitesValue,
                                    customerContactId:customerContactsValue,
                                    delivaryAddress:delivaryVal
                                }))
                            }
                            }>
                                <Text style={{ color: "#FFF", fontSize: 18 }}>NEXT</Text>
                            </TouchableOpacity>
                }
                </View> */}

                <Text style={styles.Heading}>Who would you like to create a Sales Quote for?</Text>

                <View style={styles.eachbox}>

                    <TouchableOpacity
                        style={styles.btnArea}
                        onPress={() => {
                            if (globalReducerState?.getGlobalData?.data?.emp_org?.length > 1) {
                                setModalVisible(true);
                                setNavigatePage("Customer");
                            } else {
                                navigation.push('searchLeadCustomerScreen', {
                                    pageTitle: "Customer",
                                    orgId:globalReducerState?.getGlobalData?.data?.emp_org[0]?.org_id
                                });
                            }
                        }}
                    >
                        <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "600", textTransform: "uppercase", textAlign: 'center' }}>Customer</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.eachbox, {opacity:0.5}]} >
                    <TouchableOpacity
                    style={styles.btnArea}
                    disabled={true}
                    onPress={() => {
                        if (globalReducerState?.getGlobalData?.data?.emp_org?.length > 1) {
                            setModalVisible(true);
                            setNavigatePage("Lead");
                        } else {
                            navigation.push('searchLeadCustomerScreen', {
                                pageTitle: "Lead",
                                orgId:globalReducerState?.getGlobalData?.data?.emp_org[0]?.org_id
                            });
                        }
                    }}>
                        <Text style={{ color: "#FFF", fontSize: 22, fontWeight: "600", textTransform: "uppercase", textAlign: 'center' }}>Lead</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={(index) => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => { handleClose(); setOrgId(''); }} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <Text style={{ color: "#626F7F", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>Please choose organization:</Text>
                            <SelectDropdown
                                buttonStyle={{ backgroundColor: '#e1e2e3', width: '100%', margin: 0, height: 50 }}
                                buttonTextStyle={{ textAlign: 'left', padding: 0, fontSize: 16 }}
                                defaultButtonText="Select"
                                data={globalReducerState?.getGlobalData?.data?.emp_org}
                                onSelect={(selectedItem, index) => {
                                    setOrgId(selectedItem.org_id);
                                    navigation.push('searchLeadCustomerScreen', {
                                        pageTitle: navigatePage,
                                        orgId: selectedItem.org_id
                                    });
                                    // setOrgId("");
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
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 16,
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

export default OrgCustomerSearch
