import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
  Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused,useFocusEffect } from '@react-navigation/native';
import { DeliveryAction } from '../../Redux/Delivery/DeliveryAction';
import { Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoOverlay from '../../Component/LoaderComponent';
import HeaderTextLeft from '../../Component/HeaderTextLeft';


const screenWidth = Dimensions.get('window').width;

const Index = ({ navigation }) => {
  const searchState = useSelector((state) => state.DeliveryReducer);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [empId, setEmpId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const readItemFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('uuid');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
    }
  };

  useEffect(() => {
    //console.log("hi2")
    const fetchUuid = async () => {
      const uuid = await readItemFromStorage();
      setEmpId(uuid?.emp_data?.emp_id);
      let data = {
        search: '',
        delivery_driver_id: uuid?.emp_data?.emp_id,
        delivery_status: 0,
        page: page,
        limit: 10,
        orderByKey: 'so_header.so_header_id',
        orderBy: 'DESC',
      };
      await dispatch(DeliveryAction(data));
    };
    fetchUuid();
  }, []);

  // Refresh data when screen regains focus
  useFocusEffect(
    
    React.useCallback(() => {
      const fetchOrders = async () => {
        if (isFetching) return;
        setIsFetching(true);
        try {
          const uuid = await readItemFromStorage();
          const currentEmpId = uuid?.emp_data?.emp_id;
          setEmpId(currentEmpId);
          let data = {
            search: '',
            delivery_driver_id: 0,
            delivery_status: 0,
            page: page,
            limit: 10,
            orderByKey: 'so_header.so_header_id',
            orderBy: 'DESC',
          };
          await dispatch(DeliveryAction(data));
        } finally {
          setIsFetching(false);
        }
      };
      fetchOrders();
    }, [dispatch])
  );

  const handleSearch = async (overrideStatus, customSearchText = searchText) => {
    Keyboard.dismiss();
    const data = {
      search: customSearchText,
      delivery_driver_id: empId,
      delivery_status: overrideStatus !== undefined ? overrideStatus : selectedStatus,
      page: page,
      limit: 10,
      orderByKey: 'so_header.so_header_id',
      orderBy: 'DESC',
    };
    dispatch(DeliveryAction(data));
    
  };

  const handleFilterClick = (status) => {
    setSelectedStatus(status);
    setSearchText('');
    handleSearch(status);
  };

  useEffect(() => {
    const itemLists = searchState.allDelivery.orders_query?.map((item) => {
      return item;
    });
    setSearchResults(itemLists);
  }, [searchState, isFocused]);

  const goBack = () => {
    navigation.goBack();
  };

  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderLines = selectedOrder?.lines || [];
  const [showModal, setShowModal] = useState(false);

  const handleConfirmDelivery = (order) => {
    navigation.navigate('CameraScreen', {
      orderId: order.so_header_id,
      orderData: order,
    });
  };

  const openMapWithAddress = async (address) => {
    if (!address) {
      Alert.alert('Error', 'No address available for this location');
      return;
    }

    const encodedAddress = encodeURIComponent(address);

    try {
      const nativeUrl = Platform.select({
        ios: `maps://?q=${encodedAddress}`,
        android: `geo:0,0?q=${encodedAddress}`,
      });

      const webUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      const canOpenNative = await Linking.canOpenURL(nativeUrl);
      if (canOpenNative) {
        await Linking.openURL(nativeUrl);
        return;
      }

      const canOpenWeb = await Linking.canOpenURL(webUrl);
      if (canOpenWeb) {
        await Linking.openURL(webUrl);
        return;
      }

      Alert.alert('Open in Map', 'Would you like to open Map?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open', onPress: () => Linking.openURL(webUrl) },
      ]);
    } catch (error) {
      console.error('Failed to open maps:', error);
      Alert.alert('Error', 'Failed to open maps. Please try again later.');
    }
  };

  const renderOrderCard = (order) => (
    <TouchableOpacity
      key={order.so_header_id}
      onPress={() => {
        setSelectedOrder(order);
        setShowModal(true);
      }}
      style={styles.orderCard}
      disabled={order.delivery_status == 1}
    >
      <Text style={styles.orderNumber}>SO #{order.so_code}</Text>
      {order.delivery_box_count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Number of boxes: {order.delivery_box_count}</Text>
        </View>
      )}
      <Text style={styles.customerName}>
        <Text style={{ fontWeight: '700' }}>{order.customer_name}</Text>
      </Text>
      <Text style={styles.customerName}>
        <Icon name="phone" size={14} color="#4b6efe" /> {order.country_phone_code}{' '}
        {order.customer_site_mobno}
      </Text>
      <View style={{ position: 'relative', paddingLeft: 14 }}>
        <Icon name="enviromento" size={14} color="#ed7370" style={{ position: 'absolute', left: 0, top: 2 }} />
        <Text style={styles.customerAddress}>
           {order.customer_site_addr1} , {order.customer_site_postcode}
        </Text>
      </View>
      <View style={[styles.statusBadge, order.delivery_status == 0 ? styles.pending : styles.delivered]}>
        <Text style={styles.statusText}>
          {order.delivery_status == 0 ? 'Pending' : order.delivery_status == 1 ? 'Delivered' : ''}
        </Text>
      </View>
      <TouchableOpacity
        disabled={order.delivery_status == 1}
        style={styles.btnDirection}
        onPress={() => openMapWithAddress(order.customer_site_addr1)}
      >
        <FontAwesome5 name="directions" size={18} color="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const formatQuantity = (qty) => {
    return parseFloat(qty).toFixed(2);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {searchState?.isLoading && (
        <LogoOverlay />
      )}
    
      <View style={styles.mainWrapper}>
        {/* <View style={{ backgroundColor: '#f6f7fb', borderBottomColor: '#dfe0e4', borderBottomWidth: 1 }}> */}
        <HeaderTextLeft
          goBack={goBack}
          title="Delivery Dashboard"
          subTitle="Manage your delivery orders efficiently"
          fontSize={20}
        />
      {/* </View> */}
        <View style={styles.searchContainer}>
          <View style={{ width: screenWidth - 120 }}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => handleSearch(0)}
            />
          </View>
          <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(0)}>
           <Icon name="search1" size={18} color="#76747f" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => {
              setSearchText('');
              setSelectedStatus(0);
              handleSearch(0, '');
            }}
          >
            <Icon name="sync" size={16} color="#4b6efe" />
            {/* <Text style={styles.filterBtnText}>Reset</Text> */}
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {/* <Text style={styles.sectionTitle}>Today's Deliveries</Text> */}
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={selectedStatus === 0 ? styles.filterButtonActive : styles.filterButton}
              onPress={() => handleFilterClick(0)}
            >
              <Text style={selectedStatus === 0 ? styles.filterButtonTextActive : styles.filterButtonText}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={selectedStatus === 1 ? styles.filterButtonActive : styles.filterButton}
              onPress={() => handleFilterClick(1)}
            >
              <Text style={selectedStatus === 1 ? styles.filterButtonTextActive : styles.filterButtonText}>Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={selectedStatus === 3 ? styles.filterButtonActive : styles.filterButton}
              onPress={() => handleFilterClick(3)}
            >
              <Text style={selectedStatus === 3 ? styles.filterButtonTextActive : styles.filterButtonText}>All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.deliveriesContainer}>
          <ScrollView>
            {searchResults && searchResults.length > 0 ? (
              searchResults.map(renderOrderCard)
            ) : (
              <View style={styles.noOrdersContainer}>
                <Text style={styles.noOrdersText}>No orders from the past 7 days</Text>
                <Text style={styles.noOrdersText}>You can still search for older orders anytime!</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      <Modal transparent animationType="fade" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={styles.modalTitle}>DELIVERY CONFIRMATION</Text>
              </View>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                 <Icon name="closesquare" size={24} color="red" />
              </TouchableOpacity>
            </View>

            <Text style={styles.orderNote}>*Order Contains {orderLines.length} Items</Text>

            
              <ScrollView style={{ maxHeight: 200 }} contentContainerStyle={styles.itemList}>
                {orderLines?.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Icon
                        name="dropbox"
                        size={24}
                        color="#ff9900"
                        style={styles.itemIcon}
                      />
                      <Text style={styles.itemText}>
                      {formatQuantity(item.order_qty)} x{' '}
                      {item.item_code === item.item_description ? (
                        item.item_code
                      ) : (
                        <>
                          <Text style={styles.itemCode}>{item.item_code}</Text>
                          {'\n'}
                          <Text style={styles.itemDescription}>({item.item_description})</Text>
                        </>
                      )}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={() => {
                setShowModal(false);
                handleConfirmDelivery(selectedOrder);
              }}
            >
              <Text style={styles.confirmText}>CONFIRM DELIVERY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  Row: {
    flexDirection: 'row',
    marginHorizontal: -5,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  btnSubmit: {
    backgroundColor: '#3b5998',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  Desc: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  header: {
    backgroundColor: '#f6f7fb',
    borderBottomColor: '#dfe0e4',
    borderBottomWidth: 1,
    paddingLeft: 50,
    paddingRight: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#f8f9fb',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderColor: '#dfe0e4',
    borderWidth: 1,
    fontSize: 14,
    color: '#333',
  },
  searchBtn: {
    width: 45,
    marginLeft: 5,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: '#dfe0e4',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBtn: {
    width: 46,
    marginLeft: 5,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderColor: '#dfe0e4',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBtnText: {
    fontSize: 12,
    color: '#333',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#f6f7fb',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 5,
  },
  filterButtonActive: {
    backgroundColor: '#4b6efe',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 5,
  },
  filterButtonText: {
    color: '#333',
    fontSize: 11,
  },
  filterButtonTextActive: {
    color: '#fff',
    fontSize: 11,
  },
  deliveriesContainer: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    marginBottom: 12,
    elevation: 2,
    position: 'relative',
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  customerAddress: {
    width: 180,
    fontSize: 12,
    color: '#666',
    marginBottom: 0,
    position: 'relative',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  statusText: {
    fontSize: 9,
    color: '#fff',
  },
  readyForPickup: {
    backgroundColor: '#FFA500',
  },
  pending: {
    backgroundColor: '#FF6347',
  },
  delivered: {
    backgroundColor: '#4CAF50',
  },
  btnDirection: {
    width: 38,
    height: 38,
    borderRadius: 45,
    position: 'absolute',
    top: 50,
    right: 15,
    backgroundColor: '#4b69ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    // Removed marginLeft: 28 to allow proper centering
  },
  orderNote: {
    fontSize: 12,
    marginBottom: 10,
    color: '#555',
  },
  itemList: {
    alignSelf: 'auto',
    marginRight: 5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 10,
  },
  // itemText: {
  //   fontSize: 13,
  //   color: '#000',
  // },
  confirmBtn: {
    backgroundColor: '#005A92',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  confirmText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  topButton: {
    borderWidth: 1,
    borderColor: '#005A92',
    paddingVertical: 8,
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
  },
  topButtonText: {
    color: '#005A92',
    fontWeight: 'bold',
  },
  itemText: {
    fontSize: 13,
    color: '#000',
    flexWrap: 'wrap',
    flexShrink: 1,
    width: '90%',
  },

  itemCode: {
    fontSize: 13,
    color: '#000',
    flexWrap: 'wrap',
  },

  itemDescription: {
    fontSize: 13,
    color: '#444',
    flexWrap: 'wrap',
  },

  badge: {
    minWidth: 20,
    alignSelf: 'flex-start',
    backgroundColor: '#4b6efe',
    borderRadius: 30,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20
  },
  noOrdersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Index;