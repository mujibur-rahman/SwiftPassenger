// @/screens/main/food/DeliveryOptionScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { useGetDeliveryOptionsQuery } from "@/features/food/foodApi";
import { setDeliveryOption, selectCart } from "@/features/food/cartSlice";
import ScreenHeader from "@/components/ui/ScreenHeader";

const OPTION_ICONS = { standard: "home-outline", priority: "flash" };

const MOCK_OPTIONS = [
  { id: "standard", label: "Standard Delivery", etaMinutes: "20–30 min", fee: 2.0 },
  { id: "priority", label: "Priority Delivery", etaMinutes: "15–20 min", fee: 4.99 },
];

export default function DeliveryOptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const { data: apiOptions, isLoading } = useGetDeliveryOptionsQuery();
  const options = apiOptions?.length ? apiOptions : MOCK_OPTIONS;
  const [selected, setSelected] = useState(cart.deliveryOptionId || "standard");

  const next = () => {
    dispatch(setDeliveryOption(selected));
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color={primary} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Delivery Option" />
      </View>

      <View className="flex-1 px-5">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.85}
              onPress={() => setSelected(opt.id)}
              className={`mb-3 flex-row items-center gap-3 rounded-2xl border p-4 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
            >
              <View className={`h-11 w-11 items-center justify-center rounded-xl ${isSelected ? "bg-primary/20" : "bg-background-muted"}`}>
                <Icon name={OPTION_ICONS[opt.id] || "bike-fast"} size={22} color={primary} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-inter-bold text-foreground">{opt.label}</Text>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted">{opt.etaMinutes}</Text>
              </View>
              <Text className="mr-2 font-inter-bold text-foreground">${Number(opt.fee).toFixed(2)}</Text>
              <Icon name={isSelected ? "radiobox-marked" : "radiobox-blank"} size={22} color={isSelected ? primary : muted} />
            </TouchableOpacity>
          );
        })}

        <View className="mt-2 flex-row items-start gap-2 rounded-2xl border border-border bg-background-muted p-3">
          <Icon name="information-outline" size={16} color={muted} />
          <Text className="flex-1 text-xs font-inter leading-4 text-foreground-muted">
            Delivery time is an estimate and may vary based on your location and order volume.
          </Text>
        </View>
      </View>

      <View className="px-5" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={next}>Next</Button>
      </View>
    </View>
  );
}