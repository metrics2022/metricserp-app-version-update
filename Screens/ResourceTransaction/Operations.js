import React, { useState, useEffect } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    ActivityIndicator,
    Image,
    SafeAreaView,
    Animated,
    Easing
} from 'react-native';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getMyLocalData } from '../../config/getLocalStorageData';
import Toast from 'react-native-toast-message';
import { woDetailsAction } from '../../Redux/Actions/ResourceTransactionsAction';
import { API_URL } from '../../config/constant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Operations = ({ navigation, route }) => {
    const resourceTransactionState = useSelector((state) => state.ResourceTransaction);
    const globalReducerState = useSelector(state => state.GlobalDataReducer);
    const dispatch = useDispatch();
    const { operationLists, isLoading, headerData } = resourceTransactionState;
    const { emp_fname, emp_lname } = globalReducerState?.getGlobalData?.data?.emp_data;
    const [modalVisible, setModalVisible] = useState(false);
    const [workOrderRoutingId, setWorkOrderRoutingId] = useState('');
    const [workOrderOrderId, setWorkOrderOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [workOrderDone, setWorkOrderDone] = useState('')
    const [workOrderProgress, setWorkOrderProgress] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [loadingDone, setLoadingDone] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const goBack = () => {
        navigation.goBack()
    }

    const startAnimation = () => {
        animation.setValue(0);
        Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
        }).start();
    };

    useEffect(() => {
        if (operationLists?.length > 0) {
            startAnimation();
        }
    }, [operationLists]);

    const handleUpdateOperation = async (isDone, isProgress, type) => {
        if (type === 'progress') {
            setLoadingProgress(true);
        } else if (type === 'done') {
            setLoadingDone(true);
        }
        const val = await getMyLocalData();
        let data = {
            "work_order_routing_id": workOrderRoutingId,
            ...(type === 'progress'
                && { "work_order_routing_progress": type === 'progress' && isProgress == 0 ? 1 : isProgress, }),
            "work_order_routing_done": type === 'done' && isDone == 0 ? 1 : isDone,
            "work_order_id": workOrderOrderId,
            "emp_fname": emp_fname,
            "emp_lname": emp_lname,
        }

        try {
            const response = await axios.post(API_URL + '/v1/update-routings', data, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${val.token}`
                }
            })
            if (response?.data?.status == "Success") {
                Toast.show({
                    type: 'success',
                    text1: response?.data?.message,
                });
                setModalVisible(false);
                await dispatch(woDetailsAction(route?.params?.work_order_id));
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Update failed. Please try again.',
            });
        } finally {
            if (type === 'progress') {
                setLoadingProgress(false);
            } else if (type === 'done') {
                setLoadingDone(false);
            }
        }
    }

    useEffect(() => {
        dispatch(woDetailsAction(route?.params?.work_order_id));
    }, []);

    const renderOperationItem = (item, index) => {
        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
        });
        
        const opacity = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });

        return (
            <Animated.View 
                key={index} 
                style={[
                    styles.operationCard,
                    { 
                        transform: [{ translateY }],
                        opacity,
                        backgroundColor: item?.work_order_routing_done == 1 ? '#F0F9FF' : '#FFFFFF'
                    }
                ]}
            >
                <TouchableOpacity 
                    onPress={() => { 
                        setModalVisible(true); 
                        setWorkOrderRoutingId(item?.work_order_routing_id); 
                        setWorkOrderDone(item?.work_order_routing_done); 
                        setWorkOrderProgress(item?.work_order_routing_progress); 
                        setWorkOrderOrderId(item?.work_order_id); 
                    }} 
                    disabled={item?.work_order_routing_done == 1} 
                    style={styles.operationTouchable}
                    activeOpacity={0.7}
                >
                    <View style={styles.operationContent}>
                        <View style={styles.operationHeader}>
                            <View style={[
                                styles.operationIconContainer,
                                item?.work_order_routing_done == 1 && styles.completedIcon
                            ]}>
                                <Fontawesome name='gears' size={20} color={item?.work_order_routing_done == 1 ? "#10B981" : "#3B82F6"} />
                            </View>
                            <View style={styles.operationTextContainer}>
                                <Text style={styles.operationCode}>{item?.operation_code}</Text>
                                {item?.work_order_routing_done == 1 && (
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Completed</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        
                        {item?.work_order_routing_done != 1 && (
                            <View style={styles.actionIndicator}>
                                <Text style={styles.actionText}>Tap to update status</Text>
                                <Icon name="chevron-right" size={16} color="#6B7280" />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text style={styles.loadingText}>Loading operations...</Text>
                    </View>
                </View>
            )}

            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"Operations"} goBack={goBack} fontSize={20} />
                
                {headerData && (
                    <View style={styles.headerCard}>
                        <View style={styles.headerRow}>
                            <Text style={styles.headerLabel}>Work Order#:</Text>
                            <Text style={styles.headerValue}>{headerData?.work_order_no}</Text>
                        </View>
                        <View style={styles.headerRow}>
                            <Text style={styles.headerLabel}>Finished Goods:</Text>
                            <Text style={styles.headerValue} numberOfLines={1}>{headerData?.item_description}</Text>
                        </View>
                        <View style={styles.headerRow}>
                            <Text style={styles.headerLabel}>Quantity:</Text>
                            <Text style={styles.headerValue}>{headerData?.quantity}</Text>
                        </View>
                    </View>
                )}

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <Text style={styles.operationsTitle}>Operations List</Text>
                    
                    {operationLists?.length > 0 ? (
                        operationLists?.map(renderOperationItem)
                    ) : (
                        !isLoading && (
                            <View style={styles.emptyContainer}>
                                <Icon name="construction" size={60} color="#D1D5DB" />
                                <Text style={styles.emptyTitle}>No Operations Available</Text>
                                <Text style={styles.emptyText}>
                                    There are no operations configured for this work order.
                                </Text>
                            </View>
                        )
                    )}
                </ScrollView>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Update Operation Status</Text>
                                <TouchableOpacity 
                                    onPress={() => setModalVisible(false)} 
                                    style={styles.closeButton}
                                >
                                    <Icon name="close" size={24} color="#6B7280" />
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={styles.modalDescription}>
                                Please choose the current status for this operation
                            </Text>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity 
                                    style={[
                                        styles.modalButton, 
                                        styles.progressButton,
                                        (loadingProgress || workOrderProgress == 1) && styles.disabledButton
                                    ]} 
                                    disabled={loadingProgress || workOrderProgress == 1} 
                                    onPress={() => handleUpdateOperation(workOrderDone, workOrderProgress, 'progress')}
                                >
                                    {loadingProgress ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Icon name="pending" size={18} color="#FFFFFF" />
                                            <Text style={styles.buttonText}>In Progress</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[
                                        styles.modalButton, 
                                        styles.doneButton,
                                        loadingDone && styles.disabledButton
                                    ]} 
                                    disabled={loadingDone} 
                                    onPress={() => handleUpdateOperation(workOrderDone, workOrderProgress, 'done')}
                                >
                                    {loadingDone ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Icon name="check-circle" size={18} color="#FFFFFF" />
                                            <Text style={styles.buttonText}>Mark Done</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            <Toast position='top' />
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
    headerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    headerValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        flex: 1,
        textAlign: 'right',
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
    },
    operationsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
    },
    operationCard: {
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    operationTouchable: {
        padding: 16,
    },
    operationContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    operationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    operationIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    completedIcon: {
        backgroundColor: '#ECFDF5',
    },
    operationTextContainer: {
        flex: 1,
    },
    operationCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    statusBadge: {
        backgroundColor: '#10B981',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    actionIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        color: '#6B7280',
        marginRight: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
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
    modalDescription: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 24,
        lineHeight: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 8,
    },
    progressButton: {
        backgroundColor: '#3B82F6',
    },
    doneButton: {
        backgroundColor: '#10B981',
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Operations;