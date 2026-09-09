// @/components/gig/GigCategoryCard.jsx
// Same visual language as ServiceCard.jsx (service-card / service-card-circle /
// service-card-title classes from global.css) but takes a `category` prop and
// always calls onPress(category) — no hardcoded navigation inside the card.
import React from "react";
import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function GigCategoryCard({
  category,
  onPress,
  iconSize = 26,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const iconColor = colors?.foreground ?? (isDark ? "#F0F9FF" : "#0F172A");

  return (
    <Pressable
      className={`service-card ${className}`}
      onPress={() => onPress?.(category)}
      accessibilityRole="button"
      accessibilityLabel={category?.title}
    >
      <View className="service-card-circle">
        <Icon name={category?.icon || "briefcase-outline"} size={iconSize} color={iconColor} />
      </View>
      <Text className="service-card-title" numberOfLines={2}>
        {category?.title}
      </Text>
    </Pressable>
  );
}
