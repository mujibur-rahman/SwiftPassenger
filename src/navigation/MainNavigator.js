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


// // src/navigation/MainNavigator.js
// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Easing } from "react-native";

// import HomeScreen from "@/screens/main/HomeScreen";
// import RideBookingScreen from "@/screens/main/ride/RideBookingScreen";
// import ActiveRideScreen from "@/screens/main/ride/ActiveRideScreen";
// import RideCompletedScreen from "@/screens/main/ride/RideCompletedScreen";
// import ActivityScreen from "@/screens/main/ride/ActivityScreen";
// import ProfileScreen from "@/screens/main/profile/ProfileScreen";
// import EditProfileScreen from "@/screens/main/profile/EditProfileScreen";
// import PaymentMethodsScreen from "@/screens/main/PaymentMethodsScreen";
// import NotificationsScreen from "@/screens/main/NotificationsScreen";
// import SavedPlacesScreen from "@/screens/main/SavedPlacesScreen";
// import HelpCenterScreen from "@/screens/main/HelpCenterScreen";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// function TabNavigator() {
//   const insets = useSafeAreaInsets();
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarStyle: {
//           backgroundColor: "#38BDF8",
//           borderColor: "#38BDF8",
//           borderWidth: 1,
//           height: 60,
//           paddingBottom: 6,
//           paddingTop: 6,
//           borderRadius: 30,
//           position: "absolute",
//           paddingHorizontal: 6,
//           marginHorizontal: 10,
//           bottom: Math.max(insets.bottom),
//           shadowColor: "#ddd",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.15,
//           shadowRadius: 8,
//           elevation: 0,
//         },
//         tabBarItemStyle: { borderRadius: 23, paddingVertical: 4 },
//         tabBarActiveTintColor: "#fff",
//         tabBarInactiveTintColor: "#000",
//         tabBarLabelStyle: { fontSize: 11, fontWeight: "700", lineHeight: 12 },
//         tabBarIcon: ({ color, focused }) => {
//           const icons = {
//             Home: focused ? "home" : "home-outline",
//             Activity: focused ? "clock" : "clock-outline",
//             Profile: focused ? "account-circle" : "account-circle-outline",
//           };
//           return <Icon name={icons[route.name]} size={24} color={color} />;
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Activity" component={ActivityScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }

// // Scale + fade transition for RideBooking
// const scaleTransition = {
//   gestureDirection: "horizontal",
//   transitionSpec: {
//     open: {
//       animation: "timing",
//       config: { duration: 320, easing: Easing.out(Easing.poly(4)) },
//     },
//     close: {
//       animation: "timing",
//       config: { duration: 260, easing: Easing.in(Easing.poly(4)) },
//     },
//   },
//   cardStyleInterpolator: ({ current, next, layouts }) => {
//     return {
//       cardStyle: {
//         transform: [
//           {
//             scale: current.progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0.88, 1],
//             }),
//           },
//         ],
//         opacity: current.progress.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 1],
//         }),
//       },
//       overlayStyle: {
//         opacity: current.progress.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0, 0.55],
//         }),
//       },
//     };
//   },
// };

// export default function MainNavigator() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//         cardStyle: { backgroundColor: "#060E1A" },
//         contentStyle: { backgroundColor: "#060E1A" },
//       }}
//     >
//       <Stack.Screen name="Tabs" component={TabNavigator} />
//       <Stack.Screen
//         name="RideBooking"
//         component={RideBookingScreen}
//         options={{
//           ...scaleTransition,
//           presentation: "card",
//         }}
//       />
//       <Stack.Screen name="ActiveRide" component={ActiveRideScreen} />
//       <Stack.Screen name="RideCompleted" component={RideCompletedScreen} />
//       <Stack.Screen name="EditProfile" component={EditProfileScreen} />
//       <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
//       <Stack.Screen name="Notifications" component={NotificationsScreen} />
//       <Stack.Screen name="SavedPlaces" component={SavedPlacesScreen} />
//       <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
//     </Stack.Navigator>
//   );
// }
