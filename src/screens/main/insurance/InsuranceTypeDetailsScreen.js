import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { getInsuranceType } from "@/config/insurance/insuranceTypes";
import { setPolicyType, resetInsuranceDraft } from "@/features/insurance/insuranceSlice";
import { useDispatch } from "react-redux";

export default function InsuranceTypeDetailsScreen({ navigation, route }) {
  const { colors, isDark } = useTheme();
  const dispatch = useDispatch();
  const type = getInsuranceType(route?.params?.typeId);
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  const startQuote = () => {
    dispatch(resetInsuranceDraft());
    dispatch(setPolicyType(type.id));
    navigation.navigate("VehicleDetails");
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Insurance details" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        <View className="mb-5 mt-2 items-center rounded-3xl border border-border bg-card p-6">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Icon name={type.icon} size={40} color={primary} />
          </View>
          <Text className="text-center text-2xl font-inter-bold text-foreground">{type.title}</Text>
          <Text className="mt-2 text-center text-sm font-inter leading-5 text-foreground-muted">
            {type.description}
          </Text>
        </View>

        <Text className="mb-3 text-base font-inter-semibold text-foreground">What's covered</Text>
        {type.benefits.map((item) => (
          <View key={item} className="mb-2.5 flex-row items-center rounded-2xl border border-border bg-card p-3.5">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="check-circle-outline" size={21} color={primary} />
            </View>
            <Text className="ml-3 flex-1 text-sm font-inter text-foreground">{item}</Text>
          </View>
        ))}

        <Text className="mb-3 mt-5 text-base font-inter-semibold text-foreground">Important exclusions</Text>
        {type.exclusions.map((item) => (
          <View key={item} className="mb-2.5 flex-row items-center rounded-2xl border border-border bg-card p-3.5">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-background-muted">
              <Icon name="information-outline" size={21} color={colors?.foregroundMuted ?? "#64748B"} />
            </View>
            <Text className="ml-3 flex-1 text-sm font-inter text-foreground">{item}</Text>
          </View>
        ))}
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 border-t border-border bg-card px-5 pb-5 pt-3">
        <Button variant="gradient" pill onPress={startQuote}>Get a Quote</Button>
      </View>
    </View>
  );
}
