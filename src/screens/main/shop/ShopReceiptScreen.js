// @/screens/main/shop/ShopReceiptScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import ScreenHeader from "@/components/ui/ScreenHeader";

export default function ShopReceiptScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");

  const order = useSelector((s) => s.shopOrder?.currentOrder);
  const orderNumber = order?.orderNumber ?? route.params?.orderNumber;
  const items = (order?.items || []).filter((i) => i.status !== "skipped");
  const fees = order?.fees || { serviceFee: 3, deliveryFee: 2 };
  const productTotal = items.reduce((sum, i) => sum + (Number(i.actualPrice) || 0) * (i.qty || 1), 0);
  const totalPaid = order?.actualTotal ?? productTotal + fees.serviceFee + fees.deliveryFee;
  const paymentLabel = order?.paymentMethod?.label || "Card";
  const date = order?.createdAt ? new Date(order.createdAt) : new Date();
  const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const timeLabel = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Shopping complete" onBack={() => navigation.goBack()} />
        <Text className="mb-3 text-xs font-inter text-foreground-muted">Order ID: {orderNumber}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-success/15">
            <Icon name="storefront" size={20} color={success} />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-inter-bold text-foreground">{order?.storeName}</Text>
            <Text className="text-xs font-inter text-foreground-muted">Grocery</Text>
          </View>
        </View>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">Items</Text>
        <View className="rounded-2xl border border-border bg-card p-3 mb-4">
          {items.map((item, idx) => (
            <View key={item.id} className={`flex-row items-center justify-between ${idx > 0 ? "mt-3 border-t border-border pt-3" : ""}`}>
              <Text className="flex-1 pr-2 text-[13px] font-inter text-foreground" numberOfLines={1}>
                {item.substitutedWith?.name || item.name} × {item.qty}
              </Text>
              <Text className="text-[13px] font-inter-semibold text-foreground">${(Number(item.actualPrice) * item.qty).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-2xl border border-border bg-card p-4 mb-4">
          <View className="flex-row justify-between mb-2">
            <Text className="font-inter text-foreground-muted">Product total</Text>
            <Text className="font-inter-medium text-foreground">${productTotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="font-inter text-foreground-muted">Service fee</Text>
            <Text className="font-inter-medium text-foreground">${fees.serviceFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="font-inter text-foreground-muted">Delivery fee</Text>
            <Text className="font-inter-medium text-foreground">${fees.deliveryFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between border-t border-border pt-3">
            <Text className="text-[15px] font-inter-bold text-foreground">Total paid</Text>
            <Text className="text-[15px] font-inter-bold text-foreground">${totalPaid.toFixed(2)}</Text>
          </View>
        </View>

        <View className="rounded-2xl border border-border bg-card p-4">
          <View className="mb-2.5 flex-row items-center gap-2">
            <Icon name="credit-card-outline" size={16} color={primary} />
            <Text className="text-[13px] font-inter-semibold text-foreground">Payment method</Text>
          </View>
          <Text className="mb-3 text-[13px] font-inter text-foreground-muted">{paymentLabel}</Text>
          <View className="flex-row items-center gap-2 border-t border-border pt-3">
            <Icon name="calendar-outline" size={14} color={colors?.foregroundMuted ?? "#64748B"} />
            <Text className="text-xs font-inter text-foreground-muted">
              {dateLabel} · {timeLabel}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={() => navigation.goBack()}>Done</Button>
      </View>
    </View>
  );
}
