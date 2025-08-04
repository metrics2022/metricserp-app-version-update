import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
  } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import Verification from './Verification';
import ChooseAccountScreen from './ChooseAccountScreen';

const AuthStack = createNativeStackNavigator();
console.log('Loaded AuthStack');

const AuthStackScreen = () => {
    return (
        <AuthStack.Navigator screenOptions={{headerShown:false}}>
            <AuthStack.Screen name="login" component={Login}  />
            <AuthStack.Screen name="account" component={ChooseAccountScreen}  />
            <AuthStack.Screen name="verification" component={Verification}  />            
        </AuthStack.Navigator>
        
    )
}

export default AuthStackScreen;
