// @/screens/main/food/FoodSearchResultsScreen.js
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { useSearchRestaurantsQuery } from "@/features/food/foodApi";
import SearchBar from "@/components/ui/SearchBar";
import RestaurantCard from "@/components/food/RestaurantCard";

const FILTERS = ["All", "Restaurants", "Food"];

// Local fallback so UI always looks complete
const MOCK_RESTAURANTS = [
  {
    id: "1",
    name: "Burger King",
    category: "Burgers · Fast Food",
    rating: 4.5,
    ratingCount: 2300,
    etaMinutes: "20–30 min",
    logo: require("@assets/images/restaurants/burger-king.jpg"),
    foodImage: require("@assets/images/products/chicken-burger.jpg"),
  },
  {
    id: "2",
    name: "The Burger House",
    category: "Burgers · American",
    rating: 4.6,
    ratingCount: 1800,
    etaMinutes: "25–35 min",
    logo: require("@assets/images/restaurants/burger-house.jpg"),
    foodImage: require("@assets/images/products/beef-burger.jpg"),
  },
  {
    id: "3",
    name: "Pizza Hut",
    category: "Pizza · Italian",
    rating: 4.3,
    ratingCount: 4200,
    etaMinutes: "25–40 min",
    logo: require("@assets/images/restaurants/pizza-hut.jpg"),
    foodImage: require("@assets/images/products/pepperoni-pizza.jpg"),
  },
  {
    id: "4",
    name: "Burger Lab",
    category: "Burgers · Gourmet",
    rating: 4.7,
    ratingCount: 950,
    etaMinutes: "30–45 min",
    logo: require("@assets/images/restaurants/burger-house.jpg"),
    foodImage: require("@assets/images/products/cheese-burger.jpg"),
  },
];

export default function FoodSearchResultsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const warning = colors?.warning ?? "#FBBF24";

  const [query, setQuery] = useState(route.params?.query ?? "");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: apiRestaurants, isFetching } = useSearchRestaurantsQuery(query);

  const restaurants = useMemo(() => {
    if (apiRestaurants && apiRestaurants.length > 0) {
      return apiRestaurants.map((r, idx) => ({
        ...r,
        logo: MOCK_RESTAURANTS[idx % MOCK_RESTAURANTS.length].logo,
        foodImage: MOCK_RESTAURANTS[idx % MOCK_RESTAURANTS.length].foodImage,
        category: r.category || "Burgers · Fast Food",
        ratingCount: r.ratingCount || 2000,
        etaMinutes: r.etaMinutes || "20–35 min",
      }));
    }
    const q = query.toLowerCase();
    if (!q) return MOCK_RESTAURANTS;
    return MOCK_RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [apiRestaurants, query]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={() => { }}
          placeholder="Chicken Burger"
          showClear
          className="mb-3"
        />
      </View>

      {/* Filter chips */}
      <View className="mb-3 flex-row gap-2 px-5">
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              activeOpacity={0.8}
              onPress={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 ${active ? "bg-primary" : "border border-border bg-card"
                }`}
            >
              <Text
                className={`text-[13px] font-inter-semibold ${active
                  ? "text-primary-foreground"
                  : "text-foreground-secondary"
                  }`}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isFetching && !restaurants.length ? (
        <ActivityIndicator color={primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
          ListEmptyComponent={
            <Text className="mt-12 text-center font-inter text-foreground-muted">
              No restaurants found for "{query}"
            </Text>
          }
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              warning={warning}
              onPress={() =>
                navigation.navigate("RestaurantMenu", {
                  restaurantId: item.id,
                  restaurantName: item.name,
                })
              }
            />
          )}
        />
      )}
    </View>
  );
}