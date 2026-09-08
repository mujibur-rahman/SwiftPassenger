// src/navigation/MainNavigator.js
import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

import HomeScreen from "@/screens/main/HomeScreen";
import RideBookingScreen from "@/screens/main/ride/RideBookingScreen";
import ActiveRideScreen from "@/screens/main/ride/ActiveRideScreen";
import RideCompletedScreen from "@/screens/main/ride/RideCompletedScreen";
import ActivityScreen from "@/screens/main/ride/ActivityScreen";
import ProfileScreen from "@/screens/main/profile/ProfileScreen";
import EditProfileScreen from "@/screens/main/profile/EditProfileScreen";
import PaymentMethodsScreen from "@/screens/main/PaymentMethodsScreen";
import NotificationsScreen from "@/screens/main/NotificationsScreen";
import SavedPlacesScreen from "@/screens/main/SavedPlacesScreen";
import HelpCenterScreen from "@/screens/main/HelpCenterScreen";

import FoodSearchScreen from "@/screens/main/food/FoodSearchScreen";
import FoodBrowseScreen from "@/screens/main/food/FoodBrowseScreen";
import FoodOrdersScreen from "@/screens/main/food/FoodOrdersScreen";
import FoodSearchResultsScreen from "@/screens/main/food/FoodSearchResultsScreen";
import RestaurantMenuScreen from "@/screens/main/food/RestaurantMenuScreen";
import CartScreen from "@/screens/main/food/CartScreen";
import FoodCheckoutScreen from "@/screens/main/food/FoodCheckoutScreen";
import ApplyOfferScreen from "@/screens/main/food/ApplyOfferScreen";
import DeliveryOptionScreen from "@/screens/main/food/DeliveryOptionScreen";
import FoodPaymentScreen from "@/screens/main/food/FoodPaymentScreen";
import ReviewOrderScreen from "@/screens/main/food/ReviewOrderScreen";
import OrderPlacedScreen from "@/screens/main/food/OrderPlacedScreen";
import TrackOrderScreen from "@/screens/main/food/TrackOrderScreen";

// stack examples:
// import SomeModalScreen from "@/screens/main/SomeModalScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/** Tab metadata — edit labels/icons only */
const TAB_CONFIG = {
  Home: {
    label: "Home",
    icon: "home-outline",
    iconFocused: "home",
  },
  Activity: {
    label: "Activity",
    icon: "clock-outline",
    iconFocused: "clock",
  },
  Profile: {
    label: "Profile",
    icon: "account-outline",
    iconFocused: "account",
  },
};

/** Floating pill tab bar (theme-aware) */
function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const pillBg = colors?.primary ?? "#38BDF8";
  const activeIcon = isDark ? "#060E1A" : "#FFFFFF";
  const inactiveIcon = isDark
    ? "rgba(6,14,26,0.55)"
    : "rgba(255,255,255,0.7)";
  const bottomPad = Math.max(insets.bottom, 10);

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: bottomPad,
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: pillBg,
          borderRadius: 999,
          paddingVertical: 10,
          paddingHorizontal: 8,
          width: "100%",
          maxWidth: 400,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.25,
              shadowRadius: 16,
            },
            android: { elevation: 12 },
          }),
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const cfg = TAB_CONFIG[route.name] || {
            label: route.name,
            icon: "circle-outline",
            iconFocused: "circle",
          };

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 4,
              }}
            >
              <Icon
                name={focused ? cfg.iconFocused : cfg.icon}
                size={22}
                color={focused ? activeIcon : inactiveIcon}
              />
              <Text
                style={{
                  marginTop: 2,
                  fontSize: 11,
                  fontWeight: focused ? "700" : "500",
                  color: focused ? activeIcon : inactiveIcon,
                }}
              >
                {cfg.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute" },
        sceneContainerStyle: {
          backgroundColor: colors?.background ?? "#060E1A",
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { colors } = useTheme();
  const bg = colors?.background ?? "#060E1A";

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: bg },
        contentStyle: { backgroundColor: bg },
      }}
    >
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
      <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />

      {/* Order Food flow — all stack screens under Main Navigator */}
      <Stack.Screen name="FoodSearch" component={FoodSearchScreen} />
      <Stack.Screen name="FoodBrowse" component={FoodBrowseScreen} />
      <Stack.Screen name="FoodOrders" component={FoodOrdersScreen} />
      <Stack.Screen name="FoodSearchResults" component={FoodSearchResultsScreen} />
      <Stack.Screen name="RestaurantMenu" component={RestaurantMenuScreen} />
      <Stack.Screen name="FoodCart" component={CartScreen} />
      <Stack.Screen name="FoodCheckout" component={FoodCheckoutScreen} />
      <Stack.Screen name="ApplyOffer" component={ApplyOfferScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="DeliveryOption" component={DeliveryOptionScreen} options={{ presentation: "modal" }} />
      <Stack.Screen name="FoodPayment" component={FoodPaymentScreen} />
      <Stack.Screen name="ReviewOrder" component={ReviewOrderScreen} />
      <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />

      <Stack.Screen
        name="RideBooking"
        component={RideBookingScreen}
        options={{
          presentation: "transparentModal",
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />

      {/* 3) Optional modal */}
      {/*
      <Stack.Screen
        name="IncomingModal"
        component={SomeModalScreen}
        options={{
          presentation: "transparentModal",
          cardStyle: { backgroundColor: "transparent" },
          cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        }}
      />
      */}
    </Stack.Navigator>
  );
}