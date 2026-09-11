// @/screens/main/marketplace/MarketplaceEstimateScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import InfoCard from "@/components/marketplace/InfoCard";
import {
  selectMarketplaceDraft,
  setEstimate,
} from "@/features/marketplace/marketplacePickupSlice";
import { useGetMarketplacePickupEstimateMutation } from "@/features/marketplace/marketplacePickupApi";

export default function MarketplaceEstimateScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);

  const [getEstimate, { data, isLoading, isError, error }] =
    useGetMarketplacePickupEstimateMutation();

  const fetchEstimate = () => {
    getEstimate({
      sellerAddress: draft.sellerAddress,
      deliveryAddress: draft.deliveryAddress,
      itemDescription: draft.itemDescription,
    })
      .unwrap()
      .then((res) => dispatch(setEstimate(res)))
      .catch(() => {});
  };

  useEffect(() => {
    fetchEstimate();
  }, []);

  const handleNext = () => {
    if (!data) {
      Alert.alert("Please wait", "Fare estimate is not ready yet.");
      return;
    }
    navigation.navigate("MarketplaceConfirm");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Fare Estimate" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <StepProgress current={5} total={5} />

        <InfoCard
          icon="store"
          label="Pickup"
          title={draft.sellerName || "Seller"}
          subtitle={draft.sellerAddress?.address}
          className="mb-3"
        />
        <InfoCard
          icon="home-map-marker"
          label="Delivery"
          title={draft.deliveryAddress?.address || "—"}
          className="mb-6"
        />

        {isLoading && (
          <View className="items-center rounded-2xl border border-border bg-card py-12">
            <ActivityIndicator size="large" color={colors?.primary} />
            <Text className="mt-3 text-sm font-inter text-foreground-muted">
              Calculating fare…
            </Text>
          </View>
        )}

        {isError && (
          <View className="mb-4 items-center rounded-2xl border border-border bg-card p-5">
            <Text className="mb-2 text-center text-sm text-error">
              {error?.data?.message || "Couldn’t get estimate. Check your connection."}
            </Text>
            <Button variant="ghost" onPress={fetchEstimate}>
              Retry
            </Button>
          </View>
        )}

        {data && !isLoading && (
          <View className="mb-6 rounded-3xl border border-border bg-card p-5">
            <Text className="text-xs font-inter-medium uppercase tracking-wide text-foreground-muted">
              Estimated fare
            </Text>
            <Text className="mt-1 text-4xl font-inter-bold text-foreground">
              {data.currency || "৳"}
              {data.fare}
            </Text>
            <View className="mt-4 flex-row flex-wrap gap-4">
              <View className="flex-row items-center gap-1.5">
                <Icon name="map-marker-distance" size={16} color={colors?.foregroundMuted || "#7DD3FC"} />
                <Text className="text-sm font-inter text-foreground-secondary">
                  {data.distanceKm} km
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon name="clock-outline" size={16} color={colors?.foregroundMuted || "#7DD3FC"} />
                <Text className="text-sm font-inter text-foreground-secondary">
                  ~{data.durationMin} min
                </Text>
              </View>
            </View>
            <Text className="mt-4 text-xs font-inter leading-4 text-foreground-muted">
              Final fare may vary based on traffic and actual distance.
            </Text>
          </View>
        )}

        <Button onPress={handleNext} disabled={!data || isLoading} fullWidth>
          Continue to confirm
        </Button>
      </ScrollView>
    </View>
  );
}
