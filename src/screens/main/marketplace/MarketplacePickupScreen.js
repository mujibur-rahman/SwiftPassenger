// @/screens/main/marketplace/MarketplacePickupScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { useGetMarketplacePickupOptionsQuery } from "@/features/marketplace/marketplacePickupApi";
import { resetMarketplacePickup } from "@/features/marketplace/marketplacePickupSlice";

const HOW_IT_WORKS = [
  { icon: "map-marker", title: "Set locations", body: "Seller pickup & your delivery address" },
  { icon: "package-variant", title: "Describe the item", body: "What to collect and any notes" },
  { icon: "motorbike", title: "Driver handles it", body: "We find a driver to pick up & deliver" },
];

export default function MarketplacePickupScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();

  const { data: options, isLoading, isError, refetch } =
    useGetMarketplacePickupOptionsQuery();

  const handleStart = () => {
    dispatch(resetMarketplacePickup());
    navigation.navigate("MarketplacePickupLocation");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Marketplace Pickup" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="mb-6 overflow-hidden rounded-3xl border border-border bg-card p-5">
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
            <Icon name="storefront-outline" size={28} color={colors?.primary || "#38BDF8"} />
          </View>
          <Text className="text-xl font-inter-bold text-foreground">
            Need something from a marketplace?
          </Text>
          <Text className="mt-2 text-sm font-inter leading-5 text-foreground-secondary">
            We’ll send a driver to collect your item from a seller and bring it to you.
          </Text>
          <Button className="mt-5" onPress={handleStart} fullWidth>
            Start Marketplace Pickup
          </Button>
        </View>

        {/* How it works */}
        <Text className="mb-3 text-sm font-inter-semibold text-foreground">How it works</Text>
        <View className="mb-6 gap-3">
          {HOW_IT_WORKS.map((step, i) => (
            <View
              key={step.title}
              className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-background-muted">
                <Icon name={step.icon} size={20} color={colors?.primary || "#38BDF8"} />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-inter-semibold text-foreground">
                  {i + 1}. {step.title}
                </Text>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
                  {step.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Options from API */}
        <Text className="mb-3 text-sm font-inter-semibold text-foreground">
          Popular options
        </Text>

        {isLoading && (
          <View className="items-center py-6">
            <ActivityIndicator color={colors?.primary} />
          </View>
        )}

        {isError && (
          <View className="mb-4 items-center rounded-2xl border border-border bg-card p-4">
            <Text className="mb-2 text-sm text-error">Couldn’t load options</Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text className="text-sm font-inter-semibold text-primary">Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isLoading && !isError && (!options || options.length === 0) && (
          <Text className="mb-4 text-sm text-foreground-muted">
            No options available right now. You can still start a new pickup.
          </Text>
        )}

        {options?.length > 0 && (
          <View className="gap-3">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                activeOpacity={0.85}
                onPress={handleStart}
                className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <View className="h-11 w-11 items-center justify-center rounded-xl bg-background-muted">
                  <Icon name="store" size={22} color={colors?.primary || "#38BDF8"} />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-inter-semibold text-foreground">
                    {opt.title}
                  </Text>
                  {opt.subtitle ? (
                    <Text className="mt-0.5 text-sm font-inter text-foreground-muted">
                      {opt.subtitle}
                    </Text>
                  ) : null}
                </View>
                <Icon name="chevron-right" size={20} color={colors?.foregroundMuted || "#7DD3FC"} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
