// @/screens/main/food/FoodBrowseScreen.js
import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
} from "react-native";
import { useTheme } from "@/theme";
import SearchBar from "@/components/ui/SearchBar";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Badge from "@/components/ui/Badge";

const CATEGORIES = [
    { id: "burgers", label: "Burgers", image: require("@assets/images/categories/burgers.jpg") },
    { id: "pizza", label: "Pizza", image: require("@assets/images/categories/pizza.jpg") },
    { id: "chicken", label: "Chicken", image: require("@assets/images/categories/chicken.jpg") },
    { id: "drinks", label: "Drinks", image: require("@assets/images/categories/drinks.jpg") },
    { id: "asian", label: "Asian", image: require("@assets/images/categories/asian.jpg") },
];

const QUICK_LINKS = [
    { id: "offers", label: "Offers" },
    { id: "top", label: "Top rated" },
    { id: "fast", label: "Fast delivery" },
    { id: "nearby", label: "Near you" },
];

export default function FoodBrowseScreen({ navigation }) {
    const { isDark } = useTheme();
    const [query, setQuery] = useState("");

    const goSearch = (q) => {
        const term = (q ?? query).trim();
        navigation.navigate("FoodSearchResults", { query: term || "" });
    };

    return (
        <View className="flex-1 bg-background">
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View className="px-5 pt-2 pb-1">
                <ScreenHeader
                    title="Browse"
                    onBack={() => navigation.goBack()}
                />

                <SearchBar
                    value={query}
                    onChangeText={setQuery}
                    onSubmit={goSearch}
                    placeholder="Search food, restaurants..."
                    rightIcon="chevron-right"
                    onRightPress={() => goSearch()}
                    className="mb-4"
                />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            >
                <Text className="mb-3 text-lg font-inter-semibold text-foreground">
                    Categories
                </Text>
                <View className="mb-6 flex-row flex-wrap" style={{ gap: 12 }}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            activeOpacity={0.85}
                            onPress={() => goSearch(cat.label)}
                            className="overflow-hidden rounded-2xl border border-border"
                            style={{ width: "47%", height: 110 }}
                        >
                            <Image
                                source={cat.image}
                                style={{ width: "100%", height: "100%", position: "absolute" }}
                                resizeMode="cover"
                            />
                            <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.35)" }} />
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-lg font-inter-bold text-white">{cat.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="mb-3 text-lg font-inter-semibold text-foreground">
                    Quick filters
                </Text>
                <View className="flex-row flex-wrap gap-2">
                    {QUICK_LINKS.map((item) => (
                        <TouchableOpacity key={item.id} onPress={() => goSearch(item.label)}>
                            <Badge
                                label={item.label}
                                variant="primary"
                                size="lg"
                                shape="pill"
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}