import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Text } from 'react-native';

const LogoOverlay = () => {
    const scale = useRef(new Animated.Value(1)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startHeartbeat = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.1, // Scale up slightly
                        duration: 800, // Time for the "beat"
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1, // Scale back down
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            ).start();
        };

        const startTextFadeIn = () => {
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 1200, // Slightly longer for smooth fade-in
                useNativeDriver: true,
            }).start();
        };

        startHeartbeat();
        startTextFadeIn();
    }, [scale, textOpacity]);

    return (
        <View style={styles.overlay}>
            <View style={styles.logoContainer}>
                <Animated.Image 
                    source={require('../assets/metrics-logo.webp')} 
                    style={[styles.logo, { transform: [{ scale }] }]} 
                />
                {/* <Animated.Text style={[styles.text, { opacity: textOpacity }]}>
                    MetricsERP
                </Animated.Text> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        position: "absolute",
        zIndex: 10,
        left: 0,
        width: "100%",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.7)",
    },
    logoContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 10,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        marginBottom: 12,
    },
    text: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'Montserrat-SemiBold', // Kept for consistency; can switch to Montserrat-Bold if available
        fontWeight: '700', // Added for bold text (equivalent to 'bold')
        letterSpacing: 1.2,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
});

export default LogoOverlay;