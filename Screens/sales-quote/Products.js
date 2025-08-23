import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    Keyboard,
    Dimensions,
    Animated
} from 'react-native';

import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { CategoryAutoComplete } from '../../Redux/Actions/CategoryAutoCompleteAction';
import { BrandAutoComplete } from '../../Redux/Actions/BrandAutoCompleteAction';
import { Search } from '../../Redux/Actions/SearchCustomerAction';
import { addToCart, addToCartFromQuote, handleAddToCart } from '../../Redux/Actions/cartAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';
import { getMyLocalData } from '../../config/getLocalStorageData';
import axios from 'axios';
import { API_URL_V1 } from '../../config/constant';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

const Products = ({ route, navigation }) => {
    const categoryState = useSelector((state) => state.AutocompleteCategoryReducers);
    const brandState = useSelector((state) => state.AutocompleteBrandReducers);
    const searchState = useSelector((state) => state.SearchCustomer);
    const cartState = useSelector(state => state.CartReducer);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);

    const getOrgName = globalReducerState?.getGlobalData?.data?.emp_org?.find((item) => item.org_id == route.params?.orgId);

    const dispatch = useDispatch();
    const [product_qty, setProduct_qty] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editingPriceProductId, setEditingPriceProductId] = useState(null);
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
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastOpacity] = useState(new Animated.Value(0));
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            // error reading value
        }
    }

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        
        Animated.sequence([
            Animated.timing(toastOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            setShowToast(false);
        });
    };

    const handleBrandSearch = async (value, resetPage = true) => {
        setLoader(true);
        const val = await getMyLocalData();

        let data = {
            "limit": "20",
            "page": resetPage ? 1 : pageNumberOfBrand,
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
            if (resetPage) {
                setBrandList(response?.data?.data?.brands);
            } else {
                setBrandList([...bandList, ...response?.data?.data?.brands]);
            }
            setBrandTotalCount(response?.data?.data?.total_count);

        } catch (error) {
            setLoader(false);
        } finally {
            setLoader(false);
        }
    }

    const handleCategorySearch = async (value, resetPage = true) => {
        setLoader(true);
        const val = await getMyLocalData();

        let data = {
            "limit": "20",
            "page": resetPage ? 1 : pageNumberOfCategory,
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
            if (resetPage) {
                setCategoryList(response?.data?.data?.categories);
            } else {
                setCategoryList([...categoryList, ...response?.data?.data?.categories]);
            }
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
        setCplLine(item?.cpl_price?.length > 0 ? item?.cpl_price : '')
    }

    const handleClose = (index) => {
        setModalVisible(false);
        setEditingPriceProductId(null);
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
                <Chip 
                    selected={uom == item.uom_id ? true : false} 
                    selectedColor={uom == item.uom_id ? "#FFF" : "#000"} 
                    textStyle={{ fontSize: 15, color: uom == item.uom_id ? "#FFF" : "#000" }} 
                    style={{ 
                        marginHorizontal: 6, 
                        paddingHorizontal: 8, 
                        backgroundColor: uom == item.uom_id ? "#1788F0" : "#F0F4F8",
                        borderColor: uom == item.uom_id ? "#1788F0" : "#E0E6ED",
                        borderWidth: 1,
                        marginBottom: 8
                    }} 
                    key={index} 
                    onPress={() => handleRadioBtn(item.measure_name, item.uom_id, item.unit_price, index)} 
                >
                    {item.measure_name}
                </Chip>
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

    const renderItem = ({ item, index }) => {
        const isItemInCart = cartState.cartItems.some(cartItem => cartItem.productId === item.item_id);
        
        return (
            <TouchableOpacity 
                style={styles.productCard} 
                onPress={() => handleOpen(item)}
            >
                {item?.cpl_price?.length > 0 && (
                    <View style={styles.featuredBadge}>
                        <Fontawesome size={12} color="#FFF" name='star' />
                    </View>
                )}
                <View style={styles.imageContainer}>
                    {
                        item.item_image != "" ? (
                            <Image source={{ uri: item.item_image }} style={styles.productImage} />
                        ) : (
                            <Image source={{ uri: "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg" }} style={styles.productImage} />
                        )
                    }
                </View>

                <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                        {item.item_description.length < 22
                            ? `${item.item_description}`
                            : `${item.item_description.substring(0, 20)}...`}
                    </Text>

                    <Text style={styles.productPrice}>
                        {globalReducerState?.getGlobalData?.data?.currency?.currency_code} 
                        {item?.cpl_price?.length > 0 
                            ? Number(item?.cpl_price[0]?.unit_price).toFixed(2) 
                            : Number(item?.price[0]?.unit_price).toFixed(2)}
                        <Text style={styles.unitText}>
                            /{item?.cpl_price?.length > 0 ? item?.cpl_price[0]?.measure_name : item?.price[0]?.measure_name}
                        </Text>
                    </Text>

                    <TouchableOpacity 
                        style={[styles.cartButton, isItemInCart && styles.goToCartButton]}
                        onPress={() => {
                            if (isItemInCart) {
                                navigation.navigate('Cart');
                            } else {
                                handleOpen(item);
                            }
                        }}
                    >
                        <Text style={styles.cartButtonText}>
                            {isItemInCart ? 'GO TO CART' : 'ADD TO CART'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        setSearchResults(searchState?.SearchResult?.items);
    }, [searchState]);

    const handleLoadMore = () => {
        if (isLoadingMore || searchState?.SearchResult?.items?.length >= searchState?.SearchResult?.total_items) {
            return;
        }
        setIsLoadingMore(true);
        setPage(prevPage => prevPage + 1);
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

    useEffect(() => {
        if (!searchState.isLoading) {
            setIsLoadingMore(false);
        }
    }, [searchState.isLoading]);

    const renderFooter = () => {
        return (
            isLoadingMore ? (
                <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color="#1788F0" />
                    <Text style={styles.loadingText}>Loading more products...</Text>
                </View>
            ) : null
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
        if (editingPriceProductId === productId) {
            let amount = (value * product_qty).toFixed(2);
            setTotalPrice(amount);
            setSelection({ end: 0 });
        }
    };

    const goBack = () => {
        navigation.goBack()
    }

    const handlePress = () => {
        navigation.navigate('Cart');
        dispatch({ type: 'SALES_ORDER_SUBMIT_RESET' });
        dispatch({ type: 'STORE_SELECTED_ORG_ID', payload: route.params?.orgId })
    };

    const handleCart = async () => {
        setIsLoading(true);
        let data = {
            "customer_id": route.params?.vendorId,
            "org_id": route.params?.orgId,
            "item_id": productId,
            "quantity": product_qty,
            "uom_id": uom,
            "unit_price": price,
            "sub_total": totalPrice,
            "line_note": itemDesc,
            "module_type": "1"
        }

        try {
            const response = await dispatch(handleAddToCart(data))
            if (response.status == "Success") {
                setIsLoading(false);
                showToastMessage('Product added to cart successfully!');
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }

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

    const handleCategoryLoadMore = () => {
        if (categoryList?.length >= categoryTotalCount) {
            return;
        }
        setPageNumberOfCategory(prevPage => prevPage + 1);
    }

    const RenderCategoryItem = React.memo(({ item }) => {
        return (
            <TouchableOpacity 
                onPress={() => { 
                    setInputVal(item.category_name); 
                    setCategoryNameForShow(item.category_name); 
                    setCategoryId(item.category_id); 
                    setCategoryModal(false); 
                    setInputVal(""); 
                    setPageNumberOfCategory(1);
                    handleCategorySearch("", false); 
                    dispatch({ type: 'UPDATE_CATEGORY', payload: { value: item.category_id, label: item.category_name } }); 
                }} 
                style={styles.categoryItem}
            >
                <Text style={styles.categoryText}>{item.category_name}</Text>
            </TouchableOpacity>
        )
    })

    const renderCategoryFooter = () => {
        if (loader && categoryList?.length < categoryTotalCount) {
            return (
                <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color="#1788F0" />
                    <Text style={styles.loadingText}>Loading more categories...</Text>
                </View>
            );
        }
        
        if (!loader && categoryTotalCount > 0 && categoryList?.length >= categoryTotalCount) {
            return (
                <View style={styles.endOfList}>
                    <Text style={styles.endOfListText}>All categories loaded</Text>
                </View>
            );
        }
        
        return null;
    };

    const handleBrandLoadMore = () => {
        if (bandList?.length >= brandTotalCount) {
            return;
        }
        setPageNumberOfBrand(prevPage => prevPage + 1);
    }

    const RenderBrandItem = React.memo(({ item }) => {
        return (
            <TouchableOpacity 
                onPress={() => { 
                    setBrandInputVal(item.brand_name); 
                    setBrandNameForShow(item.brand_name); 
                    setBrandId(item.brand_id); 
                    setBrandModal(false); 
                    setBrandInputVal(""); 
                    setPageNumberOfBrand(1);
                    handleBrandSearch("", false); 
                    dispatch({ type: 'UPDATE_BRAND', payload: { value: item.brand_id, label: item.brand_name } }); 
                }} 
                style={styles.brandItem}
            >
                <Text style={styles.brandText}>{item.brand_name}</Text>
            </TouchableOpacity>
        )
    })

    const renderBrandFooter = () => {
        if (loader && bandList?.length < brandTotalCount) {
            return (
                <View style={styles.loadingFooter}>
                    <ActivityIndicator size="small" color="#1788F0" />
                    <Text style={styles.loadingText}>Loading more brands...</Text>
                </View>
            );
        }
        
        if (!loader && brandTotalCount > 0 && bandList?.length >= brandTotalCount) {
            return (
                <View style={styles.endOfList}>
                    <Text style={styles.endOfListText}>All brands loaded</Text>
                </View>
            );
        }
        
        return null;
    };

    const handleIconPress = (productId) => {
        setEditingPriceProductId(productId);
        const textLength = price.toString().length;
        setSelection({ start: 0, end: textLength });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {searchState?.isLoading && <LogoOverlay />}
            
            {/* Toast Notification */}
            {showToast && (
                <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
                    <Text style={styles.toastText}>{toastMessage}</Text>
                </Animated.View>
            )}
            
            <View style={styles.container}>
                <HeaderTextLeftRight 
                    title={"Products"} 
                    goBack={goBack} 
                    fontSize={20} 
                    component={
                        <TouchableOpacity style={styles.cartIconContainer} onPress={handlePress}>
                            <Icon
                                name="shoppingcart"
                                style={styles.cartIcon}
                            />
                            {cartState.cartItems?.length > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>
                                        {cartState.cartItems.length}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    } 
                />

                <View style={styles.customerInfo}>
                    <Text style={styles.customerLabel}>Customer: 
                        <Text style={styles.customerValue}> {route.params?.customerName}</Text>
                    </Text>
                    <Text style={styles.customerLabel}>Organization: 
                        <Text style={styles.customerValue}> {getOrgName?.org_name}</Text>
                    </Text>
                </View>

                <View style={styles.filterContainer}>
                    <View style={styles.filterRow}>
                        <View style={styles.filterItem}>
                            <TouchableOpacity 
                                style={styles.filterButton} 
                                onPress={() => { 
                                    setCategoryModal(true); 
                                    setIsCategoryModalOpen(true);
                                    setPageNumberOfCategory(1);
                                    handleCategorySearch(''); 
                                }}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    searchState?.searchAllValues?.category?.label !== undefined && styles.filterButtonTextActive
                                ]}>
                                    {searchState?.searchAllValues?.category?.label !== undefined 
                                        ? searchState?.searchAllValues?.category?.label 
                                        : 'Select Category'}
                                </Text>
                                {searchState?.searchAllValues?.category?.label !== undefined && (
                                    <Icon 
                                        size={18} 
                                        color="#E74C3C" 
                                        name="closecircle" 
                                        onPress={() => { 
                                            setCategoryNameForShow(''); 
                                            setCategoryId(''); 
                                            dispatch({ type: 'UPDATE_CATEGORY', payload: {} }); 
                                        }} 
                                        style={styles.filterCloseIcon}  
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.filterItem}>
                            <TouchableOpacity 
                                style={styles.filterButton} 
                                onPress={() => { 
                                    setBrandModal(true); 
                                    setIsBrandModalOpen(true);
                                    setPageNumberOfBrand(1);
                                    handleBrandSearch(''); 
                                }}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    searchState?.searchAllValues?.brand?.label !== undefined && styles.filterButtonTextActive
                                ]}>
                                    {searchState?.searchAllValues?.brand?.label !== undefined 
                                        ? searchState?.searchAllValues?.brand?.label 
                                        : 'Select Brand'}
                                </Text>
                                {searchState?.searchAllValues?.brand?.label !== undefined && (
                                    <Icon 
                                        size={18} 
                                        color="#E74C3C" 
                                        name="closecircle" 
                                        onPress={() => { 
                                            setBrandNameForShow(''); 
                                            setBrandId(''); 
                                            dispatch({ type: 'UPDATE_BRAND', payload: {} }); 
                                        }} 
                                        style={styles.filterCloseIcon}  
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                            <TextInput 
                                value={searchState?.searchAllValues?.searchValue} 
                                onChangeText={(e) => {
                                    setSearchKeyword(e); 
                                    dispatch({
                                        type: 'UPDATE_SEARCH_VALUE',
                                        payload: e,
                                    })
                                }} 
                                placeholder="Search for products..." 
                                placeholderTextColor="#7F8C8D" 
                                style={styles.searchInput} 
                            />
                            {searchState?.searchAllValues?.searchValue !== "" && (
                                <Icon
                                    size={20}
                                    color="#E74C3C"
                                    name="closecircle"
                                    onPress={() => {
                                        setSearchKeyword('');
                                        dispatch({
                                        type: 'UPDATE_SEARCH_VALUE',
                                        payload: '',
                                        });
                                    }}
                                    style={styles.searchCloseIcon}
                                />
                            )}
                        </View>
                        <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch()}>
                            <Fontawesome size={18} color="#FFF" name="search" />
                        </TouchableOpacity>
                    </View>
                </View>

                {searchResults == '' || searchState?.SearchResult?.length == 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No Products Found</Text>
                    </View>
                ) : (
                    <FlatList
                        data={searchResults}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.item_id}-${index}`}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.1}
                        numColumns={2}
                        horizontal={false}
                        style={styles.productsList}
                        contentContainerStyle={styles.productsListContent}
                    />
                )}
            </View>

            {/* Product Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setEditingPriceProductId(null);
                }}
            >
                <View style={styles.centeredView}>
                    <TouchableWithoutFeedback onPress={() => { setIsEditing(false); setEditingPriceProductId(null); Keyboard.dismiss(); }} accessible={false}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardAvoidView}
                            keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
                        >
                            <ScrollView 
                                contentContainerStyle={styles.scrollContainer}
                                keyboardShouldPersistTaps="handled"
                            >
                                <View style={styles.modalView}>
                                    <TouchableOpacity onPress={() => handleClose()} style={styles.modalCloseBtn}>
                                        <Icon size={28} color="#E74C3C" name="closecircle" />
                                    </TouchableOpacity>
                                    
                                    <Text style={styles.modalTitle}>{itemDesc}</Text>
                                    
                                    {globalReducerState?.getGlobalData?.data?.allow_sq_price_change == 1 ? (
                                        editingPriceProductId === productId ? (
                                            <View style={styles.priceEditContainer}>
                                                <Text style={styles.currencySymbol}>
                                                    {globalReducerState?.getGlobalData?.data?.currency?.currency_code}
                                                </Text>
                                                <View style={styles.priceInputWrapper}>
                                                    <TextInput
                                                        keyboardType="numeric"
                                                        defaultValue={price.toString()}
                                                        value={price.toString()}
                                                        autoFocus
                                                        onChangeText={(e) => handlePriceChange(validatePriceInput(e))}
                                                        selection={Platform.OS === 'android' ? selection : undefined}
                                                        style={styles.priceInput}
                                                    />
                                                    <Fontawesome name="pencil" size={16} color="#1788F0" style={styles.editIcon} />
                                                </View>
                                            </View>
                                        ) : (
                                            <TouchableOpacity onPress={() => handleIconPress(productId)} style={styles.priceDisplayContainer}>
                                                <Text style={styles.priceDisplay}>
                                                    {globalReducerState?.getGlobalData?.data?.currency?.currency_code}{" "}
                                                    {marketPrice !== "" && (
                                                        <>
                                                            <Text style={styles.marketPrice}>
                                                                {controlDecimalValue(Number(marketPrice))}
                                                            </Text>
                                                            {" "}
                                                        </>
                                                    )}
                                                    {controlDecimalValue(Number(price))}
                                                    {marketPrice !== "" && (
                                                        <Text style={styles.discountIndicator}>*</Text>
                                                    )}
                                                </Text>
                                                <Fontawesome name="pencil" size={16} color="#1788F0" style={styles.editIconInline} />
                                            </TouchableOpacity>
                                        )
                                    ) : (
                                        <View style={styles.priceDisplayContainer}>
                                            <Text style={styles.priceDisplay}>
                                                {globalReducerState?.getGlobalData?.data?.currency?.currency_code}{" "}
                                                {marketPrice !== "" && (
                                                    <>
                                                        <Text style={styles.marketPrice}>
                                                            {controlDecimalValue(Number(marketPrice))}
                                                        </Text>
                                                        {" "}
                                                    </>
                                                )}
                                                {controlDecimalValue(Number(price))}
                                                {marketPrice !== "" && (
                                                    <Text style={styles.discountIndicator}>*</Text>
                                                )}
                                            </Text>
                                        </View>
                                    )}

                                    <View style={styles.quantityContainer}>
                                        <TouchableOpacity 
                                            disabled={product_qty <= 1} 
                                            onPress={handleDecrement} 
                                            style={[styles.quantityButton, product_qty <= 1 && styles.quantityButtonDisabled]}
                                        >
                                            <Icon 
                                                size={20} 
                                                color={product_qty <= 1 ? "#CCC" : "#2C3E50"} 
                                                name="minus" 
                                            />
                                        </TouchableOpacity>
                                        
                                        {isEditing ? (
                                            <TextInput 
                                                keyboardType='numeric' 
                                                autoFocus 
                                                value={product_qty.toString()} 
                                                onChangeText={(e) => handleNumberChange(e)} 
                                                style={styles.quantityInput} 
                                            />
                                        ) : (
                                            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.quantityDisplay}>
                                                <Text style={styles.quantityText}>{Number(product_qty)}</Text>
                                            </TouchableOpacity>
                                        )}
                                        
                                        <TouchableOpacity 
                                            onPress={handleIncrement} 
                                            style={styles.quantityButton}
                                        >
                                            <Icon size={20} color="#2C3E50" name="plus" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <View style={styles.uomContainer}>
                                        <RadioButton options={pricingArray} />
                                    </View>
                                    
                                    <Text style={styles.totalPrice}>
                                        <Text style={styles.totalLabel}>Total:</Text> 
                                        {globalReducerState?.getGlobalData?.data?.currency?.currency_code} {Number(totalPrice).toFixed(2)}
                                    </Text>
                                    
                                    <View style={styles.modalActions}>
                                        <Pressable
                                            style={styles.addToCartButton}
                                            onPress={() => {
                                                const uniqueCartId = `${productId}-${uom}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                                                
                                                dispatch(addToCartFromQuote({
                                                    productData: {
                                                        itemDesc, 
                                                        product_qty: Number(product_qty), 
                                                        productId, 
                                                        uom, 
                                                        uom_name, 
                                                        totalPrice: Number(totalPrice), 
                                                        price: Number(price), 
                                                        itemLineDesc, 
                                                        cartItemId: uniqueCartId
                                                    }
                                                }));
                                                
                                                showToastMessage('Product added to cart successfully!');
                                                handleClose();
                                                setIsEditing(false);
                                            }}
                                        >
                                            <Text style={styles.addToCartText}>ADD TO CART</Text>
                                        </Pressable>
                                    </View>
                                    
                                    <TextInput 
                                        placeholder="Add any notes or special instructions for this item..."
                                        editable
                                        multiline
                                        numberOfLines={3}
                                        textAlignVertical='top'
                                        placeholderTextColor="#95A5A6"
                                        style={styles.notesInput}
                                        value={itemLineDesc}
                                        defaultValue={itemLineDesc}
                                        onSubmitEditing={Keyboard.dismiss}
                                        onChangeText={(e) => setItemLineDesc(e)}
                                    />
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </Modal>

            {/* Category Modal */}
            <Modal
                animationType="slide"
                visible={categoryModal}
                onRequestClose={() => {
                    setCategoryModal(false);
                    setIsCategoryModalOpen(false);
                    setPageNumberOfCategory(1);
                }}
            >
                <SafeAreaView style={styles.modalFullScreen}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderTitle}>All Categories</Text>
                        <View style={styles.headerDivider} />
                        <TouchableOpacity 
                            onPress={() => { setInputVal(""); setCategoryId(""); handleCategorySearch(""); setCategoryModal(false); }} 
                            style={styles.modalHeaderClose}
                        >
                            <Icon size={28} color="#E74C3C" name="closecircle" />
                        </TouchableOpacity>
                        
                        <View style={styles.modalSearchContainer}>
                            <TextInput 
                                placeholder="Search categories..." 
                                placeholderTextColor="#7F8C8D" 
                                value={inputVal} 
                                onChangeText={(e) => { 
                                    setInputVal(e);
                                    setPageNumberOfCategory(1);
                                    
                                    if (searchTimeout) {
                                        clearTimeout(searchTimeout);
                                    }
                                    
                                    setSearchTimeout(setTimeout(() => {
                                        if (e.trim() === "" || e.length >= 3) {
                                            handleCategorySearch(e, false);
                                        }
                                    }, 500));
                                }} 
                                style={styles.modalSearchInput} 
                            />
                            {inputVal?.length > 0 && (
                                <Icon 
                                    size={22} 
                                    color="#E74C3C" 
                                    name="closecircle" 
                                    onPress={() => { setInputVal(""); setCategoryId(""); handleCategorySearch(""); }} 
                                    style={styles.modalSearchClose} 
                                />
                            )}
                        </View>
                    </View>

                    {categoryList?.length > 0 && (
                        <FlatList
                            data={categoryList}
                            renderItem={({ item }) => <RenderCategoryItem item={item} />}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleCategoryLoadMore}
                            ListFooterComponent={renderCategoryFooter}
                            onEndReachedThreshold={0.5}
                            horizontal={false}
                            style={styles.modalList}
                        />
                    )}
                </SafeAreaView>
            </Modal>

            {/* Brand Modal */}
            <Modal
                animationType="slide"
                visible={brandModal}
                onRequestClose={() => {
                    setBrandModal(false);
                    setIsBrandModalOpen(false);
                    setPageNumberOfBrand(1);
                }}
            >
                <SafeAreaView style={styles.modalFullScreen}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalHeaderTitle}>All Brands</Text>
                        <View style={styles.headerDivider} />
                        <TouchableOpacity 
                            onPress={() => { setBrandInputVal(""); setBrandId(''); handleBrandSearch(''); setBrandModal(false); }} 
                            style={styles.modalHeaderClose}
                        >
                            <Icon size={28} color="#E74C3C" name="closecircle" />
                        </TouchableOpacity>
                        
                        <View style={styles.modalSearchContainer}>
                            <TextInput 
                                placeholder="Search brands..." 
                                placeholderTextColor="#7F8C8D" 
                                value={brandInputVal} 
                                onChangeText={(e) => { 
                                    setBrandInputVal(e);
                                    setPageNumberOfBrand(1);
                                    
                                    if (searchTimeout) {
                                        clearTimeout(searchTimeout);
                                    }
                                    
                                    setSearchTimeout(setTimeout(() => {
                                        if (e.trim() === "" || e.length > 2) {
                                            handleBrandSearch(e, false);
                                        }
                                    }, 500));
                                }} 
                                style={styles.modalSearchInput} 
                            />
                            {brandInputVal?.length > 0 && (
                                <Icon 
                                    size={22} 
                                    color="#E74C3C" 
                                    name="closecircle" 
                                    onPress={() => { setBrandInputVal(""); setBrandId(""); handleBrandSearch(""); }} 
                                    style={styles.modalSearchClose} 
                                />
                            )}
                        </View>
                    </View>

                    {bandList?.length > 0 && (
                        <FlatList
                            data={bandList}
                            renderItem={({ item }) => <RenderBrandItem item={item} />}
                            keyExtractor={(item, index) => index.toString()}
                            onEndReached={handleBrandLoadMore}
                            ListFooterComponent={renderBrandFooter}
                            onEndReachedThreshold={0.5}
                            horizontal={false}
                            style={styles.modalList}
                        />
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    // Main container styles
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },

    // Customer info styles
    customerInfo: {
        marginTop: 15,
        marginBottom: 10,
    },
    customerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 4,
    },
    customerValue: {
        color: '#1788F0',
        fontWeight: '700',
    },

    // Filter and search styles
    filterContainer: {
        marginBottom: 15,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    filterItem: {
        width: '48%',
    },
    filterButton: {
        backgroundColor: '#F0F4F8',
        paddingHorizontal: 12,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    filterButtonText: {
        fontSize: 13,
        color: '#7F8C8D',
        flex: 1,
    },
    filterButtonTextActive: {
        color: '#2C3E50',
        fontWeight: '500',
    },
    filterCloseIcon: {
        marginLeft: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInputContainer: {
        flex: 1,
        position: 'relative',
        marginRight: 10,
    },
    searchInput: {
        backgroundColor: '#F0F4F8',
        fontSize: 14,
        color: '#2C3E50',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    searchCloseIcon: {
        position: 'absolute',
        right: 12,
        top: 14,
    },
    searchButton: {
        backgroundColor: '#1788F0',
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Empty state styles
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#95A5A6',
    },

    // Product list styles
    productsList: {
        marginTop: 15,
    },
    productsListContent: {
        paddingBottom: 20,
    },

    // Product card styles
    productCard: {
        width: '48%',
        marginHorizontal: '1%',
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        position: 'relative',
    },
    featuredBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#E67E22',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    imageContainer: {
        width: '100%',
        height: 150,
        backgroundColor: '#F8F9FA',
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2C3E50',
        marginBottom: 8,
        height: 40,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1788F0',
        marginBottom: 10,
    },
    unitText: {
        fontSize: 12,
        color: '#7F8C8D',
        fontWeight: '500',
    },
    cartButton: {
        backgroundColor: '#1788F0',
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    goToCartButton: {
        backgroundColor: '#27AE60',
    },
    cartButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },

    // Cart icon styles
    cartIconContainer: {
        position: 'absolute',
        right: 15,
    },
    cartIcon: {
        fontSize: 25,
        color: '#2C3E50',
    },
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: '#E74C3C',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Toast styles
    toastContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(39, 174, 96, 0.9)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        zIndex: 1000,
    },
    toastText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },

    // Modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    keyboardAvoidView: {
        width: '100%',
        maxHeight: '90%',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        maxHeight: '100%',
    },
    modalCloseBtn: {
        position: 'absolute',
        right: 16,
        top: 16,
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    priceEditContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    currencySymbol: {
        color: '#3d5a80',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
    priceInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    priceInput: {
        color: '#3d5a80',
        fontSize: 18,
        fontWeight: '700',
        minWidth: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#1788F0',
        paddingVertical: 4,
    },
    editIcon: {
        marginLeft: 10,
    },
    priceDisplayContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    priceDisplay: {
        color: '#3d5a80',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    marketPrice: {
        textDecorationLine: 'line-through',
        color: '#95A5A6',
        fontSize: 16,
    },
    discountIndicator: {
        color: 'red',
        fontSize: 18,
        marginLeft: 4,
    },
    editIconInline: {
        marginLeft: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    quantityButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    quantityButtonDisabled: {
        opacity: 0.5,
    },
    quantityDisplay: {
        paddingHorizontal: 20,
        minWidth: 60,
        alignItems: 'center',
    },
    quantityInput: {
        paddingHorizontal: 20,
        fontSize: 18,
        color: '#2C3E50',
        fontWeight: '600',
        minWidth: 60,
        textAlign: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#1788F0',
    },
    quantityText: {
        fontSize: 18,
        color: '#2C3E50',
        fontWeight: '600',
    },
    uomContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    totalPrice: {
        color: '#2C3E50',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '600',
    },
    totalLabel: {
        fontWeight: '700',
        color: '#3d5a80',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    addToCartButton: {
        backgroundColor: '#1788F0',
        borderRadius: 25,
        paddingHorizontal: 30,
        paddingVertical: 12,
    },
    addToCartText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    notesInput: {
        backgroundColor: '#F0F4F8',
        fontSize: 14,
        color: '#2C3E50',
        paddingHorizontal: 16,
        paddingTop: 12,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        textAlignVertical: 'top',
    },

    // Category/Brand modal styles
    modalFullScreen: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    modalHeader: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E6ED',
        backgroundColor: '#FFF',
    },
    modalHeaderTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 8,
    },
    headerDivider: {
        width: 40,
        height: 4,
        backgroundColor: '#1788F0',
        borderRadius: 2,
        marginBottom: 15,
    },
    modalHeaderClose: {
        position: 'absolute',
        right: 20,
        top: 20,
    },
    modalSearchContainer: {
        position: 'relative',
    },
    modalSearchInput: {
        backgroundColor: '#F0F4F8',
        fontSize: 15,
        color: '#2C3E50',
        paddingHorizontal: 16,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E6ED',
    },
    modalSearchClose: {
        position: 'absolute',
        right: 12,
        top: 14,
    },
    modalList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    categoryItem: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
    },
    categoryText: {
        color: '#2C3E50',
        fontSize: 15,
    },
    brandItem: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F4F8',
    },
    brandText: {
        color: '#2C3E50',
        fontSize: 15,
    },
    loadingFooter: {
        padding: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#7F8C8D',
    },
    endOfList: {
        padding: 16,
        alignItems: 'center',
    },
    endOfListText: {
        fontSize: 14,
        color: '#95A5A6',
        fontStyle: 'italic',
    },
});

export default Products;