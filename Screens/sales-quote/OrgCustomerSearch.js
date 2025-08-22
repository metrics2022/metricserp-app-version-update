import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    StatusBar,
    Platform,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AllOrganizationAction } from '../../Redux/Actions/AllOrganizationAction';
import { CustomerDependencyContactAction } from '../../Redux/Actions/SearchCustomerAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';

const { width } = Dimensions.get('window');

const OrgCustomerSearch = ({ navigation, route }) => {
    const globalReducerState = useSelector(state => state.GlobalDataReducer);
    const dispatch = useDispatch();

    const [customerId, setCustomerId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [navigatePage, setNavigatePage] = useState('');
    const [orgId, setOrgId] = useState('');
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [menuAccess, setMenuAccess] = useState('');

    const getmoduleData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('moduleData');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getmoduleData().then((e) => { setMenuAccess(e) });
    }, []);

    const readItemFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        readItemFromStorage().then((e) => { 
            setCustomerId(e.emp_data.emp_id);
        });
    }, []);

    useEffect(() => {
        if (customerId != "") {
            dispatch(AllOrganizationAction(customerId));
        }
    }, [customerId]);

    const goBack = () => {
        navigation.goBack();
    };

    const handleClose = () => {
        setModalVisible(false);
        setSelectedOrg(null);
    };

    const handleOrganizationSelect = () => {
        if (selectedOrg) {
            navigation.push('searchLeadCustomerScreen', {
                pageTitle: navigatePage,
                orgId: selectedOrg.org_id
            });
            setModalVisible(false);
            setSelectedOrg(null);
        }
    };

    const handleCardPress = (pageType) => {
        setNavigatePage(pageType);
        if (globalReducerState?.getGlobalData?.data?.emp_org?.length > 1) {
            setModalVisible(true);
        } else {
            navigation.push('searchLeadCustomerScreen', {
                pageTitle: pageType,
                orgId: globalReducerState?.getGlobalData?.data?.emp_org[0]?.org_id
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            
            <View style={styles.headerContainer}>
                <HeaderTextLeft title="Sales Quote" goBack={goBack} fontSize={20} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.headerSection}>
                   
                    <Text style={styles.title}>Who would you like to create a Sales Quote for?</Text>
                    <Text style={styles.subtitle}>Select the type of customer you want to create a quote for</Text>
                </View>

                <View style={styles.cardsContainer}>
                    {/* Customer Card */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleCardPress("Customer")}
                    >
                        <View style={styles.cardInner}>
                            <View style={[styles.cardIcon, styles.customerIcon]}>
                                <Icon name="user" size={32} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Customer</Text>
                                <Text style={styles.cardDescription}>
                                    Create quote for existing customers
                                </Text>
                            </View>
                            <View style={styles.cardArrow}>
                                <Icon name="right" size={20} color="#7F8C8D" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Lead Card */}
                    <TouchableOpacity
                        style={[styles.card, styles.leadCard]}
                        onPress={() => handleCardPress("Lead")}
                        disabled={true}
                    >
                        <View style={styles.cardInner}>
                            <View style={[styles.cardIcon, styles.leadIcon]}>
                                <Icon name="adduser" size={32} color="#FFFFFF" />
                            </View>
                            <View style={styles.cardTextContainer}>
                                <Text style={styles.cardTitle}>Lead</Text>
                                <Text style={styles.cardDescription}>
                                    Create quote for potential leads
                                </Text>
                                <View style={styles.comingSoonBadge}>
                                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                                </View>
                            </View>
                            <View style={styles.cardArrow}>
                                <Icon name="right" size={20} color="#BDC3C7" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.infoSection}>
                    <Icon name="infocirlceo" size={20} color="#7F8C8D" style={styles.infoIcon} />
                    <Text style={styles.infoText}>
                        Select an option to proceed with creating your sales quote
                    </Text>
                </View>
            </ScrollView>

            {/* Organization Selection Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleClose}
            >
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select Organization</Text>
                                    <TouchableOpacity onPress={handleClose} style={styles.modalCloseButton}>
                                        <Icon name="close" size={24} color="#7F8C8D" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalSubtitle}>
                                    Please choose the organization for this sales quote:
                                </Text>

                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={selectedOrg}
                                        style={styles.picker}
                                        dropdownIconColor="#1788F0"
                                        onValueChange={(itemValue) => setSelectedOrg(itemValue)}
                                    >
                                        <Picker.Item 
                                            label="Select Organization" 
                                            value={null} 
                                            color="#ffff"
                                        />
                                        {globalReducerState?.getGlobalData?.data?.emp_org?.map((org, index) => (
                                            <Picker.Item 
                                                key={index}
                                                label={org.org_name}
                                                value={org}
                                                color="#ffff"
                                            />
                                        ))}
                                    </Picker>
                                </View>

                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        !selectedOrg && styles.confirmButtonDisabled
                                    ]}
                                    onPress={handleOrganizationSelect}
                                    disabled={!selectedOrg}
                                >
                                    <Text style={styles.confirmButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    headerIcon: {
        marginBottom: 16,
    },
    title: {
        color: '#2C3E50',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 8,
        lineHeight: 32,
    },
    subtitle: {
        color: '#7F8C8D',
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    cardsContainer: {
        marginBottom: 30,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leadCard: {
        opacity: 0.6,
    },
    cardIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    customerIcon: {
        backgroundColor: '#1788F0',
    },
    leadIcon: {
        backgroundColor: '#95A5A6',
    },
    cardTextContainer: {
        flex: 1,
        marginRight: 16,
    },
    cardTitle: {
        color: '#2C3E50',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardDescription: {
        color: '#7F8C8D',
        fontSize: 14,
        lineHeight: 20,
    },
    cardArrow: {
        alignSelf: 'center',
    },
    comingSoonBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    comingSoonText: {
        color: '#2C3E50',
        fontSize: 12,
        fontWeight: '600',
    },
    infoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E6ED',
        marginBottom: 20,
    },
    infoIcon: {
        marginRight: 12,
    },
    infoText: {
        color: '#7F8C8D',
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: '#2C3E50',
        fontSize: 20,
        fontWeight: '700',
    },
    modalCloseButton: {
        padding: 4,
    },
    modalSubtitle: {
        color: '#7F8C8D',
        fontSize: 16,
        marginBottom: 20,
        lineHeight: 24,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E0E6ED',
        borderRadius: 12,
        marginBottom: 24,
        overflow: 'hidden',
    },
    picker: {
        color: '#2C3E50',
        backgroundColor: '#F8F9FA',
        height: 50,
    },
    confirmButton: {
        backgroundColor: '#1788F0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OrgCustomerSearch;