import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Modal,
    Image
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { salesOrderDetailsAction } from '../../Redux/Actions/SalesOrderAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons'

const SalesOrderDetails = ({ navigation, route }) => {
    const state = useSelector((state) => state.AllSalesOrders);
    const dispatch = useDispatch();
    const [data, setData] = useState();
    const [currency, setCurrency] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [itemLineDesc, setItemLineDesc] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(salesOrderDetailsAction(route.params.header_id));
    }, []);

    useEffect(() => {
        if (state.salesOrderDetails) {
            setData(state.salesOrderDetails);
            setIsLoading(false);
        }
    }, [state.salesOrderDetails]);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid')
            return jsonValue != null ? JSON.parse(jsonValue) : null
        } catch (e) {
            // read error
        }
    }

    useEffect(() => {
        readItemFromStorage().then((e) => setCurrency(e.currency.currency_code));
    }, []);

    const goBack = () => {
        navigation.goBack()
    }

    const handleOpen = (val) => {
        setModalVisible(true);
        setItemLineDesc(val);
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

    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {state.isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text style={styles.loadingText}>Loading order details...</Text>
                    </View>
                </View>
            )}
            
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"Order Details"} goBack={goBack} fontSize={22} />
                
                {!isLoading && data && (
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {/* Order Summary Card */}
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryHeader}>
                                <Icon name="receipt" size={20} color="#3B82F6" />
                                <Text style={styles.summaryTitle}>Order Summary</Text>
                            </View>
                            
                            <View style={styles.summaryGrid}>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Order #</Text>
                                    <Text style={styles.summaryValue}>{data?.so_code}</Text>
                                </View>
                                
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Date</Text>
                                    <Text style={styles.summaryValue}>{formatDate(data?.add_datetime)}</Text>
                                </View>
                                
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Customer</Text>
                                    <Text style={styles.summaryValue} numberOfLines={1}>{data?.customer_name}</Text>
                                </View>
                                
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Subtotal</Text>
                                    <Text style={styles.summaryValue}>{formatCurrency(data?.so_amount)} {currency}</Text>
                                </View>
                                
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Tax</Text>
                                    <Text style={styles.summaryValue}>{formatCurrency(data?.so_taxamount)} {currency}</Text>
                                </View>
                                
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Total</Text>
                                    <Text style={[styles.summaryValue, styles.totalAmount]}>
                                        {formatCurrency(Number(data?.so_amount) + Number(data?.so_taxamount))} {currency}
                                    </Text>
                                </View>
                            </View>
                            
                            <Text style={styles.taxNote}>*All prices are tax inclusive</Text>
                        </View>

                        {/* Order Items */}
                        <View style={styles.itemsSection}>
                            <Text style={styles.sectionTitle}>Order Items</Text>
                            
                            {data?.lines?.map((item, index) => (
                                <View key={index} style={styles.itemCard}>
                                    <View style={styles.itemHeader}>
                                        <TouchableOpacity 
                                            onPress={() => handleOpen(item?.so_line_description || '')}
                                            style={styles.descriptionIcon}
                                        >
                                            {item?.item_description === "" ? (
                                                <Image
                                                    source={require('../../assets/file-icon2.png')}
                                                    style={styles.fileIcon}
                                                />
                                            ) : (
                                                <Image
                                                    source={require('../../assets/file-icon3.png')}
                                                    style={styles.fileIcon}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName} numberOfLines={2}>
                                                {item.item_description}
                                            </Text>
                                            <Text style={styles.itemQuantity}>
                                                Quantity: {Number(item.order_qty).toFixed(0)}
                                            </Text>
                                            <Text style={styles.itemMeasure}> /
                                                {item.measure_name}
                                            </Text>
                                        </View>
                                        
                                        <Text style={styles.itemPrice}>
                                            {formatCurrency(item.line_subtotal)} {currency}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>

            {/* Line Note Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Line Note</Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(false)} 
                                style={styles.closeButton}
                            >
                                <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.modalContent}>
                            <Text style={styles.modalDescription}>
                                Additional information for this order line:
                            </Text>
                            
                            <View style={styles.noteContainer}>
                                <Text style={styles.noteText}>
                                    {itemLineDesc || 'No description available'}
                                </Text>
                            </View>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255,255,255,0.9)",
        justifyContent: 'center',
        alignItems: "center",
        zIndex: 10,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#4B5563',
    },
    mainWrapper: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 16
    },
    scrollView: {
        flex: 1,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    summaryGrid: {
        gap: 12,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    summaryValue: {
        fontSize: 14,
        color: '#6B7280',
    },
    totalAmount: {
        fontWeight: '700',
        color: '#1F2937',
        fontSize: 16,
    },
    taxNote: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
        marginTop: 12,
        textAlign: 'center',
    },
    itemsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    itemCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    descriptionIcon: {
        marginRight: 12,
        padding: 4,
    },
    fileIcon: {
        height: 24,
        width: 24,
    },
    itemInfo: {
        flex: 1,
        marginRight: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    itemMeasure: {
        fontSize: 14,
        color: '#6B7280',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    modalContent: {
        marginBottom: 20,
    },
    modalDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 20,
    },
    noteContainer: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 16,
        minHeight: 100,
    },
    noteText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    modalButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SalesOrderDetails;