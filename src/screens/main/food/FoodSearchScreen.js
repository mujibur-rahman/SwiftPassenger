// @/screens/main/food/FoodSearchScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import SearchBar from "@/components/ui/SearchBar";
import Badge from "@/components/ui/Badge";
import ScreenHeader from "@/components/ui/ScreenHeader";

const RECENT_SEARCHES = ["Chicken Burger", "Pizza", "Sushi"];

const POPULAR_CATEGORIES = [
  { id: "burgers", label: "Burgers", image: require("@assets/images/categories/burgers.jpg") },
  { id: "pizza", label: "Pizza", image: require("@assets/images/categories/pizza.jpg") },
  { id: "chicken", label: "Chicken", image: require("@assets/images/categories/chicken.jpg") },
  { id: "drinks", label: "Drinks", image: require("@assets/images/categories/drinks.jpg") },
  { id: "asian", label: "Asian", image: require("@assets/images/categories/asian.jpg") },
];

export default function FoodSearchScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const [query, setQuery] = useState("");

  const runSearch = (q) => {
    const term = (q ?? query).trim();
    if (!term) return;
    navigation.navigate("FoodSearchResults", { query: term });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5">
        <ScreenHeader title="Food Search" onBack={() => navigation.navigate("Tabs", { screen: "Home" })} rightContent={<TouchableOpacity
          onPress={() => navigation.navigate("FoodOrders")}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
        >
          <Icon name="receipt-outline" size={20} color={primary} />
        </TouchableOpacity>} />

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={runSearch}
          placeholder="Search Food"
          rightIcon="chevron-right"
          onRightPress={() => runSearch()}
          className="mb-3"
        />
        {/* অর্ডার ছাড়াই ব্রাউজ */}
        <View className="mb-5 flex-row gap-2">
          <TouchableOpacity
            onPress={() => navigation.navigate("FoodBrowse")}
            activeOpacity={0.8}
            className="flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2"
          >
            <Icon name="magnify" size={16} color={primary} />
            <Text className="text-[12px] font-inter-semibold text-foreground">Browse</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("FoodOrders")}
            activeOpacity={0.8}
            className="flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2"
          >
            <Icon name="receipt-outline" size={16} color={primary} />
            <Text className="text-[12px] font-inter-semibold text-foreground">Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        <Text className="mb-3 text-[15px] font-inter-semibold text-foreground">
          Recent Searches
        </Text>
        <View className="mb-7 flex-row flex-wrap gap-2.5">
          {RECENT_SEARCHES.map((term) => (
            <TouchableOpacity key={term} activeOpacity={0.7} onPress={() => runSearch(term)}>
              <Badge label={term} variant="card" shape="pill" />
            </TouchableOpacity>
          ))}
        </View>

        <Text className="mb-4 text-[15px] font-inter-semibold text-foreground">
          Popular Near You
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingRight: 8 }}
          className="mb-7"
        >
          {POPULAR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.8}
              onPress={() => runSearch(cat.label)}
              className="items-center"
              style={{ width: 72 }}
            >
              <View
                className="mb-2 overflow-hidden rounded-full border border-border"
                style={{ width: 64, height: 64 }}
              >
                <Image source={cat.image} style={{ width: 64, height: 64 }} resizeMode="cover" />
              </View>
              <Text
                className="text-center text-[12px] font-inter-medium text-foreground-secondary"
                numberOfLines={1}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("FoodSearchResults", { query: "Burger" })}
          className="overflow-hidden rounded-2xl border border-border"
          style={{ height: 148 }}
        >
          <Image
            source={require("@assets/images/banners/burger-banner.jpg")}
            style={{ width: "100%", height: "100%", position: "absolute" }}
            resizeMode="cover"
          />
          <View className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />
          <View className="flex-1 justify-center px-5">
            <Text className="mb-1 text-lg font-inter-bold text-white">
              Crave something delicious?
            </Text>
            <Text className="text-[13px] font-inter text-white/90">
              Find the best food near you
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}