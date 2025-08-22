import React, { useState, useEffect } from 'react';
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
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { getCustPendingSalesInvoicesAction } from '../../Redux/Actions/SalesOrderAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

const CustPendingInvoices = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesOrders);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [totalPendingAmount, setTotalPendingAmount] = useState(0);

    useEffect(() => {
        // Initial data load
        dispatch(getCustPendingSalesInvoicesAction({
            "customerId": route?.params?.customerId,
            "org_id": route?.params?.orgId,
            "page": 1
        }));
    }, []);

    useEffect(() => {
        if (state?.custPendingInvoices?.data?.length > 0) {
            setData(page === 1 ? state?.custPendingInvoices?.data : prevData => {
                const mergedData = [...prevData, ...state?.custPendingInvoices?.data];
                return Array.from(new Map(mergedData.map(item => [item.si_code, item])).values());
            });
            
            // Calculate total pending amount
            const total = state.custPendingInvoices.data.reduce((sum, item) => {
                return sum + parseFloat(item.total_unpaid || 0);
            }, 0);
            setTotalPendingAmount(total);
        }
    }, [state?.custPendingInvoices?.data]);

    const goBack = () => {
        navigation.goBack();
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        dispatch(getCustPendingSalesInvoicesAction({
            "customerId": route?.params?.customerId,
            "org_id": route?.params?.orgId,
            "page": 1
        }));
        setTimeout(() => setRefreshing(false), 1000);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity 
                style={[
                    styles.invoiceCard,
                    index === 0 && styles.firstCard,
                    index === data.length - 1 && styles.lastCard
                ]}
                onPress={() => {
                    // You can add navigation to invoice details here
                }}
            >
                <View style={styles.invoiceHeader}>
                    <Text style={styles.invoiceId}>INVOICE #{item.si_code}</Text>
                    <View style={styles.amountBadge}>
                        <Text style={styles.amountText}>
                            {item.currency_code} {parseFloat(item.total_unpaid || 0).toFixed(2)}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Icon name="calendar" size={14} color="#666" style={styles.icon} />
                        <Text style={styles.detailLabel}>Invoice Date: </Text>
                        <Text style={styles.detailValue}>{formatDate(item.invoice_date)}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Icon name="hourglass-end" size={14} color="#666" style={styles.icon} />
                        <Text style={styles.detailLabel}>Due Date: </Text>
                        <Text style={[
                            styles.detailValue, 
                            styles.dueDate,
                            new Date(item.invoice_due_date) < new Date() && styles.overdue
                        ]}>
                            {formatDate(item.invoice_due_date)}
                        </Text>
                    </View>
                    
                    {item.reference1 && (
                        <View style={styles.detailRow}>
                            <Icon name="tag" size={14} color="#666" style={styles.icon} />
                            <Text style={styles.detailLabel}>Reference: </Text>
                            <Text style={styles.detailValue}>{item.reference1}</Text>
                        </View>
                    )}
                </View>
                
                <View style={styles.statusIndicator}>
                    <View style={[
                        styles.statusDot,
                        new Date(item.invoice_due_date) < new Date() ? styles.overdueDot : styles.pendingDot
                    ]} />
                    <Text style={[
                        styles.statusText,
                        new Date(item.invoice_due_date) < new Date() && styles.overdueText
                    ]}>
                        {new Date(item.invoice_due_date) < new Date() ? 'OVERDUE' : 'PENDING'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const handleLoadMore = () => {
        const totalCount = state?.custPendingInvoices?.total_count || 0;
        const currentCount = data.length;

        if (state.isLoading || currentCount >= totalCount) {
            return;
        }

        if (state?.custPendingInvoices?.data?.length >= 10) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(getCustPendingSalesInvoicesAction({
                "customerId": route?.params?.customerId,
                "org_id": route?.params?.orgId,
                "page": nextPage
            }));
        }
    };

    const renderFooter = () => {
        if (state?.isLoading && data.length > 0) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator size="small" color="#1788F0" />
                    <Text style={styles.loadingText}>Loading more invoices...</Text>
                </View>
            );
        } else if (data.length >= (state?.custPendingInvoices?.total_count || 0)) {
            return (
                <View style={styles.footer}>
                    <Text style={styles.endText}>All invoices loaded</Text>
                </View>
            );
        }
        return null;
    };

    const renderEmptyComponent = () => {
        if (state?.isLoading) {
            return null;
        }
        
        return (
            <View style={styles.emptyContainer}>
                <Image
                    source={require('../../assets/warning.png')}
                    style={styles.emptyImage}
                    resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>No Pending Invoices</Text>
                <Text style={styles.emptySubtitle}>
                    There are no pending invoices for this customer at the moment.
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {state?.isLoading && data.length === 0 && (
                <LogoOverlay />
            )}
            
            <View style={styles.container}>
                <HeaderTextLeft 
                    title={"Pending Invoices"} 
                    goBack={goBack} 
                    fontSize={20} 
                />
                
                {data.length > 0 && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryText}>
                            {data.length} invoice{data.length !== 1 ? 's' : ''} • Total: {state.custPendingInvoices.data[0]?.currency_code} {totalPendingAmount.toFixed(2)}
                        </Text>
                    </View>
                )}
                
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item.si_code}-${index}`}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={renderEmptyComponent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#1788F0']}
                            tintColor={'#1788F0'}
                        />
                    }
                    contentContainerStyle={data.length === 0 ? styles.emptyList : styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    fullScreenLoader: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    loaderLogo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    loaderText: {
        fontSize: 16,
        color: '#666',
    },
    summaryContainer: {
        backgroundColor: '#E8F4FF',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        marginTop: 10,
    },
    summaryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1788F0',
        textAlign: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyList: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    invoiceCard: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#1788F0',
    },
    firstCard: {
        marginTop: 10,
    },
    lastCard: {
        marginBottom: 30,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    invoiceId: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2C3E50',
        flex: 1,
    },
    amountBadge: {
        backgroundColor: '#FFEDCC',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
    },
    amountText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E67E22',
    },
    detailsContainer: {
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    icon: {
        marginRight: 8,
        width: 16,
    },
    detailLabel: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#2C3E50',
        fontWeight: '600',
    },
    dueDate: {
        fontWeight: '700',
    },
    overdue: {
        color: '#E74C3C',
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    pendingDot: {
        backgroundColor: '#3498DB',
    },
    overdueDot: {
        backgroundColor: '#E74C3C',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#3498DB',
    },
    overdueText: {
        color: '#E74C3C',
    },
    footer: {
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    endText: {
        fontSize: 14,
        color: '#95A5A6',
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
        opacity: 0.7,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default CustPendingInvoices;