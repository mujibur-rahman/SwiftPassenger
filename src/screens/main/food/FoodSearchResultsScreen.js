// @/screens/main/food/FoodSearchResultsScreen.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import SearchBar from "@/components/ui/SearchBar";
import { useSearchRestaurantsQuery } from "@/features/food/foodApi";

function RestaurantCard({ restaurant, onPress, primary, muted, warning }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
    >
      <View className="h-16 w-16 items-center justify-center rounded-xl border border-border bg-background-muted">
        <Icon name="hamburger" size={28} color={primary} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-inter-bold text-foreground" numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text className="mt-0.5 text-xs font-inter text-foreground-muted" numberOfLines={1}>
          {restaurant.category}
        </Text>
        <View className="mt-1.5 flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Icon name="star" size={13} color={warning} />
            <Text className="text-xs font-inter-medium text-foreground-secondary">
              {restaurant.rating} ({(restaurant.ratingCount / 1000).toFixed(1)}k+)
            </Text>
          </View>
          <Text className="text-xs font-inter text-foreground-muted">
            {restaurant.etaMinutes}
          </Text>
        </View>
      </View>
      <Icon name="chevron-right" size={18} color={muted} />
    </TouchableOpacity>
  );
}

export default function FoodSearchResultsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const warning = colors?.warning ?? "#FBBF24";

  const [query, setQuery] = useState(route.params?.query ?? "");

  const { data: restaurants = [], isFetching } = useSearchRestaurantsQuery(query);

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Search Results" className="pb-3" />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search restaurants or food..."
        className="mb-4"
      />

      {isFetching ? (
        <ActivityIndicator color={primary} style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text className="mt-10 text-center font-inter text-foreground-muted">
              No restaurants found for "{query}"
            </Text>
          }
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              primary={primary}
              muted={muted}
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
