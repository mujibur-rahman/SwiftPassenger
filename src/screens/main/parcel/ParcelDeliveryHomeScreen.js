// @/screens/main/parcel/ParcelDeliveryHomeScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";

export default function ParcelDeliveryHomeScreen() {
  const navigation = useNavigation();
  const { isDark, colors } = useTheme();
  const primary = colors?.primary ?? "#38BDF8";

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Send a Parcel" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View className="mb-5 items-center rounded-3xl border border-border bg-card px-6 py-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/15">
            <Icon name="package-variant-closed" size={36} color={primary} />
          </View>
          <Text className="mb-2 text-center text-xl font-inter-bold text-foreground">Send a Parcel</Text>
          <Text className="mb-6 text-center text-sm font-inter text-foreground-muted">
            A driver will pick up your parcel and deliver it to any address in the city.
          </Text>

          <View className="w-full flex-row items-center justify-center gap-3">
            <View className="items-center gap-1.5">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-background-muted">
                <Icon name="map-marker-outline" size={20} color={primary} />
              </View>
              <Text className="text-[11px] font-inter text-foreground-muted">Pickup</Text>
            </View>
            <View className="mb-5 h-0.5 w-10 bg-border" />
            <View className="items-center gap-1.5">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-background-muted">
                <Icon name="home-map-marker" size={20} color={colors?.success ?? "#34D399"} />
              </View>
              <Text className="text-[11px] font-inter text-foreground-muted">Delivery</Text>
            </View>
          </View>
        </View>

        <View className="mb-5 gap-2.5">
          {[
            { icon: "clock-fast", title: "Fast pickup", subtitle: "Drivers nearby, usually within minutes" },
            { icon: "shield-check-outline", title: "Tracked delivery", subtitle: "Live tracking from pickup to drop-off" },
            { icon: "cash-multiple", title: "Multiple payment options", subtitle: "Card or cash, your choice" },
          ].map((item) => (
            <View key={item.title} className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-background-muted">
                <Icon name={item.icon} size={18} color={primary} />
              </View>
              <View className="flex-1">
                <Text className="text-[13px] font-inter-semibold text-foreground">{item.title}</Text>
                <Text className="text-xs font-inter text-foreground-muted">{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <Button onPress={() => navigation.navigate("ParcelPickupLocation")} fullWidth leftIcon="arrow-right">
          Start Delivery
        </Button>
      </ScrollView>
    </View>
  );
}
