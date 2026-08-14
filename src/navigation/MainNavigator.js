// src/navigation/MainNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Easing } from "react-native";

import HomeScreen from "../screens/main/HomeScreen";
import RideBookingScreen from "../screens/main/ride/RideBookingScreen";
import ActiveRideScreen from "../screens/main/ride/ActiveRideScreen";
import RideCompletedScreen from "../screens/main/ride/RideCompletedScreen";
import ActivityScreen from "../screens/main/ActivityScreen";
import ProfileScreen from "../screens/main/profile/ProfileScreen";
import EditProfileScreen from "../screens/main/profile/EditProfileScreen";
import PaymentMethodsScreen from "../screens/main/PaymentMethodsScreen";
import NotificationsScreen from "../screens/main/NotificationsScreen";
import SavedPlacesScreen from "../screens/main/SavedPlacesScreen";
import HelpCenterScreen from "../screens/main/HelpCenterScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#38BDF8",
          borderColor: "#38BDF8",
          borderWidth: 1,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          borderRadius: 30,
          position: "absolute",
          paddingHorizontal: 6,
          marginHorizontal: 10,
          bottom: Math.max(insets.bottom),
          shadowColor: "#ddd",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 0,
        },
        tabBarItemStyle: { borderRadius: 23, paddingVertical: 4 },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#000",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700", lineHeight: 12 },
        tabBarIcon: ({ color, focused }) => {
          const icons = {
            Home: focused ? "home" : "home-outline",
            Activity: focused ? "clock" : "clock-outline",
            Profile: focused ? "account-circle" : "account-circle-outline",
          };
          return <Icon name={icons[route.name]} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Scale + fade transition for RideBooking
const scaleTransition = {
  gestureDirection: "horizontal",
  transitionSpec: {
    open: {
      animation: "timing",
      config: { duration: 320, easing: Easing.out(Easing.poly(4)) },
    },
    close: {
      animation: "timing",
      config: { duration: 260, easing: Easing.in(Easing.poly(4)) },
    },
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.88, 1],
            }),
          },
        ],
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.55],
        }),
      },
    };
  },
};

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#060E1A" },
        contentStyle: { backgroundColor: "#060E1A" },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen
        name="RideBooking"
        component={RideBookingScreen}
        options={{
          ...scaleTransition,
          presentation: "card",
        }}
      />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
    </Stack.Navigator>
  );
}
