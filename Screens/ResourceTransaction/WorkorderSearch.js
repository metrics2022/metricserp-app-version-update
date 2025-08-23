import React, { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Keyboard
} from 'react-native';
import { useDispatch } from 'react-redux';
import { HandleWorkOrderSearchAction } from '../../Redux/Actions/ResourceTransactionsAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import Icon from 'react-native-vector-icons/FontAwesome';
import LogoOverlay from '../../Component/LoaderComponent';

const { width } = Dimensions.get('window');

const WorkorderSearch = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [inputVal, setInputVal] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const goBack = () => {
    navigation.goBack()
  }

  const onChange = (e) => {
    setInputVal(e);
    setBtnDisabled(e?.length > 0 ? false : true)
  }

  const onSubmit = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    let data = {
      "work_order_no": inputVal,
      "page": "1"
    };
  
    try {
      const response = await dispatch(HandleWorkOrderSearchAction(data));
      if (response.status === "Success" && response.data) {
        setIsLoading(false);
        const workOrders = response.data.Serach_result;
        
        if (workOrders.length === 1) {
          navigation.navigate('Operations', {
            work_order_id: workOrders[0].work_order_id,
          });
        } else if (workOrders.length > 1) {
          navigation.navigate('WorkOrderList', {
            workOrderNo: inputVal,
            workOrders,
          });
        } else {
          navigation.navigate('WorkOrderList', {
            workOrderNo: inputVal,
            workOrders,
          });
        }
  
        setInputVal('');
        setBtnDisabled(true);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        </View>
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <View style={styles.mainWrapper}>
          <HeaderTextLeft title={"Work Order Search"} goBack={goBack} fontSize={20} />
          
          <View style={styles.contentContainer}>
            <View style={styles.illustrationContainer}>
              <Icon name="search" size={60} color="#3B82F6" style={styles.searchIcon} />
              <Text style={styles.title}>Work Order Search</Text>
              <Text style={styles.subtitle}>Enter a work order number to find details</Text>
            </View>
            
            <View style={styles.formContainer}>
              {/* <Text style={styles.inputLabel}>Work Order Number</Text> */}
              <View style={styles.inputContainer}>
                <TextInput 
                  onChangeText={onChange} 
                  placeholder="Enter work order number..." 
                  placeholderTextColor="#9CA3AF" 
                  style={styles.input}
                  maxLength={40}
                  value={inputVal}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
                {inputVal.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearButton}
                    onPress={() => {
                      setInputVal('');
                      setBtnDisabled(true);
                    }}
                  >
                    <Icon name="times-circle" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
              
              <TouchableOpacity 
                style={[styles.searchButton, btnDisabled && styles.searchButtonDisabled]} 
                onPress={onSubmit}
                disabled={btnDisabled}
              >
                <View style={styles.buttonContent}>
                  <Icon name="search" size={18} color="#FFF" style={styles.buttonIcon} />
                  <Text style={styles.searchButtonText}>Search Work Order</Text>
                </View>
              </TouchableOpacity>
              
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Icon name="info-circle" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>Enter a complete or partial work order number</Text>
                </View>
                {/* <View style={styles.infoRow}>
                  <Icon name="lightbulb-o" size={16} color="#6B7280" />
                  <Text style={styles.infoText}>You can search by work order ID or reference number</Text>
                </View> */}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: 'center',
    alignItems: "center",
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
    backgroundColor: '#FFF',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  searchIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    fontSize: 16,
    color: "#111827",
    paddingHorizontal: 16,
    paddingRight: 40,
    height: 56,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  searchButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    marginBottom: 24,
  },
  searchButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoText: {
    color: "#6B7280",
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default WorkorderSearch