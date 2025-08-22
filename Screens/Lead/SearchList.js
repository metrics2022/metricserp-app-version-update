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
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconAnt from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchLeadAction } from '../../Redux/Actions/LeadSubmitAction';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import AlertComponent from '../../Component/AlertComponent';
import LogoOverlay from '../../Component/LoaderComponent';

const LeadSearchList = ({ navigation, route }) => {
    const state = useSelector((state) => state.SearchLead);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [leadType, setLeadType] = useState('');

    const getLeadType = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('uuid');
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getLeadType().then((e) => setLeadType(e.default_lead_type));
    }, []);

    const onOkPress = () => {
        dispatch({ type: "LEAD_SUBMIT_RESET" });
        navigation.navigate('Search');
    };

    useEffect(() => {
        if (state?.errorMessage?.data == '1') {
            AlertComponent({
                title: state?.errorMessage?.message,
                message: '',
                buttons: [
                    { text: 'ok', onPress: () => onOkPress() },
                ]
            });
        }
    }, [state?.errorMessage]);

    useEffect(() => {
        if (state?.leadSearchResult?.data?.length > 0) {
            setData([...data, ...state?.leadSearchResult?.data]);
        }
    }, [state?.leadSearchResult?.data]);

    useEffect(() => {
        if (page > 1) {
            dispatch(SearchLeadAction({
                "name": route?.params?.name,
                "email": route?.params?.email,
                "company": route?.params?.company,
                "phone": route?.params?.phone,
                page: page
            }));
        }
    }, [page]);

    const goBack = () => {
        navigation.goBack();
    };

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity 
                onPress={async () => {
                    try {
                        await AsyncStorage.setItem('leads_id', JSON.stringify(item.leads_id));
                        navigation.navigate('Details', { leads_id: item.leads_id });
                    } catch (error) {
                        console.error('Error saving leads_id:', error);
                    }
                }} 
                style={styles.leadItem}
            >
                <View style={styles.leadInfo}>
                    {item?.name !== "" && (
                        <View style={styles.infoRow}>
                            <IconAnt name="user" size={16} color="#1788F0" />
                            <Text style={styles.infoText}>{item?.name.concat(" ", item?.l_name)}</Text>
                        </View>
                    )}
                    {item?.email !== "" && (
                        <View style={styles.infoRow}>
                            <IconAnt name="mail" size={16} color="#1788F0" />
                            <Text style={styles.infoText}>{item?.email}</Text>
                        </View>
                    )}
                    {/* {item?.phone !== "" && (
                        <View style={styles.infoRow}>
                            <IconAnt name="phone" size={16} color="#1788F0" />
                            <Text style={styles.infoText}>{item?.phone}</Text>
                        </View>
                    )} */}
                </View>
                <IconAnt name="right" size={16} color="#626F7F" />
            </TouchableOpacity>
        );
    };

    const handleLoadMore = () => {
        if (state?.isLoading || state?.leadSearchResult?.data?.length >= state?.leadSearchResult?.total_count) {
            return;
        }
        if (state?.leadSearchResult?.data?.length >= 10) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const renderFooter = () => {
        return (
            state?.isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#1788F0" />
                    <Text style={styles.loadingText}>Loading more leads...</Text>
                </View>
            )
        );
    };

    const renderEmptyState = () => {
        return (
            <View style={styles.emptyState}>
                <Image
                    source={require('../../assets/warning.png')}
                    style={styles.emptyImage}
                    resizeMode="contain"
                />
                <Text style={styles.emptyTitle}>Sorry! No Results Found</Text>
                <Text style={styles.emptySubtitle}>We couldn't find any leads matching your search</Text>
                <TouchableOpacity 
                    style={styles.createButton} 
                    onPress={() => {
                        navigation.navigate(leadType == '1' ? 'Company' : 'Contact', {
                            phone_number: route?.params?.phone,
                            email_address: route?.params?.email,
                        });
                    }}
                >
                    <Text style={styles.createButtonText}>Create New Lead</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {state?.isLoading && (
                 <LogoOverlay/>
            )}
            
            <View style={styles.mainWrapper}>
                <HeaderTextLeft title={"Search Results"} goBack={goBack} fontSize={25} />
                
                {state?.leadSearchResult?.data?.length == 0 ? (
                    renderEmptyState()
                ) : (
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReached={handleLoadMore}
                        ListFooterComponent={renderFooter}
                        onEndReachedThreshold={0.5}
                        contentContainerStyle={styles.listContent}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    mainWrapper: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    fullScreenLoader: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.9)",
    },
    loaderImage: {
        width: 45,
        height: 45,
    },
    listContent: {
        paddingBottom: 20,
    },
    leadItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 12,
        backgroundColor: '#FFF',
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leadInfo: {
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    infoText: {
        color: "#626F7F",
        fontSize: 14,
        marginLeft: 10,
    },
    loadingContainer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        color: '#666',
        fontSize: 12,
        marginTop: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: -50,
    },
    emptyImage: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    emptyTitle: {
        color: "#000",
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    emptySubtitle: {
        color: "#666",
        fontSize: 14,
        textAlign: "center",
        marginBottom: 24,
    },
    createButton: {
        backgroundColor: "#1788F0",
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 32,
        minWidth: 200,
        alignItems: 'center',
    },
    createButtonText: {
        color: "#FFF",
        fontSize: 15,
        fontWeight: '500',
    },
});

export default LeadSearchList;