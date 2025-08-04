import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SearchLeadCompanyAction } from '../../Redux/Actions/LeadSubmitAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import AlertComponent from '../../Component/AlertComponent';

const LeadCompany = ({ navigation, route }) => {
    const SearchLeadState = useSelector((state) => state.SearchLead);
    const dispatch = useDispatch()
    const [inputVal, setInputVal] = useState('');
    const [companyId, setCompanyId] = useState('')
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [isVisible, setIsvisible] = useState(false);

    // search Company
    useEffect(() => {
        if (inputVal.length > 3) {
            dispatch(SearchLeadCompanyAction(inputVal));
            setBtnDisabled(false);
        } else {
            setIsvisible(false);
            setBtnDisabled(true);
        }
    }, [inputVal]);

    //console.log("SearchLeadState?.leadList", SearchLeadState)

    const goBack = () => {
        navigation.goBack()
    }
    const onOkPress = () => {
        dispatch({ type: "LEAD_SUBMIT_RESET" });
        navigation.navigate('Search');
    };
    useEffect(() => {
        if (SearchLeadState?.errorMessage?.data == '2') {
            AlertComponent({
                title: SearchLeadState?.errorMessage?.message,
                message: '',
                buttons: [
                    { text: 'ok', onPress: () => onOkPress() },
                ]
            });
        }
    }, [SearchLeadState?.errorMessage])

    const handleInputChange = (val) => {
        if (val == "") {
            setCompanyId("");
            dispatch({ type: "LEAD_DETAILS_RESET" });
        }
    }



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"Lead Company"} goBack={goBack} fontSize={25} />

                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", zIndex: 999 }}>
                    <TextInput placeholder="Start Typing..." placeholderTextColor="#1a1a1a" value={inputVal} onChangeText={(e) => {
                        setInputVal(e),
                            setIsvisible(e.length > 3);
                        handleInputChange(e)
                    }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50 }} />
                    {/* {
                        SearchLeadState?.leadList !== undefined && (
                            SearchLeadState?.leadList?.length > 0 && (
                                isVisible && (
                                    <View style={{ width: "100%", height: 150, position: "absolute", top: "100%", zIndex: 999, left: 5, right: 0, backgroundColor: "#ededed", paddingTop: 5, paddingBottom: 8 }}>
                                        <ScrollView keyboardShouldPersistTaps='handled'>
                                            {
                                                SearchLeadState?.leadList?.map((item, index, arr) => {
                                                    if (arr.length - 1 === index) {
                                                        return (
                                                            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), setInputVal(item?.company_name), setIsvisible(false), setCompanyId(item?.company_id), setBtnDisabled(false) }} key={index}>
                                                                <Text style={{ color: "#000", fontSize: 15, paddingHorizontal: 10, paddingVertical: 5 }}>{item?.company_name}</Text>
                                                            </TouchableWithoutFeedback>
                                                        )
                                                    } else {
                                                        return (
                                                            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), setInputVal(item?.company_name), setIsvisible(false), setCompanyId(item?.company_id), setBtnDisabled(false) }} key={index}>
                                                                <Text style={{ color: "#000", fontSize: 15, paddingHorizontal: 10, paddingVertical: 5, borderBottomColor: "#ccc", borderBottomWidth: 1 }}>{item?.company_name}</Text>
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
                    } */}

                    {SearchLeadState?.leadList && SearchLeadState?.leadList?.length > 0 && isVisible && (
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
                                data={SearchLeadState?.leadList}
                                keyExtractor={(item) => item.company_id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(), setInputVal(item?.company_name), setIsvisible(false), setCompanyId(item?.company_id), setBtnDisabled(false) }}>
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
                                            {item.company_name}
                                        </Text>
                                    </TouchableWithoutFeedback>
                                )}
                                style={{ maxHeight: 150 }}
                                showsVerticalScrollIndicator={true}
                            />
                        </View>
                    )}

                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    {
                        <TouchableOpacity disabled={btnDisabled} style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#1788F0" }]} onPress={() => {
                            navigation.navigate('Contact',
                                {
                                    companyId: SearchLeadState?.leadList?.length > 0 ? companyId : '',
                                    companyName: inputVal,
                                    phone_number: route?.params?.phone_number,
                                    email_address: route?.params?.email_address
                                }
                            )
                        }
                        }>
                            <Text style={{ color: "#FFF", fontSize: 18 }}>NEXT</Text>
                        </TouchableOpacity>
                    }
                </View>
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
    btnSubmit: {
        backgroundColor: "#3b5998",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        paddingHorizontal: 18,
        paddingVertical: 8
    },
});

export default LeadCompany;
