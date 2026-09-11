// src/components/marketplace/InfoCard.jsx
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function InfoCard({
  icon,
  label,
  title,
  subtitle,
  right,
  className = "",
  children,
}) {
  const { colors } = useTheme();

  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className}`}>
      <View className="flex-row items-start gap-3">
        {icon ? (
          <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-xl bg-background-muted">
            <Icon name={icon} size={20} color={colors?.primary || "#38BDF8"} />
          </View>
        ) : null}
        <View className="flex-1">
          {label ? (
            <Text className="text-[11px] font-inter-medium uppercase tracking-wide text-foreground-muted">
              {label}
            </Text>
          ) : null}
          {title ? (
            <Text className="mt-0.5 text-base font-inter-semibold text-foreground" numberOfLines={2}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text className="mt-0.5 text-sm font-inter text-foreground-secondary" numberOfLines={3}>
              {subtitle}
            </Text>
          ) : null}
          {children}
        </View>
        {right}
      </View>
    </View>
  );
}
