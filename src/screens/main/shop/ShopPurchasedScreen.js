// @/screens/main/shop/ShopPurchasedScreen.js
import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { useGetActiveShopOrderQuery } from "@/features/shop/shopApi";
import { hydrateShopOrder } from "@/features/shop/shopOrderSlice";

export default function ShopPurchasedScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");

  // Still polling here — the user might sit on this screen while the
  // shopper starts driving, and "Track Delivery" below should only make
  // sense once status has actually reached "delivering".
  const { data } = useGetActiveShopOrderQuery(undefined, { pollingInterval: 3000 });
  const order = data?.order;

  useEffect(() => {
    if (order) dispatch(hydrateShopOrder(order));
  }, [order, dispatch]);

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-inter text-foreground-muted">Loading…</Text>
      </View>
    );
  }

  const purchasedItems = (order.items || []).filter((i) => i.status !== "skipped");
  const productTotal = purchasedItems.reduce((sum, i) => sum + (Number(i.actualPrice) || 0) * (i.qty || 1), 0);
  const canTrackDelivery = ["delivering", "delivered"].includes(order.status);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Shopping complete" onBack={() => navigation.goBack()} />
        <Text className="mb-3 text-xs font-inter text-foreground-muted">Your items have been purchased.</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-success/15">
            <Icon name="storefront" size={20} color={success} />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-inter-bold text-foreground">{order.storeName}</Text>
            <Text className="text-xs font-inter text-foreground-muted">
              {order.storeDistanceKm != null ? `${order.storeDistanceKm} km · ` : ""}Grocery
            </Text>
          </View>
          <Icon name="chevron-right" size={18} color={colors?.foregroundMuted ?? "#64748B"} />
        </View>

        <View className="mb-4 flex-row items-center gap-1.5">
          <Icon name="receipt-text-outline" size={14} color={primary} />
          <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>
            Receipt available
          </Text>
        </View>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">Items</Text>
        <View className="mb-4 rounded-2xl border border-border bg-card p-3.5">
          {purchasedItems.map((item, idx) => (
            <View key={item.id} className={`flex-row items-center justify-between ${idx > 0 ? "mt-2.5 border-t border-border pt-2.5" : ""}`}>
              <Text className="flex-1 text-[13px] font-inter text-foreground" numberOfLines={1}>
                {item.substitutedWith?.name || item.name} × {item.qty}
              </Text>
              <Text className="text-[13px] font-inter-semibold text-foreground">${(Number(item.actualPrice) * item.qty).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-2xl border border-border bg-card p-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="font-inter text-foreground-muted">Product total</Text>
            <Text className="font-inter-medium text-foreground">${productTotal.toFixed(2)}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-inter text-foreground-muted">Service fee</Text>
            <Text className="font-inter-medium text-foreground">${(order.fees?.serviceFee ?? 3).toFixed(2)}</Text>
          </View>
          <View className="mb-3 flex-row justify-between">
            <Text className="font-inter text-foreground-muted">Delivery fee</Text>
            <Text className="font-inter-medium text-foreground">${(order.fees?.deliveryFee ?? 2).toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between border-t border-border pt-3">
            <Text className="text-[15px] font-inter-bold text-foreground">Final total</Text>
            <Text className="text-[15px] font-inter-bold text-foreground">${(order.actualTotal ?? productTotal + 5).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="gap-2.5 px-5" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button
          onPress={() => navigation.navigate("ShopOnTheWay", { orderId: order.id, orderNumber: order.orderNumber })}
          disabled={!canTrackDelivery}
        >
          Track Delivery
        </Button>
        <Button variant="outline" onPress={() => navigation.navigate("ShopReceipt", { orderId: order.id, orderNumber: order.orderNumber })}>
          View Receipt
        </Button>
      </View>
    </View>
  );
}
