import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import StepProgress from "@/components/marketplace/StepProgress";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  setDraftField,
  selectMarketplaceDraft,
} from "@/features/marketplace/marketplacePickupSlice";

export default function MarketplaceSellerInfoScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);

  const [sellerName, setSellerName] = useState(draft.sellerName || "");
  const [marketplaceSource, setMarketplaceSource] = useState(draft.marketplaceSource || "");
  const [orderReference, setOrderReference] = useState(draft.orderReference || "");
  const [sellerPhone, setSellerPhone] = useState(draft.sellerPhone || "");
  const [pickupInstructions, setPickupInstructions] = useState(draft.pickupInstructions || "");

  const handleNext = () => {
    if (!sellerName.trim()) {
      Alert.alert("Required", "Please enter the seller or shop name.");
      return;
    }
    dispatch(setDraftField({ key: "sellerName", value: sellerName.trim() }));
    dispatch(setDraftField({ key: "marketplaceSource", value: marketplaceSource.trim() }));
    dispatch(setDraftField({ key: "orderReference", value: orderReference.trim() }));
    dispatch(setDraftField({ key: "sellerPhone", value: sellerPhone.trim() }));
    dispatch(setDraftField({ key: "pickupInstructions", value: pickupInstructions.trim() }));
    navigation.navigate("MarketplaceItemDetails");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Seller Information" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={2} total={5} />

        {/* Seller preview card */}
        <View className="mb-5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Image
            source={DUMMY.sellerShop}
            style={{ width: 56, height: 56, borderRadius: 14 }}
          />
          <View className="flex-1">
            <Text className="text-base font-inter-semibold text-foreground">
              {sellerName || "Seller / Shop"}
            </Text>
            <Text className="mt-0.5 text-sm text-foreground-muted" numberOfLines={1}>
              {draft.sellerAddress?.address || "Pickup location"}
            </Text>
          </View>
        </View>

        <View className="mb-5 gap-3 rounded-2xl border border-border bg-card p-4">
          <AppTextInput
            label="Seller / shop name"
            value={sellerName}
            onChangeText={setSellerName}
            placeholder="e.g. ABC Electronics"
          />
          <AppTextInput
            label="Marketplace / source"
            value={marketplaceSource}
            onChangeText={setMarketplaceSource}
            placeholder="Facebook Marketplace, Daraz…"
          />
          <AppTextInput
            label="Order / reference no."
            value={orderReference}
            onChangeText={setOrderReference}
            placeholder="MP-102938"
          />
          <AppTextInput
            label="Seller phone"
            value={sellerPhone}
            onChangeText={setSellerPhone}
            placeholder="01XXXXXXXXX"
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-6 rounded-2xl border border-border bg-card p-4">
          <AppTextInput
            label="Pickup instructions"
            value={pickupInstructions}
            onChangeText={setPickupInstructions}
            placeholder="Call before arrival, ask for Rahman…"
            multiline
            numberOfLines={3}
          />
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
