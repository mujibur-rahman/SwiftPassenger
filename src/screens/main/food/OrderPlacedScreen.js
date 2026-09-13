// @/screens/main/food/OrderPlacedScreen.js
import React from "react";
import { View, Text, Image, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";

export default function OrderPlacedScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const orderId = route.params?.orderId;

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Image
        source={require("@assets/images/food/order-placed.jpg")}
        className="w-full h-60 mb-8 rounded-xl shadow-2xl shadow-foreground"
        resizeMode="cover"
      />

      <Text className="mb-2 text-center text-2xl font-inter-bold text-foreground">Order Placed!</Text>
      <Text className="mb-1 text-center text-[14px] font-inter text-foreground-muted">
        Your food is being prepared
      </Text>
      {orderId ? (
        <Text className="mb-8 text-center text-xs font-inter text-foreground-muted">Order ID: {orderId}</Text>
      ) : (
        <View className="mb-8" />
      )}

      <View className="w-full gap-3">
        <Button onPress={() => navigation.replace("TrackOrder", { orderId })}>
          Track Order
        </Button>
        <Button
          variant="outline"
          onPress={() => navigation.reset({ index: 0, routes: [{ name: "FoodSearch" }] })}
        >
          Back to Home
        </Button>
      </View>
    </View>
  );
}