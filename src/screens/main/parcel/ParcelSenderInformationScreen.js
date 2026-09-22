// @/screens/main/parcel/ParcelSenderInformationScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import Avatar from "@/components/ui/Avatar";
import StepProgress from "@/components/marketplace/StepProgress";
import { setDraftField, selectParcelDraft } from "@/features/parcel/parcelDeliverySlice";

export default function ParcelSenderInformationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const draft = useSelector(selectParcelDraft);
  const user = useSelector((s) => s.auth?.user);

  const [senderName, setSenderName] = useState(draft.senderName || user?.name || "");
  const [senderPhone, setSenderPhone] = useState(draft.senderPhone || user?.phone || "");
  const [pickupInstructions, setPickupInstructions] = useState(draft.pickupInstructions || "");

  const handleNext = () => {
    if (!senderName.trim()) {
      Alert.alert("Required", "Please enter the sender's name.");
      return;
    }
    if (!senderPhone.trim()) {
      Alert.alert("Required", "Please enter a valid phone number.");
      return;
    }
    dispatch(setDraftField({ key: "senderName", value: senderName.trim() }));
    dispatch(setDraftField({ key: "senderPhone", value: senderPhone.trim() }));
    dispatch(setDraftField({ key: "pickupInstructions", value: pickupInstructions.trim() }));
    navigation.navigate("ParcelReceiverInformation");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Sender Information" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <StepProgress current={5} total={9} />

        <View className="mb-5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Avatar name={senderName.trim() || "S"} size={48} />
          <View className="flex-1">
            <Text className="text-base font-inter-semibold text-foreground">{senderName || "Sender"}</Text>
            <Text className="mt-0.5 text-sm text-foreground-muted" numberOfLines={1}>
              {draft.pickupAddress?.address || "Pickup location"}
            </Text>
          </View>
        </View>

        <View className="mb-6 gap-3 rounded-2xl border border-border bg-card p-4">
          <AppTextInput label="Sender name" value={senderName} onChangeText={setSenderName} placeholder="Enter sender name" required />
          <AppTextInput label="Sender phone" value={senderPhone} onChangeText={setSenderPhone} placeholder="Enter sender phone number" keyboardType="phone-pad" required />
          <AppTextInput label="Pickup instructions (optional)" value={pickupInstructions} onChangeText={setPickupInstructions} placeholder="Call before arrival, ask for reception…" multiline numberOfLines={3} />
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
