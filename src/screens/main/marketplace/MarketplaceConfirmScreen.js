import React from "react";
import { View, Text, ScrollView, StatusBar, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/marketplace/InfoCard";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  selectMarketplaceDraft,
  selectMarketplaceEstimate,
  setActivePickupId,
  setTrackingStatus,
} from "@/features/marketplace/marketplacePickupSlice";
import { useCreateMarketplacePickupMutation } from "@/features/marketplace/marketplacePickupApi";

export default function MarketplaceConfirmScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);
  const estimate = useSelector(selectMarketplaceEstimate);
  const [createPickup, { isLoading }] = useCreateMarketplacePickupMutation();

  const handleConfirm = async () => {
    try {
      const pickup = await createPickup({
        sellerName: draft.sellerName,
        sellerAddress: draft.sellerAddress,
        marketplaceSource: draft.marketplaceSource,
        orderReference: draft.orderReference,
        sellerPhone: draft.sellerPhone,
        pickupInstructions: draft.pickupInstructions,
        itemDescription: draft.itemDescription,
        itemQuantity: draft.itemQuantity,
        itemCategory: draft.itemCategory,
        approximateValue: draft.approximateValue,
        itemNotes: draft.itemNotes,
        deliveryAddress: draft.deliveryAddress,
        receiverPhone: draft.receiverPhone,
        estimatedFare: estimate?.fare,
      }).unwrap();

      dispatch(setActivePickupId(pickup.id));
      dispatch(setTrackingStatus("searching"));
      navigation.replace("MarketplaceSearching");
    } catch (err) {
      Alert.alert(
        "Couldn’t create pickup",
        err?.data?.message || "Please check your connection and try again."
      );
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Pickup Summary" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 text-sm font-inter text-foreground-muted">
          Review everything before we find a driver.
        </Text>

        <InfoCard
          imageUri={DUMMY.sellerShop}
          label="Pickup"
          title={draft.sellerName}
          subtitle={[draft.sellerAddress?.address, draft.marketplaceSource]
            .filter(Boolean)
            .join(" · ")}
          className="mb-3"
        />

        <InfoCard
          imageUri={DUMMY.itemProduct}
          label="Item"
          title={draft.itemDescription}
          subtitle={[
            draft.itemQuantity > 1 ? `Qty: ${draft.itemQuantity}` : null,
            draft.approximateValue ? `Value ~ ${draft.approximateValue}` : null,
            draft.itemNotes,
          ]
            .filter(Boolean)
            .join(" · ")}
          className="mb-3"
        />

        <InfoCard
          icon="map-marker"
          label="Delivery"
          title={draft.deliveryAddress?.address}
          className="mb-3"
        />

        {estimate && (
          <View className="mb-6 rounded-2xl border border-primary/30 bg-primary/10 p-4">
            <Text className="text-xs font-inter-medium text-foreground-muted">Estimated fare</Text>
            <Text className="mt-1 text-2xl font-inter-bold text-foreground">
              ${estimate.fare}
            </Text>
          </View>
        )}

        <Button onPress={handleConfirm} disabled={isLoading} fullWidth loading={isLoading}>
          {isLoading ? "Confirming…" : "Confirm Pickup"}
        </Button>
      </ScrollView>
    </View>
  );
}
