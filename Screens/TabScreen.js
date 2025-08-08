import React from 'react';
import {
  Alert,
  BackHandler,
  Linking,
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from './Cart';
import SalesOrder from './SalesOrder';
import SalesOrderDetails from './SalesOrderDetails';

//import { VERSION_CHECK_API_URL } from "@env";
import { VERSION_CHECK_API_URL } from '../config/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import VersionCheck from 'react-native-version-check';
import { useDispatch, useSelector } from 'react-redux';
import { doLogout } from '../Redux/Actions/AuthActions';
import BillToScreen from './BillToScreen';
import AllActivity from './Lead/AddActivity';
import AllActivities from './Lead/AllActivities';
import LeadCompany from './Lead/Company';
import LeadContact from './Lead/Contact';
import LeadDetails from './Lead/Details';
import LeadSearch from './Lead/Search';
import LeadSearchList from './Lead/SearchList';
import RemarksScreen from './RemarksScreen';
import Operations from './ResourceTransaction/Operations';
import WorkorderSearch from './ResourceTransaction/WorkorderSearch';
import ShipToScreen from './ShipToScreen';
import Privacy from './account/privacy-policy';
import Settings from './account/setting';
import Terms from './account/terms';
import BillAddress from './sales-quote/BillAddress';
import Contact from './sales-quote/Contact';
import CustomerLeadSearchScreen from './sales-quote/CustomerLeadSearchScreen';
import OrgCustomerSearch from './sales-quote/OrgCustomerSearch';
import Products from './sales-quote/Products';
import QuoteDescription from './sales-quote/QuoteDescription';
import SalesQuoteDetails from './sales-quote/SalesQuoteDetails';
import SalesQuotes from './sales-quote/SalesQuotes';
import ShipAddress from './sales-quote/ShipAddress';
import Organization from './SalesOrder/Organization';
import SearchProducts from './Common/SearchProducts';
import SalesOrderCart from './SalesOrder/Cart';
import SalesOrderRemarksScreen from './SalesOrder/RemarksScreen';
import WorkOrderList from './ResourceTransaction/WorkOrderList';
import CustPendingInvoices from './SalesOrder/CustPendingInvoices';
import TermsCondition from './sales-quote/TermsCondition';
import DeliveryRoot from './DeliveryStack';
import CameraScreen from './DeliveryStack/cameraScreen';
//import SignatureScreen from './DeliveryStack/signatureScreen';
import ConfirmOrder from './DeliveryStack/confirmOrder';



const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const OrderStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const LeadStack = createNativeStackNavigator();
const SalesQuoteStack = createNativeStackNavigator();
const WorkOrderStack = createNativeStackNavigator();
const ResourceStack = createNativeStackNavigator();
const QuoteStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();

console.log('Loaded TabScreen');

const SalesOrderScreen = ({ }) => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen
      name="Organization"
      component={Organization}
      screenOptions={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="CustPendingInvoices"
      component={CustPendingInvoices}
      screenOptions={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="SearchProducts"
      component={SearchProducts}
      screenOptions={{ headerShown: false }}
    />

    <HomeStack.Screen
      name="SalesOrderCart"
      component={SalesOrderCartStackScreens}
      screenOptions={{ headerShown: false }}
    />
  </HomeStack.Navigator>
);

// For Sales Order
const SalesOrderCartStackScreens = ({ navigation }) => (
  <CartStack.Navigator
    initialRouteName="Cartscreen"
    screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="Cartscreen" component={SalesOrderCart} />
    <CartStack.Screen
      name="ShipAdd"
      component={ShipAddress}
      screenOptions={{ headerShown: false }}
    />
    <CartStack.Screen
      name="Address"
      component={BillAddress}
      screenOptions={{ headerShown: false }}
    />
    <CartStack.Screen
      name="SalesOrderRemarks"
      component={SalesOrderRemarksScreen}
      screenOptions={{ headerShown: false }}
    />
  </CartStack.Navigator>
);
// For Sales Order

const OrderStackScreens = ({ navigation }) => (
  <OrderStack.Navigator screenOptions={{ headerShown: false }}>
    <OrderStack.Screen
      name="Sales-order"
      component={SalesOrder}
      screenOptions={{ headerShown: false }}
    />
    <OrderStack.Screen
      name="Sales-order-details"
      component={SalesOrderDetails}
      screenOptions={{ headerShown: false }}
    />
  </OrderStack.Navigator>
);

const CartStackScreens = ({ navigation }) => (
  <CartStack.Navigator
    initialRouteName="Cartscreen"
    screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="Cartscreen" component={Cart} />
    <CartStack.Screen
      name="Address"
      component={BillAddress}
      screenOptions={{ headerShown: false }}
    />
    <CartStack.Screen
      name="ShipAdd"
      component={ShipAddress}
      screenOptions={{ headerShown: false }}
    />

    <CartStack.Screen
      name="Contact"
      component={Contact}
      screenOptions={{ headerShown: false }}
    />

    <CartStack.Screen
      name="Billto"
      component={BillToScreen}
      screenOptions={{ headerShown: false }}
    />
    <CartStack.Screen
      name="Shipto"
      component={ShipToScreen}
      screenOptions={{ headerShown: false }}
    />
    <CartStack.Screen
      name="Remarks"
      component={RemarksScreen}
      screenOptions={{ headerShown: false }}
    />
  </CartStack.Navigator>
);
const LeadStackScreens = ({ navigation }) => (
  <LeadStack.Navigator screenOptions={{ headerShown: false }}>
    <LeadStack.Screen
      name="Search"
      component={LeadSearch}
      screenOptions={{ headerShown: false }}
    />

    <LeadStack.Screen
      name="Company"
      component={LeadCompany}
      screenOptions={{ headerShown: false }}
    />
    <LeadStack.Screen
      name="Contact"
      component={LeadContact}
      screenOptions={{ headerShown: false }}
    />
    <LeadStack.Screen
      name="SearchList"
      component={LeadSearchList}
      screenOptions={{ headerShown: false }}
    />
    <LeadStack.Screen
      name="Details"
      component={LeadDetails}
      screenOptions={{ headerShown: false }}
    />
    <LeadStack.Screen
      name="AllActivities"
      component={AllActivities}
      screenOptions={{ headerShown: false }}
    />
    <LeadStack.Screen
      name="AddActivity"
      component={AllActivity}
      screenOptions={{ headerShown: false }}
    />
  </LeadStack.Navigator>
);

const SalesQuoteStackScreens = ({ navigation }) => (
  <SalesQuoteStack.Navigator screenOptions={{ headerShown: false }}>
    <SalesQuoteStack.Screen
      name="OrgCustomerSearch"
      component={OrgCustomerSearch}
      screenOptions={{ headerShown: false }}
    />
    <SalesQuoteStack.Screen
      name="SearchProducts"
      component={SearchProducts}
      screenOptions={{ headerShown: false }}
    />
    <SalesQuoteStack.Screen
      name="QuoteDescription"
      component={QuoteDescription}
      screenOptions={{ headerShown: false }}
    />
    {/* New screens */}
    <SalesQuoteStack.Screen
      name="searchLeadCustomerScreen"
      component={CustomerLeadSearchScreen}
      screenOptions={{ headerShown: false }}
    />
    <SalesQuoteStack.Screen
      name="Products"
      component={Products}
      screenOptions={{ headerShown: false }}
    />
    <SalesQuoteStack.Screen
      name="Cart"
      component={CartStackScreens}
      screenOptions={{ headerShown: false }}
    />
    <SalesQuoteStack.Screen
      name="SalesOrderTerms"
      component={TermsCondition}
      screenOptions={{ headerShown: false }}
    />
  </SalesQuoteStack.Navigator>
);

const QuoteStackScreens = ({ navigation }) => (
  <QuoteStack.Navigator screenOptions={{ headerShown: false }}>
    <OrderStack.Screen
      name="SalesQuotes"
      component={SalesQuotes}
      screenOptions={{ headerShown: false }}
    />
    <QuoteStack.Screen
      name="SalesQuoteDetails"
      component={SalesQuoteDetails}
      screenOptions={{ headerShown: false }}
    />
  </QuoteStack.Navigator>
);

const ResourceStackScreens = ({ navigation }) => (
  <ResourceStack.Navigator screenOptions={{ headerShown: false }}>

    {/* <ResourceStack.Screen
      name="ResourceTransactionSearch"
      component={ResourceTransactionSearch}
      screenOptions={{ headerShown: false }}
    />
    <ResourceStack.Screen
      name="ResourceTransactionList"
      component={ResourceTransactionList}
      screenOptions={{ headerShown: false }}
    />
    <ResourceStack.Screen
      name="ResourceTransactionDetaile"
      component={ResourceTransactionDetaile}
      screenOptions={{ headerShown: false }}
    />
    <ResourceStack.Screen
      name="AddResourceTransaction"
      component={AddResourceTransaction}
      screenOptions={{ headerShown: false }}
    /> */}


    {/* New screen */}
    <ResourceStack.Screen
      name="WorkorderSearch"
      component={WorkorderSearch}
      screenOptions={{ headerShown: false }}
    />
    <ResourceStack.Screen
      name="WorkOrderList"
      component={WorkOrderList}
      screenOptions={{ headerShown: false }}
    />

    <ResourceStack.Screen
      name="Operations"
      component={Operations}
      screenOptions={{ headerShown: false }}
    />

  </ResourceStack.Navigator>
);

const AccountStackScreens = ({ navigation }) => (
  <AccountStack.Navigator screenOptions={{ headerShown: false }}>

    <AccountStack.Screen
      name="Settings"
      component={Settings}
      screenOptions={{ headerShown: false }}
    />
    <AccountStack.Screen
      name="Privacy"
      component={Privacy}
      screenOptions={{ headerShown: false }}
    />
    <AccountStack.Screen
      name="Terms"
      component={Terms}
      screenOptions={{ headerShown: false }}
    />

  </AccountStack.Navigator>
);

const DeliveryStackScreens = ({ navigation }) => (
  <AccountStack.Navigator screenOptions={{ headerShown: false }}>
    <AccountStack.Screen
      name="Delivery"
      component={DeliveryRoot}
      screenOptions={{ headerShown: false }}
    />
    <AccountStack.Screen 
        name="CameraScreen" 
        component={CameraScreen} 
        options={{ headerShown: false }}
      />
    {/* <AccountStack.Screen 
        name="SignatureScreen" 
        component={SignatureScreen} 
        options={{ headerShown: false }}
      /> */}
    <AccountStack.Screen 
        name="ConfirmOrder" 
        component={ConfirmOrder} 
        options={{ headerShown: false }}
      />
  </AccountStack.Navigator>
);

const TabScreen = ({ route }) => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.CartReducer);

  const removeLocalStore = async () => {
    try {
      await AsyncStorage.removeItem('uuid');
    } catch (e) {
      // remove error
    }
  };

  let alertPresent = false;

  const updatePress = async () => {
    alertPresent = false;
  }

  const updateCheck = async (routeName, navigation) => {
    try {
      const response = await axios.get(VERSION_CHECK_API_URL + '/version-check', {
        headers: {
          "X-Access-Token": "wSsVR61wrET5CPgsz2esIukxn1gBUgzyEEx"
        }
      });

      const latestVersion = Platform.OS === 'ios' ? response?.data?.data?.ios_version : response?.data?.data?.android_version;
      const currentVersion = VersionCheck.getCurrentVersion();

     
    } catch (error) {
      console.error('Error checking version:', error);
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Main"
        component={
          route.params.access == '1'
            ? SalesOrderScreen
            : route.params.access == '2'
              ? WorkOrderStackScreens
              : route.params.access == '3'
                ? SalesQuoteStackScreens
                : route.params.access == '4'
                  ? LeadStackScreens
                  : route.params.access == '5'
                    ? ResourceStackScreens
                    : route.params.access == '6' ? DeliveryStackScreens : SalesOrderScreen
        }
        options={({ route }) => ({
          tabBarLabel: 'Home',
          tabBarColor: '#FFFFFF',
          //tabBarStyle: {display: 'none'},
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        })}
        listeners={({ navigation }) => ({
          tabPress: async e => {
            e.preventDefault(); // Stop default navigation action
            dispatch({ type: 'SALES_ORDER_SUBMIT_RESET' });
            dispatch({ type: "RESET_CART_DATA" });
            await updateCheck('service', navigation); // Wait for the version check to complete
          },
        })}
      />
      <Tab.Screen
        name="Setting"
        component={AccountStackScreens}
        options={({ route }) => ({
          tabBarLabel: 'Setting',
          tabBarColor: '#FFFFFF',
          tabBarIcon: ({ color, size }) => (
            <Icon name="setting" color={color} size={size} />
          ),
        })}
        listeners={({ navigation }) => ({
          tabPress: async e => {
            e.preventDefault(); // Stop default navigation action
            await updateCheck('Setting', navigation); // Wait for the version check to complete
          },
        })}
      />

      {/* {route.params.access == '1' && (
        <Tab.Screen
          name="Cart"
          component={CartStackScreens}
          options={({ route }) => ({
            tabBarInactiveTintColor: '#515151',
            tabBarLabel: 'Cart',
            tabBarColor: '#FFFFFF',
            // tabBarStyle: {display: 'none'},
            tabBarIcon: ({ color, size }) => (
              <Icon name="shoppingcart" color={color} size={size} />
            ),
            tabBarBadgeStyle: { opacity: cartState.cartItems.length > 0 ? 1 : 0 },
            tabBarBadge: cartState.cartItems.length,
          })}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              navigation.navigate('Cart');
              dispatch({ type: 'SALES_ORDER_SUBMIT_RESET' });
            },
          })}
        />
      )}
      {route.params.access == '3' && (
        <Tab.Screen
          name="Cart"
          component={CartStackScreens}
          options={({ route }) => ({
            tabBarInactiveTintColor: '#515151',
            tabBarLabel: 'Cart',
            tabBarColor: '#FFFFFF',
            // tabBarStyle: {display: 'none'},
            tabBarIcon: ({ color, size }) => (
              <Icon name="shoppingcart" color={color} size={size} />
            ),
            tabBarBadgeStyle: { opacity: cartState.cartItems.length > 0 ? 1 : 0 },
            tabBarBadge: cartState.cartItems.length,
          })}
          listeners={({ navigation, route }) => ({
            tabPress: e => {
              navigation.navigate('Cart');
              dispatch({ type: 'SALES_ORDER_SUBMIT_RESET' });
            },
          })}
        />
      )} */}
      {route.params.access == '3' && (
        <Tab.Screen
          name="Quote"
          component={QuoteStackScreens}
          options={({ route }) => ({
            tabBarLabel: 'Quote',
            tabBarColor: '#FFFFFF',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          })}
        />
      )}
      {route.params.access == '1' && (
        <Tab.Screen
          name="Order"
          component={OrderStackScreens}
          options={({ route }) => ({
            tabBarLabel: 'Orders',
            tabBarColor: '#FFFFFF',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
          })}
        />
      )}

      <Tab.Screen
        name="You"
        component={SalesOrderScreen}
        options={({ route }) => ({
          tabBarLabel: 'Sign Out',
          tabBarColor: '#FFFFFF',
          tabBarIcon: ({ color, size }) => (
            <Icon name="logout" color={color} size={size} />
          ),
        })}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            e.preventDefault();
            Alert.alert('Do you really want to sign out?', '', [
              { text: 'No', onPress: () => console.log('logout') },
              {
                text: 'Yes',
                onPress: () => {
                  removeLocalStore(), dispatch(doLogout());
                },
              },
            ]);
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default TabScreen;
