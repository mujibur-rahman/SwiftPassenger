// @/screens/main/food/OrderPlacedScreen.js
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";

export default function OrderPlacedScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const success = colors?.success ?? "#34D399";
  const { orderId } = route.params;

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) }}
    >
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-success/15">
        <Icon name="check-circle" size={56} color={success} />
      </View>

      <Text className="mb-2 text-2xl font-inter-bold text-foreground">Order Placed!</Text>
      <Text className="mb-1 text-center font-inter text-foreground-muted">
        Your food is on the way. You'll receive updates in real time.
      </Text>
      <Text className="mb-10 font-inter-semibold text-primary">Order #{orderId}</Text>

      <View className="w-full gap-3">
        <Button onPress={() => navigation.replace("TrackOrder", { orderId })} leftIcon="map-marker-path">
          Track Order
        </Button>
        <Button
          variant="outline"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Tabs" }],
            })
          }
        >
          View Order Details
        </Button>
      </View>
    </View>
  );
}
