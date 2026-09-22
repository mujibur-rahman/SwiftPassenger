// @/screens/main/parcel/ParcelCompleteScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { selectActiveParcelId, resetParcelDelivery } from "@/features/parcel/parcelDeliverySlice";

export default function ParcelCompleteScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const parcelId = useSelector(selectActiveParcelId);

  // Rule #23 — reset stale Parcel state once the flow is genuinely done,
  // same as ParcelComplete's job description says. Runs on unmount so the
  // "Order #" is still visible while this screen itself is showing.
  useEffect(() => {
    return () => dispatch(resetParcelDelivery());
  }, [dispatch]);

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-success/15">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-success">
          <Icon name="check" size={30} color={isDark ? "#060E1A" : "#FFFFFF"} />
        </View>
      </View>

      <Text className="mb-2 text-center text-2xl font-inter-bold text-foreground">Delivery Complete</Text>
      <Text className="mb-6 text-center text-[13px] font-inter text-foreground-muted">
        Thanks for using SwiftPassenger for your parcel delivery.
      </Text>

      {parcelId ? (
        <View className="mb-10 rounded-full bg-background-muted px-4 py-2">
          <Text className="text-[13px] font-inter-semibold text-foreground">Order #{parcelId}</Text>
        </View>
      ) : (
        <View className="mb-10" />
      )}

      <View className="w-full">
        <Button onPress={() => navigation.reset({ index: 0, routes: [{ name: "Tabs" }] })}>Back to Home</Button>
      </View>
    </View>
  );
}
