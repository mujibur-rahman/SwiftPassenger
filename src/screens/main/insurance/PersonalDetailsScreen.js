import React, { useState } from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import AppDropdown from "@/components/ui/AppDropdown";
import StepProgress from "@/components/marketplace/StepProgress";
import {
  setPersonalDetails,
  selectInsurancePersonal,
} from "@/features/insurance/insuranceSlice";

const RELATIONS = ["Spouse", "Parent", "Child", "Sibling", "Other"].map((v) => ({
  label: v,
  value: v,
}));

export default function PersonalDetailsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const stored = useSelector(selectInsurancePersonal);

  const [form, setForm] = useState({ ...stored });
  const [errors, setErrors] = useState({});

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName?.trim()) next.fullName = "Required";
    if (!form.mobile?.trim() || form.mobile.replace(/\D/g, "").length < 10)
      next.mobile = "Valid mobile required";
    if (!form.email?.trim() || !form.email.includes("@")) next.email = "Valid email required";
    if (!form.dateOfBirth?.trim()) next.dateOfBirth = "Required";
    if (!form.pinCode?.trim()) next.pinCode = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    dispatch(setPersonalDetails(form));
    navigation.navigate("CoverageSelection");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Personal Details" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={2} total={4} />

        <AppTextInput
          label="Full name"
          required
          placeholder="As per NID / passport"
          value={form.fullName}
          onChangeText={(v) => update("fullName", v)}
          error={errors.fullName}
          containerClassName="mb-3"
        />

        <AppTextInput
          label="Mobile number"
          required
          leftContent="+61"
          placeholder="(555) 000-0000"
          value={form.mobile}
          onChangeText={(v) => update("mobile", v)}
          keyboardType="phone-pad"
          error={errors.mobile}
          containerClassName="mb-3"
        />

        <AppTextInput
          label="Email"
          required
          placeholder="you@example.com"
          value={form.email}
          onChangeText={(v) => update("email", v)}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          containerClassName="mb-3"
        />

        <AppTextInput
          label="Date of birth"
          required
          placeholder="DD / MM / YYYY"
          value={form.dateOfBirth}
          onChangeText={(v) => update("dateOfBirth", v)}
          error={errors.dateOfBirth}
          containerClassName="mb-3"
        />

        <AppTextInput
          label="PIN code"
          required
          placeholder="7001"
          value={form.pinCode}
          onChangeText={(v) => update("pinCode", v)}
          keyboardType="number-pad"
          error={errors.pinCode}
          containerClassName="mb-3"
        />

        <AppTextInput
          label="Address"
          placeholder="House, road, area"
          value={form.address}
          onChangeText={(v) => update("address", v)}
          multiline
          numberOfLines={2}
          containerClassName="mb-4"
        />

        <AppTextInput
          label="Nominee name"
          placeholder="Full name of nominee"
          value={form.nomineeName}
          onChangeText={(v) => update("nomineeName", v)}
          containerClassName="mb-3"
        />

        <AppDropdown
          label="Nominee relation"
          value={form.nomineeRelation}
          options={RELATIONS}
          onChange={(v) => update("nomineeRelation", v)}
          placeholder="Select relation"
          className="mb-6"
        />
      </ScrollView>

      <View
        className="border-t border-border bg-card px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          variant="gradient"
          pill={true} onPress={goNext}>Continue</Button>
      </View>
    </View>
  );
}
