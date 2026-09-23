import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import {
  setPolicyType,
  setIdv,
  toggleAddOn,
  recalculateQuote,
  selectInsuranceCoverage,
  selectInsuranceQuote,
} from "@/features/insurance/insuranceSlice";

const ADDONS = [
  { key: "zeroDepreciation", label: "Zero Depreciation", desc: "No depreciation on claims" },
  { key: "engineProtect", label: "Engine Protect", desc: "Covers engine & gearbox damage" },
  { key: "roadsideAssistance", label: "Roadside Assistance", desc: "24/7 towing & on-spot help" },
  { key: "consumables", label: "Consumables Cover", desc: "Nuts, bolts, oils, etc." },
  { key: "ncbProtection", label: "NCB Protection", desc: "Protect no-claim bonus" },
  { key: "keyReplacement", label: "Key Replacement", desc: "Lost or stolen keys" },
];

export default function CoverageSelectionScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const coverage = useSelector(selectInsuranceCoverage);
  const quote = useSelector(selectInsuranceQuote);

  useEffect(() => {
    dispatch(recalculateQuote());
  }, [dispatch]);

  const formatMoney = (n) => `$ ${Number(n || 0).toLocaleString("en-BD")}`;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Coverage" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={3} total={4} />

        {/* IDV */}
        <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
          IDV (Insured Declared Value)
        </Text>
        <View className="mb-5 flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5">
          <TouchableOpacity
            onPress={() => dispatch(setIdv(Math.max(300000, coverage.idv - 50000)))}
            className="h-9 w-9 items-center justify-center rounded-full bg-background-muted"
          >
            <Icon name="minus" size={18} color={primary} />
          </TouchableOpacity>
          <Text className="text-lg font-inter-bold text-foreground">
            {formatMoney(coverage.idv)}
          </Text>
          <TouchableOpacity
            onPress={() => dispatch(setIdv(coverage.idv + 50000))}
            className="h-9 w-9 items-center justify-center rounded-full bg-background-muted"
          >
            <Icon name="plus" size={18} color={primary} />
          </TouchableOpacity>
        </View>

        {/* Add-ons */}
        <Text className="mb-2 text-sm font-inter-semibold text-foreground-secondary">
          Add-ons
        </Text>
        {ADDONS.map((item) => {
          const checked = !!coverage.addOns[item.key];
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.85}
              onPress={() => dispatch(toggleAddOn(item.key))}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-3.5 ${checked ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
            >
              <Icon
                name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
                size={22}
                color={checked ? primary : muted}
              />
              <View className="flex-1">
                <Text className="text-[14px] font-inter-semibold text-foreground">
                  {item.label}
                </Text>
                <Text className="text-xs font-inter text-foreground-muted">{item.desc}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sticky premium + CTA */}
      <View
        className="border-t border-border bg-card px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-sm font-inter text-foreground-muted">Estimated premium</Text>
          <Text className="text-lg font-inter-bold text-foreground">
            {formatMoney(quote.totalPremium)}
          </Text>
        </View>
        <Button variant="gradient" pill={true} onPress={() => navigation.navigate("QuoteSummary")}>View Quote</Button>
      </View>
    </View>
  );
}
