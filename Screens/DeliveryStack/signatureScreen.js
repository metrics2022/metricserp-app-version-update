import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, SafeAreaView } from 'react-native';
import { ConfirmDelivery } from '../../Redux/Delivery/DeliveryAction';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoOverlay from '../../Component/LoaderComponent';
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import SignatureCanvas from 'react-native-signature-canvas';

const SignatureScreen = ({ navigation, route }) => {
  const state = useSelector((state) => state.DeliveryReducer);
  const dispatch = useDispatch();
  const signatureRef = useRef(null);

  const [signature, setSignature] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { orderData, orderId, deliveryPhotos = [] } = route.params;
  const [empId, setEmpId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation(`${latitude},${longitude}`);
        setIsLoading(false);
      },
      (error) => {
        console.warn(error);
        setCurrentLocation("unavailable");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const readItemFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('uuid');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const getUserId = async () => {
      const uuid = await readItemFromStorage();
      setEmpId(uuid?.emp_data?.emp_id);
    };

    const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (hasPermission) {
        getCurrentLocation();
      }
    };

    fetchLocation();
    getUserId();
  }, []);

  const handleClear = () => {
    signatureRef.current?.clearSignature();
    setSignature(null);
  };

  const handleEnd = () => {
    signatureRef.current?.readSignature();
  };

  const handleSignature = (signature) => {
    console.log('Signature captured:', signature);
    setSignature(signature);
  };

  const handleError = (error) => {
    console.error('Signature pad error:', error);
    Alert.alert('Error', 'Failed to capture signature');
  };

  const handleDone = async () => {
    if (!signature) {
      Alert.alert('Signature required', 'Please provide a signature before submitting');
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract base64 data (remove the data URL prefix if present)
      const base64Data = signature.startsWith('data:') 
        ? signature.split(',')[1] 
        : signature;

      const payload = {
        delivery_driver_id: empId,
        so_header_id: orderId,
        signatures: signature,
        delivery_photos: deliveryPhotos.map(photo => 
          `data:${photo.type || 'image/jpeg'};base64,${photo.base64}`
        ),
        driver_current_location: currentLocation || "unavailable"
      };

      await dispatch(ConfirmDelivery(payload));

      if (!state.errorMessage || state.errorMessage.status !== 'Error') {
        navigation.navigate('ConfirmOrder', {
          orderId: orderData?.so_code,
          customerName: orderData?.customer_name,
        });
      } else {
        throw new Error(state.errorMessage.message || 'Delivery confirmation failed');
      }
    } catch (error) {
      console.error('Delivery confirmation error:', error);
      Alert.alert('Error', error.message || 'Failed to confirm delivery');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {(state?.isLoading || isLoading) && <LogoOverlay />}

      <View style={styles.container}>
        <HeaderTextLeft
          goBack={goBack}
          title="Customer Signature"
          fontSize={20}
        />

        <Text style={styles.orderInfo}>SO #{orderData?.so_code}</Text>
        <Text style={styles.orderInfo}>Customer: {orderData?.customer_name}</Text>
        <Text style={styles.title}>Please Sign to Confirm Delivery</Text>
        <Text style={styles.subtitle}>Customer signature required</Text>
        
        {currentLocation && (
          <Text style={styles.locationText}>
            Current Location: {currentLocation === "unavailable" ? "Not available" : currentLocation}
          </Text>
        )}

        <View style={styles.signatureContainer}>
          <SignatureCanvas
            ref={signatureRef}
            onOK={handleSignature}
            onEnd={handleEnd}
            onError={handleError}
            penColor="#000000"
            backgroundColor="rgba(255,255,255,0)"
            imageType="image/png"
            dataURLType="image/png"
            autoClear={false}
            descriptionText="Sign here"
            webStyle={`
              .m-signature-pad {
                box-shadow: none;
                border: none;
                height: 100%;
              }
              .m-signature-pad--body {
                border: none;
                margin: 0;
                padding: 0;
                height: 100%;
              }
              .m-signature-pad--footer {
                display: none !important;
                height: 0 !important;
                overflow: hidden !important;
                pointer-events: none !important;
              }
              body, html {
                background-color: transparent;
                height: 100%;
                margin: 0;
                padding: 0;
              }
            `}
          />

          
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={handleClear}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>CLEAR</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.doneButton]}
            onPress={handleDone}
            disabled={!signature || isLoading}
          >
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.footerNote}>
          Signature will be saved as proof of delivery.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  signatureContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  clearButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D32F2F',
    backgroundColor: '#D32F2F',
    alignItems: 'center',
  },
  doneButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#005A92',
    backgroundColor: '#005A92',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  footerNote: {
    textAlign: 'center',
    marginTop: 15,
    color: '#555',
    fontSize: 12,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    marginBottom: 10,
    color: '#555'
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
  },
  locationText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  orderInfo: {
    fontSize: 14,
    color: '#000',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default SignatureScreen;