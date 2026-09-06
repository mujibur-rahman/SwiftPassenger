// @/screens/main/food/RestaurantMenuScreen.js
import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import AppModal from "@/components/ui/AppModal";
import { useGetRestaurantQuery } from "@/features/food/foodApi";
import { addItem, selectCartCount } from "@/features/food/cartSlice";

const TABS = ["Menu", "Info", "Reviews"];

function MenuItemRow({ item, onAdd, primary, onPrimary }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onAdd(item)}
      className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
    >
      <View className="h-16 w-16 items-center justify-center rounded-xl border border-border bg-background-muted">
        <Icon name="food" size={26} color={primary} />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] font-inter-bold text-foreground" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="mt-0.5 text-xs font-inter text-foreground-muted" numberOfLines={2}>
          {item.description}
        </Text>
        <Text className="mt-1 text-sm font-inter-bold text-primary">
          ${item.price.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onAdd(item)}
        activeOpacity={0.8}
        className="h-9 w-9 items-center justify-center rounded-full bg-primary"
      >
        <Icon name="plus" size={20} color={onPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function RestaurantMenuScreen({ route }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const onPrimary = colors?.primaryForeground ?? (isDark ? "#060E1A" : "#FFFFFF");
  const warning = colors?.warning ?? "#FBBF24";
  const foreground = colors?.foreground ?? (isDark ? "#F0F9FF" : "#0F172A");

  const { restaurantId, restaurantName } = route.params;

  const { data: restaurant, isLoading } = useGetRestaurantQuery(restaurantId);
  const cartCount = useSelector(selectCartCount);

  const [tab, setTab] = useState("Menu");
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const categories = useMemo(() => {
    if (!restaurant?.menu) return {};
    return restaurant.menu.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [restaurant]);

  const openItem = (item) => {
    setSelectedItem(item);
    setQty(1);
    setNote("");
  };

  const confirmAdd = () => {
    dispatch(
      addItem({
        restaurantId,
        restaurantName: restaurantName || restaurant?.name,
        menuItemId: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        qty,
        note,
      })
    );
    setSelectedItem(null);
  };

  if (isLoading || !restaurant) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Hero header — placeholder photo block since no real image asset is provided */}
      <View
        className="w-full items-center justify-center border-b border-border bg-background-muted"
        style={{ height: 200, paddingTop: insets.top }}
      >
        <Icon name="hamburger" size={72} color={primary} style={{ opacity: 0.5 }} />

        <View
          className="absolute left-5 right-5 flex-row items-center justify-between"
          style={{ top: insets.top + 8 }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
            className="h-10 w-10 items-center justify-center rounded-full bg-card/90 border border-border"
          >
            <Icon name="arrow-left" size={20} color={foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSaved((s) => !s)}
            activeOpacity={0.8}
            className="h-10 w-10 items-center justify-center rounded-full bg-card/90 border border-border"
          >
            <Icon name={saved ? "heart" : "heart-outline"} size={20} color={saved ? primary : foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}>
        <Text className="text-xl font-inter-bold text-foreground" numberOfLines={1}>
          {restaurant.name}
        </Text>
        <Text className="mt-0.5 text-sm font-inter-medium text-foreground-secondary">
          {restaurant.category} · {restaurant.etaMinutes}
        </Text>
        <View className="mt-2 mb-4 flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Icon name="star" size={13} color={warning} />
            <Text className="text-xs font-inter-medium text-foreground-secondary">
              {restaurant.rating} ({(restaurant.ratingCount / 1000).toFixed(1)}k+)
            </Text>
          </View>
          <View className="h-1 w-1 rounded-full bg-border" />
          <View className="flex-row items-center gap-1">
            <Icon name="bike-fast" size={14} color={colors?.foregroundMuted} />
            <Text className="text-xs font-inter text-foreground-muted">
              Delivery ${restaurant.deliveryFee.toFixed(2)}
            </Text>
          </View>
        </View>

        <View className="mb-5 flex-row gap-2 rounded-2xl border border-border bg-card p-1">
          {TABS.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              activeOpacity={0.8}
              className={`flex-1 items-center rounded-xl py-2.5 ${tab === t ? "bg-primary" : ""}`}
            >
              <Text
                className={`text-sm font-inter-semibold ${
                  tab === t ? "text-primary-foreground" : "text-foreground-muted"
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "Menu" &&
          Object.entries(categories).map(([category, items]) => (
            <View key={category} className="mb-4">
              <Text className="mb-3 text-base font-inter-bold text-foreground">{category}</Text>
              {items.map((item) => (
                <MenuItemRow key={item.id} item={item} onAdd={openItem} primary={primary} onPrimary={onPrimary} />
              ))}
            </View>
          ))}

        {tab === "Info" && (
          <Text className="font-inter text-foreground-muted">
            Delivery fee ${restaurant.deliveryFee.toFixed(2)} · {restaurant.etaMinutes}
          </Text>
        )}

        {tab === "Reviews" && (
          <Text className="font-inter text-foreground-muted">No reviews yet.</Text>
        )}
      </ScrollView>

      {cartCount > 0 && (
        <View className="absolute bottom-0 left-0 right-0 px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
          <Button onPress={() => navigation.navigate("FoodCart")} rightIcon="cart">
            {`View Cart (${cartCount})`}
          </Button>
        </View>
      )}

      {/* Add to Cart modal */}
      <AppModal
        visible={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        primaryLabel={selectedItem ? `Add to Cart - $${(selectedItem.price * qty).toFixed(2)}` : undefined}
        onPrimary={confirmAdd}
        secondaryLabel={null}
      >
        {selectedItem && (
          <View>
            <View className="mb-4 h-32 w-full items-center justify-center rounded-2xl border border-border bg-background-muted">
              <Icon name="food" size={48} color={primary} style={{ opacity: 0.6 }} />
            </View>

            <Text className="mb-4 font-inter text-foreground-muted">{selectedItem.description}</Text>

            <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">Quantity</Text>
            <View className="mb-4 flex-row items-center gap-4">
              <TouchableOpacity
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                className="h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
              >
                <Icon name="minus" size={18} color={primary} />
              </TouchableOpacity>
              <Text className="text-base font-inter-bold text-foreground">{qty}</Text>
              <TouchableOpacity
                onPress={() => setQty((q) => q + 1)}
                className="h-9 w-9 items-center justify-center rounded-full bg-primary"
              >
                <Icon name="plus" size={18} color={onPrimary} />
              </TouchableOpacity>
            </View>

            <Badge label={`$${selectedItem.price.toFixed(2)} each`} variant="muted" size="sm" />
          </View>
        )}
      </AppModal>
    </View>
  );
}
