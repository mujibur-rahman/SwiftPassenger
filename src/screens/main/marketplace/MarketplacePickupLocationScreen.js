// @/screens/main/marketplace/MarketplacePickupLocationScreen.js
import React, { useState } from "react";
import { View, Text, StatusBar, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import StepProgress from "@/components/marketplace/StepProgress";
import {
  setSellerAddress,
  selectMarketplaceDraft,
} from "@/features/marketplace/marketplacePickupSlice";

export default function MarketplacePickupLocationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);
  const currentLocation = useSelector((s) => s.location?.currentLocation);

  const [text, setText] = useState(draft.sellerAddress?.address || "");

  const handleSelect = (place) => {
    dispatch(
      setSellerAddress({
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
        placeId: place.placeId || null,
      })
    );
    setText(place.address);
  };

  const handleNext = () => {
    if (!draft.sellerAddress?.address && !text.trim()) {
      Alert.alert("Required", "Please select where the driver should collect the item.");
      return;
    }
    if (!draft.sellerAddress?.latitude && text.trim()) {
      dispatch(
        setSellerAddress({
          address: text.trim(),
          latitude: null,
          longitude: null,
        })
      );
    }
    navigation.navigate("MarketplaceSellerInfo");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Pickup Location" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={1} total={5} />

        <Text className="mb-1 text-xl font-inter-bold text-foreground">
          Where should we collect?
        </Text>
        <Text className="mb-5 text-sm font-inter text-foreground-muted">
          Search for the seller, shop, or marketplace meetup point.
        </Text>

        <View className="mb-4 z-50">
          <LocationAutocomplete
            label="Search pickup location"
            value={text}
            onChangeText={setText}
            onSelect={handleSelect}
            placeholder="Seller address or place name"
            biasCoords={currentLocation}
          />
        </View>

        {draft.sellerAddress?.address ? (
          <View className="mb-6 flex-row items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <Icon name="map-marker" size={20} color={colors?.primary || "#38BDF8"} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-inter-medium text-foreground-muted">Selected</Text>
              <Text className="mt-0.5 text-base font-inter-semibold text-foreground">
                {draft.sellerAddress.address}
              </Text>
            </View>
          </View>
        ) : null}

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
