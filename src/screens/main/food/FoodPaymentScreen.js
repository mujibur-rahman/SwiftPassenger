// @/screens/main/food/FoodPaymentScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { useGetPaymentMethodsQuery } from "@/features/payment/paymentApi";
import { makeSelectTotals } from "@/features/food/cartSlice";

const MOCK_METHODS = [
  { id: "1", type: "card", brand: "visa", lastFour: "4242", isDefault: true, label: "Visa" },
  { id: "2", type: "card", brand: "mastercard", lastFour: "1234", isDefault: false, label: "Mastercard" },
];

const EXTRA_METHODS = [
  { id: "paypal", label: "PayPal", icon: "credit-card-outline" },
  { id: "apple_pay", label: "Apple Pay", icon: "apple" },
  { id: "cash", label: "Cash on Delivery", icon: "cash" },
];

const BRAND_COLORS = { visa: "#1A1F71", mastercard: "#EB001B" };
const selectTotals = makeSelectTotals();

export default function FoodPaymentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const totals = useSelector(selectTotals);

  const { data: methods = [], isError } = useGetPaymentMethodsQuery();
  const cardMethods = !isError && methods.length ? methods : MOCK_METHODS;

  const [selected, setSelected] = useState(
    cardMethods.find((m) => m.isDefault)?.id || cardMethods[0]?.id || "cash"
  );

  const next = () => {
    const cardMatch = cardMethods.find((m) => m.id === selected);
    const extraMatch = EXTRA_METHODS.find((m) => m.id === selected);
    const paymentMethod = cardMatch
      ? { type: "card", label: `${cardMatch.label} ···· ${cardMatch.lastFour}` }
      : { type: extraMatch?.id, label: extraMatch?.label };
    navigation.navigate("ReviewOrder", { paymentMethod });
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-2 flex-row items-center px-5 pt-2 pb-3">
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8} className="mr-3 h-10 w-10 items-center justify-center">
          <Icon name="arrow-left" size={22} color={colors?.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-inter-bold text-foreground">Payment</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Text className="mb-3 text-[14px] font-inter-semibold text-foreground-secondary">Payment Method</Text>

        {cardMethods.map((m) => {
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.85}
              onPress={() => setSelected(m.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"}`}
            >
              <View className="h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: BRAND_COLORS[m.brand] || "#334155" }}>
                <Text className="text-[10px] font-inter-bold text-white uppercase">{m.brand?.slice(0, 4) || "CARD"}</Text>
              </View>
              <Text className="flex-1 text-[15px] font-inter-semibold text-foreground">{m.label} ···· {m.lastFour}</Text>
              <Icon name={isSelected ? "radiobox-marked" : "radiobox-blank"} size={22} color={isSelected ? primary : muted} />
            </TouchableOpacity>
          );
        })}

        {EXTRA_METHODS.map((m) => {
          const isSelected = selected === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.85}
              onPress={() => setSelected(m.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"}`}
            >
              <View className="h-10 w-10 items-center justify-center rounded-lg bg-background-muted">
                <Icon name={m.icon} size={20} color={primary} />
              </View>
              <Text className="flex-1 text-[15px] font-inter-semibold text-foreground">{m.label}</Text>
              <Icon name={isSelected ? "radiobox-marked" : "radiobox-blank"} size={22} color={isSelected ? primary : muted} />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("PaymentMethods")}
          className="mt-2 flex-row items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-4"
        >
          <Icon name="plus" size={22} color={primary} />
          <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">Add new card</Text>
          <Icon name="chevron-right" size={18} color={muted} />
        </TouchableOpacity>
      </ScrollView>

      <View className="border-t border-border px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-[15px] font-inter-bold text-foreground">Total</Text>
          <Text className="text-[17px] font-inter-bold text-foreground">${totals.total.toFixed(2)}</Text>
        </View>
        <View className="mb-3 flex-row items-center gap-1.5">
          <Icon name="lock-outline" size={14} color={muted} />
          <Text className="text-xs font-inter text-foreground-muted">Your payment information is secure</Text>
        </View>
        <Button onPress={next}>Next</Button>
      </View>
    </View>
  );
}