import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";

const BENEFITS = [
  { icon: "shield-check-outline", title: "Fast claim settlement", desc: "Most claims settled within 7 days" },
  { icon: "car-emergency", title: "24/7 Roadside assistance", desc: "Anytime, anywhere support" },
  { icon: "file-document-outline", title: "100% digital process", desc: "Buy & manage policies online" },
  { icon: "cash-refund", title: "Competitive premiums", desc: "Best rates with flexible add-ons" },
];

export default function CarInsuranceLandingScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const primaryDark = isDark ? "#0EA5E9" : "#0284C7";

  const gradientColors = isDark
    ? ["#0C4A6E", "#075985", "#0EA5E9"]
    : ["#E0F2FE", "#BAE6FD", "#7DD3FC"];

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Car Insurance" className="px-5" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Beautiful Hero ── */}
        <View className="mb-6 mt-2 overflow-hidden rounded-3xl">
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 28 }}
          >
            {/* Decorative circles */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: -40,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: isDark
                  ? "rgba(56, 189, 248, 0.15)"
                  : "rgba(255, 255, 255, 0.45)",
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: -50,
                left: -40,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: isDark
                  ? "rgba(14, 165, 233, 0.12)"
                  : "rgba(255, 255, 255, 0.35)",
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 60,
                left: 20,
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark
                  ? "rgba(125, 211, 252, 0.1)"
                  : "rgba(255, 255, 255, 0.3)",
              }}
            />

            {/* Badge */}
            <View className="mb-4 self-center flex-row items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5">
              <Icon name="shield-check" size={14} color={isDark ? "#E0F2FE" : primaryDark} />
              <Text
                className="text-[11px] font-inter-semibold tracking-wide"
                style={{ color: isDark ? "#E0F2FE" : primaryDark }}
              >
                TRUSTED BY 50,000+ DRIVERS
              </Text>
            </View>

            {/* Icon with glow ring */}
            <View className="mb-4 items-center">
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 88,
                  height: 88,
                  backgroundColor: isDark
                    ? "rgba(56, 189, 248, 0.2)"
                    : "rgba(255, 255, 255, 0.7)",
                  borderWidth: 2,
                  borderColor: isDark
                    ? "rgba(125, 211, 252, 0.35)"
                    : "rgba(255, 255, 255, 0.9)",
                }}
              >
                <View
                  className="items-center justify-center rounded-full"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: isDark ? primary : "#FFFFFF",
                  }}
                >
                  <Icon
                    name="car-estate"
                    size={32}
                    color={isDark ? "#0C4A6E" : primary}
                  />
                </View>
              </View>
            </View>

            {/* Title */}
            <Text
              className="mb-2 text-center text-[26px] font-inter-bold leading-8"
              style={{ color: isDark ? "#F0F9FF" : "#0C4A6E" }}
            >
              Protect your car
            </Text>

            {/* Subtitle */}
            <Text
              className="mb-5 text-center text-[14px] font-inter leading-5 px-2"
              style={{ color: isDark ? "#BAE6FD" : "#0369A1" }}
            >
              Comprehensive cover at the best premium.{"\n"}
              Buy or renew in minutes — fully digital.
            </Text>

            {/* Mini stats row */}
            <View className="flex-row justify-center gap-6">
              {[
                { value: "7 days", label: "Avg. claim" },
                { value: "24/7", label: "Support" },
                { value: "100%", label: "Digital" },
              ].map((stat) => (
                <View key={stat.label} className="items-center">
                  <Text
                    className="text-[15px] font-inter-bold"
                    style={{ color: isDark ? "#F0F9FF" : "#0C4A6E" }}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    className="text-[11px] font-inter"
                    style={{ color: isDark ? "#7DD3FC" : "#0284C7" }}
                  >
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* CTAs */}
        <Button
          variant="gradient"
          pill={true}
          onPress={() => navigation.navigate("VehicleDetails")}
          className="mb-3"
        >
          Get New Policy
        </Button>

        <Button
          variant="secondary"
          pill={true}
          onPress={() => navigation.navigate("MyPolicies")}
          className="mb-8"
        >
          Renew / My Policies
        </Button>

        {/* Benefits */}
        <Text className="mb-3 text-base font-inter-semibold text-foreground">
          Why choose us?
        </Text>

        {BENEFITS.map((item) => (
          <View
            key={item.title}
            className="mb-3 flex-row items-start gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon name={item.icon} size={22} color={primary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-semibold text-foreground">
                {item.title}
              </Text>
              <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
                {item.desc}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}