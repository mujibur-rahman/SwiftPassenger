import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { getInsuranceType } from "@/config/insurance/insuranceTypes";
import {
  selectInsuranceVehicle,
  selectInsurancePersonal,
  selectInsuranceCoverage,
  selectInsuranceQuote,
} from "@/features/insurance/insuranceSlice";

export default function PolicyReviewScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const vehicle = useSelector(selectInsuranceVehicle);
  const personal = useSelector(selectInsurancePersonal);
  const coverage = useSelector(selectInsuranceCoverage);
  const quote = useSelector(selectInsuranceQuote);
  const insuranceType = getInsuranceType(coverage.policyType);

  const [accepted, setAccepted] = useState(false);

  const formatMoney = (n) => `$ ${Number(n || 0).toLocaleString("en-BD")}`;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Review Policy" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
            Vehicle
          </Text>
          <Text className="text-[15px] font-inter-semibold text-foreground">
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text className="text-xs font-inter text-foreground-muted">
            {vehicle.registrationNumber} · {vehicle.year}
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
            Policy holder
          </Text>
          <Text className="text-[15px] font-inter-semibold text-foreground">
            {personal.fullName}
          </Text>
          <Text className="text-xs font-inter text-foreground-muted">
            {personal.mobile} · {personal.email}
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
            Coverage & Premium
          </Text>
          <Text className="text-[15px] font-inter-semibold text-foreground">
            {insuranceType.title}
          </Text>
          <Text className="mt-1 text-xs font-inter text-foreground-muted">
            IDV {formatMoney(coverage.idv)}
          </Text>
          <View className="mt-3 border-t border-border pt-3 flex-row justify-between">
            <Text className="text-sm font-inter-semibold text-foreground">Total payable</Text>
            <Text className="text-base font-inter-bold text-primary">
              {formatMoney(quote.totalPremium)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAccepted((v) => !v)}
          className="mb-2 flex-row items-start gap-3"
        >
          <Icon
            name={accepted ? "checkbox-marked" : "checkbox-blank-outline"}
            size={22}
            color={accepted ? primary : muted}
          />
          <Text className="flex-1 text-sm font-inter text-foreground-secondary leading-5">
            I have read and agree to the terms & conditions and policy wordings.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View
        className="border-t border-border bg-card px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          variant="gradient"
          pill={true}
          onPress={() => navigation.navigate("InsurancePayment")}
          disabled={!accepted}
        >
          Proceed to Payment
        </Button>
      </View>
    </View>
  );
}
