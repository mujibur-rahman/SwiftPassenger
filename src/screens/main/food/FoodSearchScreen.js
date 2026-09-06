// @/screens/main/food/FoodSearchScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SearchBar from "@/components/ui/SearchBar";
import Badge from "@/components/ui/Badge";

const RECENT_SEARCHES = ["Chicken Burger", "Pizza", "Sushi"];

const POPULAR_CATEGORIES = [
  { id: "burgers", label: "Burgers", icon: "hamburger" },
  { id: "pizza", label: "Pizza", icon: "pizza" },
  { id: "sushi", label: "Sushi", icon: "fish" },
  { id: "healthy", label: "Healthy", icon: "food-apple-outline" },
  { id: "asian", label: "Asian", icon: "noodles" },
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
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Order Food" showBack={false} className="pb-3" />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmit={runSearch}
        placeholder="Search restaurants or food..."
        autoFocus
        className="mb-6"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
          Recent Searches
        </Text>
        <View className="mb-6 flex-row flex-wrap gap-2">
          {RECENT_SEARCHES.map((term) => (
            <TouchableOpacity
              key={term}
              activeOpacity={0.7}
              onPress={() => runSearch(term)}
              className="rounded-full border border-border bg-card px-3.5 py-2"
            >
              <Text className="text-xs font-inter-medium text-foreground">{term}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
          Popular Near You
        </Text>
        <View className="mb-4 flex-row flex-wrap gap-3">
          {POPULAR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.7}
              onPress={() => runSearch(cat.label)}
              className="items-center gap-1.5"
              style={{ width: 68 }}
            >
              <View className="h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background-muted">
                <Icon name={cat.icon} size={26} color={primary} />
              </View>
              <Text className="text-center text-[11px] font-inter-medium text-foreground-muted" numberOfLines={1}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("FoodSearchResults", { query: "" })}
          className="mb-8 overflow-hidden rounded-2xl border border-border bg-background-muted p-5"
        >
          <Badge label="Craving something delicious?" variant="primary" shape="pill" size="sm" className="mb-2 self-start" />
          <Text className="text-lg font-inter-bold text-foreground">
            Find the best food near you
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
