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
import { SearchCustomerAction } from '../Redux/Actions/SearchCustomerAction';
import { useDispatch, useSelector } from 'react-redux';


const CustomerSearchCom = (props) => {
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isVisible, setIsvisible] = useState(false);
    const searchCustomerState = useSelector((state) => state.SearchCustomer);
    const dispatch = useDispatch();

    return (
        <>
            <View style={styles.Row}>
                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative" }}>
                    <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Customer</Text>
                    <TextInput placeholder="Start Typing..." placeholderTextColor="#1a1a1a" value={props.customer} onChangeText={(e) => { props.setCustomer(e), setIsvisible(true) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />

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
                                                            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), props.setCustomer(item.customer_name), props.setVendorid(item.customer_id), props.onPressFun, setIsvisible(false) }} key={index}>
                                                                <Text style={{ color: "#000", fontSize: 15, paddingHorizontal: 10, paddingVertical: 5 }}>{item.customer_name}</Text>
                                                            </TouchableWithoutFeedback>
                                                        )
                                                    } else {
                                                        return (
                                                            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), props.setCustomer(item.customer_name), props.setVendorid(item.customer_id), props.onPressFun, setIsvisible(false) }} key={index}>
                                                                <Text style={{ color: "#000", fontSize: 15, paddingHorizontal: 10, paddingVertical: 5, borderBottomColor: "#ccc", borderBottomWidth: 1 }}>{item.customer_name}</Text>
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
        </>
    )
}
var styles = StyleSheet.create({
    Row: {
        flexDirection: "row",
        marginHorizontal: -5,
        flexWrap: "wrap"
    },
    listItem: {
        fontSize: 15,
        padding: 0
    },


});
export default CustomerSearchCom