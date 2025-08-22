import React from 'react';
import { Alert } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { doLogout } from '../Redux/Actions/AuthActions';

// Import all screens
import Cart from './sales-quote/Cart';
import SalesOrder from './SalesOrder/SalesOrder';
import SalesOrderDetails from './SalesOrder/SalesOrderDetails';
import AllActivity from './Lead/AddActivity';
import AllActivities from './Lead/AllActivities';
import LeadCompany from './Lead/Company';
import LeadContact from './Lead/Contact';
import LeadDetails from './Lead/Details';
import LeadSearch from './Lead/Search';
import LeadSearchList from './Lead/SearchList';
import Operations from './ResourceTransaction/Operations';
import WorkorderSearch from './ResourceTransaction/WorkorderSearch';
import Settings from './account/setting';
import Privacy from './account/privacy-policy';
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
import SignatureScreen from './DeliveryStack/signatureScreen';
import ConfirmOrder from './DeliveryStack/confirmOrder';
import BillingShippingAddress from './Common/BillingShipping';



// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const OrderStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const LeadStack = createNativeStackNavigator();
const SalesQuoteStack = createNativeStackNavigator();
const ResourceStack = createNativeStackNavigator();
const QuoteStack = createNativeStackNavigator();
const AccountStack = createNativeStackNavigator();
const DeliveryStack = createNativeStackNavigator();
const CommonStack = createNativeStackNavigator();



// Stack Navigators
const SalesOrderScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Organization" component={Organization} />
    <HomeStack.Screen name="CustPendingInvoices" component={CustPendingInvoices} />
    <HomeStack.Screen name="SearchProducts" component={SearchProducts} />
    <HomeStack.Screen name="SalesOrderCart" component={SalesOrderCartStackScreens} />
    <HomeStack.Screen name="BillingShippingAddress" component={BillingShippingAddress} />
    <CartStack.Screen name="SalesOrderRemarks" component={SalesOrderRemarksScreen} />
  </HomeStack.Navigator>
);

const SalesOrderCartStackScreens = () => (
  <CartStack.Navigator screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="Cartscreen" component={SalesOrderCart} />
    <CartStack.Screen name="ShipAdd" component={ShipAddress} />
    <CartStack.Screen name="Address" component={BillAddress} />
    
  </CartStack.Navigator>
);

const OrderStackScreens = () => (
  <OrderStack.Navigator screenOptions={{ headerShown: false }}>
    <OrderStack.Screen name="Sales-order" component={SalesOrder} />
    <OrderStack.Screen name="Sales-order-details" component={SalesOrderDetails} />
  </OrderStack.Navigator>
);

const LeadStackScreens = () => (
  <LeadStack.Navigator screenOptions={{ headerShown: false }}>
    <LeadStack.Screen name="Search" component={LeadSearch} />
    <LeadStack.Screen name="Company" component={LeadCompany} />
    <LeadStack.Screen name="Contact" component={LeadContact} />
    <LeadStack.Screen name="SearchList" component={LeadSearchList} />
    <LeadStack.Screen name="Details" component={LeadDetails} />
    <LeadStack.Screen name="AllActivities" component={AllActivities} />
    <LeadStack.Screen name="AddActivity" component={AllActivity} />
  </LeadStack.Navigator>
);

const SalesQuoteStackScreens = () => (
  <SalesQuoteStack.Navigator screenOptions={{ headerShown: false }}>
    <SalesQuoteStack.Screen name="OrgCustomerSearch" component={OrgCustomerSearch} />
    <SalesQuoteStack.Screen name="SearchProducts" component={SearchProducts} />
    <SalesQuoteStack.Screen name="QuoteDescription" component={QuoteDescription} />
    <SalesQuoteStack.Screen name="searchLeadCustomerScreen" component={CustomerLeadSearchScreen} />
    <SalesQuoteStack.Screen name="Products" component={Products} />
    <SalesQuoteStack.Screen name="Cart" component={CartStackScreens} />
    <SalesQuoteStack.Screen name="BillingShippingAddress" component={BillingShippingAddress} />
    <SalesQuoteStack.Screen name="Contact" component={Contact} />
    <SalesQuoteStack.Screen name="SalesOrderTerms" component={TermsCondition} />
  </SalesQuoteStack.Navigator>
);

const QuoteStackScreens = () => (
  <QuoteStack.Navigator screenOptions={{ headerShown: false }}>
    <QuoteStack.Screen name="SalesQuotes" component={SalesQuotes} />
    <QuoteStack.Screen name="SalesQuoteDetails" component={SalesQuoteDetails} />
  </QuoteStack.Navigator>
);

const ResourceStackScreens = () => (
  <ResourceStack.Navigator screenOptions={{ headerShown: false }}>
    <ResourceStack.Screen name="WorkorderSearch" component={WorkorderSearch} />
    <ResourceStack.Screen name="WorkOrderList" component={WorkOrderList} />
    <ResourceStack.Screen name="Operations" component={Operations} />
  </ResourceStack.Navigator>
);

const DeliveryStackScreens = () => (
  <DeliveryStack.Navigator screenOptions={{ headerShown: false }}>
    <DeliveryStack.Screen name="Delivery" component={DeliveryRoot} />
    <DeliveryStack.Screen name="CameraScreen" component={CameraScreen} />
    <DeliveryStack.Screen name="SignatureScreen" component={SignatureScreen} />
    <DeliveryStack.Screen name="ConfirmOrder" component={ConfirmOrder} />
  </DeliveryStack.Navigator>
);

const AccountStackScreens = () => (
  <AccountStack.Navigator screenOptions={{ headerShown: false }}>
    <AccountStack.Screen name="Settings" component={Settings} />
    <AccountStack.Screen name="Privacy" component={Privacy} />
    <AccountStack.Screen name="Terms" component={Terms} />
  </AccountStack.Navigator>
);

const CartStackScreens = () => (
  <CartStack.Navigator screenOptions={{ headerShown: false }}>
    <CartStack.Screen name="Cartscreen" component={Cart} />
    <CartStack.Screen name="Address" component={BillAddress} />
    <CartStack.Screen name="ShipAdd" component={ShipAddress} />
    
  </CartStack.Navigator>
);

const TabNavigator = ({ route }) => {
  const dispatch = useDispatch();
  const cartState = useSelector(state => state.CartReducer);

  const removeLocalStore = async () => {
    try {
      await AsyncStorage.removeItem('uuid');
    } catch (e) {
      console.error('Error removing uuid:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Do you really want to sign out?', '', [
      { text: 'No' },
      {
        text: 'Yes',
        onPress: () => {
          removeLocalStore();
          dispatch(doLogout());
        },
      },
    ]);
  };

  const getMainComponent = () => {
    switch(route.params.access) {
      case '1': return SalesOrderScreen;
      case '2': return ResourceStackScreens;
      case '3': return SalesQuoteStackScreens;
      case '4': return LeadStackScreens;
      case '5': return ResourceStackScreens;
      case '6': return DeliveryStackScreens;
      default: return SalesOrderScreen;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1788F0',
        tabBarInactiveTintColor: '#626F7F',
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
      backBehavior="history"
    >
      <Tab.Screen
        name="HomeTab"
        component={getMainComponent()}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={24} />
          ),
        }}
      />

      {(route.params.access === '1' || route.params.access === '3') && (
        <Tab.Screen
          name="CartTab"
          component={CartStackScreens}
          options={{
            tabBarLabel: 'Cart',
            tabBarIcon: ({ color }) => (
              <Icon name="shoppingcart" color={color} size={24} />
            ),
            tabBarBadge: cartState.cartItems.length || undefined,
          }}
        />
      )}

      {route.params.access === '3' && (
        <Tab.Screen
          name="QuoteTab"
          component={QuoteStackScreens}
          options={{
            tabBarLabel: 'Quote',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={24} />
            ),
          }}
        />
      )}

      {route.params.access === '1' && (
        <Tab.Screen
          name="OrderTab"
          component={OrderStackScreens}
          options={{
            tabBarLabel: 'Orders',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={24} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="SettingsTab"
        component={AccountStackScreens}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="setting" color={color} size={24} />
          ),
        }}
      />

      <Tab.Screen
        name="LogoutTab"
        component={SalesOrderScreen}
        options={{
          tabBarLabel: 'Sign Out',
          tabBarIcon: ({ color }) => (
            <Icon name="logout" color={color} size={24} />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;