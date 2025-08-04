import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResourceTransactionsAction } from '../../Redux/Actions/ResourceTransactionsAction'
import HeaderTextLeft from '../../Component/HeaderTextLeft';
import CustomerSearchCom from '../../Component/CustomerSearchCom';
import { SearchCustomerAction } from '../../Redux/Actions/SearchCustomerAction';

const ResourceTransactionSearch = ({ navigation, route }) => {

  const SearchResourcesState = useSelector((state) => state.ResourceTransaction);
  const dispatch = useDispatch()
  // console.log('ResourceState', SearchResourcesState)
  const [inputVal, setInputVal] = useState('');
  const [customer, setCustomer] = useState('')
  const [vendorid, setVendorid] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [isVisible, setIsvisible] = useState(false);

  const searchCustomerState = useSelector((state) => state.SearchCustomer);

  const goBack = () => {
    navigation.goBack()
  }
  const handleSearch = () => {
    dispatch({ type: "RESOURCE_TRANSACTIONS_SEARCH_RESET" })
    dispatch(SearchResourceTransactionsAction({
      work_order_no: inputVal,
      page: "1"
    }));
    // console.log("work_order_no:", inputVal)
  }
  useEffect(() => {
    if (inputVal == '' && customer == '') {
      setBtnDisabled(true)
    } else {
      setIsvisible(false);
      setBtnDisabled(false)
    }
  }, [inputVal, customer])

  useEffect(() => {
    if (customer.length > 3) {
      dispatch(SearchCustomerAction(customer));
      // console.log("Custome_Name", customer)
    } else {
      setIsvisible(false);
      setBtnDisabled(true);
    }
  }, [customer]);

  const onPressFun = () => {
    setBtnDisabled(false)
    // setIsvisible(false)
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.mainWrapper}>
      <HeaderTextLeft title={"Resource Transactions"} goBack={goBack} fontSize={20} />
      <TouchableOpacity onPress={() => navigation.navigate('AddResourceTransaction')} style={{ position: "absolute", right: 15, top: 36 }}><Icon name='plus-square' color="#1788F0" size={25} /></TouchableOpacity>
      <View style={styles.Row}>
        <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
          <Text style={{ color: "#000", fontSize: 15, marginBottom: 5, fontWeight: "700" }}>Work Order No:</Text>
          <TextInput placeholder="Start Typing..." keyboardType='numeric' placeholderTextColor="#1a1a1a" value={inputVal} onChangeText={(e) => { setInputVal(e), setIsvisible(true) }} style={{ backgroundColor: "#e1e2e3", fontSize: 15, color: "#000", paddingHorizontal: 12, height:46 }} />
        </View>
      </View>
      <View style={[styles.Row, {position:'relative', zIndex:999}]}>
        <View style={{ width: "100%", paddingHorizontal: 5, position: "relative", marginTop: 20 }}>
          <CustomerSearchCom customer={customer} setCustomer={setCustomer} setVendorid={setVendorid} onPressFun={onPressFun} isVisible={isVisible} />
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {
          <TouchableOpacity disabled={btnDisabled} style={[styles.btnSubmit, { backgroundColor: btnDisabled ? "#9d9d9d" : "#1788F0" }]} onPress={() => {
            handleSearch()
              , navigation.navigate('ResourceTransactionList')
          }
          }>
            <Text style={{ color: "#FFF", fontSize: 18 }}>NEXT</Text>
          </TouchableOpacity>
        }
      </View>
    </View>
    </SafeAreaView >

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
export default ResourceTransactionSearch
