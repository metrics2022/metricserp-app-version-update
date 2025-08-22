import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HeaderTextLeftRight = ({ goBack, title, fontSize = 20, component }) => {
    return (
        <View style={styles.header}>
            {/* Back Button */}
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <AntDesign name="arrowleft" size={24} color="#000" />
            </TouchableOpacity>

            {/* Title + Underline */}
            <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle, { fontSize }]}>{title}</Text>
                {/* <View style={styles.line} /> */}
            </View>

            {/* Right Side Component (optional) */}
            <View style={styles.rightComponent}>
                {component}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f6f7fb',
        borderBottomColor: '#dfe0e4',
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 15,
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 18,
    },
    titleContainer: {
        marginLeft: 50, // space after back button
        flex: 1,
    },
    headerTitle: {
        // fontSize: 20,
        fontWeight: 'bold',
        color: '#252525',
    },
    line: {
        width: 34,
        height: 4,
        backgroundColor: '#1788F0',
        borderRadius: 3,
        marginTop: 6,
    },
    rightComponent: {
        position: 'absolute',
        right: 15,
        top: 18,
    },
});

export default HeaderTextLeftRight;
