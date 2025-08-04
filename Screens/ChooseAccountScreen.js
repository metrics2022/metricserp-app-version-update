import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SassLoginAction } from '../Redux/Actions/SassLoginAction';


const ChooseAccountScreen = ({ navigation, route }) => {
    const state = useSelector((state) => state.SassLogin);
    const dispatch = useDispatch();

    const [selectedIndex, setSelectedIndex] = useState('');
    const [uniqueKey, setUniqueKey] = useState('');
    const [empId, setEmpId] = useState('');
    const [empMobNo, setEmpMobNo] = useState('');


    useEffect(() => {
        if (state.sassLoginData.status === "Success") {
            //console.log('chooseAccount', state.sassLoginData.data);
            setEmpId(state.sassLoginData.data.employeeData.emp_id);
            setEmpMobNo(state.sassLoginData.data.employeeData.emp_mobno);
        }
    }, [state]);

    const RadioButton = () => {
        return (
            route.params.empData.map((item, index) => (
                <TouchableOpacity 
                    key={index} 
                    onPress={() => {
                        setSelectedIndex(index);
                        setUniqueKey(item.unique_key);
                    }} 
                    style={styles.singleRadioBtn}
                >
                    <View style={styles.circle}>
                        {selectedIndex === index && (<View style={styles.checkedCircle} />)}
                    </View>
                    <Text style={{ color: "#000", fontSize: 16 }}>{item.company_name}</Text>
                </TouchableOpacity>
            ))
        );
    };
    
    return (
        <>
            {state.isLoading && (
                <View style={{
                    flex: 1,
                    position: "absolute",
                    zIndex: 2,
                    left: 0,
                    width: "100%",
                    justifyContent: "center",
                    height: "100%",
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.9)"
                }}>
                    <View style={{
                        paddingHorizontal: 15,
                        paddingVertical: 15,
                        borderRadius: 5
                    }}>
                        <Image source={require('../assets/logoSmall.png')} style={{ width: 45, height: 45, resizeMode: "cover" }} />
                    </View>
                </View>
            )}
            <ScrollView style={styles.mainWrapper}>
                <View style={{ paddingHorizontal: 30, paddingVertical: 40 }}>
                    <Text style={styles.Heading}>Choose Your Account</Text>
                    <View style={styles.line}></View>
                    <View style={styles.RadioButtonRow}>
                        <RadioButton />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                        <TouchableOpacity 
                            style={styles.btnSubmit} 
                            onPress={() => {
                                if (uniqueKey) {
                                    dispatch(SassLoginAction(uniqueKey));
                                    navigation.navigate('verification', {
                                        uniqueKey: uniqueKey,
                                        emp_mobno: empMobNo,
                                    });
                                } else {
                                    Alert.alert("Please select an account first!");
                                }
                            }}
                        >
                            <Text style={{ color: "#FFF", fontSize: 18 }}>NEXT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </>
    );
    
}

export default ChooseAccountScreen;

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    Heading: {
        fontSize: 24,
        fontWeight: "500",
        color: "#252525",
    },
    line: {
        width: 34,
        height: 4,
        backgroundColor: "#1788F0",
        borderRadius: 3,
        marginTop: 10
    },
    RadioButtonRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        marginTop: 20
    },
    singleRadioBtn: {
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        position: "relative",
        paddingLeft: 20,
        marginBottom: 10
    },
    circle: {
        height: 15,
        width: 15,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#aeaeae',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
        position: "absolute",
        left: 0,
        top: 3
    },
    checkedCircle: {
        width: 8,
        height: 8,
        borderRadius: 7,
        backgroundColor: '#1788F0',
    },
    btnSubmit: {
        width: "46%",
        height: 42,
        alignItems: "center",
        backgroundColor: "#1788F0",
        borderRadius: 30,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
        padding: 5,
        marginHorizontal: "2%"
    },
    btnSubmitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: "500",
        textTransform: "uppercase"
    }
});