// @/screens/main/parcel/ParcelFareEstimateScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar, ActivityIndicator, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import InfoCard from "@/components/marketplace/InfoCard";
import ParcelFareBreakdown from "@/components/parcel/ParcelFareBreakdown";
import { selectParcelDraft, setEstimate } from "@/features/parcel/parcelDeliverySlice";
import { useGetParcelDeliveryEstimateMutation } from "@/features/parcel/parcelDeliveryApi";

export default function ParcelFareEstimateScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const [getEstimate, { data, isLoading, isError }] = useGetParcelDeliveryEstimateMutation();

  const fetchEstimate = () => {
    getEstimate({
      pickupAddress: draft.pickupAddress,
      deliveryAddress: draft.deliveryAddress,
      deliveryOption: draft.deliveryOption,
    })
      .unwrap()
      .then((res) => dispatch(setEstimate(res)))
      .catch(() => {});
  };

  useEffect(() => {
    fetchEstimate();
  }, []);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Fare Estimate" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <StepProgress current={8} total={9} />

        <InfoCard icon="map-marker-outline" label="Pickup" title={draft.pickupAddress?.address || "—"} className="mb-3" />
        <InfoCard icon="home-map-marker" label="Delivery" title={draft.deliveryAddress?.address || "—"} className="mb-5" />

        {isLoading && (
          <View className="items-center rounded-2xl border border-border bg-card py-12">
            <ActivityIndicator size="large" color={colors?.primary} />
            <Text className="mt-3 text-sm text-foreground-muted">Calculating fare…</Text>
          </View>
        )}

        {isError && (
          <View className="mb-4 items-center rounded-2xl border border-border bg-card p-5">
            <Text className="mb-2 text-center text-sm text-error">Couldn't get estimate.</Text>
            <Button variant="ghost" onPress={fetchEstimate}>
              Retry
            </Button>
          </View>
        )}

        {data && !isLoading && (
          <>
            <View className="mb-4 flex-row flex-wrap gap-4 px-1">
              <View className="flex-row items-center gap-1.5">
                <Icon name="map-marker-distance" size={16} color={colors?.foregroundMuted} />
                <Text className="text-sm text-foreground-secondary">{data.distanceKm} km</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <Icon name="clock-outline" size={16} color={colors?.foregroundMuted} />
                <Text className="text-sm text-foreground-secondary">~{data.durationMin} min</Text>
              </View>
            </View>
            <ParcelFareBreakdown estimate={data} className="mb-6" />
          </>
        )}

        <Button onPress={() => navigation.navigate("ParcelPayment")} disabled={!data || isLoading} fullWidth>
          Continue
        </Button>
      </ScrollView>
    </View>
  );
}
