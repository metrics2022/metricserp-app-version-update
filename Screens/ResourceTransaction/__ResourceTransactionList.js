import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Image
} from 'react-native';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchResourceTransactionsAction } from '../../Redux/Actions/ResourceTransactionsAction'
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import HeaderTextLeft from '../../Component/HeaderTextLeft';

const ResourceTransactionList = ({ navigation, route }) => {

  const state = useSelector((state) => state.ResourceTransaction);
  const dispatch = useDispatch()
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  // console.log('result', state.ResourceSearchResult)
  useEffect(() => {
    if (state.ResourceSearchResult.length > 0) {
      setData([...data, ...state.ResourceSearchResult])
      // console.log("Resource DaTa:", [...data, ...state.ResourceSearchResult])
    }
  }, [state.ResourceSearchResult])
  useEffect(() => {
    if (page > 1) {
      dispatch(SearchResourceTransactionsAction({
        page: page
      }));
    }
  }, [page]);


  const goBack = () => {
    navigation.goBack()
  }
  const handleLoadMore = () => {
    //console.log('load more', page);
    if (state.ResourceSearchResult.length >= 10) {
      setPage(page + 1);
    }
  }
  const renderFooter = () => {
    return (
      state.isLoading ? <View style={{ marginTop: 20 }}><ActivityIndicator size="large" color="#1788F0" /></View> : null
    )
  }
  const renderItem = ({ item }) => {
    // console.log("Item", item)
    if (item != 0) {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('ResourceTransactionDetaile', {
          resource_transaction_id: item.resource_transaction_id
        })} style={styles.Row}>
          <View style={{ width: "100%" }}>
            <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Work Order No: {item.work_order_no}</Text>
            <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Resource Code: {item.resource_code}</Text>
            <Text style={{ color: "#626F7F", fontSize: 13, marginBottom: 4 }}>Transaction Date: {item.transaction_date}</Text>
          </View>
          <Icon size={26} color="#626F7F" name="angle-right" style={{ position: "absolute", top: "38%", right: 0 }} />
        </TouchableOpacity>
      )
    }

  }
  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={styles.mainWrapper}>
        <HeaderTextLeft title={"Resource Transactions Search List"} goBack={goBack} fontSize={25} />
        {state.ResourceSearchResult === 0 ? (
          <View style={{ justifyContent: "center", marginTop: 40 }}>
            <View style={{ justifyContent: "center", flexDirection: "row" }}>
              <Image
                source={require('../../assets/warning.png')}
                width="10"
                height="10"
                resizeMode="contain"
              />
              {/* <Icon name='error-outline' color= '#000' size={45} /> */}
            </View>
            <Text style={{ color: "#000", fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 20 }}>Sorry! No result Found</Text>

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 50, flexWrap: "wrap" }}>
              <TouchableOpacity style={styles.btnSubmit} onPress={() => { navigation.navigate('ResourceTransactionSearch'), navigation.popToTop(), dispatch({ type: "WORK_ORDER_RESET" }) }}>
                <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Go Back</Text>
              </TouchableOpacity>
            </View>

          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={handleLoadMore}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.5}
          />
        )
        }

      </View>
    </SafeAreaView >

  )
}
var styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20
  },
  Row: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
    borderStyle: "solid",
    marginBottom: 15
  },
  btnSubmit: {
    backgroundColor: "#1788F0",
    borderRadius: 35,
    paddingVertical: 10,
    paddingHorizontal: 25
  }
});

export default ResourceTransactionList