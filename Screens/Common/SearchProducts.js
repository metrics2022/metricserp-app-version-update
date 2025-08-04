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
    Modal,
    Image,
    Pressable,
    Alert,
    FlatList,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Keyboard
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { Chip } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';

import { CategoryAutoComplete } from '../../Redux/Actions/CategoryAutoCompleteAction';
import { BrandAutoComplete } from '../../Redux/Actions/BrandAutoCompleteAction';
import { Search } from '../../Redux/Actions/SearchCustomerAction';


import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import Icon from 'react-native-vector-icons/AntDesign';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';
import { getMyLocalData } from '../../config/getLocalStorageData';
import axios from 'axios';
import { API_URL_V1 } from '../../config/constant';
import { addToCart } from '../../Redux/Actions/SalesOrderCartAction';
import { useIsFocused } from '@react-navigation/native';

const SearchProducts = ({ route, navigation }) => {
    const categoryState = useSelector((state) => state.AutocompleteCategoryReducers);
    const brandState = useSelector((state) => state.AutocompleteBrandReducers);
    const searchState = useSelector((state) => state.SearchCustomer);
    const cartState = useSelector(state => state.SalesOrderCartReducer);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);

    const getOrgName = globalReducerState?.getGlobalData?.data?.emp_org?.find((item) => item.org_id == route.params?.orgId);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const [product_qty, setProduct_qty] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPriceProductId, setEditingPriceProductId] = useState(null); // Changed from isEditingPrice
    const [categoryId, setCategoryId] = useState('');
    const [inputVal, setInputVal] = useState('');
    const [isVisible, setIsvisible] = useState(false);
    const [empId, setEmpId] = useState('');

    const [brandId, setBrandId] = useState('');
    const [brandInputVal, setBrandInputVal] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isVisible2, setIsvisible2] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);

    const [searchResults, setSearchResults] = useState([]);
    const [pricingArray, setPricingArray] = useState([]);
    const [uom, setUom] = useState();
    const [uom_name, setUom_name] = useState('');
    const [productId, setProductId] = useState('');

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    const [itemDesc, setItemDesc] = useState('');
    const [itemLineDesc, setItemLineDesc] = useState('');
    const [price, setPrice] = useState('');
    const [marketPrice, setMarketPrice] = useState('');
    const [totalPrice, setTotalPrice] = useState('');

    const [hasMore, setHasMore] = useState(true);

    const [categoryModal, setCategoryModal] = useState(false);
    const [brandModal, setBrandModal] = useState(false);

    const [bandList, setBrandList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [categoryTotalCount, setCategoryTotalCount] = useState('');
    const [categoryNameForShow, setCategoryNameForShow] = useState('');
    const [brandNameForShow, setBrandNameForShow] = useState('');
    const [cplLine, setCplLine] = useState([]);
    const [pageNumberOfCategory, setPageNumberOfCategory] = useState(1);
    const [pageNumberOfBrand, setPageNumberOfBrand] = useState(1);
    const [brandTotalCount, setBrandTotalCount] = useState('');
    const [loader, setLoader] = useState(false);
    const [isItemExistCart, setIsItemExistCart] = useState({});

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    const handleBrandSearch = async (value) => {
        setLoader(true);
        const val = await getMyLocalData();

        let data = {
            "limit": "20",
            "page": pageNumberOfBrand,
            "search": value
        }
        try {
            const response = await axios.post(API_URL_V1 + 'get-brands', data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${val.token}`
                }
            })

            setLoader(false);
            setBrandList(response?.data?.data?.brands);
            setBrandTotalCount(response?.data?.data?.total_count);

        } catch (error) {
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    const handleCategorySearch = async (value) => {
        setLoader(true);
        const val = await getMyLocalData();

        let data = {
            "limit": "20",
            "page": pageNumberOfCategory,
            "search": value
        }
        try {
            const response = await axios.post(API_URL_V1 + 'get-categories', data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${val.token}`
                }
            })

            setLoader(false);
            setCategoryList(response?.data?.data?.categories);
            setCategoryTotalCount(response?.data?.data?.total_count)

        } catch (error) {
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        getData().then((e) => setEmpId(e.emp_id));
        let data = {
            "value": searchState?.searchAllValues?.searchValue,
            "term": searchState?.searchAllValues?.searchValue,
            "customer_id": route.params?.vendorId,
            "org_id": route.params?.orgId,
            "brand_id": searchState?.searchAllValues?.brand?.value !== undefined ? searchState?.searchAllValues?.brand?.value : '',
            "category_id": searchState?.searchAllValues?.category?.value !== undefined ? searchState?.searchAllValues?.category?.value : '',
            "page": page,
            "limit": 10
        }
        dispatch(Search(data));
        handleCategorySearch('');
        handleBrandSearch('');
    }, []);

    const handleSearch = useCallback(() => {
        let data = {
            "value": searchState?.searchAllValues?.searchValue,
            "term": searchState?.searchAllValues?.searchValue,
            "customer_id": route.params?.vendorId,
            "org_id": route.params?.orgId,
            "brand_id": searchState?.searchAllValues?.brand?.value !== undefined ? searchState?.searchAllValues?.brand?.value : '',
            "category_id": searchState?.searchAllValues?.category?.value !== undefined ? searchState?.searchAllValues?.category?.value : '',
            "page": page,
            "limit": 10
        }
        dispatch(Search(data));
        setPage(1);
        Keyboard.dismiss();
    }, [searchState?.searchAllValues]);

    const handleOpen = (item) => {
        setModalVisible(true);
        setItemDesc(item?.item_description);
        setPricingArray(item?.cpl_price?.length > 0 ? item?.cpl_price : item?.price);
        setUom(item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.uom_id : item?.price[0]?.uom_id);
        setUom_name(item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.measure_name : item?.price[0]?.measure_name);
        setPrice(item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.unit_price : item?.price[0]?.unit_price);
        setMarketPrice(item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.market_price : '');
        setTotalPrice(item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.unit_price : item?.price[0]?.unit_price);
        setProduct_qty(1);
        setProductId(item?.item_id);
        setItemLineDesc(item?.item_description_details || '');
        setCplLine(item?.cpl_price?.length > 0 ? item?.cpl_price : '');
    }

    const handleClose = (index) => {
        setModalVisible(false);
        setEditingPriceProductId(null); // Reset editing state
    }

    useEffect(() => {
        if (product_qty > 0) {
            let amount = (price * product_qty).toFixed(2);
            setTotalPrice(amount);
        } else {
            setProduct_qty(1);
            setTotalPrice(price);
        }
    }, [product_qty]);

    const handleIncrement = () => {
        setIsEditing(false);
        setProduct_qty(prevVal => Number(prevVal) + 1);
    }

    const handleDecrement = () => {
        setIsEditing(false);
        if (product_qty > 1) {
            setProduct_qty(prevVal => Number(prevVal) - 1);
        } else if (product_qty > 0 && product_qty < 1) {
            setProduct_qty(0);
        }
    }

    const RadioButton = ({ options, index }) => {
        return (
            options?.map((item, index) => (
                <Chip selected={uom == item.uom_id ? true : false} selectedColor={uom == item.uom_id ? "#FFF" : "#000"} textStyle={{ fontSize: 15, color: "#FFF" }} style={{ marginHorizontal: 6, paddingHorizontal: 8, backgroundColor: uom == item.uom_id ? "#f79256" : "#a2adbc" }} key={index} onPress={() => handleRadioBtn(item.measure_name, item.uom_id, item.unit_price, index)} >{item.measure_name}</Chip>
            ))
        )
    }

    const handleRadioBtn = (measureName, measureId, itemPrice, index) => {
        setUom_name(measureName);
        setUom(measureId);
        setPrice(itemPrice);
        setTotalPrice(Number(product_qty) * itemPrice);
        setProduct_qty(Number(product_qty));
        setIsEditing(false);
        let currentMarketPrice = cplLine[index]?.market_price
        setMarketPrice(currentMarketPrice !== undefined ? currentMarketPrice : '');
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.eachProduct} onPress={() => {
                if (item?.isExist || isItemExistCart[item?.item_id]) {
                    handlePress();
                } else {
                    handleOpen(item);
                }
            }}>
                {item?.cpl_price?.length > 0 && <Fontawesome size={15} color="#d81b60" name='star' style={{ position: 'absolute', zIndex: 9, top: 5, right: 10 }} />}
                <View style={{ borderWidth: 0.5, width: "100%" }}>
                    {
                        item.item_image != "" ? (
                            <Image source={{ uri: item.item_image }} style={{ width: "100%", height: 150, resizeMode: "cover", marginBottom: 10 }} />
                        ) : (
                            <Image source={{ uri: "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" }} style={{ width: "100%", height: 150, resizeMode: "cover", marginBottom: 10 }} />
                        )
                    }

                    <Text style={{ color: "#000", fontSize: 12, marginBottom: 3, textAlign: "center", fontWeight: "800" }}>{item.item_description.length < 22
                        ? `${item.item_description}`
                        : `${item.item_description.substring(0, 20)}...`}</Text>

                    <Text style={{ color: "#000", fontSize: 11, marginBottom: 3, textAlign: "center" }}>
                        <Text style={{ fontSize: 13 }}>
                            {globalReducerState?.getGlobalData?.data?.currency?.currency_code} {item?.cpl_price?.length > 0 ? Number(item?.cpl_price[0]?.market_price).toFixed(2) : Number(item?.price[0]?.unit_price).toFixed(2)}</Text>/{item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.measure_name : item?.price[0]?.measure_name}</Text>

                    <View style={styles.btnCart}>
                        <Text style={{ color: "#FFF", textAlign: 'center' }}>{item?.isExist || isItemExistCart[item?.item_id] ? 'GO TO CART' : 'ADD TO CART'}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        let isExistsToCart = {};
        const itemLists = searchState?.SearchResult?.items?.map(item => {
            const matchingCartItem = cartState.cartItems.find(cartItem => cartItem.productId == item.item_id);
            if (matchingCartItem) {
                isExistsToCart = {
                    [matchingCartItem?.productId]: true
                }
                setIsItemExistCart((prev) => ({
                    ...isExistsToCart
                }));
            } else {
                setIsItemExistCart({})
            }

            return matchingCartItem
                ? { ...item, isExist: true }
                : item;
        });
        setSearchResults(itemLists);
    }, [searchState, isFocused]);

    const handleLoadMore = () => {
        if (searchState?.SearchResult?.items?.length >= searchState?.SearchResult?.total_items) {
        } else {
            setPage(page + 1);
        }
    }

    useEffect(() => {
        if (page > 1) {
            let data = {
                "value": searchState?.searchAllValues?.searchValue,
                "term": searchState?.searchAllValues?.searchValue,
                "customer_id": route.params?.vendorId,
                "org_id": route.params?.orgId,
                "brand_id": searchState?.searchAllValues?.brand?.value !== undefined ? searchState?.searchAllValues?.brand?.value : '',
                "category_id": searchState?.searchAllValues?.category?.value !== undefined ? searchState?.searchAllValues?.category?.value : '',
                "page": page,
                "limit": 10
            }
            dispatch(Search(data));
        }
    }, [page]);

    const renderFooter = () => {
        return (
            searchState.isLoading ? <View style={{ marginTop: 30 }}><ActivityIndicator size="large" color="#1788F0" /></View> : null
        )
    }

    const handleNumberChange = (text) => {
        const decimalIndex = text.indexOf('.');
        if (decimalIndex !== -1 && text.length - decimalIndex > 5) {
            return;
        }
        setProduct_qty(text);
    }

    const validatePriceInput = (input) => {
        const validInput = input.match(/^\d*\.?\d{0,4}$/);
        return validInput ? input : price;
    };

    const handlePriceChange = (value) => {
        setPrice(value);
        if (editingPriceProductId === productId) { // Check if this product is being edited
            let amount = (value * product_qty).toFixed(2);
            setTotalPrice(amount);
            setSelection({ end: 0 });
        }
    };

    const goBack = () => {
        navigation.goBack()
    }

    const handlePress = () => {
        navigation.navigate('SalesOrderCart');
        dispatch({ type: 'SALES_ORDER_SUBMIT_RESET' });
        dispatch({ type: 'STORE_SELECTED_ORG_ID', payload: route.params?.orgId })
    };

    const controlDecimalValue = (number) => {
        let decimlCount = 4;
        const parts = number.toString().split('.');

        if (parts.length === 1 || parts[1].length <= 2) {
            return parseFloat(number).toFixed(2);
        } else {
            const decimalPart = parts[1].substring(0, 4);
            return `${parts[0]}.${decimalPart}`;
        }
    }

    useEffect(() => {
        if (pageNumberOfCategory) {
            handleCategorySearch(inputVal);
        }
    }, [inputVal]);

    const handleCategoryLoadMore = () => {
        if (categoryList?.length >= categoryTotalCount) {
        } else {
            setPageNumberOfCategory(pageNumberOfCategory + 1);
        }
    }

    const RenderCategoryItem = React.memo(({ item }) => {
        return (
            <TouchableOpacity onPress={() => { setInputVal(item.category_name), setCategoryNameForShow(item.category_name), setCategoryId(item.category_id); setCategoryModal(false); setInputVal(""); handleCategorySearch(""); dispatch({ type: 'UPDATE_CATEGORY', payload: { value: item.category_id, label: item.category_name } }); }} style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
                <Text style={{ color: "#000", fontSize: 14 }}>{item.category_name}</Text>
            </TouchableOpacity>
        )
    })

    const renderCategoryFooter = () => {
        return (
            loader ? <View style={{ marginTop: 30 }}><ActivityIndicator size="large" color="#1788F0" /></View> : null
        )
    }

    useEffect(() => {
        if (pageNumberOfBrand) {
            handleBrandSearch(brandInputVal);
        }
    }, [brandInputVal]);

    const handleBrandLoadMore = () => {
        if (bandList?.length >= brandTotalCount) {
        } else {
            setPageNumberOfBrand(pageNumberOfBrand + 1);
        }
    }

    const RenderBrandItem = React.memo(({ item }) => {
        return (
            <TouchableOpacity onPress={() => { setBrandInputVal(item.brand_name); setBrandNameForShow(item.brand_name); setBrandId(item.brand_id); setBrandModal(false); setBrandInputVal(""); handleBrandSearch(""); dispatch({ type: 'UPDATE_BRAND', payload: { value: item.brand_id, label: item.brand_name } }); }} style={{ paddingHorizontal: 10, paddingVertical: 8, borderBottomColor: "#ccc", borderBottomWidth: 1 }}>
                <Text style={{ color: "#000", fontSize: 14 }}>{item.brand_name}</Text>
            </TouchableOpacity>
        )
    })

    const renderBrandFooter = () => {
        return (
            loader ? <View style={{ marginTop: 30 }}><ActivityIndicator size="large" color="#1788F0" /></View> : null
        )
    }

    const [selection, setSelection] = useState({ start: 0, end: 0 });

    const handleIconPress = (productId) => {
        setEditingPriceProductId(productId); // Set the specific product being edited
        const textLength = price.toString().length;
        setSelection({ start: 0, end: textLength });
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {
                searchState?.isLoading && (
                    <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)" }}>
                        <View style={{
                            paddingHorizontal: 15, paddingVertical: 15,  borderRadius: 5
                        }}>
                            <Image source={require('../../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                        </View>
                    </View>
                )
            }
            <View style={styles.mainWrapper}>
                <HeaderTextLeftRight title={"Products"} goBack={goBack} fontSize={25} component={
                    <TouchableOpacity style={{ position: 'absolute', right: 15 }} onPress={handlePress}>
                        <Icon
                            name="shoppingcart"
                            style={{ fontSize: 25, color: "#000" }}
                        />
                        {cartState.cartItems?.length > 0 && (
                            <View style={{
                                position: 'absolute',
                                right: -6,
                                top: -3,
                                backgroundColor: 'red',
                                borderRadius: 10,
                                width: 20,
                                height: 20,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                                    {cartState.cartItems.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                } />

                <View style={{ position: "relative", paddingTop: 22 }}>
                    <Text style={[styles.Heading, { fontSize: 16 }]}>Customer: <Text style={{ color: '#1788F0' }}>{route.params?.customerName}</Text>
                    </Text>
                    <Text style={[styles.Heading, { fontSize: 16 }]}>Organization: <Text style={{ color: '#1788F0' }}>{getOrgName?.org_name}</Text>
                    </Text>
                </View>

                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, position: "relative", zIndex: 99 }}>
                    <View style={{ width: "48%", borderRadius: 5, position: "relative", zIndex: 99 }}>
                        <TouchableOpacity style={{ backgroundColor: "#F2F1F8", paddingHorizontal: 12, height: 50, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setCategoryModal(true); }}>
                            <Text style={{ fontSize: 12, color: "#626F7F", paddingRight: 20 }}>{searchState?.searchAllValues?.category?.label !== undefined ? searchState?.searchAllValues?.category?.label : 'Select Category'}</Text>
                        </TouchableOpacity>
                        {searchState?.searchAllValues?.category?.label !== undefined && <MaterialCommunityIcons size={22} color="red" name="close-circle-outline" onPress={() => { setCategoryNameForShow(''); setCategoryId(''); dispatch({ type: 'UPDATE_CATEGORY', payload: {} }); }} style={{ position: 'absolute', right: 10, top: 14 }} />}
                    </View>
                    <View style={{ width: "48%", marginLeft: "4%", borderRadius: 5, position: "relative", zIndex: 99 }}>
                        <TouchableOpacity style={{ backgroundColor: "#F2F1F8", paddingHorizontal: 12, height: 50, flexDirection: 'row', alignItems: 'center' }} onPress={() => { setBrandModal(true); }}>
                            <Text style={{ fontSize: 12, color: "#626F7F", paddingRight: 20 }}>{searchState?.searchAllValues?.brand?.label !== undefined ? searchState?.searchAllValues?.brand?.label : 'Select Brand'}</Text>
                        </TouchableOpacity>
                        {searchState?.searchAllValues?.brand?.label !== undefined && <MaterialCommunityIcons size={22} color="red" name="close-circle-outline" onPress={() => { setBrandNameForShow(''); setBrandId(''); dispatch({ type: 'UPDATE_BRAND', payload: {} }); }} style={{ position: 'absolute', right: 10, top: 14 }} />}
                    </View>

                    <View style={{ width: "80%", marginTop: 15, overflow: "hidden", position: 'relative' }}>
                        <TextInput value={searchState?.searchAllValues?.searchValue} onChangeText={(e) => {
                            setSearchKeyword(e); dispatch({
                                type: 'UPDATE_SEARCH_VALUE',
                                payload: e,
                            })
                        }} placeholder="Please search for products" placeholderTextColor="#000" style={{ width: "100%", height: 45, backgroundColor: "#F2F1F8", paddingHorizontal: 10, color: "#000", fontSize: 12 }} />
                        {searchState?.searchAllValues?.searchValue !== "" && <MaterialCommunityIcons size={22} color="red" name="close-circle-outline" onPress={() => {
                            setSearchKeyword(''); dispatch({
                                type: 'UPDATE_SEARCH_VALUE',
                                payload: '',
                            })
                        }} style={{ position: 'absolute', right: 10, top: 14 }} />}
                    </View>
                    <View style={{ width: "16%", marginLeft: "4%", marginTop: 15, overflow: "hidden" }}>
                        <TouchableOpacity style={styles.btnSubmit} onPress={() => handleSearch()}>
                            <Fontawesome size={20} color="#FFF" name="search" />
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    searchResults == '' || searchState?.SearchResult?.length == 0 ? (
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
                            onEndReachedThreshold={0.1}
                            numColumns={2}
                            horizontal={false}
                            style={{ marginTop: 30 }}
                        />
                    )
                }
            </View>
            <View style={[styles.centeredView, { backgroundColor: modalVisible ? "rgba(0,0,0,0.5)" : "transparent", display: modalVisible ? "flex" : "none" }]}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={(index) => {
                        setModalVisible(!modalVisible);
                        setEditingPriceProductId(null); // Reset editing state
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                        <TouchableWithoutFeedback onPress={() => { setIsEditing(false); setEditingPriceProductId(null); Keyboard.dismiss(); }} accessible={false}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={styles.container}
                                keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
                            >
                                <View style={styles.modalView}>
                                    <TouchableOpacity onPress={() => handleClose()} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                                    <Text style={{ color: "#000", fontSize: 20, fontWeight: "700", marginBottom: 5, textAlign: "center" }}>{itemDesc}</Text>
                                    {
                                        globalReducerState?.getGlobalData?.data?.allow_so_price_change == 1 ? (
                                            editingPriceProductId === productId ? ( // Check if this product is being edited
                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Text style={{
                                                        color: "#3d5a80",
                                                        fontSize: 18,
                                                        textAlign: "center",
                                                        position: "relative",
                                                    }}>
                                                        {globalReducerState?.getGlobalData?.data?.currency?.currency_code}
                                                    </Text>
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}>
                                                        <TextInput
                                                            keyboardType="numeric"
                                                            defaultValue={price.toString()}
                                                            value={price.toString()}
                                                            autoFocus
                                                            onChangeText={(e) => handlePriceChange(validatePriceInput(e))}
                                                            selection={Platform.OS === 'android' ? selection : undefined}
                                                            style={{
                                                                color: "#3d5a80",
                                                                fontSize: 18,
                                                                textAlign: "center",
                                                            }}
                                                        />
                                                        <Fontawesome name="pencil" size={18} color="#1788F0" style={{ marginLeft: 10 }} />
                                                    </View>
                                                </View>
                                            ) : (
                                                <Text
                                                    onPress={() => handleIconPress(productId)} // Pass productId to handleIconPress
                                                    style={{
                                                        color: "#3d5a80",
                                                        fontSize: 18,
                                                        textAlign: "center",
                                                        position: "relative",
                                                    }}
                                                >
                                                    {globalReducerState?.getGlobalData?.data?.currency?.currency_code}{" "}
                                                    {marketPrice !== "" && (
                                                        <>
                                                            <Text style={{ textDecorationLine: "line-through" }}>
                                                                {controlDecimalValue(Number(marketPrice))}
                                                            </Text>
                                                        </>
                                                    )}{" "}
                                                    {controlDecimalValue(Number(price))}{" "}
                                                    {marketPrice !== "" && (
                                                        <Text style={{ position: "absolute", color: "red" }}>*</Text>
                                                    )}
                                                    <Fontawesome name="pencil" size={18} color="#1788F0" style={{ marginLeft: 25 }} />
                                                </Text>
                                            )
                                        ) : (
                                            <Text
                                                style={{
                                                    color: "#3d5a80",
                                                    fontSize: 18,
                                                    textAlign: "center",
                                                    position: "relative",
                                                }}
                                            >
                                                {globalReducerState?.getGlobalData?.data?.currency?.currency_code}{" "}
                                                {marketPrice !== "" && (
                                                    <>
                                                        <Text style={{ textDecorationLine: "line-through" }}>
                                                            {controlDecimalValue(Number(marketPrice))}
                                                        </Text>
                                                    </>
                                                )}{" "}
                                                {controlDecimalValue(Number(price))}{" "}
                                                {marketPrice !== "" && (
                                                    <Text style={{ position: "absolute", color: "red" }}>*</Text>
                                                )}
                                            </Text>
                                        )
                                    }

                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 20 }}>
                                        <TouchableOpacity disabled={product_qty > 0 ? false : true} onPress={handleDecrement} style={{
                                            width: 35,
                                            height: 35,
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#FFF",
                                            borderRadius: 35,
                                            shadowOffset: {
                                                width: 0,
                                                height: 3,
                                            },
                                            shadowOpacity: 0.12,
                                            shadowRadius: 4.65,
                                            elevation: 6,
                                        }}>
                                            <MaterialCommunityIcons size={20} color="#000" name="minus" />
                                        </TouchableOpacity>
                                        {
                                            isEditing ? (
                                                <TextInput keyboardType='numeric' autoFocus value={Number(product_qty)} onChangeText={(e) => handleNumberChange(e)} style={{ paddingHorizontal: 20, fontSize: 20, color: "#000" }} />
                                            ) : (
                                                <Text onPress={() => setIsEditing(true)} style={{ paddingHorizontal: 20, fontSize: 20, color: "#000" }}>{Number(product_qty)}</Text>
                                            )
                                        }
                                        <TouchableOpacity onPress={handleIncrement} style={{
                                            width: 35,
                                            height: 35,
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "#FFF",
                                            borderRadius: 35,
                                            shadowOffset: {
                                                width: 0,
                                                height: 3,
                                            },
                                            shadowOpacity: 0.12,
                                            shadowRadius: 4.65,
                                            elevation: 6,
                                        }}>
                                            <MaterialCommunityIcons size={20} color="#000" name="plus" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                        <RadioButton options={pricingArray} />
                                    </View>
                                    <Text style={{ color: "#3d5a80", fontSize: 16, textAlign: "center", marginTop: 15 }}><Text style={{ fontWeight: "700", color: "#3d5a80" }}>Total:</Text> {globalReducerState?.getGlobalData?.data?.currency?.currency_code} {Number(totalPrice).toFixed(2)}</Text>
                                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                                        <Pressable
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={() => {
                                                dispatch(addToCart({
                                                    productData: {
                                                        itemDesc, product_qty, productId, uom, uom_name, totalPrice, price, itemLineDesc, cartItemId: Date.now() + Math.random()
                                                    }
                                                }));
                                                setIsItemExistCart((prev) => ({
                                                    ...prev,
                                                    [productId]: !prev[productId]
                                                }));
                                                handleClose();
                                                setIsEditing(false);
                                            }}
                                        >
                                            <Text style={styles.textStyle}>ADD TO CART</Text>
                                        </Pressable>
                                    </View>
                                    <TextInput placeholder="Add any notes or special instructions for this item.."
                                        editable
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical='top'
                                        placeholderTextColor="#a1a1a1"
                                        style={{ width: 280, backgroundColor: "#e1e2e3", fontSize: 14, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 60, borderRadius: 10, marginTop: 10 }}
                                        value={itemLineDesc}
                                        defaultValue={itemLineDesc}
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={(e) => setItemLineDesc(e)}
                                    />
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible2}
                    onRequestClose={(index) => {
                        setModalVisible2(!modalVisible2);
                    }}
                >
                    <View style={{ flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center", marginLeft: -12, marginRight: -12 }}>
                        <View style={styles.modalView}>
                            <TouchableOpacity onPress={() => { setModalVisible2(false) }} style={{ position: "absolute", right: -10, top: -10, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={35} color="red" name="close-circle" /></TouchableOpacity>
                            <Text style={{ color: "#000", fontSize: 16, marginBottom: 10, paddingHorizontal: 5, position: "relative", fontWeight: "700" }}>Line Note</Text>
                            <View>
                                <TextInput placeholder="Type quote description"
                                    editable
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical='top'
                                    placeholderTextColor="#a1a1a1"
                                    style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, paddingTop: 10, height: 250, borderRadius: 10 }}
                                    value={itemLineDesc}
                                    defaultValue={itemLineDesc}
                                    onChangeText={(e) => setItemLineDesc(e)}
                                />
                                <TouchableOpacity style={[styles.btnSubmit, { borderRadius: 8, marginTop: 15 }]} onPress={() => setModalVisible2(false)}>
                                    <Text style={styles.textStyle}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>

            <View style={[styles.centeredView, { backgroundColor: categoryModal || brandModal ? "rgba(0,0,0,0.5)" : "transparent", display: categoryModal || brandModal ? "flex" : "none" }]}>
                <Modal
                    animationType="fade"
                    visible={categoryModal}
                    onRequestClose={(index) => {
                        setCategoryModal(categoryModal);
                    }}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
                        <View style={{
                            width: "100%", position: "relative", zIndex: 99, paddingHorizontal: 15, paddingVertical: 15, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5, backgroundColor: "#FFF", marginBottom: 15
                        }}>
                            <Text style={{ color: '#000', fontSize: 20, fontWeight: "700", marginBottom: 5 }}>All Categories</Text>
                            <View style={styles.line}></View>
                            <TouchableOpacity onPress={() => { setInputVal(""); setCategoryId(""); handleCategorySearch(""); setCategoryModal(false); }} style={{ position: "absolute", right: 10, top: 20, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={25} color="red" name="close-circle" /></TouchableOpacity>
                            <View style={{ position: 'relative' }}>
                                <TextInput placeholder="Type here" placeholderTextColor="#000" value={inputVal} onChangeText={(e) => { setInputVal(e), handleCategorySearch(e); }} style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50 }} />
                                {inputVal?.length > 0 && <MaterialCommunityIcons size={24} color="red" name="close" onPress={() => { setInputVal(""); setCategoryId(""); handleCategorySearch(""); }} style={{ position: 'absolute', right: 10, top: 12 }} />}
                            </View>
                        </View>

                        {
                            categoryList?.length > 0 &&
                            <FlatList
                                data={categoryList}
                                renderItem={({ item }) => <RenderCategoryItem item={item} />}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={handleCategoryLoadMore}
                                ListFooterComponent={renderCategoryFooter}
                                onEndReachedThreshold={0.1}
                                horizontal={false}
                            />
                        }
                    </SafeAreaView>
                </Modal>

                <Modal
                    animationType="fade"
                    visible={brandModal}
                    onRequestClose={(index) => {
                        setBrandModal(!brandModal);
                    }}
                >
                    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
                        <View style={{
                            width: "100%", position: "relative", zIndex: 99, paddingHorizontal: 15, paddingVertical: 15, shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5, backgroundColor: "#FFF", marginBottom: 15
                        }}>
                            <Text style={{ color: '#000', fontSize: 20, fontWeight: "700", marginBottom: 5 }}>All Brands</Text>
                            <View style={styles.line}></View>
                            <TouchableOpacity onPress={() => { setBrandInputVal(""); setBrandId(''); handleBrandSearch(''); setBrandModal(false); }} style={{ position: "absolute", right: 10, top: 20, zIndex: 99, backgroundColor: "#FFF", borderRadius: 40, overflow: "hidden" }}><MaterialCommunityIcons size={25} color="red" name="close-circle" /></TouchableOpacity>
                            <View style={{ position: 'relative' }}>
                                <TextInput placeholder="Type here" placeholderTextColor="#000" value={brandInputVal} onChangeText={(e) => { setBrandInputVal(e), handleBrandSearch(e); }} style={{ backgroundColor: "#F2F1F8", fontSize: 15, color: "#000", paddingHorizontal: 12, height: 50 }} />
                                {brandInputVal?.length > 0 && <MaterialCommunityIcons size={24} color="red" name="close" onPress={() => { setBrandInputVal(""); setBrandId(""); handleBrandSearch(""); }} style={{ position: 'absolute', right: 10, top: 12 }} />}
                            </View>
                        </View>

                        {
                            bandList?.length > 0 &&
                            <FlatList
                                data={bandList}
                                renderItem={({ item }) => <RenderBrandItem item={item} />}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={handleBrandLoadMore}
                                ListFooterComponent={renderBrandFooter}
                                onEndReachedThreshold={0.1}
                                horizontal={false}
                            />
                        }
                    </SafeAreaView>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative",
        paddingTop: 30,
        paddingHorizontal: 20
    },
    Row: {
        flexDirection: "row",
        marginHorizontal: -5,
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    listItem: {
        fontSize: 15,
        padding: 0
    },
    btnSubmit: {
        backgroundColor: "#3b5998",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 45
    },
    eachProduct: {
        width: "50%",
        paddingHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 25,
        position: 'relative'
    },
    btnCart: {
        backgroundColor: "#3b5998",
        paddingHorizontal: 15,
        paddingVertical: 6,
        marginTop: 8
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
    button: {
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
        marginTop: 15
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    Heading: {
        fontWeight: "500",
        color: "#252525",
    },
    line: {
        width: 34,
        height: 4,
        backgroundColor: "#1788F0",
        borderRadius: 3,
        marginTop: 0,
        marginBottom: 15,
        marginLeft: 0
    },
});

export default SearchProducts