// @/screens/main/parcel/ParcelConfirmScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/marketplace/InfoCard";
import ParcelFareBreakdown from "@/components/parcel/ParcelFareBreakdown";
import {
  selectParcelDraft,
  selectParcelEstimate,
  setActiveParcelId,
  setTrackingStatus,
} from "@/features/parcel/parcelDeliverySlice";
import { useCreateParcelDeliveryMutation } from "@/features/parcel/parcelDeliveryApi";

export default function ParcelConfirmScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const estimate = useSelector(selectParcelEstimate);
  const [createParcelDelivery, { isLoading }] = useCreateParcelDeliveryMutation();
  const [submitting, setSubmitting] = useState(false); // extra guard against double-tap beyond isLoading

  const handleConfirm = async () => {
    if (isLoading || submitting) return; // prevent duplicate order creation
    setSubmitting(true);
    try {
      const parcel = await createParcelDelivery({
        pickupAddress: draft.pickupAddress,
        deliveryAddress: draft.deliveryAddress,
        description: draft.description,
        quantity: draft.quantity,
        category: draft.category,
        approximateValue: draft.approximateValue,
        notes: draft.notes,
        isFragile: draft.isFragile,
        photos: draft.photos,
        size: draft.size,
        weight: draft.weight,
        senderName: draft.senderName,
        senderPhone: draft.senderPhone,
        pickupInstructions: draft.pickupInstructions,
        receiverName: draft.receiverName,
        receiverPhone: draft.receiverPhone,
        deliveryInstructions: draft.deliveryInstructions,
        deliveryOption: draft.deliveryOption,
        paymentMethod: draft.paymentMethod,
        estimatedFare: estimate?.fare,
      }).unwrap();

      // Never silently proceed as if an order exists when the API failed —
      // only reaches here on a genuine 2xx response.
      dispatch(setActiveParcelId(parcel.id));
      dispatch(setTrackingStatus("searching"));
      navigation.replace("ParcelSearching");
    } catch (err) {
      Alert.alert(
        "Couldn't create delivery",
        err?.data?.message || "Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const busy = isLoading || submitting;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Confirm Parcel Delivery" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <Text className="mb-4 text-sm font-inter text-foreground-muted">
          Review everything before we find a driver.
        </Text>

        <InfoCard icon="map-marker-outline" label="Pickup" title={draft.pickupAddress?.address} subtitle={draft.senderName} className="mb-3" />
        <InfoCard icon="home-map-marker" label="Destination" title={draft.deliveryAddress?.address} subtitle={draft.receiverName} className="mb-3" />
        <InfoCard
          icon="package-variant-closed"
          label="Parcel"
          title={draft.description}
          subtitle={[draft.category, draft.size?.replace(/_/g, " ")].filter(Boolean).join(" · ")}
          className="mb-3"
        />
        <InfoCard icon="truck-delivery-outline" label="Delivery option" title={draft.deliveryOption?.label} subtitle={draft.deliveryOption?.etaMinutes} className="mb-5" />

        {estimate && <ParcelFareBreakdown estimate={estimate} className="mb-6" />}

        <Button onPress={handleConfirm} disabled={busy} fullWidth loading={busy}>
          {busy ? "Confirming…" : "Confirm & Find Driver"}
        </Button>
      </ScrollView>
    </View>
  );
}
