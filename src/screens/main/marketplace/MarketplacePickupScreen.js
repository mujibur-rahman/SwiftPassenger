// Marketplace Pickup Home (mockup screen 1) — NOT app HomeScreen.js
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { useGetMarketplacePickupOptionsQuery } from "@/features/marketplace/marketplacePickupApi";
import { resetMarketplacePickup } from "@/features/marketplace/marketplacePickupSlice";
import { DUMMY } from "@/components/marketplace/dummyAssets";

const POPULAR = [
  { id: "daraz", title: "Daraz", uri: DUMMY.daraz },
  { id: "fb", title: "Facebook", uri: DUMMY.facebook },
  { id: "ebay", title: "eBay", uri: DUMMY.ebay },
  { id: "local", title: "Local Shops", uri: DUMMY.localShop },
];

export default function MarketplacePickupScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const { data: options, isLoading, isError, refetch } =
    useGetMarketplacePickupOptionsQuery();

  const start = () => {
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
        <View className="mb-5 overflow-hidden rounded-3xl border border-border bg-card">
          <Image
            source={DUMMY.heroMarketplace}
            style={{ width: "100%", height: 140 }}
            resizeMode="cover"
          />
          <View className="p-5">
            <Text className="text-xl font-inter-bold text-foreground">
              Need something from a marketplace?
            </Text>
            <Text className="mt-2 text-sm font-inter leading-5 text-foreground-secondary">
              We’ll pick it up from the seller and deliver it to you.
            </Text>
            <Button className="mt-4" onPress={start} fullWidth>
              Start Marketplace Pickup
            </Button>
          </View>
        </View>

        {/* Popular marketplaces */}
        <Text className="mb-3 text-sm font-inter-semibold text-foreground">
          Popular Marketplaces
        </Text>
        <View className="mb-6 flex-row flex-wrap justify-between gap-y-3">
          {POPULAR.map((p) => (
            <TouchableOpacity
              key={p.id}
              onPress={start}
              activeOpacity={0.85}
              className="w-[23%] items-center"
            >
              <Image
                source={{ uri: p.uri }}
                style={{ width: 56, height: 56, borderRadius: 16 }}
              />
              <Text
                className="mt-1.5 text-center text-[11px] font-inter-medium text-foreground-muted"
                numberOfLines={1}
              >
                {p.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* API options */}
        <Text className="mb-3 text-sm font-inter-semibold text-foreground">Options</Text>
        {isLoading && (
          <ActivityIndicator color={colors?.primary} className="py-4" />
        )}
        {isError && (
          <TouchableOpacity onPress={() => refetch()} className="mb-3">
            <Text className="text-sm text-error">Couldn’t load — tap to retry</Text>
          </TouchableOpacity>
        )}
        {options?.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={start}
            activeOpacity={0.85}
            className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-background-muted">
              <Icon name="storefront-outline" size={22} color={colors?.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-inter-semibold text-foreground">{opt.title}</Text>
              {opt.subtitle ? (
                <Text className="mt-0.5 text-sm text-foreground-muted">{opt.subtitle}</Text>
              ) : null}
            </View>
            <Icon name="chevron-right" size={20} color={colors?.foregroundMuted} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
