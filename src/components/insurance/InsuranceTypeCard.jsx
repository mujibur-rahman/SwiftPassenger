import React from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function InsuranceTypeCard({ type, onPress }) {
  const { colors, isDark } = useTheme();
  const iconColor = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  return (
    <Pressable
      onPress={() => onPress?.(type)}
      className="mb-3 flex-row items-center rounded-2xl border border-border bg-card p-4"
      style={({ pressed }) => ({ opacity: pressed ? 0.78 : 1 })}
      accessibilityRole="button"
      accessibilityLabel={type.title}
    >
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <Icon name={type.icon} size={25} color={iconColor} />
      </View>
      <View className="ml-3 flex-1 pr-2">
        <Text className="text-[15px] font-inter-semibold leading-5 text-foreground">
          {type.title}
        </Text>
        <Text className="mt-1 text-xs font-inter leading-4 text-foreground-muted">
          {type.description}
        </Text>
      </View>
      <Icon name="chevron-right" size={23} color={colors?.foregroundMuted ?? "#64748B"} />
    </Pressable>
  );
}
