import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import AppDropdown from "@/components/ui/AppDropdown";
import StepProgress from "@/components/marketplace/StepProgress";
import {
  setVehicleDetails,
  selectInsuranceVehicle,
} from "@/features/insurance/insuranceSlice";
import { useLazyFetchVehicleByRegQuery } from "@/features/insurance/insuranceApi";

const toOpts = (arr) => arr.map((v) => ({ label: v, value: v }));
const BRANDS = toOpts(["Toyota", "Honda", "Hyundai", "Suzuki", "Nissan", "Mitsubishi", "Mazda", "Ford", "Other"]);
const FUEL_TYPES = toOpts(["Petrol", "Diesel", "CNG", "Hybrid", "Electric"]);
const YEARS = toOpts(Array.from({ length: 20 }, (_, i) => String(2026 - i)));

export default function VehicleDetailsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const stored = useSelector(selectInsuranceVehicle);

  const [form, setForm] = useState({ ...stored });
  const [errors, setErrors] = useState({});
  const [fetchVehicle, { isFetching }] = useLazyFetchVehicleByRegQuery();

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const handleAutoFetch = async () => {
    if (!form.registrationNumber?.trim()) {
      setErrors((e) => ({ ...e, registrationNumber: "Enter registration number first" }));
      return;
    }
    try {
      const result = await fetchVehicle(form.registrationNumber.trim()).unwrap();
      if (result) {
        setForm((prev) => ({
          ...prev,
          brand: result.brand || prev.brand,
          model: result.model || prev.model,
          variant: result.variant || prev.variant,
          year: result.year || prev.year,
          fuelType: result.fuelType || prev.fuelType,
          registrationCity: result.registrationCity || prev.registrationCity,
        }));
      }
    } catch {
      // server mock / offline – ignore
    }
  };

  const validate = () => {
    const next = {};
    if (!form.registrationNumber?.trim()) next.registrationNumber = "Required";
    if (!form.brand) next.brand = "Required";
    if (!form.model?.trim()) next.model = "Required";
    if (!form.year) next.year = "Required";
    if (!form.fuelType) next.fuelType = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validate()) return;
    dispatch(setVehicleDetails(form));
    navigation.navigate("PersonalDetails");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Vehicle Details" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepProgress current={1} total={4} />

        <AppTextInput
          label="Registration number"
          required
          placeholder="Enter registration number"
          value={form.registrationNumber}
          onChangeText={(v) => update("registrationNumber", v.toUpperCase())}
          error={errors.registrationNumber}
          autoCapitalize="characters"
          containerClassName="mb-3"
          rightContent={
            <TouchableOpacity onPress={handleAutoFetch} disabled={isFetching} hitSlop={8}>
              {isFetching ? (
                <ActivityIndicator size="small" />
              ) : (
                <Text className="text-sm font-inter-semibold text-primary">Auto-fetch</Text>
              )}
            </TouchableOpacity>
          }
        />

        <AppDropdown
          label="Brand"
          value={form.brand}
          options={BRANDS}
          onChange={(v) => update("brand", v)}
          placeholder="Select brand"
          error={errors.brand}
          className="mb-3"
        />

        <AppTextInput
          label="Model"
          required
          placeholder="Enter model"
          value={form.model}
          onChangeText={(v) => update("model", v)}
          error={errors.model}
          containerClassName="mb-3"
        />

        <AppTextInput
          label="Variant (optional)"
          placeholder="Enter variant"
          value={form.variant}
          onChangeText={(v) => update("variant", v)}
          containerClassName="mb-3"
        />

        <AppDropdown
          label="Manufacturing year"
          value={form.year}
          options={YEARS}
          onChange={(v) => update("year", v)}
          placeholder="Select year"
          error={errors.year}
          className="mb-3"
        />

        <AppDropdown
          label="Fuel type"
          value={form.fuelType}
          options={FUEL_TYPES}
          onChange={(v) => update("fuelType", v)}
          placeholder="Select fuel type"
          error={errors.fuelType}
          className="mb-3"
        />

        <AppTextInput
          label="Registration city"
          placeholder="Enter registration city"
          value={form.registrationCity}
          onChangeText={(v) => update("registrationCity", v)}
          containerClassName="mb-6"
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
