import React from "react";
import { View, Text, StatusBar, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  selectMarketplaceDraft,
  selectMarketplaceEstimate,
  selectActivePickupId,
} from "@/features/marketplace/marketplacePickupSlice";

export default function MarketplaceCompletedScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectMarketplaceDraft);
  const estimate = useSelector(selectMarketplaceEstimate);
  const pickupId = useSelector(selectActivePickupId);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingBottom: 40,
          justifyContent: "center",
        }}
      >
        <View className="items-center mb-8">
          <Image
            source={DUMMY.success}
            style={{ width: 88, height: 88, borderRadius: 44, marginBottom: 16 }}
          />
          <View className="mb-2 h-14 w-14 items-center justify-center rounded-full bg-success/20 absolute top-6">
            <Icon name="check" size={28} color={colors?.success || "#34D399"} />
          </View>
          <Text className="mt-14 text-center text-2xl font-inter-bold text-foreground">
            Pickup Completed!
          </Text>
          <Text className="mt-2 text-center text-sm font-inter text-foreground-muted">
            Your marketplace item has been delivered successfully.
          </Text>
        </View>

        <View className="mb-8 rounded-2xl border border-border bg-card p-4">
          {pickupId ? (
            <Text className="mb-2 text-xs font-inter-medium text-foreground-muted">
              Order #{pickupId}
            </Text>
          ) : null}
          <View className="flex-row items-center gap-3">
            <Image
              source={DUMMY.itemProduct}
              style={{ width: 48, height: 48, borderRadius: 10 }}
            />
            <View className="flex-1">
              <Text className="text-base font-inter-semibold text-foreground">
                {draft.itemDescription || "Item"}
              </Text>
              {estimate ? (
                <Text className="mt-0.5 text-sm text-foreground-secondary">
                  Total · ৳{estimate.fare}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <Button className="mb-3" fullWidth onPress={() => navigation.navigate("MarketplaceRate")}>
          Rate this pickup
        </Button>
        <Button
          variant="ghost"
          fullWidth
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "Tabs" }] })}
        >
          Done
        </Button>
      </ScrollView>
    </View>
  );
}
