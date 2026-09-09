// @/components/gig/ImageOptionCard.jsx
// 2-column photo-card grid item for GigQuestionScreen. Falls back to a
// tinted icon tile (same idea as OptionCard's thumbnail) when an option
// hasn't got a real photo asset yet — e.g. frequency/monthly.jpg is
// missing today, so that option renders with `icon`/`color` instead of
// breaking the bundle on a missing require().
import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function ImageOptionCard({
  image,
  icon,
  color,
  title,
  subtitle,
  selected = false,
  onPress,
  aspectRatio = 1.3,
  style,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const primaryForeground = colors?.primaryForeground || "#fff";
  const fallbackTint = color || primary;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={style}
      className={`
        overflow-hidden rounded-2xl border bg-card
        ${selected ? "border-primary" : "border-border"}
        ${className}
      `}
    >
      <View style={{ aspectRatio }} className="w-full">
        {image ? (
          <Image source={image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <View
            className="h-full w-full items-center justify-center"
            style={{ backgroundColor: `${fallbackTint}26` }}
          >
            <Icon name={icon || "image-outline"} size={32} color={fallbackTint} />
          </View>
        )}

        {selected ? (
          <View
            className="absolute right-2 top-2 h-6 w-6 items-center justify-center rounded-full"
            style={{ backgroundColor: primary }}
          >
            <Icon name="check" size={14} color={primaryForeground} />
          </View>
        ) : null}
      </View>

      <View className="px-3 py-2.5">
        <Text
          className={`text-sm font-inter-bold ${selected ? "text-primary" : "text-foreground"}`}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-0.5 text-xs font-inter text-foreground-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
