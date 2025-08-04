import React from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    SafeAreaView
} from 'react-native';

import HeaderTextLeft from '../../Component/HeaderTextLeft';
import VersionCheck from 'react-native-version-check';

const Settings = ({ navigation }) => {

    const currentVersion = VersionCheck.getCurrentVersion();

    const goBack = () => {
        navigation.goBack()
    }
    function LoadingIndicatorView() {
        return (
          <ActivityIndicator
            color="#009b88"
            size="large"
            style={styles.ActivityIndicatorStyle}
          />
        );
      }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainWrapper}>
          <HeaderTextLeft title={"Settings"} goBack={goBack} fontSize={25} />

          <View style={styles.tabBarContainer}>
            <TouchableOpacity onPress={()=> navigation.navigate('Privacy')} style={{borderBottomWidth:1, borderBottomColor:"#ccc"}}>
              <View style={styles.Desc}>
                <Text style={{ color: "#626F7F", fontSize: 20 }}>Privacy Policy</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> navigation.navigate('Terms')}>
            <View style={styles.Desc}>
              <Text style={{ color: "#626F7F", fontSize: 20 }}>Terms of Use</Text>
            </View>

            </TouchableOpacity>

          </View>
          <Text style={{position:'absolute', textAlign:'center', bottom:15, left:0, right:0, color:'gray'}}>Version: {currentVersion}</Text>
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
    },
    Desc: {
        paddingHorizontal: 14,
        paddingVertical: 10
    }
});

export default Settings;
