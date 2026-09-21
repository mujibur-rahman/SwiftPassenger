// @/screens/main/shop/ShopDeliveredScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";

export default function ShopDeliveredScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  // Order already fully hydrated by ShopOnTheWayScreen just before this
  // screen replaces it — read from the slice rather than polling again,
  // the order is done.
  const order = useSelector((s) => s.shopOrder?.currentOrder);
  const items = (order?.items || []).filter((i) => i.status !== "skipped");
  const orderId = order?.id ?? route.params?.orderId;
  const orderNumber = order?.orderNumber ?? route.params?.orderNumber;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="" showBack onBack={() => navigation.goBack()} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        <View className="items-center py-4">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-success">
            <Icon name="check" size={30} color={isDark ? "#060E1A" : "#FFFFFF"} />
          </View>
          <Text className="mb-1 text-xl font-inter-bold text-foreground">Order delivered</Text>
          <Text className="text-[13px] font-inter text-foreground-muted">Your shopping has arrived.</Text>
        </View>

        <Text className="mb-2 mt-4 text-[13px] font-inter-semibold text-foreground-secondary">Items delivered</Text>
        <View className="rounded-2xl border border-border bg-card p-3.5">
          {items.map((item, idx) => (
            <View key={item.id} className={`flex-row items-center gap-3 ${idx > 0 ? "mt-2.5 border-t border-border pt-2.5" : ""}`}>
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-background-muted">
                <Icon name="package-variant" size={16} color={primary} />
              </View>
              <Text className="flex-1 text-[13px] font-inter text-foreground" numberOfLines={1}>
                {item.substitutedWith?.name || item.name}
              </Text>
              <Text className="text-[13px] font-inter-semibold text-foreground-muted">× {item.qty}</Text>
            </View>
          ))}
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-sm font-inter text-foreground-muted">Total amount</Text>
          <Text className="text-lg font-inter-bold text-foreground">${(order?.actualTotal ?? 0).toFixed(2)}</Text>
        </View>
        <Text className="mt-1 text-xs font-inter text-foreground-muted" numberOfLines={2}>
          Delivery address: {order?.deliveryAddress?.address || "—"}
        </Text>

        {order?.shopper && (
          <View className="mt-5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
              <Icon name="account" size={22} color={primary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-bold text-foreground">{order.shopper.name}</Text>
              <Text className="text-xs font-inter text-foreground-muted">
                ★ {order.shopper.rating} ({order.shopper.ratingCount})
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="gap-2.5 px-5" style={{ paddingBottom: insets.bottom + 12 }}>
        <Button variant="outline" onPress={() => navigation.navigate("ShopReceipt", { orderId, orderNumber })}>
          View Receipt
        </Button>
        <Button
          onPress={() =>
            navigation.navigate("RateShopOrder", {
              orderId,
              shopperName: order?.shopper?.name,
              shopperRating: order?.shopper?.rating,
              shopperRatingCount: order?.shopper?.ratingCount,
            })
          }
        >
          Rate Driver
        </Button>
      </View>
    </View>
  );
}
