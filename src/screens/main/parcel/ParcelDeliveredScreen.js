// @/screens/main/parcel/ParcelDeliveredScreen.js
import React from "react";
import { View, Text, StatusBar, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { selectParcelDraft, selectActiveParcelId } from "@/features/parcel/parcelDeliverySlice";

export default function ParcelDeliveredScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const parcelId = useSelector(selectActiveParcelId);
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40, justifyContent: "center" }}>
        <View className="mb-8 items-center">
          <View className="mb-5 h-24 w-24 items-center justify-center rounded-full bg-success/15">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-success">
              <Icon name="check" size={30} color={isDark ? "#060E1A" : "#FFFFFF"} />
            </View>
          </View>
          <Text className="text-center text-2xl font-inter-bold text-foreground">Parcel Delivered Successfully</Text>
          <Text className="mt-2 text-center text-sm font-inter text-foreground-muted">
            Your parcel has been delivered to {draft.receiverName || "the receiver"}.
          </Text>
        </View>

        <View className="mb-8 rounded-2xl border border-border bg-card p-4">
          {parcelId ? <Text className="mb-2 text-xs font-inter-medium text-foreground-muted">Order #{parcelId}</Text> : null}
          <View className="flex-row items-center gap-3">
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-background-muted">
              <Icon name="package-variant-closed" size={20} color={success} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-inter-semibold text-foreground" numberOfLines={1}>{draft.description || "Parcel"}</Text>
              <Text className="mt-0.5 text-sm text-foreground-secondary" numberOfLines={1}>
                {draft.deliveryAddress?.address || "Destination"}
              </Text>
            </View>
          </View>
        </View>

        <Button className="mb-3" fullWidth onPress={() => navigation.navigate("ParcelReceipt")}>
          View Receipt
        </Button>
        <Button variant="ghost" fullWidth onPress={() => navigation.navigate("ParcelRate")}>
          Rate Delivery
        </Button>
      </ScrollView>
    </View>
  );
}
