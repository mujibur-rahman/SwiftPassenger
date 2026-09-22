// @/screens/main/parcel/ParcelPaymentScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import { useGetPaymentMethodsQuery } from "@/features/payment/paymentApi";
import { setDraftField, selectParcelDraft } from "@/features/parcel/parcelDeliverySlice";

// Reuses the exact payment-selection pattern from ShopPaymentScreen.js —
// same fallback-to-demo-cards behavior when the API errors, so Parcel
// never gets stuck on a broken payment fetch mid-flow.
const MOCK_METHODS = [
  { id: "1", type: "card", brand: "visa", lastFour: "4242", isDefault: true, label: "Visa" },
  { id: "2", type: "card", brand: "mastercard", lastFour: "1234", isDefault: false, label: "Mastercard" },
];
const CASH_METHOD = { id: "cash", type: "cash", label: "Cash on delivery" };

export default function ParcelPaymentScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const primary = colors?.primary ?? "#38BDF8";
  const draft = useSelector(selectParcelDraft);

  const { data: methods = [], isError } = useGetPaymentMethodsQuery();
  const cardMethods = !isError && methods.length ? methods : MOCK_METHODS;
  const allMethods = [...cardMethods, CASH_METHOD];

  const [selected, setSelected] = useState(
    draft.paymentMethod?.id || cardMethods.find((m) => m.isDefault)?.id || cardMethods[0]?.id
  );

  const handleContinue = () => {
    const method = allMethods.find((m) => m.id === selected);
    if (!method) return;
    const value =
      method.type === "cash"
        ? { type: "cash", label: "Cash on delivery" }
        : { type: "card", id: method.id, label: `${method.label} ····${method.lastFour}` };
    dispatch(setDraftField({ key: "paymentMethod", value }));
    navigation.navigate("ParcelOrderReview");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Payment Method" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <StepProgress current={9} total={9} />

        <View className="mb-6 gap-2.5">
          {allMethods.map((m) => {
            const active = selected === m.id;
            const isCash = m.type === "cash";
            return (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelected(m.id)}
                activeOpacity={0.85}
                className="flex-row items-center gap-3 rounded-2xl border p-3.5"
                style={{ borderColor: active ? primary : colors?.border ?? "#1E3A5F", backgroundColor: active ? `${primary}14` : "transparent" }}
              >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-background-muted">
                  <Icon name={isCash ? "cash" : "credit-card-outline"} size={18} color={active ? primary : colors?.foregroundMuted} />
                </View>
                <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">
                  {isCash ? "Cash on delivery" : `${m.label} ····${m.lastFour}`}
                </Text>
                <Icon name={active ? "radiobox-marked" : "radiobox-blank"} size={20} color={active ? primary : colors?.foregroundMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("PaymentMethods")} activeOpacity={0.7} className="mb-6 flex-row items-center gap-1.5 self-start">
          <Icon name="plus-circle-outline" size={16} color={primary} />
          <Text className="text-sm font-inter-semibold" style={{ color: primary }}>
            Add payment method
          </Text>
        </TouchableOpacity>

        <Button onPress={handleContinue} disabled={!selected} fullWidth>
          Continue
        </Button>
      </ScrollView>
    </View>
  );
}
