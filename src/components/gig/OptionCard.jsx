// @/components/gig/OptionCard.jsx
// Selectable option row for GigQuestionScreen — one question, one screen,
// tap an option to advance. Plain props only.
import React from "react";
import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function OptionCard({
  label,
  subtitle,
  selected = false,
  onPress,
  disabled = false,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      className={`
        mb-3 flex-row items-center justify-between rounded-2xl border p-4
        ${selected ? "border-primary bg-primary/10" : "border-border bg-card"}
        ${disabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      <View className="flex-1 pr-3">
        <Text
          className={`text-base font-inter-semibold ${selected ? "text-primary" : "text-foreground"}`}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs font-inter text-foreground-muted">{subtitle}</Text>
        ) : null}
      </View>

      <View
        className={`
          h-6 w-6 items-center justify-center rounded-full border-2
          ${selected ? "border-primary bg-primary" : "border-border bg-transparent"}
        `}
      >
        {selected ? (
          <Icon name="check" size={14} color={colors?.primaryForeground || "#fff"} />
        ) : null}
      </View>
    </Pressable>
  );
}
