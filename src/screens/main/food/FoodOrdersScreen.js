// @/screens/main/food/FoodOrdersScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StatusBar,
    TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import OrderCard from "@/components/food/OrderCard";
import ScreenHeader from "@/components/ui/ScreenHeader";

const TABS = ["Active", "Past"];

const MOCK_ACTIVE = [
    {
        id: "a1",
        restaurant: "Burger King",
        status: "On the way",
        items: "Chicken Burger × 1",
        total: 8.98,
        eta: "12 min",
        image: require("@assets/images/products/chicken-burger.jpg"),
    },
];

const MOCK_PAST = [
    {
        id: "p1",
        restaurant: "The Burger House",
        status: "Delivered",
        items: "Beef Burger × 2",
        total: 15.48,
        date: "Yesterday",
        image: require("@assets/images/products/beef-burger.jpg"),
    },
    {
        id: "p2",
        restaurant: "Pizza Hut",
        status: "Delivered",
        items: "Pepperoni Pizza × 1",
        total: 12.99,
        date: "3 days ago",
        image: require("@assets/images/products/pepperoni-pizza.jpg"),
    },
];

export default function FoodOrdersScreen({ navigation }) {
    const { colors, isDark } = useTheme();
    const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
    const [tab, setTab] = useState("Active");
    const data = tab === "Active" ? MOCK_ACTIVE : MOCK_PAST;

    return (
        <View className="flex-1 bg-background">
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View className="px-5 pt-2 pb-3">
                <ScreenHeader
                    title="Orders"
                    titleClassName="text-xl"
                    onBack={() => navigation.goBack()}
                />

                <View className="mt-4 flex-row gap-3 border-b border-border">
                    {TABS.map((t) => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setTab(t)}
                            className="flex-1 items-center py-1"
                            style={{
                                borderBottomWidth: t === tab ? 2 : 0,
                                borderBottomColor: primary,
                            }}
                        >
                            <Text
                                className={`text-sm font-inter-semibold ${tab === t ? "text-foreground" : "text-foreground-muted"
                                    }`}
                            >
                                {t}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100, flexGrow: 1 }}
                ListEmptyComponent={
                    <View className="mt-16 items-center">
                        <Icon name="receipt" size={48} color={isDark ? "#7DD3FC" : "#94A3B8"} style={{ opacity: 0.5 }} />
                        <Text className="mt-3 font-inter text-foreground-muted">No {tab.toLowerCase()} orders</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <OrderCard
                        order={item}
                        isActive={tab === "Active"}
                        primary={primary}
                        onPress={() => {
                            if (tab === "Active") navigation.navigate("TrackOrder", { orderId: item.id });
                        }}
                    />
                )}
            />
        </View>
    );
}