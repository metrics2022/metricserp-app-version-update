import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoOverlay = () => {
    return (
        <View style={styles.overlay}>
            <View style={styles.logoContainer}>
                <Image 
                    source={require('../assets/logoSmall.png')} 
                    style={styles.logo} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        zIndex: 2,
        left: 0,
        width: "100%",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.9)"
    },
    logoContainer: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5
    },
    logo: {
        width: 45,
        height: 45,
        resizeMode: "cover"
    }
});

export default LogoOverlay;
