// @/screens/main/shop/ShopCompleteScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { resetShopOrder } from "@/features/shop/shopOrderSlice";

export default function ShopCompleteScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const orderNumber = route.params?.orderNumber;

  // The flow is fully done — clear shopOrder so the next "Shop for me"
  // doesn't briefly flash the previous order before its own poll lands.
  useEffect(() => {
    return () => dispatch(resetShopOrder());
  }, [dispatch]);

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-8 h-28 w-28 items-center justify-center rounded-full bg-success/10">
        <View className="relative items-center justify-center">
          <Icon name="shopping-outline" size={56} color={success} />
          <View
            className="absolute -bottom-1 -right-2 h-7 w-7 items-center justify-center rounded-full bg-success"
            style={{ borderWidth: 2, borderColor: isDark ? "#060E1A" : "#FFFFFF" }}
          >
            <Icon name="check" size={14} color={isDark ? "#060E1A" : "#FFFFFF"} />
          </View>
        </View>
      </View>

      <Text className="mb-2 text-center text-2xl font-inter-bold text-foreground">Thank you!</Text>
      <Text className="mb-6 text-center text-[13px] font-inter text-foreground-muted">
        Your shopping request is complete.
      </Text>

      {orderNumber ? (
        <View className="mb-10 rounded-full bg-background-muted px-4 py-2">
          <Text className="text-[13px] font-inter-semibold text-foreground">Order #{orderNumber}</Text>
        </View>
      ) : (
        <View className="mb-10" />
      )}

      <View className="w-full">
        <Button variant="outline" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Tabs" }] })}>
          Back to Home
        </Button>
      </View>
      <Text className="mt-4 text-center text-xs font-inter text-foreground-muted">
        We hope you enjoyed the service!
      </Text>
    </View>
  );
}
