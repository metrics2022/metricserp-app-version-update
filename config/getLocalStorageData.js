
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMyLocalData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('uuid')
      return jsonValue != null ? JSON.parse(jsonValue) : null
    } catch(e) {
      // read error
    }  
    //console.log('Done.')  
}


