import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity , BackHandler,Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // For check icon

const ConfirmOrder = ({ navigation, route }) => {
  const orderId = route?.params?.orderId || ''; // Optional: pass real ID via navigation
  const customerName = route?.params?.customerName

  // Handle back button press
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Prevent going back
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
      <Image
        source={require('../../assets/pngwing.com.png')}
        style={{ width: 60, height: 60, resizeMode: 'contain' }}
      />
      </View>

      <Text style={styles.title}>Delivery Confirmed</Text>
      <Text style={styles.orderId}>Order #{orderId}</Text>
      <Text style={styles.orderId}>{customerName}</Text>
      <Text style={styles.message}>
        Thank you! The delivery has been successfully recorded.
      </Text>

      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('service')}
        onPress={() => navigation.navigate('service')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.pop(3)}
      >
        <Text style={styles.buttonText}>Start Next Delivery</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },
  message: {
    textAlign: 'center',
    color: '#555',
    marginTop: 10,
    marginBottom: 30,
    fontSize: 14,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
});