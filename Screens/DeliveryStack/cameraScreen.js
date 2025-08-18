import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import HeaderTextLeft from '../../Component/HeaderTextLeft';

const CameraScreen = ({ navigation, route }) => {
  const [images, setImages] = useState([]); // Now stores objects with uri and base64
  const { order , orderId, orderData } = route.params;

  const openCamera = async () => {
    if (images.length >= 2) {
      Alert.alert('Limit Reached', 'You can only capture 2 photos.');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
      cameraType: 'back',
      includeBase64: true, // This is the key change
    };

    try {
      const response = await new Promise((resolve) => {
        launchCamera(options, resolve);
      });

      if (response.didCancel) return;

      if (response.errorCode) {
        let errorMessage = response.errorMessage;
        if (response.errorCode === 'permission') {
          errorMessage = 'Camera permission was denied';
        }
        Alert.alert('Error', errorMessage);
        return;
      }

      const asset = response.assets?.[0];
      if (asset) {
        setImages((prev) => [
          ...prev,
          {
            uri: asset.uri,
            base64: asset.base64,
            type: asset.type || 'image/jpeg', // default to jpeg if type not provided
          },
        ]);
      } else {
        Alert.alert('Error', 'Could not get image data');
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleSkip = () => {
    navigation.navigate('SignatureScreen', {
      order,
      orderData,
      orderId
    });
  };

  const handleNext = () => {
    if (images.length === 0) {
      Alert.alert('Required', 'Please capture at least one photo');
      return;
    }

    navigation.navigate('SignatureScreen', {
      order,
      orderData,
      deliveryPhotos: images.map(img => ({
        base64: img.base64,
        // type: img.type
      })),
      orderId
    });
  };

  const handleRemoveImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      
      <View style={styles.container}>
        <HeaderTextLeft
          goBack={goBack}
          title="Delivery Photos"
          // subTitle="Capture photos for delivery verification"
          fontSize={20}
        />
        <Text style={[styles.header1, {fontSize:14, color:'#000', fontWeight:'700'}]}>SO #{orderData?.so_code}</Text>
        <Text style={[styles.header1, {fontSize:14, color:'#000', fontWeight:'700'}]}>Customer: {orderData?.customer_name}</Text>
        <View style={{flex:1, flexDirection:'column', justifyContent:'space-between'}}>
          <Text style={styles.header1}>Capture Delivery Photos</Text>
          <View style={styles.cameraBox}>
            {images.length === 0 ? (
              <TouchableOpacity onPress={openCamera} style={styles.placeholder}>
                <Icon name="camera" size={40} color="#444" />
                <Text style={styles.maxText}>(Max 2 Photos)</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.imageGrid}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Icon name="closesquare" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 2 && (
                  <TouchableOpacity onPress={openCamera} style={styles.placeholder}>
                    <Icon name="camera" size={30} color="#444" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.sideButton, { backgroundColor: '#005A92' }]} onPress={handleSkip}>
              <Text style={[styles.sideButtonText, { color: '#fff' }]}>SKIP</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sideButton, { backgroundColor: '#005A92' }]}
              onPress={handleNext}
            >
              <Text style={[styles.sideButtonText, { color: '#fff' }]}>NEXT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  header1: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    fontWeight: '600',
    color: '#666',
  },
  orderIdText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: '#005A92',
    fontWeight: 'bold',
  },
  cameraBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  placeholder: {
    paddingVertical: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#aaa',
  },
  maxText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  imageGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  imageWrapper: {
    width: '100%',
    marginBottom: 5,
  },
  imagePreview: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  sideButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  sideButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  header: {
    backgroundColor: "#f6f7fb",
    borderBottomColor: "#dfe0e4",
    borderBottomWidth: 1,
    paddingLeft: 50,
    paddingRight: 15,
    paddingVertical: 15
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CameraScreen;