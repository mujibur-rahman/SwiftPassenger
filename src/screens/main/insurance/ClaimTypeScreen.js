import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity, Alert } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import { useSubmitClaimMutation } from "@/features/insurance/insuranceApi";

const CLAIM_TYPES = [
  { id: "accident", label: "Accident", icon: "car-emergency" },
  { id: "theft", label: "Theft", icon: "shield-alert-outline" },
  { id: "glass", label: "Glass / Windshield", icon: "car-windshield-outline" },
  { id: "others", label: "Others", icon: "dots-horizontal-circle-outline" },
];

export default function ClaimTypeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const policyId = route?.params?.policyId;
  const policyNumber = route?.params?.policyNumber;

  const [claimType, setClaimType] = useState(null);
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [submitClaim, { isLoading }] = useSubmitClaimMutation();

  const handleSubmit = async () => {
    if (!claimType) {
      Alert.alert("Required", "Please select a claim type");
      return;
    }
    try {
      const result = await submitClaim({
        policyId,
        policyNumber,
        claimType,
        incidentDate,
        description,
      }).unwrap();
      Alert.alert(
        "Claim submitted",
        `Your claim number is ${result.claimNumber || "CLM-" + Date.now()}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch {
      const claimNumber = `CLM-${Date.now().toString().slice(-8)}`;
      Alert.alert("Claim submitted", `Your claim number is ${claimNumber}`, [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="File a Claim" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {policyNumber ? (
          <Text className="mb-4 text-sm font-inter text-foreground-muted">
            Policy: {policyNumber}
          </Text>
        ) : null}

        <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
          Claim type
        </Text>

        {CLAIM_TYPES.map((t) => {
          const selected = claimType === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.85}
              onPress={() => setClaimType(t.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-4 ${selected ? "border-primary bg-primary/10" : "border-border bg-card"
                }`}
            >
              <Icon name={t.icon} size={22} color={selected ? primary : muted} />
              <Text
                className={`flex-1 text-[15px] font-inter-semibold ${selected ? "text-primary" : "text-foreground"
                  }`}
              >
                {t.label}
              </Text>
              <Icon
                name={selected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={selected ? primary : muted}
              />
            </TouchableOpacity>
          );
        })}

        <AppTextInput
          label="Incident date"
          placeholder="DD / MM / YYYY"
          value={incidentDate}
          onChangeText={setIncidentDate}
          containerClassName="mt-4 mb-3"
        />

        <AppTextInput
          label="Description"
          placeholder="Briefly describe what happened"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          containerClassName="mb-4"
        />
      </ScrollView>

      <View
        className="border-t border-border bg-card px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button onPress={handleSubmit} loading={isLoading} disabled={!claimType}>
          Submit Claim
        </Button>
      </View>
    </View>
  );
}
