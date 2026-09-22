import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  selectInsuranceVehicle,
  selectInsurancePersonal,
  selectInsuranceCoverage,
  selectInsuranceQuote,
  selectInsuranceBillingCycle,
  setBillingCycle,
  addPolicy,
  resetInsuranceDraft,
} from "@/features/insurance/insuranceSlice";
import { usePurchasePolicyMutation } from "@/features/insurance/insuranceApi";

// Payment method options
const METHODS = [
  { id: "upi", label: "UPI", icon: "qrcode" },
  { id: "card", label: "Card", icon: "credit-card-outline" },
  { id: "netbanking", label: "Net Banking", icon: "bank-outline" },
];

// Billing cycle config: divisor for instalment amount, and policy duration label
const BILLING_CYCLES = [
  {
    id: "monthly",
    label: "Monthly",
    sublabel: "12 instalments / year",
    icon: "calendar-month-outline",
    divisor: 12,
  },
  {
    id: "quarterly",
    label: "Quarterly",
    sublabel: "4 instalments / year",
    icon: "calendar-refresh-outline",
    divisor: 4,
  },
  {
    id: "yearly",
    label: "Yearly",
    sublabel: "Single annual payment",
    icon: "calendar-check-outline",
    divisor: 1,
    badge: "Best value",
  },
];

/** Returns the instalment amount based on the annual total and billing cycle. */
function getInstalmentAmount(totalAnnual, cycleId) {
  const cycle = BILLING_CYCLES.find((c) => c.id === cycleId);
  return Math.ceil(totalAnnual / (cycle?.divisor ?? 1));
}

export default function InsurancePaymentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const vehicle = useSelector(selectInsuranceVehicle);
  const personal = useSelector(selectInsurancePersonal);
  const coverage = useSelector(selectInsuranceCoverage);
  const quote = useSelector(selectInsuranceQuote);
  const savedCycle = useSelector(selectInsuranceBillingCycle);

  const [method, setMethod] = useState("upi");
  const [cycle, setCycle] = useState(savedCycle ?? "yearly");
  const [purchasePolicy, { isLoading }] = usePurchasePolicyMutation();

  const instalmentAmount = getInstalmentAmount(quote.totalPremium, cycle);
  const formatMoney = (n) => `$ ${Number(n || 0).toLocaleString("en-BD")}`;

  const handlePay = async () => {
    // Persist the billing cycle choice
    dispatch(setBillingCycle(cycle));

    const body = {
      vehicle,
      personal,
      coverage,
      quote,
      paymentMethod: method,
      billingCycle: cycle,
      instalmentAmount,
    };

    try {
      const result = await purchasePolicy(body).unwrap();
      dispatch(addPolicy({ ...result, billingCycle: cycle, instalmentAmount }));
      dispatch(resetInsuranceDraft());
      navigation.replace("PolicySuccess", { policy: result });
    } catch {
      // Fallback mock success for offline / server down
      const mock = {
        id: `POL-${Date.now()}`,
        policyNumber: `POL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        vehicle,
        personal,
        coverage,
        quote,
        billingCycle: cycle,
        instalmentAmount,
        status: "active",
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      dispatch(addPolicy(mock));
      dispatch(resetInsuranceDraft());
      navigation.replace("PolicySuccess", { policy: mock });
    }
  };

  const selectedCycleConfig = BILLING_CYCLES.find((c) => c.id === cycle);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Payment" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount payable card — updates with billing cycle */}
        <View className="mb-6 items-center rounded-2xl bg-primary/10 py-6">
          <Text className="text-sm font-inter text-foreground-muted">Amount payable</Text>
          <Text className="mt-1 text-3xl font-inter-bold text-foreground">
            {formatMoney(instalmentAmount)}
          </Text>
          <Text className="mt-1 text-xs font-inter text-foreground-muted">
            {selectedCycleConfig?.sublabel ?? ""} · Annual total {formatMoney(quote.totalPremium)}
          </Text>
        </View>

        {/* ── Billing Cycle ── */}
        <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
          Billing cycle
        </Text>

        {BILLING_CYCLES.map((c) => {
          const active = cycle === c.id;
          const amount = getInstalmentAmount(quote.totalPremium, c.id);
          return (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.85}
              onPress={() => setCycle(c.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${
                active ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: active ? `${primary}22` : (isDark ? "#1E3A5F" : "#F1F5F9") }}
              >
                <Icon name={c.icon} size={20} color={active ? primary : muted} />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text
                    className={`text-[15px] font-inter-semibold ${
                      active ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {c.label}
                  </Text>
                  {c.badge && (
                    <View className="rounded-full bg-primary/20 px-2 py-0.5">
                      <Text className="text-[10px] font-inter-semibold text-primary">
                        {c.badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
                  {c.sublabel}
                </Text>
              </View>

              <View className="items-end gap-0.5">
                <Text
                  className={`text-[15px] font-inter-bold ${
                    active ? "text-primary" : "text-foreground"
                  }`}
                >
                  {formatMoney(amount)}
                </Text>
                <Icon
                  name={active ? "radiobox-marked" : "radiobox-blank"}
                  size={20}
                  color={active ? primary : muted}
                />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── Payment Method ── */}
        <Text className="mb-3 mt-5 text-sm font-inter-semibold text-foreground-secondary">
          Payment method
        </Text>

        {METHODS.map((m) => {
          const selected = method === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.85}
              onPress={() => setMethod(m.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${
                selected ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
            >
              <Icon name={m.icon} size={22} color={selected ? primary : muted} />
              <Text
                className={`flex-1 text-[15px] font-inter-semibold ${
                  selected ? "text-primary" : "text-foreground"
                }`}
              >
                {m.label}
              </Text>
              <Icon
                name={selected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={selected ? primary : muted}
              />
            </TouchableOpacity>
          );
        })}

        <View className="mt-4 flex-row items-center justify-center gap-2">
          <Icon name="lock-outline" size={16} color={muted} />
          <Text className="text-xs font-inter text-foreground-muted">Secure payment</Text>
        </View>
      </ScrollView>

      <View
        className="border-t border-border bg-card px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button variant="gradient" pill={true} onPress={handlePay} loading={isLoading}>
          Pay {formatMoney(instalmentAmount)}
        </Button>
      </View>
    </View>
  );
}
