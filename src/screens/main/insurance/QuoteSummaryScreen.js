import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import {
  selectInsuranceVehicle,
  selectInsuranceCoverage,
  selectInsuranceQuote,
} from "@/features/insurance/insuranceSlice";

export default function QuoteSummaryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const vehicle = useSelector(selectInsuranceVehicle);
  const coverage = useSelector(selectInsuranceCoverage);
  const quote = useSelector(selectInsuranceQuote);

  const formatMoney = (n) => `$ ${Number(n || 0).toLocaleString("en-BD")}`;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Your Quote" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={4} total={4} />

        {/* Big premium */}
        <View className="mb-6 items-center rounded-2xl bg-primary/10 py-8">
          <Text className="mb-1 text-sm font-inter text-foreground-muted">Total Premium</Text>
          <Text className="text-3xl font-inter-bold text-foreground">
            {formatMoney(quote.totalPremium)}
          </Text>
          <Text className="mt-1 text-xs font-inter text-foreground-muted">
            Inclusive of GST
          </Text>
        </View>

        {/* Vehicle summary */}
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
            Vehicle
          </Text>
          <Text className="text-[15px] font-inter-semibold text-foreground">
            {vehicle.brand} {vehicle.model} {vehicle.variant}
          </Text>
          <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
            {vehicle.registrationNumber} · {vehicle.year} · {vehicle.fuelType}
          </Text>
        </View>

        {/* Coverage summary */}
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
            Coverage
          </Text>
          <Text className="text-[15px] font-inter-semibold text-foreground">
            {coverage.policyType === "ThirdParty" ? "Third Party" : "Comprehensive"}
          </Text>
          <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
            IDV: {formatMoney(coverage.idv)}
          </Text>
        </View>

        {/* Premium break-up */}
        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
            Premium break-up
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm font-inter text-foreground-muted">Base premium</Text>
            <Text className="text-sm font-inter-medium text-foreground">
              {formatMoney(quote.basePremium)}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm font-inter text-foreground-muted">Add-ons</Text>
            <Text className="text-sm font-inter-medium text-foreground">
              {formatMoney(quote.addOnPremium)}
            </Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="text-sm font-inter text-foreground-muted">GST (18%)</Text>
            <Text className="text-sm font-inter-medium text-foreground">
              {formatMoney(quote.gst)}
            </Text>
          </View>
          <View className="mt-2 border-t border-border pt-2 flex-row justify-between">
            <Text className="text-sm font-inter-semibold text-foreground">Total</Text>
            <Text className="text-sm font-inter-bold text-foreground">
              {formatMoney(quote.totalPremium)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="border-t border-border bg-card px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          variant="gradient"
          pill={true} onPress={() => navigation.navigate("PolicyReview")} className="mb-2">
          Buy Now
        </Button>
        <Button pill={true} variant="secondary" onPress={() => navigation.navigate("MyPolicies")}>
          Save for Later
        </Button>
      </View>
    </View>
  );
}
