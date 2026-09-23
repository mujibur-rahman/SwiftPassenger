import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import InsuranceTypeCard from "@/components/insurance/InsuranceTypeCard";
import { INSURANCE_TYPES } from "@/config/insurance/insuranceTypes";

export default function InsuranceTypesScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Car Insurance" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 36 }}
      >
        <View className="mb-5 mt-2 rounded-3xl border border-border bg-card p-5">
          <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Icon name="shield-car" size={28} color={primary} />
          </View>
          <Text className="text-2xl font-inter-bold text-foreground">Choose your cover</Text>
          <Text className="mt-1.5 text-sm font-inter leading-5 text-foreground-muted">
            Select an insurance type to see what it covers, then continue to get your quote.
          </Text>
        </View>

        <Text className="mb-3 text-base font-inter-semibold text-foreground">Insurance types</Text>
        {INSURANCE_TYPES.map((type) => (
          <InsuranceTypeCard
            key={type.id}
            type={type}
            onPress={(selected) =>
              navigation.navigate("InsuranceTypeDetails", { typeId: selected.id })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
