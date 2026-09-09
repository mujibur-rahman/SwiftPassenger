// @/components/gig/OptionCard.jsx
// Selectable option row for GigQuestionScreen. Renders an icon-based
// thumbnail tile (icon + tinted background) when the option config supplies
// `icon`/`color` — falls back to the plain radio row when it doesn't, so
// this stays reusable for future gig services that haven't added thumbnails
// to their config yet.
import React from "react";
import { Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function OptionCard({
  label,
  subtitle,
  icon,
  color,
  selected = false,
  onPress,
  disabled = false,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const thumbColor = color || primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      className={`
        mb-3 flex-row items-center rounded-2xl border p-3
        ${selected ? "border-primary bg-primary/10" : "border-border bg-card"}
        ${disabled ? "opacity-50" : ""}
        ${className}
      `}
    >
      {icon ? (
        <View
          className="mr-3.5 h-14 w-14 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${thumbColor}26` }} // ~15% tint of the option color
        >
          <Icon name={icon} size={26} color={thumbColor} />
        </View>
      ) : null}

      <View className="flex-1 pr-3">
        <Text
          className={`text-[15px] font-inter-semibold ${selected ? "text-primary" : "text-foreground"}`}
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
