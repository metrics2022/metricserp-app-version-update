import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image } from 'react-native';
import SignaturePad from 'react-native-signature-pad';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ConfirmDelivery } from '../../Redux/Delivery/DeliveryAction';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service'; // Add this import
import { PermissionsAndroid } from 'react-native'; // For Android permissions
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignatureScreen = ({ navigation, route }) => {
  const state = useSelector((state) => state.DeliveryReducer);
  const dispatch = useDispatch();
  const signatureRef = useRef(null);
  const [signature, setSignature] = useState(null);
  const [signaturePadKey, setSignaturePadKey] = useState(1);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { order, orderData, orderId, deliveryPhotos = [] } = route.params;
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [empId, setEmpId] = useState('');

  // Request location permission
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

  // Get current location
  const getCurrentLocation = (retryCount = 0) => {
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 3000; // in milliseconds

  setIsFetchingLocation(true);

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,{
              headers: {
                'User-Agent': 'MetricsERP/1.1.2 (metricsbs@gmail.com)', // Replace this properly
                'Accept': 'application/json',
              },
            }
          );

          if (!response.ok) {
            // Non-200 response, avoid parsing as JSON
            //console.warn(`Geocoding failed with status ${response.status}`);
            setCurrentLocation(`${latitude},${longitude}`);
          } else {
            const data = await response.json();
            //console.log('Locationdata', data);
            const address = data?.display_name || `${latitude},${longitude}`;
            setCurrentLocation(address);
          }

        } catch (error) {
          //console.log('Geocoding error:', error);
          setCurrentLocation(`${latitude},${longitude}`);
        } finally {
          setIsFetchingLocation(false);
        }
      },
      (error) => {
        //console.warn('Location error:', error.message);

        if (retryCount < MAX_RETRIES) {
          Alert.alert('Location Error', 'Trying to fetch location again...');
          setTimeout(() => getCurrentLocation(retryCount + 1), RETRY_DELAY);
        } else {
          setCurrentLocation("unavailable");
          setIsFetchingLocation(false);
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  //  const getCurrentLocation = () => {
  //   setIsFetchingLocation(true);
  //   Geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       try {
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  //         );
  //         const data = await response.json();
  //         const address = data?.display_name || `${latitude},${longitude}`;
  //         setCurrentLocation(address);
  //       } catch (error) {
  //         //console.log('Geocoding error:', error);
  //         setCurrentLocation(`${latitude},${longitude}`);
  //       } finally {
  //         setIsFetchingLocation(false);
  //       }
  //     },
  //     (error) => {
  //       //console.log(error.code, error.message);
  //       setCurrentLocation("unavailable");
  //       setIsFetchingLocation(false);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // };



  const readItemFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('uuid')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch (e) {
      // read error
    }
  }


  useEffect(() => {
    // Initialize signature pad
    if (signatureRef.current) {
      setSignaturePadKey(prev => prev + 1);
      setSignature(null);
    }
    const getUserId = async () => {
      const uuid = await readItemFromStorage();
      setEmpId(uuid?.emp_data?.emp_id)
    }


    // Get location when component mounts
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
    setSignaturePadKey(prev => prev + 1);
    setSignature(null);
  };

  // const handleDone = async () => {
  //   if (!signature) {
  //     Alert.alert('Signature required', 'Please take the customer\'s signature before proceeding.');
  //     return;
  //   }

  //   const payload = {
  //     delivery_driver_id: empId,
  //     so_header_id: orderId,
  //     signatures: signature?.base64DataUrl,
  //     delivery_photos: deliveryPhotos.map(photo =>
  //       `data:${photo.type || 'image/jpeg'};base64,${photo.base64}`
  //     ),
  //     driver_current_location: currentLocation || "unavailable"
  //   };

  //   try {
  //     const res = await dispatch(ConfirmDelivery(payload));
  //     if(res !== null){
  //       navigation.navigate('ConfirmOrder', { orderId: orderData?.so_code, customerName:orderData?.customer_name });
  //     }else{
  //       alert('Something went wrong. Please try again.');
  //     }

  //   } catch (apiError) {
  //     Alert.alert('Could not confirm delivery. Please try again.');
  //   }
  // };


  const handleDone = async () => {
  if (!signature) {
    Alert.alert('Signature required', 'Please take the customer\'s signature before proceeding.');
    return;
  }

  const payload = {
    delivery_driver_id: empId,
    so_header_id: orderId,
    signatures: signature?.base64DataUrl,
    delivery_photos: deliveryPhotos.map(photo =>
      `data:${photo.type || 'image/jpeg'};base64,${photo.base64}`
    ),
    driver_current_location: currentLocation || "unavailable"
  };

  try {
    await dispatch(ConfirmDelivery(payload));  // Wait for dispatch to complete

    const error = state.errorMessage;
    if (!error || error.status !== 'Error') {
      navigation.navigate('ConfirmOrder', {
        orderId: orderData?.so_code,
        customerName: orderData?.customer_name,
      });
    } else {
      const msg = 'Something went wrong. Please try again.';
      Alert.alert('Error', msg);
    }

  } catch (apiError) {
    Alert.alert('Could not confirm delivery. Please try again.');
  }
};


  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      

      
    </>
  );
};

export default SignatureScreen;

