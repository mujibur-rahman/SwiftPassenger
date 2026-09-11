import React from "react";
import { View, Text, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function InfoCard({
  icon,
  imageUri,
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
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            className="h-12 w-12 rounded-xl"
            style={{ width: 48, height: 48, borderRadius: 12 }}
          />
        ) : icon ? (
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
