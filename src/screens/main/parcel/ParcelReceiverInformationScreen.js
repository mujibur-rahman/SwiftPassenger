// @/screens/main/parcel/ParcelReceiverInformationScreen.js
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

export default function ParcelReceiverInformationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const draft = useSelector(selectParcelDraft);

  const [receiverName, setReceiverName] = useState(draft.receiverName || "");
  const [receiverPhone, setReceiverPhone] = useState(draft.receiverPhone || "");
  const [deliveryInstructions, setDeliveryInstructions] = useState(draft.deliveryInstructions || "");

  const handleNext = () => {
    if (!receiverName.trim()) {
      Alert.alert("Required", "Please enter the receiver's name.");
      return;
    }
    if (!receiverPhone.trim()) {
      Alert.alert("Required", "Please enter a valid receiver phone number.");
      return;
    }
    dispatch(setDraftField({ key: "receiverName", value: receiverName.trim() }));
    dispatch(setDraftField({ key: "receiverPhone", value: receiverPhone.trim() }));
    dispatch(setDraftField({ key: "deliveryInstructions", value: deliveryInstructions.trim() }));
    navigation.navigate("ParcelDeliveryOptions");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Receiver Information" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <StepProgress current={6} total={9} />

        <View className="mb-5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <Avatar name={receiverName.trim() || "R"} size={48} />
          <View className="flex-1">
            <Text className="text-base font-inter-semibold text-foreground">{receiverName || "Receiver"}</Text>
            <Text className="mt-0.5 text-sm text-foreground-muted" numberOfLines={1}>
              {draft.deliveryAddress?.address || "Delivery location"}
            </Text>
          </View>
        </View>

        <View className="mb-6 gap-3 rounded-2xl border border-border bg-card p-4">
          <AppTextInput label="Receiver name" value={receiverName} onChangeText={setReceiverName} placeholder="Enter receiver name" required />
          <AppTextInput label="Receiver phone" value={receiverPhone} onChangeText={setReceiverPhone} placeholder="Enter receiver phone number" keyboardType="phone-pad" required />
          <AppTextInput label="Delivery instructions (optional)" value={deliveryInstructions} onChangeText={setDeliveryInstructions} placeholder="Leave at reception, call on arrival…" multiline numberOfLines={3} />
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
