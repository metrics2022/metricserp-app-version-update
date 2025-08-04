import React, { useState, useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image

} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { HandleWorkOrderSearchAction, SearchResourceTransactionsAction } from '../../Redux/Actions/ResourceTransactionsAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';



const WorkorderSearch = ({ navigation, route }) => {

  const dispatch = useDispatch()
  // console.log('ResourceState', SearchResourcesState)
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

  // const onSubmit = async () => {
  //   setIsLoading(true);
  //   let data = {
  //     "work_order_no": inputVal,
  //     "page": "1"
  //   }
  //   try {
  //     const response = await dispatch(HandleWorkOrderSearchAction(data));
  //     if (response.status == "Success") {
  //       setIsLoading(false); // Assuming the response contains a success flag
  //       navigation.navigate('WorkOrderList', {
  //         workOrderNo:inputVal
  //       }); // Navigate to the verification page
  //       setInputVal('');
  //       setBtnDisabled(true);
  //     }
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     // Handle error (e.g., show error message)
  //   } finally {
  //     setIsLoading(false);
  //   }

  // }

  const onSubmit = async () => {
    setIsLoading(true);
    let data = {
      "work_order_no": inputVal,
      "page": "1"
    };
  
    try {
      const response = await dispatch(HandleWorkOrderSearchAction(data));
      if (response.status === "Success" && response.data) {
        setIsLoading(false);
        //console.log(response.data.Serach_result)
        const workOrders = response.data.Serach_result 
        //console.log(workOrders)
        if (workOrders.length === 1) {
          // Navigate to the details page directly if there's only one work order
          navigation.navigate('Operations', {
            work_order_id: workOrders[0].work_order_id, // Pass the single work order details
          });
        } else if (workOrders.length > 1) {
          // Navigate to the list page if there are multiple work orders
          navigation.navigate('WorkOrderList', {
            workOrderNo: inputVal,
            workOrders, // Pass the array of work orders
          });
        } else {
          // Handle the case when no work orders are found
          navigation.navigate('WorkOrderList', {
            workOrderNo: inputVal,
            workOrders, // Pass the array of work orders
          });
        }
  
        setInputVal('');
        setBtnDisabled(true);
      }
    } catch (error) {
      //console.error('Search error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <SafeAreaView style={{ flex: 1 }}>
    {
        isLoading && (
          <View style={{ flex: 1, position: "absolute", zIndex: 2, left: 0, width: "100%", justifyContent: "center", height: "100%", justifyContent: 'center', alignItems: "center", backgroundColor: "rgba(255,255,255,0.9)" }}>
            <View style={{
                paddingHorizontal: 15, paddingVertical: 15, borderRadius: 5
            }}>
                <Image source={require('../../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
            </View>
          </View>
        )
    }
    <View style={styles.mainWrapper}>
      <HeaderTextLeft title={"Work Order Search"} goBack={goBack} fontSize={20} />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: '100%' }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: '#000', marginBottom: 15 }}>Please enter the Work Order number:</Text>
          <View style={{ width: "100%", paddingHorizontal: "auto", position: "relative", marginBottom: 20 }}>
            <TextInput onChangeText={(e) => { onChange(e) }} placeholder="Type here..." placeholderTextColor="#000" style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 10, height: 50 }} maxLength={40}
              value={inputVal}
            />
          </View>
          <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'center', overflow: "hidden", marginTop: 10 }}>
            <TouchableOpacity style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#1788F0" }]} onPress={onSubmit}>
              <Text style={{ color: '#FFF', fontSize: 20 }}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </View></SafeAreaView>
  )
}

var styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    position: "relative",
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20
  },

  Row: {
    flexDirection: "row",
    marginHorizontal: -5,
    flexWrap: "wrap",
    alignItems: "center"
  },

  btnSubmit: {
    backgroundColor: "#3b5998",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 8
  }
});
export default WorkorderSearch
