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
          backgroundColor: '#CBA35C', borderColor: '#CBA35C',
          borderWidth: 1, height: 60, paddingBottom: 6, paddingTop: 6, borderRadius: 30,
          position: 'absolute', paddingHorizontal: 6, marginHorizontal: 10, bottom: 6,
          // Shadow (iOS)
          shadowColor: '#ddd',          // ← change this for the shadow color
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          // Shadow (Android)
          elevation: 8,
        },
        // tabBarActiveTintColor:   '#00D95F',
        tabBarItemStyle: {borderRadius: 23, paddingVertical: 4},
        tabBarActiveTintColor:   '#fff',
        tabBarInactiveTintColor: '#000',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', lineHeight: 12},  
        // tabBarActiveBackgroundColor: "rgba(35, 42, 49, .7)",
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
