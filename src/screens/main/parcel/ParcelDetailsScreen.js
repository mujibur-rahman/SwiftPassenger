// @/screens/main/parcel/ParcelDetailsScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import AppDropdown from "@/components/ui/AppDropdown";
import StepProgress from "@/components/marketplace/StepProgress";
import { setDraftField, selectParcelDraft } from "@/features/parcel/parcelDeliverySlice";

const CATEGORY_OPTIONS = [
  { label: "Documents", value: "documents", icon: "file-document-outline" },
  { label: "Clothing", value: "clothing", icon: "tshirt-crew" },
  { label: "Electronics", value: "electronics", icon: "chip" },
  { label: "Food", value: "food", icon: "food" },
  { label: "Medicine", value: "medicine", icon: "pill" },
  { label: "Grocery", value: "grocery", icon: "cart-outline" },
  { label: "Small Package", value: "small_package", icon: "package-variant" },
  { label: "Fragile Item", value: "fragile", icon: "glass-fragile" },
  { label: "Other", value: "other", icon: "dots-horizontal" },
];

export default function ParcelDetailsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const draft = useSelector(selectParcelDraft);

  const [description, setDescription] = useState(draft.description || "");
  const [quantity, setQuantity] = useState(draft.quantity || 1);
  const [category, setCategory] = useState(draft.category || "");
  const [approximateValue, setApproximateValue] = useState(draft.approximateValue || "");
  const [notes, setNotes] = useState(draft.notes || "");
  const [isFragile, setIsFragile] = useState(draft.isFragile || false);

  const changeQty = (d) => setQuantity((q) => Math.max(1, Math.min(99, (Number(q) || 1) + d)));

  const handleNext = () => {
    if (!description.trim()) {
      Alert.alert("Required", "Please describe the parcel.");
      return;
    }
    if (!category) {
      Alert.alert("Required", "Please select a category.");
      return;
    }
    dispatch(setDraftField({ key: "description", value: description.trim() }));
    dispatch(setDraftField({ key: "quantity", value: Number(quantity) || 1 }));
    dispatch(setDraftField({ key: "category", value: category }));
    dispatch(setDraftField({ key: "approximateValue", value: approximateValue.trim() }));
    dispatch(setDraftField({ key: "notes", value: notes.trim() }));
    dispatch(setDraftField({ key: "isFragile", value: isFragile }));
    navigation.navigate("ParcelSizeWeight");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Parcel Details" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <StepProgress current={3} total={9} />

        <View className="mb-5 gap-3 rounded-2xl border border-border bg-card p-4">
          <AppTextInput label="Parcel description" value={description} onChangeText={setDescription} placeholder="e.g. Mobile phone" required />

          <View>
            <Text className="mb-1.5 text-xs font-inter-medium text-foreground-muted">Quantity</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity onPress={() => changeQty(-1)} className="h-14 w-14 items-center justify-center rounded-xl border border-border bg-background-muted">
                <Icon name="minus" size={18} color={colors?.foreground} />
              </TouchableOpacity>
              <Text className="min-w-8 text-center text-lg font-inter-bold text-foreground">{quantity}</Text>
              <TouchableOpacity onPress={() => changeQty(1)} className="h-14 w-14 items-center justify-center rounded-xl border border-border bg-background-muted">
                <Icon name="plus" size={18} color={colors?.foreground} />
              </TouchableOpacity>
            </View>
          </View>

          <AppDropdown label="Category" placeholder="Select a category…" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} leftIcon="shape-outline" />
          <AppTextInput label="Approximate value (optional)" value={approximateValue} onChangeText={setApproximateValue} placeholder="e.g. 250" keyboardType="numeric" />
          <AppTextInput label="Special instructions" value={notes} onChangeText={setNotes} placeholder="Handle carefully, keep upright…" multiline numberOfLines={3} />

          <TouchableOpacity
            onPress={() => setIsFragile((v) => !v)}
            activeOpacity={0.8}
            className="flex-row items-center justify-between rounded-xl border border-border bg-background-muted px-3.5 py-3"
          >
            <View className="flex-row items-center gap-2.5">
              <Icon name="glass-fragile" size={18} color={colors?.warning ?? "#FBBF24"} />
              <Text className="text-sm font-inter-medium text-foreground">This item is fragile</Text>
            </View>
            <View
              className="h-6 w-11 rounded-full p-0.5"
              style={{ backgroundColor: isFragile ? colors?.primary ?? "#38BDF8" : colors?.border ?? "#1E3A5F" }}
            >
              <View
                className="h-5 w-5 rounded-full bg-white"
                style={{ marginLeft: isFragile ? 20 : 0 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <Button onPress={handleNext} fullWidth>
          Next
        </Button>
      </ScrollView>
    </View>
  );
}
