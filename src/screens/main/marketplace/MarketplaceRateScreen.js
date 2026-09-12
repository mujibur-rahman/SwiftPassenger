import React, { useState } from "react";
import { View, Text, StatusBar, Alert, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  selectActivePickupId,
  resetMarketplacePickup,
} from "@/features/marketplace/marketplacePickupSlice";
import { useRateMarketplacePickupMutation } from "@/features/marketplace/marketplacePickupApi";

export default function MarketplaceRateScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const pickupId = useSelector(selectActivePickupId);
  const [rating, setRating] = useState(0);
  const [ratePickup, { isLoading }] = useRateMarketplacePickupMutation();

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    try {
      await ratePickup({ id: pickupId, rating }).unwrap();
      dispatch(resetMarketplacePickup());
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Couldn’t submit rating", "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Rate Pickup" onBack={() => navigation.goBack()} />
      </View>

      <View className="flex-1 items-center px-6 pt-10">
        <Image
          source={DUMMY.driverAvatar}
          style={{ width: 72, height: 72, borderRadius: 36, marginBottom: 16 }}
        />
        <Text className="mb-1 text-center text-xl font-inter-bold text-foreground">
          How was your experience?
        </Text>
        <Text className="mb-8 text-center text-sm text-foreground-muted">
          Rate your driver and the pickup service.
        </Text>

        <View className="mb-10 flex-row gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity key={n} onPress={() => setRating(n)} hitSlop={8}>
              <Icon
                name={n <= rating ? "star" : "star-outline"}
                size={36}
                color={
                  n <= rating
                    ? colors?.warning || "#FBBF24"
                    : colors?.foregroundMuted || "#7DD3FC"
                }
              />
            </TouchableOpacity>
          ))}
        </View>

        <Button
          className="w-full"
          onPress={handleSubmit}
          disabled={isLoading || rating < 1}
          loading={isLoading}
          fullWidth
        >
          Submit
        </Button>
      </View>
    </View>
  );
}
