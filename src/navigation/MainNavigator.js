// src/navigation/MainNavigator.js  (Passenger - FINAL COMPLETE)
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import HomeScreen            from '../screens/main/HomeScreen';
import RideBookingScreen     from '../screens/main/RideBookingScreen';
import ActiveRideScreen      from '../screens/main/ActiveRideScreen';
import RideCompletedScreen   from '../screens/main/RideCompletedScreen';
import ActivityScreen        from '../screens/main/ActivityScreen';
import ProfileScreen         from '../screens/main/ProfileScreen';
import EditProfileScreen     from '../screens/main/EditProfileScreen';
import PaymentMethodsScreen  from '../screens/main/PaymentMethodsScreen';
import NotificationsScreen   from '../screens/main/NotificationsScreen';
import SavedPlacesScreen     from '../screens/main/SavedPlacesScreen';
import HelpCenterScreen      from '../screens/main/HelpCenterScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111', borderTopColor: '#222',
          borderTopWidth: 1, height: 60, paddingBottom: 8, paddingTop: 8,
        },
        tabBarActiveTintColor:   '#00D95F',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            Home:     focused ? 'home'           : 'home-outline',
            Activity: focused ? 'clock'          : 'clock-outline',
            Profile:  focused ? 'account-circle' : 'account-circle-outline',
          };
          return <Icon name={icons[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile"  component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs"            component={TabNavigator} />
      <Stack.Screen name="RideBooking"     component={RideBookingScreen} />
      <Stack.Screen name="ActiveRide"      component={ActiveRideScreen} />
      <Stack.Screen name="RideCompleted"   component={RideCompletedScreen} />
      <Stack.Screen name="EditProfile"     component={EditProfileScreen} />
      <Stack.Screen name="PaymentMethods"  component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications"   component={NotificationsScreen} />
      <Stack.Screen name="SavedPlaces"     component={SavedPlacesScreen} />
      <Stack.Screen name="HelpCenter"      component={HelpCenterScreen} />
    </Stack.Navigator>
  );
}
