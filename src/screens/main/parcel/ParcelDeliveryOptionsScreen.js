// @/screens/main/parcel/ParcelDeliveryOptionsScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import StepProgress from "@/components/marketplace/StepProgress";
import { setDraftField, selectParcelDraft } from "@/features/parcel/parcelDeliverySlice";
import { useGetParcelDeliveryOptionsQuery } from "@/features/parcel/parcelDeliveryApi";

export default function ParcelDeliveryOptionsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const primary = colors?.primary ?? "#38BDF8";

  const { data: options = [], isLoading, isError, refetch } = useGetParcelDeliveryOptionsQuery();

  const selected = draft.deliveryOption?.id;

  const handleSelect = (option) => dispatch(setDraftField({ key: "deliveryOption", value: option }));

  const handleContinue = () => {
    if (!draft.deliveryOption) return;
    navigation.navigate("ParcelFareEstimate");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Delivery Options" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <StepProgress current={7} total={9} />

        {isLoading && (
          <View className="items-center rounded-2xl border border-border bg-card py-12">
            <ActivityIndicator size="large" color={primary} />
            <Text className="mt-3 text-sm text-foreground-muted">Loading delivery options…</Text>
          </View>
        )}

        {isError && (
          <View className="mb-4 items-center rounded-2xl border border-border bg-card p-5">
            <Text className="mb-2 text-center text-sm text-error">Couldn't load delivery options.</Text>
            <Button variant="ghost" onPress={refetch}>
              Retry
            </Button>
          </View>
        )}

        {!isLoading && !isError && (
          <View className="mb-6 gap-2.5">
            {options.map((opt) => {
              const active = selected === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => handleSelect(opt)}
                  activeOpacity={0.85}
                  className="flex-row items-center gap-3 rounded-2xl border p-4"
                  style={{ borderColor: active ? primary : colors?.border ?? "#1E3A5F", backgroundColor: active ? `${primary}14` : "transparent" }}
                >
                  <View className="h-11 w-11 items-center justify-center rounded-xl bg-background-muted">
                    <Icon name="truck-delivery-outline" size={20} color={active ? primary : colors?.foregroundMuted} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[15px] font-inter-bold text-foreground">{opt.label}</Text>
                    <Text className="text-xs font-inter text-foreground-muted">{opt.etaMinutes}</Text>
                  </View>
                  {opt.extraFee > 0 && (
                    <Text className="text-[13px] font-inter-semibold text-foreground-muted">+${opt.extraFee.toFixed(2)}</Text>
                  )}
                  <Icon name={active ? "radiobox-marked" : "radiobox-blank"} size={20} color={active ? primary : colors?.foregroundMuted} />
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <Button onPress={handleContinue} disabled={!draft.deliveryOption} fullWidth>
          Continue
        </Button>
      </ScrollView>
    </View>
  );
}
