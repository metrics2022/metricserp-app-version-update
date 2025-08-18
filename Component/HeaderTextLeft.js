import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const HeaderTextLeft = ({ goBack, title, subTitle }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <AntDesign name="arrowleft" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            {subTitle ? <Text style={styles.headerSubtitle}>{subTitle}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#f6f7fb',
        borderBottomColor: '#dfe0e4',
        borderBottomWidth: 1,
        paddingLeft: 50, // ✅ keep same padding as your working version
        paddingRight: 15,
        paddingVertical: 15,
        width: '100%', // ensures it spans full screen
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 18,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});

export default HeaderTextLeft;
