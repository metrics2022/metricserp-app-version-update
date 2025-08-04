import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const HeaderTextLeft = (props) => {
    return (
        <>
            <TouchableOpacity onPress={props.goBack} style={{ position: "absolute", top: 22, left: 3, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 14, borderRadius: 30 }}>
                <AntDesign name='arrowleft' size={24} color="#000" />
            </TouchableOpacity>
            <View style={{ position: "relative" }}>
                <Text style={[styles.Heading,{fontSize:props.fontSize}]}>{props.title}</Text>
            </View>
            <View style={styles.line}></View>
        </>
    )
}
var styles = StyleSheet.create({

    Heading: {
        fontWeight: "500",
        color: "#252525",
        marginLeft: 40
    },
    line: {
        width: 34,
        height: 4,
        backgroundColor: "#1788F0",
        borderRadius: 3,
        marginTop: 10,
        marginBottom: 25,
        marginLeft:40
    },

});
export default HeaderTextLeft