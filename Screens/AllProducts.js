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
    Image
} from 'react-native';
import Fontawesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const AllProducts = () => {
    
    const [selectedVal, setSelectedVal] = useState('');

    return (
        <View style={styles.mainWrapper}>            
            <ScrollView style={{flex:1}}>
            <View style={styles.Row}>
                <View style={styles.eachProduct}>
                    <Image source={{uri:"https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"}} style={{width:"100%", height:130, resizeMode:"cover"}} />
                    <Text style={{color:"#000", fontSize:14}}>Item Code</Text>
                    <Text style={{color:"#000", fontSize:14, marginBottom:3}}>Description</Text>
                    <Text style={{color:"#000", fontSize:15, fontWeight:"700"}}>AUD 11.20</Text>
                    <TouchableOpacity style={styles.btnCart}>
                        <Text style={{color:"#FFF"}}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachProduct}>
                    <Image source={{uri:"https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"}} style={{width:"100%", height:130, resizeMode:"cover"}} />
                    <Text style={{color:"#000", fontSize:14}}>Item Code</Text>
                    <Text style={{color:"#000", fontSize:14, marginBottom:3}}>Description</Text>
                    <Text style={{color:"#000", fontSize:15, fontWeight:"700"}}>AUD 11.20</Text>
                    <TouchableOpacity style={styles.btnCart}>
                        <Text style={{color:"#FFF"}}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachProduct}>
                    <Image source={{uri:"https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"}} style={{width:"100%", height:130, resizeMode:"cover"}} />
                    <Text style={{color:"#000", fontSize:14}}>Item Code</Text>
                    <Text style={{color:"#000", fontSize:14, marginBottom:3}}>Description</Text>
                    <Text style={{color:"#000", fontSize:15, fontWeight:"700"}}>AUD 11.20</Text>
                    <TouchableOpacity style={styles.btnCart}>
                        <Text style={{color:"#FFF"}}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachProduct}>
                    <Image source={{uri:"https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"}} style={{width:"100%", height:130, resizeMode:"cover"}} />
                    <Text style={{color:"#000", fontSize:14}}>Item Code</Text>
                    <Text style={{color:"#000", fontSize:14, marginBottom:3}}>Description</Text>
                    <Text style={{color:"#000", fontSize:15, fontWeight:"700"}}>AUD 11.20</Text>
                    <TouchableOpacity style={styles.btnCart}>
                        <Text style={{color:"#FFF"}}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachProduct}>
                    <Image source={{uri:"https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"}} style={{width:"100%", height:130, resizeMode:"cover"}} />
                    <Text style={{color:"#000", fontSize:14}}>Item Code</Text>
                    <Text style={{color:"#000", fontSize:14, marginBottom:3}}>Description</Text>
                    <Text style={{color:"#000", fontSize:15, fontWeight:"700"}}>AUD 11.20</Text>
                    <TouchableOpacity style={styles.btnCart}>
                        <Text style={{color:"#FFF"}}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.eachProduct}>
                    <Image source={{uri:"https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg"}} style={{width:"100%", height:130, resizeMode:"cover"}} />
                    <Text style={{color:"#000", fontSize:14}}>Item Code</Text>
                    <Text style={{color:"#000", fontSize:14, marginBottom:3}}>Description</Text>
                    <Text style={{color:"#000", fontSize:15, fontWeight:"700"}}>AUD 11.20</Text>
                    <TouchableOpacity style={styles.btnCart}>
                        <Text style={{color:"#FFF"}}>ADD TO CART</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </ScrollView>
        </View>
    )
}

var styles = StyleSheet.create({
    mainWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        position: "relative",
        paddingVertical:0
    },
    Row:{
        flexDirection:"row",
        marginHorizontal:-5,
        flexWrap:"wrap"
    },
    listItem:{
        fontSize:12,
        padding:0
    },
    eachProduct:{
        width:"50%",
        paddingHorizontal:5,
        justifyContent:"center",
        alignItems:"center"
    },
    btnCart:{
        backgroundColor:"#1788F0",
        paddingHorizontal:15,
        paddingVertical:6,
        marginTop:8
    }

});

export default AllProducts
