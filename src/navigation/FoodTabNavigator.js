// src/navigation/FoodTabNavigator.js
import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { useSelector } from "react-redux";
import { selectCartCount } from "@/features/food/cartSlice";

import FoodSearchScreen from "@/screens/main/food/FoodSearchScreen";
import FoodBrowseScreen from "@/screens/main/food/FoodBrowseScreen";
import FoodOrdersScreen from "@/screens/main/food/FoodOrdersScreen";
import ProfileScreen from "@/screens/main/profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const FOOD_TABS = {
    FoodHome: { label: "Home", icon: "home-outline", iconFocused: "home" },
    FoodBrowse: { label: "Browse", icon: "magnify", iconFocused: "magnify" },
    FoodOrders: { label: "Orders", icon: "receipt-outline", iconFocused: "receipt" },
    FoodAccount: { label: "Account", icon: "account-outline", iconFocused: "account" },
};

function FoodTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const cartCount = useSelector(selectCartCount);

    const bg = colors?.card ?? (isDark ? "#0D1E32" : "#FFFFFF");
    const border = colors?.border ?? (isDark ? "#1E3A5F" : "#E2E8F0");
    const active = colors?.primary ?? "#0EA5E9";
    const inactive = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#94A3B8");
    const bottomPad = Math.max(insets.bottom, 8);

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: bg,
                borderTopWidth: 1,
                borderTopColor: border,
                paddingBottom: bottomPad,
                paddingTop: 8,
                ...Platform.select({
                    ios: {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                    },
                    android: { elevation: 8 },
                }),
            }}
        >
            {state.routes.map((route, index) => {
                const focused = state.index === index;
                const cfg = FOOD_TABS[route.name] || {
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

                const showBadge = route.name === "FoodOrders" && cartCount > 0;

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={focused ? { selected: true } : {}}
                        onPress={onPress}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            paddingVertical: 4,
                        }}
                    >
                        <View>
                            <Icon
                                name={focused ? cfg.iconFocused : cfg.icon}
                                size={24}
                                color={focused ? active : inactive}
                            />
                            {showBadge && (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: -4,
                                        right: -8,
                                        minWidth: 16,
                                        height: 16,
                                        borderRadius: 8,
                                        backgroundColor: "#EF4444",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        paddingHorizontal: 3,
                                    }}
                                >
                                    <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text
                            style={{
                                marginTop: 3,
                                fontSize: 11,
                                fontWeight: focused ? "700" : "500",
                                color: focused ? active : inactive,
                            }}
                        >
                            {cfg.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default function FoodTabNavigator() {
    const { colors } = useTheme();

    return (
        <Tab.Navigator
            tabBar={(props) => <FoodTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneContainerStyle: {
                    backgroundColor: colors?.background ?? "#060E1A",
                },
            }}
        >
            <Tab.Screen name="FoodHome" component={FoodSearchScreen} />
            <Tab.Screen name="FoodBrowse" component={FoodBrowseScreen} />
            <Tab.Screen name="FoodOrders" component={FoodOrdersScreen} />
            <Tab.Screen name="FoodAccount" component={ProfileScreen} />
        </Tab.Navigator>
    );
}