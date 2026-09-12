// @/screens/main/food/FoodCheckoutScreen.js
import React from "react";
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
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { selectCart, makeSelectTotals } from "@/features/food/cartSlice";
import ScreenHeader from "@/components/ui/ScreenHeader";

const DELIVERY_LABELS = {
  standard: { label: "Standard Delivery", eta: "20–30 min", fee: 2.0 },
  priority: { label: "Priority Delivery", eta: "15–20 min", fee: 4.99 },
};

const selectTotals = makeSelectTotals();
const FALLBACK = require("@assets/images/products/chicken-burger.jpg");

export default function FoodCheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const cart = useSelector(selectCart);
  const totals = useSelector(selectTotals);
  const deliveryInfo = DELIVERY_LABELS[cart.deliveryOptionId] || DELIVERY_LABELS.standard;

  if (cart.items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-5" style={{ paddingTop: insets.top }}>
        <Icon name="cart-outline" size={48} color={muted} />
        <Text className="mt-3 font-inter text-foreground-muted">Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Checkout" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <Icon name="map-marker" size={20} color={primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-inter text-foreground-muted">Delivery to</Text>
            <Text className="text-[14px] font-inter-semibold text-foreground">Ralph Terrace, Australia</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SavedPlaces")}>
            <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>Change</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <View className="h-10 w-10 overflow-hidden rounded-full border border-border">
            <Image
              source={require("@assets/images/restaurants/burger-king.jpg")}
              style={{ width: 40, height: 40 }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-inter text-foreground-muted">Order from</Text>
            <Text className="text-[14px] font-inter-semibold text-foreground">
              {cart.restaurantName || "Restaurant"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>Change</Text>
          </TouchableOpacity>
        </View>

        {cart.items.map((item) => (
          <View
            key={`${item.menuItemId}-${item.note}`}
            className="mb-2 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <View className="h-14 w-14 overflow-hidden rounded-xl">
              <Image source={item.image || FALLBACK} style={{ width: 56, height: 56 }} resizeMode="cover" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-bold text-foreground" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-xs font-inter text-foreground-muted">Qty: {item.qty}</Text>
            </View>
            <Text className="text-[14px] font-inter-bold text-foreground">
              ${(item.price * item.qty).toFixed(2)}
            </Text>
          </View>
        ))}

        <Button variant="link" size="sm" className="h-auto px-0! mb-4 mt-2" fullWidth={false} onPress={() => navigation.navigate("RestaurantMenu", {
          restaurantId: cart.restaurantId,
          restaurantName: cart.restaurantName,
        })}>+ Add more items</Button>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("ApplyOffer")}
          className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <Icon name="tag-outline" size={22} color={primary} />
          <View className="flex-1">
            <Text className="text-[14px] font-inter-semibold text-foreground">
              {cart.offer ? cart.offer.title || cart.offer.code : "Apply offer"}
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">
              {cart.offer ? `Code: ${cart.offer.code}` : "Select or enter code"}
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={muted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("DeliveryOption")}
          className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/15">
            <Icon name="bike" size={20} color={primary} />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-inter-semibold text-foreground">{deliveryInfo.label}</Text>
            <Text className="text-xs font-inter text-foreground-muted">{deliveryInfo.eta}</Text>
          </View>
          <Text className="mr-1 text-[14px] font-inter-bold text-foreground">
            ${totals.deliveryFee.toFixed(2)}
          </Text>
          <Icon name="chevron-right" size={18} color={muted} />
        </TouchableOpacity>
      </ScrollView>

      <View className="border-t border-border px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={() => navigation.navigate("FoodPayment")}>Next</Button>
      </View>
    </View>
  );
}