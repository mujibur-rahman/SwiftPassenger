// @/screens/main/food/FoodPaymentScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { useTheme } from "@/theme";
import { useGetPaymentMethodsQuery } from "@/features/payment/paymentApi";
import { selectCart, makeSelectTotals } from "@/features/food/cartSlice";

const BRAND_ICONS = {
  visa: { icon: "credit-card", tw: "bg-primary/15" },
  mastercard: { icon: "credit-card", tw: "bg-primary/15" },
  amex: { icon: "credit-card", tw: "bg-primary/15" },
  default: { icon: "credit-card-outline", tw: "bg-primary/15" },
};

const MOCK_METHODS = [
  { id: "1", type: "card", brand: "visa", lastFour: "4242", isDefault: true, label: "Visa" },
  { id: "2", type: "card", brand: "mastercard", lastFour: "1234", isDefault: false, label: "Mastercard" },
];

const EXTRA_METHODS = [
  { id: "paypal", label: "PayPal", icon: "credit-card-outline" },
  { id: "apple_pay", label: "Apple Pay", icon: "apple" },
  { id: "cash", label: "Cash on Delivery", icon: "cash" },
];

const selectTotals = makeSelectTotals();

export default function FoodPaymentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const totals = useSelector(selectTotals);

  const { data: methods = [], isError } = useGetPaymentMethodsQuery();
  const cardMethods = !isError && methods.length ? methods : MOCK_METHODS;

  const [selected, setSelected] = useState(
    cardMethods.find((m) => m.isDefault)?.id || cardMethods[0]?.id
  );

  const next = () => {
    const cardMatch = cardMethods.find((m) => m.id === selected);
    const extraMatch = EXTRA_METHODS.find((m) => m.id === selected);
    const paymentMethod = cardMatch
      ? { type: "card", label: `${cardMatch.label} •••• ${cardMatch.lastFour}` }
      : { type: extraMatch?.id, label: extraMatch?.label };

    navigation.navigate("ReviewOrder", { paymentMethod });
  };

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Payment" className="pb-3" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
          Payment Method
        </Text>

        {cardMethods.map((m) => {
          const brand = BRAND_ICONS[m.brand] || BRAND_ICONS.default;
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => setSelected(m.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${
                isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <View className={`h-10 w-10 items-center justify-center rounded-lg ${brand.tw}`}>
                <Icon name={brand.icon} size={20} color={primary} />
              </View>
              <Text className="flex-1 font-inter-medium text-foreground">
                {m.label} •••• {m.lastFour}
              </Text>
              <Icon
                name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={isSelected ? "#38BDF8" : "#7DD3FC"}
              />
            </TouchableOpacity>
          );
        })}

        {EXTRA_METHODS.map((m) => {
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => setSelected(m.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${
                isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <View className="h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                <Icon name={m.icon} size={20} color="#38BDF8" />
              </View>
              <Text className="flex-1 font-inter-medium text-foreground">{m.label}</Text>
              <Icon
                name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={isSelected ? "#38BDF8" : "#7DD3FC"}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity className="mt-1 flex-row items-center gap-2 py-2">
          <Icon name="plus" size={18} color="#38BDF8" />
          <Text className="font-inter-semibold text-primary">Add new card</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="font-inter-medium text-foreground-muted">Total</Text>
          <Text className="text-base font-inter-bold text-foreground">${totals.total.toFixed(2)}</Text>
        </View>
        <Button onPress={next} disabled={!selected}>
          Next
        </Button>
      </View>
    </View>
  );
}
