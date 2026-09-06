// @/screens/main/food/DeliveryOptionScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { useGetDeliveryOptionsQuery } from "@/features/food/foodApi";
import { selectCart, setDeliveryOption } from "@/features/food/cartSlice";

const OPTION_ICONS = { standard: "bike-fast", priority: "rocket-launch-outline" };

export default function DeliveryOptionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  const { data: options = [], isLoading } = useGetDeliveryOptionsQuery();
  const [selected, setSelected] = useState(cart.deliveryOptionId);

  const next = () => {
    dispatch(setDeliveryOption(selected));
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#38BDF8" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Delivery Option" className="pb-3" />

      {options.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            activeOpacity={0.8}
            onPress={() => setSelected(opt.id)}
            className={`mb-3 flex-row items-center gap-3 rounded-2xl border p-4 ${
              isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
            }`}
          >
            <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
              <Icon name={OPTION_ICONS[opt.id] || "bike-fast"} size={22} color="#38BDF8" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-inter-bold text-foreground">{opt.label}</Text>
              <Text className="mt-0.5 text-xs font-inter text-foreground-muted">{opt.etaMinutes}</Text>
            </View>
            <Text className="mr-2 font-inter-bold text-foreground">${opt.fee.toFixed(2)}</Text>
            <Icon
              name={isSelected ? "radiobox-marked" : "radiobox-blank"}
              size={22}
              color={isSelected ? "#38BDF8" : "#7DD3FC"}
            />
          </TouchableOpacity>
        );
      })}

      <View className="mb-4 flex-row items-start gap-2 rounded-2xl bg-background-muted p-3">
        <Icon name="information-outline" size={16} color="#7DD3FC" />
        <Text className="flex-1 text-xs font-inter text-foreground-muted">
          Delivery time is an estimate and may vary based on your location and order volume.
        </Text>
      </View>

      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={next}>Next</Button>
      </View>
    </View>
  );
}
