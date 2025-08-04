import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
const HeaderTextLeftRight = (props) => {
    return (
        <View style={{width:'100%'}}>
            <View style={{ position: "relative", width:'100%', paddingLeft:10, paddingRight:25 }}>
                <TouchableOpacity onPress={props.goBack} style={{ position: "absolute", top: 6, left:0, zIndex: 3, backgroundColor: "rgba(255,255,255,0.8)", padding: 0, borderRadius: 30 }}>
                    <AntDesign name='arrowleft' size={24} color="#000" />
                </TouchableOpacity>
                <Text style={[styles.Heading,{fontSize:props.fontSize}]}>{props.title}</Text>
                <View style={styles.line}></View>
                {props.component}
            </View>
        </View>
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
        marginLeft: 40
    }

});
export default HeaderTextLeftRight