// @/screens/main/parcel/ParcelOrderReviewScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/marketplace/InfoCard";
import ParcelFareBreakdown from "@/components/parcel/ParcelFareBreakdown";
import { selectParcelDraft, selectParcelEstimate } from "@/features/parcel/parcelDeliverySlice";

function SectionEdit({ label, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} hitSlop={8}>
      <Text className="text-xs font-inter-semibold" style={{ color: colors?.primary ?? "#38BDF8" }}>
        Edit
      </Text>
    </TouchableOpacity>
  );
}

export default function ParcelOrderReviewScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const estimate = useSelector(selectParcelEstimate);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Order Review" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-[13px] font-inter-semibold text-foreground-secondary">Pickup</Text>
          <SectionEdit onPress={() => navigation.navigate("ParcelSenderInformation")} />
        </View>
        <InfoCard
          icon="map-marker-outline"
          label={draft.senderName || "Sender"}
          title={draft.pickupAddress?.address || "—"}
          subtitle={draft.senderPhone}
          className="mb-4"
        />

        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-[13px] font-inter-semibold text-foreground-secondary">Delivery</Text>
          <SectionEdit onPress={() => navigation.navigate("ParcelReceiverInformation")} />
        </View>
        <InfoCard
          icon="home-map-marker"
          label={draft.receiverName || "Receiver"}
          title={draft.deliveryAddress?.address || "—"}
          subtitle={draft.receiverPhone}
          className="mb-4"
        />

        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-[13px] font-inter-semibold text-foreground-secondary">Parcel</Text>
          <SectionEdit onPress={() => navigation.navigate("ParcelDetails")} />
        </View>
        <InfoCard
          icon="package-variant-closed"
          label={draft.category || "Category"}
          title={draft.description || "—"}
          subtitle={[
            draft.quantity > 1 ? `Qty: ${draft.quantity}` : null,
            draft.size ? draft.size.replace(/_/g, " ") : null,
            draft.weight ? draft.weight.replace(/_/g, " ") : null,
            draft.isFragile ? "Fragile" : null,
          ]
            .filter(Boolean)
            .join(" · ")}
          className="mb-4"
        />

        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-[13px] font-inter-semibold text-foreground-secondary">Delivery Option</Text>
          <SectionEdit onPress={() => navigation.navigate("ParcelDeliveryOptions")} />
        </View>
        <InfoCard
          icon="truck-delivery-outline"
          label={draft.deliveryOption?.label || "—"}
          title={draft.deliveryOption?.etaMinutes || "—"}
          className="mb-4"
        />

        <View className="mb-2 flex-row items-center justify-between px-1">
          <Text className="text-[13px] font-inter-semibold text-foreground-secondary">Payment</Text>
          <SectionEdit onPress={() => navigation.navigate("ParcelPayment")} />
        </View>
        <InfoCard icon="credit-card-outline" label="Method" title={draft.paymentMethod?.label || "—"} className="mb-5" />

        {estimate && <ParcelFareBreakdown estimate={estimate} className="mb-6" />}

        <Button onPress={() => navigation.navigate("ParcelConfirm")} fullWidth>
          Confirm Delivery
        </Button>
      </ScrollView>
    </View>
  );
}
