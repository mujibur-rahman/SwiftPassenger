// @/screens/main/parcel/ParcelSizeWeightScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import { setDraftField, selectParcelDraft } from "@/features/parcel/parcelDeliverySlice";

const SIZE_OPTIONS = [
  { value: "small", label: "Small", hint: "Fits in a shoebox", icon: "package-variant" },
  { value: "medium", label: "Medium", hint: "Fits in a backpack", icon: "package-variant-closed" },
  { value: "large", label: "Large", hint: "Needs both hands", icon: "archive-outline" },
  { value: "extra_large", label: "Extra Large", hint: "Bulky item", icon: "dolly" },
];

const WEIGHT_OPTIONS = [
  { value: "up_to_1kg", label: "Up to 1 kg" },
  { value: "1_3kg", label: "1–3 kg" },
  { value: "3_5kg", label: "3–5 kg" },
  { value: "5_10kg", label: "5–10 kg" },
  { value: "10kg_plus", label: "10+ kg" },
];

export default function ParcelSizeWeightScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const primary = colors?.primary ?? "#38BDF8";

  const [size, setSize] = useState(draft.size || "");
  const [weight, setWeight] = useState(draft.weight || "");

  const handleNext = () => {
    if (!size) {
      Alert.alert("Required", "Please select a parcel size.");
      return;
    }
    if (!weight) {
      Alert.alert("Required", "Please select an approximate weight.");
      return;
    }
    dispatch(setDraftField({ key: "size", value: size }));
    dispatch(setDraftField({ key: "weight", value: weight }));
    navigation.navigate("ParcelSenderInformation");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Size & Weight" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <StepProgress current={4} total={9} />

        <Text className="mb-2.5 text-[13px] font-inter-semibold text-foreground-secondary">Size</Text>
        <View className="mb-5 gap-2.5">
          {SIZE_OPTIONS.map((opt) => {
            const active = size === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setSize(opt.value)}
                activeOpacity={0.85}
                className="flex-row items-center gap-3 rounded-2xl border p-3.5"
                style={{ borderColor: active ? primary : colors?.border ?? "#1E3A5F", backgroundColor: active ? `${primary}14` : "transparent" }}
              >
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-background-muted">
                  <Icon name={opt.icon} size={19} color={active ? primary : colors?.foregroundMuted} />
                </View>
                <View className="flex-1">
                  <Text className="text-[14px] font-inter-semibold text-foreground">{opt.label}</Text>
                  <Text className="text-xs font-inter text-foreground-muted">{opt.hint}</Text>
                </View>
                <Icon name={active ? "radiobox-marked" : "radiobox-blank"} size={20} color={active ? primary : colors?.foregroundMuted} />
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="mb-2.5 text-[13px] font-inter-semibold text-foreground-secondary">Approximate weight</Text>
        <View className="mb-6 flex-row flex-wrap gap-2">
          {WEIGHT_OPTIONS.map((opt) => {
            const active = weight === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => setWeight(opt.value)}
                activeOpacity={0.85}
                className="rounded-full border px-4 py-2.5"
                style={{ borderColor: active ? primary : colors?.border ?? "#1E3A5F", backgroundColor: active ? primary : "transparent" }}
              >
                <Text className="text-[13px] font-inter-semibold" style={{ color: active ? (isDark ? "#060E1A" : "#FFFFFF") : colors?.foreground }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
