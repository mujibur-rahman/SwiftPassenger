// @/screens/main/food/ReviewOrderScreen.js
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
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import {
  selectCart,
  makeSelectTotals,
  setOffer,
  clearCart,
} from "@/features/food/cartSlice";
import { usePlaceOrderMutation } from "@/features/food/foodApi";
import { setCurrentOrder, updateOrderStatus } from "@/features/food/foodOrderSlice";

const DELIVERY_LABELS = {
  standard: "Standard Delivery 20–30 min",
  priority: "Priority Delivery 15–20 min",
};

const FALLBACK = require("@assets/images/products/chicken-burger.jpg");
const selectTotals = makeSelectTotals();

export default function ReviewOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const cart = useSelector(selectCart);
  const totals = useSelector(selectTotals);
  const paymentMethod = route.params?.paymentMethod || { label: "Cash on Delivery" };

  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        items: cart.items,
        deliveryOptionId: cart.deliveryOptionId,
        offer: cart.offer,
        paymentMethod,
        totals,
        address: "123 Main St, Natore",
      };

      let orderId = `ORD-${Date.now()}`;
      try {
        const res = await placeOrder(orderPayload).unwrap();
        orderId = res?.id || orderId;
      } catch {
        // offline mock
      }

      dispatch(setCurrentOrder({ id: orderId, ...orderPayload, status: "confirmed", createdAt: new Date().toISOString() }));
      dispatch(updateOrderStatus("confirmed"));
      dispatch(clearCart());
      navigation.replace("OrderPlaced", { orderId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-2 flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center">
          <Icon name="arrow-left" size={22} color={colors?.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-inter-bold text-foreground">Review & Pay</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Icon name="map-marker" size={20} color={primary} />
          <View className="flex-1">
            <Text className="text-xs font-inter text-foreground-muted">Delivery to</Text>
            <Text className="text-[14px] font-inter-semibold text-foreground">123 Main St, Natore</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SavedPlaces")}>
            <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>Change</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Icon name="credit-card-outline" size={20} color={primary} />
          <View className="flex-1">
            <Text className="text-xs font-inter text-foreground-muted">Payment Method</Text>
            <Text className="text-[14px] font-inter-semibold text-foreground">{paymentMethod.label}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>Change</Text>
          </TouchableOpacity>
        </View>

        <Text className="mb-2 mt-1 text-[14px] font-inter-semibold text-foreground-secondary">Order Summary</Text>
        {cart.items.map((item) => (
          <View key={`${item.menuItemId}-${item.note}`} className="mb-2 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <View className="h-12 w-12 overflow-hidden rounded-lg">
              <Image source={item.image || FALLBACK} style={{ width: 48, height: 48 }} resizeMode="cover" />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-semibold text-foreground" numberOfLines={1}>{item.name}</Text>
              <Text className="text-xs font-inter text-foreground-muted">Qty: {item.qty}</Text>
            </View>
            <Text className="text-[14px] font-inter-bold text-foreground">${(item.price * item.qty).toFixed(2)}</Text>
          </View>
        ))}

        {cart.offer && (
          <View className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <View className="flex-row items-center gap-2">
              <Icon name="tag" size={16} color={primary} />
              <Text className="text-[13px] font-inter-medium text-foreground">{cart.offer.code}</Text>
              {totals.discount > 0 && (
                <Text className="text-[13px] font-inter text-success">(−${totals.discount.toFixed(2)})</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => dispatch(setOffer(null))}>
              <Text className="text-[13px] font-inter-semibold text-error">Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="mb-2 flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
          <View className="flex-row items-center gap-2">
            <Icon name="bike" size={16} color={primary} />
            <Text className="text-[13px] font-inter-medium text-foreground">
              {DELIVERY_LABELS[cart.deliveryOptionId] || DELIVERY_LABELS.standard}
            </Text>
          </View>
          <Text className="text-[13px] font-inter-bold text-foreground">${totals.deliveryFee.toFixed(2)}</Text>
        </View>

        <View className="mt-3 flex-row items-center justify-between border-t border-border pt-4">
          <Text className="text-base font-inter-bold text-foreground">Total</Text>
          <Text className="text-lg font-inter-bold text-foreground">${totals.total.toFixed(2)}</Text>
        </View>
      </ScrollView>

      <View className="border-t border-border px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={submit} disabled={submitting || isLoading || cart.items.length === 0}>
          {submitting ? "Placing order…" : "Submit Order"}
        </Button>
      </View>
    </View>
  );
}