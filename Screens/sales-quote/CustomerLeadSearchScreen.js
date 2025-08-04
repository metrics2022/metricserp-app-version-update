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
    TouchableWithoutFeedback,
    Image,
    FlatList
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
import { customerInfoAction, salesQuoteCustomerAction } from '../../Redux/Actions/SalesQuoteAction';


const CustomerLeadSearchScreen = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesQuote);
    const { pageTitle, orgId } = route.params;

    const dispatch = useDispatch()
    const [customerId, setCustomerId] = useState(''); // login customer id
    const [customerName, setCustomerName] = useState(''); // login customer name
    const [inputVal, setInputVal] = useState('');
    const [isVisible, setIsvisible] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [custId, setCustId] = useState();

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={pageTitle} goBack={goBack} fontSize={25} />
                <View style={styles.line}></View>

                <Text style={styles.Heading}>Let's Find Your {pageTitle}</Text>


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

                <TouchableOpacity disabled={btnDisabled} style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#1788F0" }]} onPress={() => {
                    dispatch({ type: "RESET_CART_DATA" }); dispatch({ type: "SEARCH_RESET" });
                    navigation.navigate('Products', {
                        vendorId: customerId,
                        customerName: customerName,
                        orgId: orgId
                    })
                }}>
                    <Text style={styles.btnSubmitText}>Next</Text>
                </TouchableOpacity>

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
    }

});

export default CustomerLeadSearchScreen
