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
    RefreshControl,
    Animated,
    Easing
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import IconAnt from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFA from 'react-native-vector-icons/FontAwesome';
import { HandleWorkOrderSearchAction } from '../../Redux/Actions/ResourceTransactionsAction';

const WorkOrderList = ({ navigation, route }) => {
    const resourceTransactionState = useSelector((state) => state.ResourceTransaction);
    const { workOrderLists, isLoading } = resourceTransactionState;
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (page > 1) {
            let data = {
                "work_order_no": route.params?.workOrderNo,
                "page": page
            }
            dispatch(HandleWorkOrderSearchAction(data));
        }
    }, [page]);

    useEffect(() => {
        if (workOrderLists.Serach_result?.length > 0) {
            setData([...data, ...workOrderLists.Serach_result])
            startAnimation();
        }
    }, [workOrderLists.Serach_result])

    const startAnimation = () => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }).start();
    };

    const goBack = () => {
        navigation.goBack()
    }

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        setData([]);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const renderItem = ({ item, index }) => {
        console.log('item', item);
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
                styles.card,
                { 
                    transform: [{ translateY }],
                    opacity 
                }
            ]}>
                <TouchableOpacity 
                    onPress={() => {
                        navigation.navigate('Operations', { work_order_id: item.work_order_id });
                    }} 
                    activeOpacity={0.7}
                >
                    <View style={styles.cardInner}>
                        <View style={styles.cardHeader}>
                            <View style={styles.orderNumberContainer}>
                                <View style={styles.iconContainer}>
                                    <IconAnt name="appstore1" size={16} color="#FFFFFF"/>
                                </View>
                                <Text style={styles.orderNumber}>#{item?.work_order_no}</Text>
                            </View>
                            {/* <View style={[styles.statusContainer, 
                                {backgroundColor: getStatusColor(item.status)}]}>
                                <Text style={styles.statusText}>
                                    {item.status || 'Pending'}
                                </Text>
                            </View> */}
                        </View>
                        
                        <View style={styles.cardBody}>
                            <View style={styles.infoRow}>
                                {/* <Icon name="inbox" size={14} color="#6B7280" /> */}
                                <Text style={styles.infoText} numberOfLines={2}>
                                    {item?.item_description || 'No description available'}
                                </Text>
                            </View>
                            
                            
                            {/* {item?.quantity && (
                                <View style={styles.infoRow}>
                                    <Icon name="number" size={14} color="#6B7280"/>
                                    <Text style={styles.infoText}>
                                        Qty: {item.quantity}
                                    </Text>
                                </View>
                            )} */}
                        </View>
                        
                        <View style={styles.cardFooter}>
                            <Text style={styles.viewDetailsText}>
                                View Details
                            </Text>
                            <Icon name="arrowright" size={14} color="#3B82F6" />
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    // const formatDate = (dateString) => {
    //     if (!dateString) return 'N/A';
    //     return new Date(dateString).toLocaleDateString();
    // }

    // const getStatusColor = (status) => {
    //     const statusColors = {
    //         'Completed': '#10B981',
    //         'In Progress': '#3B82F6',
    //         'Pending': '#F59E0B',
    //         'Cancelled': '#EF4444',
    //         'default': '#9CA3AF'
    //     };
    //     return statusColors[status] || statusColors.default;
    // }

    const handleLoadMore = () => {
        if (isLoading || workOrderLists.Serach_result?.length >= workOrderLists.Serach_result?.count) {
            return;
        }
        if (workOrderLists.Serach_result?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }
    }

    const renderFooter = () => {
        if (!isLoading) return null;
        
        return (
            <View style={styles.footerContainer}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading more work orders...</Text>
            </View>
        )
    }

    const renderEmptyComponent = () => {
        if (isLoading) return null;
        
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIllustration}>
                     <IconFA name="search" size={60} color="#3B82F6" />
                </View>
                <Text style={styles.emptyTitle}>No Work Orders Found</Text>
                <Text style={styles.emptyMessage}>
                    We couldn't find any work orders matching your search criteria. Try adjusting your search terms.
                </Text>
                <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={onRefresh}
                >
                    <Text style={styles.retryButtonText}>
                        <IconFA name="refresh" size={14} /> Try Again
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainWrapper}>
                <HeaderTextLeft 
                    title={"Work Orders"} 
                    goBack={goBack} 
                    fontSize={20} 
                />
                
                <View style={styles.headerContainer}>
                    <Text style={styles.headerTitle}>Search Results</Text>
                    {data.length > 0 && (
                        <View style={styles.resultsBadge}>
                            <Text style={styles.resultsCount}>
                                {data.length}
                            </Text>
                        </View>
                    )}
                </View>

                {data.length > 0 && (
                    <Text style={styles.resultsText}>
                        {data.length} work order{data.length !== 1 ? 's' : ''} found
                    </Text>
                )}

                <FlatList
                    data={data}
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
                    contentContainerStyle={data.length === 0 ? styles.emptyListContainer : styles.listContainer}
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        marginTop: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
    },
    resultsBadge: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    resultsCount: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    resultsText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 16,
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyListContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
    },
    cardInner: {
        padding: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    orderNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: '#3B82F6',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    orderNumber: {
        color: "#1F2937",
        fontWeight: "700",
        fontSize: 18,
    },
    statusContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        gap: 12,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        color: "#4B5563",
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
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
    },
    emptyIllustration: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        color: "#1F2937",
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },
    emptyMessage: {
        color: "#6B7280",
        fontSize: 16,
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 24,
    },
    retryButton: {
        backgroundColor: "#3B82F6",
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default WorkOrderList;