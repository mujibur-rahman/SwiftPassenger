// @/screens/main/parcel/ParcelReceiptScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import ParcelFareBreakdown from "@/components/parcel/ParcelFareBreakdown";
import { selectParcelDraft, selectParcelEstimate, selectActiveParcelId } from "@/features/parcel/parcelDeliverySlice";

export default function ParcelReceiptScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const estimate = useSelector(selectParcelEstimate);
  const parcelId = useSelector(selectActiveParcelId);
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  const date = new Date();
  const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const timeLabel = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Delivery Receipt" onBack={() => navigation.goBack()} />
        {parcelId ? <Text className="mb-3 text-xs font-inter text-foreground-muted">Order ID: {parcelId}</Text> : null}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="mb-3 rounded-2xl border border-border bg-card p-4">
          <View className="mb-2 flex-row items-center gap-2">
            <Icon name="calendar-outline" size={14} color={colors?.foregroundMuted ?? "#64748B"} />
            <Text className="text-xs font-inter text-foreground-muted">
              {dateLabel} · {timeLabel}
            </Text>
          </View>
        </View>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">Pickup</Text>
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="text-sm font-inter-semibold text-foreground" numberOfLines={2}>
            {draft.pickupAddress?.address || "—"}
          </Text>
        </View>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">Destination</Text>
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="text-sm font-inter-semibold text-foreground" numberOfLines={2}>
            {draft.deliveryAddress?.address || "—"}
          </Text>
          <Text className="mt-1 text-xs font-inter text-foreground-muted">
            {draft.receiverName} · {draft.receiverPhone}
          </Text>
        </View>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">Parcel</Text>
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <View className="mb-1.5 flex-row justify-between">
            <Text className="text-sm font-inter text-foreground-muted">Description</Text>
            <Text className="text-sm font-inter-medium text-foreground">{draft.description || "—"}</Text>
          </View>
          <View className="mb-1.5 flex-row justify-between">
            <Text className="text-sm font-inter text-foreground-muted">Delivery option</Text>
            <Text className="text-sm font-inter-medium text-foreground">{draft.deliveryOption?.label || "Standard"}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-sm font-inter text-foreground-muted">Payment method</Text>
            <Text className="text-sm font-inter-medium text-foreground">
              {draft.paymentMethod?.label || draft.paymentMethod?.type || "—"}
            </Text>
          </View>
        </View>

        <Text className="mb-2 text-[13px] font-inter-semibold text-foreground-secondary">Total paid</Text>
        <ParcelFareBreakdown estimate={estimate} />
      </ScrollView>

      <View className="border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: 16 }}>
        <Button onPress={() => navigation.navigate("ParcelRate")}>Rate Delivery</Button>
      </View>
    </View>
  );
}
