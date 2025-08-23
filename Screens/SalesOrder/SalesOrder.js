import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Animated,
    Easing
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { salesOrderAction } from '../../Redux/Actions/SalesOrderAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFA from 'react-native-vector-icons/FontAwesome';
import HeaderTextLeftRight from '../../Component/HeaderTextLeftRight';

const SalesOrder = ({ navigation }) => {
    const state = useSelector((state) => state.AllSalesOrders);
    const dispatch = useDispatch();

    const [customerId, setCustomerId] = useState('');
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((e) => setCustomerId(e.emp_data.emp_id));
    }, []);

    useEffect(() => {
        if (customerId != "") {
            dispatch(salesOrderAction({customerId, page}));
            startAnimation();
        }
    }, [customerId, page]);

    const startAnimation = () => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }).start();
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const renderItem = ({ item, index }) => {
        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
        });
        
        const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        return (
            <Animated.View style={[
                styles.orderCard,
                { 
                    transform: [{ translateY }],
                    opacity 
                }
            ]}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Sales-order-details', {
                        header_id: item.so_header_id
                    })} 
                    style={styles.cardTouchable}
                    activeOpacity={0.7}
                >
                    <View style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                            <View style={styles.orderIconContainer}>
                                <Icon name="receipt" size={20} color="#FFFFFF"/>
                            </View>
                            <Text style={styles.orderNumber}>#{item.so_code}</Text>
                        </View>
                        
                        <View style={styles.orderDetails}>
                            <View style={styles.detailRow}>
                                <Icon name="event" size={14} color="#6B7280"/>
                                <Text style={styles.detailText}>
                                    {formatDate(item.add_datetime)}
                                </Text>
                            </View>
                            
                            <View style={styles.detailRow}>
                                <Icon name="person" size={14} color="#6B7280"/>
                                <Text style={styles.detailText} numberOfLines={1}>
                                    {item.customer_name}
                                </Text>
                            </View>
                        </View>
                        
                        <View style={styles.cardFooter}>
                            <Text style={styles.viewDetailsText}>
                                View Details
                            </Text>
                            <Icon name="arrow-forward-ios" size={14} color="#3B82F6" />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    const handleLoadMore = () => {
        if (state.isLoading || state?.allSalesOrders?.orders_query?.length >= state?.allSalesOrders?.total_count) {
            return;
        }
        if (state?.allSalesOrders?.orders_query?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }
    }

    const renderFooter = () => {
        if (!state.isLoading) return null;
        
        return (
            <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading more orders...</Text>
            </View>
        )
    }

    const renderEmptyComponent = () => {
        if (state.isLoading) return null;
        
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIllustration}>
                    <Icon name="receipt" size={60} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyTitle}>No Sales Orders Found</Text>
                <Text style={styles.emptyText}>
                    You don't have any sales orders yet. Create your first order to get started.
                </Text>
            </View>
        )
    }

    const goBack = () => {
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainWrapper}>
                

                <HeaderTextLeftRight 
                    title={"Sales Orders"} 
                    goBack={goBack} 
                    fontSize={20} 
                    component={
                         <TouchableOpacity 
                            onPress={() => navigation.navigate('Organization')} 
                            
                        >
                            <IconFA name='plus-square' size={20} color="#3B82F6" />
                        </TouchableOpacity>
                    } 
                />
                
               

                <FlatList
                    data={state?.allSalesOrders?.orders_query}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmptyComponent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#3B82F6']}
                            tintColor={'#3B82F6'}
                        />
                    }
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    mainWrapper: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 16
    },
    addButton: {
        position: "absolute",
        right: 20,
        top: 20,
        zIndex: 10,
        padding: 8,
    },
    listContainer: {
        paddingBottom: 20,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    cardTouchable: {
        padding: 16,
    },
    cardContent: {
        gap: 12,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderIconContainer: {
        backgroundColor: '#3B82F6',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderNumber: {
        color: "#1F2937",
        fontWeight: "700",
        fontSize: 16,
    },
    orderDetails: {
        gap: 8,
        paddingLeft: 48, // Align with order number
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        color: "#4B5563",
        fontSize: 14,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        marginTop: 4,
    },
    viewDetailsText: {
        color: "#3B82F6",
        fontSize: 14,
        fontWeight: '600',
        marginRight: 8,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    loadingText: {
        color: '#6B7280',
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 40,
    },
    emptyIllustration: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        color: "#1F2937",
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    emptyText: {
        color: "#6B7280",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },
});

export default SalesOrder;