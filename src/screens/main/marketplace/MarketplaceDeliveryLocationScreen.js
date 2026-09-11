// @/screens/main/marketplace/MarketplaceDeliveryLocationScreen.js
import React, { useState } from "react";
import { View, Text, StatusBar, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import StepProgress from "@/components/marketplace/StepProgress";
import {
  setDeliveryAddress,
  setDraftField,
  selectMarketplaceDraft,
} from "@/features/marketplace/marketplacePickupSlice";

export default function MarketplaceDeliveryLocationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);
  const currentLocation = useSelector((s) => s.location?.currentLocation);

  const [text, setText] = useState(draft.deliveryAddress?.address || "");
  const [receiverPhone, setReceiverPhone] = useState(draft.receiverPhone || "");

  const handleSelect = (place) => {
    dispatch(
      setDeliveryAddress({
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        placeId: place.placeId || null,
      })
    );
    setText(place.address);
  };

  const handleNext = () => {
    if (!draft.deliveryAddress?.address && !text.trim()) {
      Alert.alert("Required", "Please select the delivery address.");
      return;
    }
    if (!draft.deliveryAddress?.latitude && text.trim()) {
      dispatch(
        setDeliveryAddress({
          address: text.trim(),
          latitude: null,
          longitude: null,
        })
      );
    }
    dispatch(setDraftField({ key: "receiverPhone", value: receiverPhone.trim() }));
    navigation.navigate("MarketplaceEstimate");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Delivery Location" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={4} total={5} />

        {/* Route preview */}
        <View className="mb-5 rounded-2xl border border-border bg-card p-4">
          <View className="flex-row items-start gap-3">
            <View className="items-center">
              <View className="h-3 w-3 rounded-full bg-primary" />
              <View className="my-1 h-8 w-0.5 bg-border" />
              <Icon name="map-marker" size={16} color={colors?.primary || "#38BDF8"} />
            </View>
            <View className="flex-1 gap-5">
              <View>
                <Text className="text-[11px] font-inter-medium uppercase text-foreground-muted">
                  Pickup
                </Text>
                <Text className="mt-0.5 text-sm font-inter-semibold text-foreground" numberOfLines={2}>
                  {draft.sellerName || "Seller"} · {draft.sellerAddress?.address || "—"}
                </Text>
              </View>
              <View>
                <Text className="text-[11px] font-inter-medium uppercase text-foreground-muted">
                  Delivery
                </Text>
                <Text className="mt-0.5 text-sm font-inter text-foreground-secondary">
                  Choose below
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mb-4 z-50">
          <LocationAutocomplete
            label="Delivery address"
            value={text}
            onChangeText={setText}
            onSelect={handleSelect}
            placeholder="Search delivery location"
            biasCoords={currentLocation}
          />
        </View>

        <View className="mb-6 rounded-2xl border border-border bg-card p-4">
          <AppTextInput
            label="Receiver phone (optional)"
            value={receiverPhone}
            onChangeText={setReceiverPhone}
            placeholder="Contact at delivery"
            keyboardType="phone-pad"
          />
        </View>

        <Button onPress={handleNext} fullWidth>
          Get fare estimate
        </Button>
      </ScrollView>
    </View>
  );
}
