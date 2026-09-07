// @/screens/main/food/FoodOrdersScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";

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

function OrderCard({ order, isActive, onPress, primary }) {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            className="mb-3 flex-row gap-3 rounded-2xl border border-border bg-card p-3"
        >
            <View className="h-16 w-16 overflow-hidden rounded-xl">
                <Image source={order.image} style={{ width: 64, height: 64 }} resizeMode="cover" />
            </View>
            <View className="flex-1">
                <View className="flex-row items-center justify-between">
                    <Text className="text-[15px] font-inter-bold text-foreground" numberOfLines={1}>
                        {order.restaurant}
                    </Text>
                    {isActive ? (
                        <View className="rounded-full bg-primary/15 px-2 py-0.5">
                            <Text className="text-[11px] font-inter-semibold text-primary">{order.eta}</Text>
                        </View>
                    ) : (
                        <Text className="text-[11px] font-inter text-foreground-muted">{order.date}</Text>
                    )}
                </View>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted" numberOfLines={1}>
                    {order.items}
                </Text>
                <View className="mt-1.5 flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                        <Icon name={isActive ? "bike" : "check-circle"} size={13} color={isActive ? primary : "#34D399"} />
                        <Text className="text-xs font-inter-medium" style={{ color: isActive ? primary : "#34D399" }}>
                            {order.status}
                        </Text>
                    </View>
                    <Text className="text-[13px] font-inter-bold text-foreground">
                        ${order.total.toFixed(2)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function FoodOrdersScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { colors, isDark } = useTheme();
    const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
    const [tab, setTab] = useState("Active");
    const data = tab === "Active" ? MOCK_ACTIVE : MOCK_PAST;

    return (
        <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View className="px-5 pt-2 pb-3">
                <Text className="mb-4 text-xl font-inter-bold text-foreground">Orders</Text>
                <View className="flex-row gap-2">
                    {TABS.map((t) => {
                        const active = tab === t;
                        return (
                            <TouchableOpacity
                                key={t}
                                onPress={() => setTab(t)}
                                activeOpacity={0.8}
                                className={`rounded-full px-5 py-2 ${active ? "bg-primary" : "border border-border bg-card"}`}
                            >
                                <Text className={`text-[13px] font-inter-semibold ${active ? "text-primary-foreground" : "text-foreground-secondary"}`}>
                                    {t}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
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