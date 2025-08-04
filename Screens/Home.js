import React, { useState, useEffect } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Image
} from 'react-native';

import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { doLogout } from '../Redux/Actions/AuthActions';
import { useDispatch, useSelector } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyLocalData } from '../config/getLocalStorageData';

import { globalDataAction } from '../Redux/Actions/GlobalDataAction';
import { ModuleAccessAction } from '../Redux/Actions/ModuleAccessAction';

const Home = ({ navigation }) => {
    const globalReducerState = useSelector(state=> state.GlobalDataReducer);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [accessSalesOrder, setAccessSalesOrder] = useState('');
    const [accessWorkOrder, setAccessWorkOrder] = useState('');
    const [accessSalesQuote, setAccessSalesQuote] = useState('');
    const [getApiKeyToken, setGetApiKeyToken] = useState(null);
    const [salesOrderModule, setSalesOrderModule] = useState('');
    const [salesQuoteModule, setSalesQuoteModule] = useState('');
    const [modules, setModules] = useState([]);





    const dispatch = useDispatch();

    const setMyLocalData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value);
          await AsyncStorage.mergeItem('uuid', jsonValue)
        } catch (e) {
          // saving error
        }
    }

    // useEffect(() => {
    //     getData().then((e) => {
    //          console.log('sasad',e.emp_data.emp_fname);
    //         setFirstName(e.emp_data.emp_fname);
    //         setLastName(e.emp_data.emp_lname);
    //         setAccessSalesOrder(e.sales_order_access)

    //     });
    // }, []);





    useEffect(() => {
        getMyLocalData().then((value)=> {setGetApiKeyToken(value)});
        //console.log('localStotageData', value)
    }, []);

    useEffect(()=> {
        if(getApiKeyToken!=null){
            dispatch(globalDataAction(getApiKeyToken));
        }
    }, [getApiKeyToken]);

    //console.log("20",modules)


    useEffect(()=> {
        if(globalReducerState.getGlobalData.status==="Success"){
            setMyLocalData(globalReducerState.getGlobalData.data);
            //console.log('currency', globalReducerState.getGlobalData.data.currency);
            setFirstName(globalReducerState.getGlobalData.data.emp_data.emp_fname);
            setLastName(globalReducerState.getGlobalData.data.emp_data.emp_lname);
            setAccessSalesOrder(globalReducerState.getGlobalData.data.sales_order_access);
            setAccessWorkOrder(globalReducerState.getGlobalData.data.work_order_access);
            setAccessSalesQuote(globalReducerState.getGlobalData.data.sales_quote_access);
            setModules(globalReducerState.getGlobalData.data.modules);

            //setSalesQuoteModule(globalReducerState.getGlobalData.data.module_access.sales_quote_module);
        }

    }, [globalReducerState]);

    const accessModule = (index,menu_name) => {
        if(menu_name == 'Sales Order')
        {
            navigation.navigate('Organization')
        }
        if(menu_name == 'Work Order')
        {
            navigation.navigate('WorkOrderSearch')
        }
        if(menu_name == 'QUOTE')
        {
            navigation.navigate('Organization')
        }

    }

    const setModuleValue = async (menu) =>{
        try{
            //console.log('menu',menu)
            const jsonValue = JSON.stringify(menu)
            await AsyncStorage.setItem('moduleData',jsonValue)

        } catch(err){
            // console.log(err)
        }
    }
    const removeModuleValue = async () =>{
        try{
            await AsyncStorage.removeItem('moduleData')
            // console.log('Done')

        } catch(err){
            // console.log(err)
        }


    }
    useEffect(() => {
        removeModuleValue()

    }, []);


    return (
        <ScrollView style={styles.mainWrapper}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 40 }}>
                <View style={styles.userImage}>
                    <Image
                        source={require('../assets/small-logo.png')}
                        width="80"
                        height="44"
                        resizeMode="cover"
                    />
                </View>
                <View style={{ paddingLeft: 15 }}>
                    <Text style={{ fontSize: 17, color: "#000" }}><Text style={{ color: "#3b5998" }}>{firstName} {lastName}</Text></Text>
                </View>
            </View>
            <View style={styles.row}>
            {
            modules.map((menu, index ) => {

               //console.log(index)
               return(
                <View key={index} style={styles.eachbox}>
                    <TouchableOpacity disabled={menu.user_access === "1" ? false : true} style={menu.user_access === "1" ? styles.btnArea : [styles.btnArea, { backgroundColor: "#ccc", position: "relative" }]} onPress={() => {accessModule(index,menu.menu_name),setModuleValue(menu)}}>
                        {menu.user_access !== "1" && (
                            <Fontawesome name="lock" color="#FFF" size={16} style={{ position: "absolute", top: 10, right: 10 }} />
                        )}
                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>{menu.menu_name}</Text>
                    </TouchableOpacity>
                </View>
               )
              })
            }
                {/* <View style={styles.eachbox}>
                <TouchableOpacity disabled={accessSalesQuote === "1" ? false : true} style={accessSalesQuote === "1" ? styles.btnArea :
                 [styles.btnArea, { backgroundColor: "#ccc", position: "relative" }]} onPress={() => navigation.navigate('Organization',{
                    accessMenu :"2"
                })}>
                        {accessSalesQuote !== "1" && (
                            <Fontawesome name="lock" color="#FFF" size={16} style={{ position: "absolute", top: 10, right: 10 }} />
                        )}
                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>QUOTE</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachbox}>
                <TouchableOpacity disabled={accessWorkOrder === "1" ? false : true} style={accessWorkOrder === "1" ? styles.btnArea :
                 [styles.btnArea, { backgroundColor: "#ccc", position: "relative" }]} onPress={() => navigation.navigate('WorkOrderSearch',{
                    accessMenu :"3"
                 })}>
                        {accessWorkOrder !== "1" && (
                            <Fontawesome name="lock" color="#FFF" size={16} style={{ position: "absolute", top: 10, right: 10 }} />
                        )}
                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Work Order</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachbox}>
                    <TouchableOpacity disabled={true} style={[styles.btnArea, { backgroundColor: "#ccc", position: "relative" }]}>
                        <Fontawesome name="lock" color="#FFF" size={16} style={{ position: "absolute", top: 10, right: 10 }} />
                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Lead</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachbox}>
                    <TouchableOpacity disabled={true} style={[styles.btnArea, { backgroundColor: "#ccc", position: "relative" }]}>
                        <Fontawesome name="lock" color="#FFF" size={16} style={{ position: "absolute", top: 10, right: 10 }} />
                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Analytics</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachbox}>
                    <TouchableOpacity disabled={true} style={[styles.btnArea, { backgroundColor: "#ccc", position: "relative" }]}>
                        <Fontawesome name="lock" color="#FFF" size={16} style={{ position: "absolute", top: 10, right: 10 }} />
                        <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "600", textTransform: "uppercase" }}>Stock</Text>
                    </TouchableOpacity>
                </View> */}

                {/* <TouchableOpacity onPress={()=> { removeLocalStore(), dispatch(doLogout()) }}>
                    <Text style={{color:"#000", fontSize:20, marginLeft:25}}>Logout</Text></TouchableOpacity> */}
            </View>
        </ScrollView>
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative",
        paddingVertical: 30,
        paddingHorizontal: 20
    },
    userImage: {
        width: 80,
        height: 70,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 80
    },
    row: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -5
    },
    eachbox: {
        width: "100%",
        paddingHorizontal: 5,
        marginBottom: 15
    },
    btnArea: {
        backgroundColor: "#3b5998",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 15,
        height: 100,
        borderRadius: 10
    }
});

export default Home
