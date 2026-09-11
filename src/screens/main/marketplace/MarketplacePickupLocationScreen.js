import React, { useState } from "react";
import { View, Text, StatusBar, Alert, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import LocationAutocomplete from "@/components/LocationAutocomplete";
import StepProgress from "@/components/marketplace/StepProgress";
import { DUMMY } from "@/components/marketplace/dummyAssets";
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
      Alert.alert("Required", "Please select the seller pickup location.");
      return;
    }
    if (!draft.sellerAddress?.latitude && text.trim()) {
      dispatch(setSellerAddress({ address: text.trim(), latitude: null, longitude: null }));
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
        <Text className="mb-1 text-xl font-inter-bold text-foreground">Where should we collect?</Text>
        <Text className="mb-4 text-sm font-inter text-foreground-muted">
          Search for the seller, shop, or meetup point.
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

        {/* Dummy map preview */}
        <View className="mb-4 overflow-hidden rounded-2xl border border-border">
          <Image
            source={{ uri: DUMMY.mapPickup }}
            style={{ width: "100%", height: 160 }}
            resizeMode="cover"
          />
          <View className="absolute bottom-3 left-3 right-3 flex-row items-center gap-2 rounded-xl bg-card/95 px-3 py-2.5 border border-border">
            <Icon name="map-marker" size={18} color={colors?.primary} />
            <Text className="flex-1 text-sm font-inter-medium text-foreground" numberOfLines={1}>
              {draft.sellerAddress?.address || text || "Select a location"}
            </Text>
          </View>
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
