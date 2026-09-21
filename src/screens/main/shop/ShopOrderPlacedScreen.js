// @/screens/main/shop/ShopOrderPlacedScreen.js
import React from "react";
import { View, Text, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";

export default function ShopOrderPlacedScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const orderId = route.params?.orderId;
  const orderNumber = route.params?.orderNumber;

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-success/15">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-success">
          <Icon name="check" size={32} color={isDark ? "#060E1A" : "#FFFFFF"} />
        </View>
      </View>

      <Text className="mb-2 text-center text-2xl font-inter-bold text-foreground">
        Your shopping request has been placed!
      </Text>
      {orderNumber ? (
        <Text className="mb-1 text-center text-sm font-inter-semibold text-foreground">Order #{orderNumber}</Text>
      ) : null}
      <Text className="mb-10 text-center text-[13px] font-inter text-foreground-muted">
        You'll be notified when a driver is assigned.
      </Text>

      {/* Decorative store + car — same idea as the dashed-route sketch in the image */}
      <View className="mb-10 w-full flex-row items-center justify-center gap-6 opacity-70">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-success/10 border border-success/20">
          <Icon name="storefront" size={26} color={success} />
        </View>
        <Icon name="dots-horizontal" size={20} color={muted} />
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Icon name="car" size={26} color={primary} />
        </View>
      </View>

      <View className="w-full gap-3">
        <Button onPress={() => navigation.replace("ShopTrackOrder", { orderId, orderNumber })}>Track Order</Button>
        <Button variant="outline" onPress={() => navigation.navigate("ShopTrackOrder", { orderId, orderNumber })}>
          View Details
        </Button>
      </View>
    </View>
  );
}
