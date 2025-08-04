import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Fontawesome from 'react-native-vector-icons/FontAwesome';

import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CategoryAutoComplete } from '../Redux/Actions/CategoryAutoCompleteAction';
import { BrandAutoComplete } from '../Redux/Actions/BrandAutoCompleteAction';
import { Search } from '../Redux/Actions/SearchCustomerAction';
import HeaderTextLeft from '../Component/HeaderTextLeft';

const SearchScreen = ({ navigation }) => {
    const categoryState = useSelector((state) => state.AutocompleteCategoryReducers);
    const brandState = useSelector((state) => state.AutocompleteBrandReducers);

    const searchState = useSelector((state) => state.SearchCustomer);

    const dispatch = useDispatch();

    const [categoryId, setCategoryId] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [isVisible, setIsvisible] = useState(false);

    const [brandId, setBrandId] = useState('');
    const [brandInputVal, setBrandInputVal] = useState('');
    const [isVisible2, setIsvisible2] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);

    const [searchResults, setSearchResults] = useState([]);

    // search customer
    useEffect(() => {
        dispatch(CategoryAutoComplete(inputVal));

        if (inputVal == "") {
            setIsvisible2(false);
        }
    }, [inputVal]);

    useEffect(() => {
        dispatch(BrandAutoComplete(brandInputVal));

        if (brandInputVal == "") {
            setIsvisible2(false);
        }
    }, [brandInputVal]);


    const handleSearch = () => {
        dispatch(Search({
            category_id: categoryId,
            brand_id: brandId
        }));
    }

    // console.log('cat_id', categoryId);

    useEffect(() => {
        // console.log('search-resule', searchState.SearchResult);
    }, [searchState]);

    const goBack = () => {
        navigation.goBack()
    }
    return (
        <View style={styles.mainWrapper}>
            {/* <View style={{ position: "relative" }}>
                <Text style={styles.Heading}>Search</Text>
                <View style={styles.line}></View>
            </View> */}
            <HeaderTextLeft title={"Search"} goBack={goBack}fontSize={25}  />
            <View style={styles.Row}>
                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginBottom: 20 }}>
                    {/* <Text style={{color:"#000", fontSize:15}}>Customer</Text> */}
                    <TextInput placeholder="Category" placeholderTextColor="#000" value={inputVal} onChangeText={(e) => { setInputVal(e), setIsvisible(true) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12 }} />

                    {
                        categoryState.allCategoryList !== undefined && (
                            categoryState.allCategoryList.length > 0 && (

                                isVisible && (
                                    <View style={{ width: "100%", height: 150, position: "absolute", overflow: "hidden", top: "100%", zIndex: 999, left: 5, right: 0, backgroundColor: "#ededed", paddingTop: 5, paddingBottom: 8 }}>
                                        <ScrollView>
                                            {
                                                categoryState.allCategoryList?.map((item, index, arr) => {
                                                    if (arr.length - 1 === index) {
                                                        return (
                                                            <TouchableOpacity onPress={() => { setInputVal(item.category_name), setIsvisible(false), setCategoryId(item.category_id), setBtnDisabled(false) }} key={index} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                <Text style={{ color: "#000", fontSize: 15 }}>{item.category_name}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    } else {
                                                        return (
                                                            <TouchableOpacity onPress={() => { setInputVal(item.category_name), setIsvisible(false), setCategoryId(item.category_id), setBtnDisabled(false) }} key={index} style={{ paddingHorizontal: 10, paddingVertical: 5, borderBottomColor: "#ccc", borderBottomWidth: 1 }}>
                                                                <Text style={{ color: "#000", fontSize: 15 }}>{item.category_name}</Text>
                                                            </TouchableOpacity>
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

                <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginBottom: 20 }}>
                    <TextInput placeholder="Brand" placeholderTextColor="#000" value={brandInputVal} onChangeText={(e) => { setBrandInputVal(e), setIsvisible2(true) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12 }} />

                    {
                        brandState.allBrandList !== undefined && (
                            brandState.allBrandList.length > 0 && (

                                isVisible2 && (
                                    <View style={{ width: "100%", height: 150, position: "absolute", overflow: "hidden", top: "100%", zIndex: 999, left: 5, right: 0, backgroundColor: "#ededed", paddingTop: 5, paddingBottom: 8 }}>
                                        <ScrollView>
                                            {
                                                brandState.allBrandList?.map((item, index, arr) => {
                                                    if (arr.length - 1 === index) {
                                                        return (
                                                            <TouchableOpacity onPress={() => { setBrandInputVal(item.brand_name), setIsvisible2(false), setBrandId(item.brand_id) }} key={index} style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
                                                                <Text style={{ color: "#000", fontSize: 15 }}>{item.brand_name}</Text>
                                                            </TouchableOpacity>
                                                        )
                                                    } else {
                                                        return (
                                                            <TouchableOpacity onPress={() => { setBrandInputVal(item.brand_name), setIsvisible2(false), setBrandId(item.brand_id) }} key={index} style={{ paddingHorizontal: 10, paddingVertical: 5, borderBottomColor: "#ccc", borderBottomWidth: 1 }}>
                                                                <Text style={{ color: "#000", fontSize: 15 }}>{item.brand_name}</Text>
                                                            </TouchableOpacity>
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

            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity style={styles.btnSubmit} onPress={() => handleSearch()}>
                    <Text style={{ color: "#FFF", fontSize: 18 }}>SEARCH</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={{ marginTop: 50 }}>

                {
                    searchState.SearchResult?.map((item, index, arr) => (
                        arr.length > 0 && (
                            <TouchableOpacity key={index} style={{ marginBottom: 20 }}>
                                <View style={{ width: "100%" }}>
                                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Item Description: {item.item_description}</Text>
                                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Item Market Price:{item.item_marketprice}</Text>
                                    <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Item UOM {item.item_uom}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    ))
                }

                {
                    searchState.SearchResult == undefined && (
                        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 40 }}>
                            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700" }}>No Result Found</Text>
                        </View>
                    )
                }


            </ScrollView>
        </View>
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
    // Heading: {
    //     fontSize: 26,
    //     fontWeight: "500",
    //     color: "#252525"
    // },
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
        marginTop: 30,
        paddingHorizontal: 18,
        paddingVertical: 8
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: "500",
        textTransform: "uppercase"
    }

});

export default SearchScreen
