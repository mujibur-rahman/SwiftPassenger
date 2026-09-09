// @/components/gig/ProviderCard.jsx
// Compact version of QuoteCard for CompareQuotesScreen — subset of fields +
// a select radio, so the customer can pick one provider while comparing.
import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import { ProviderAvatar } from "@/components/gig/QuoteCard";

export default function ProviderCard({
  quote,
  selected = false,
  isBestValue = false,
  onSelect,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const warning = colors?.warning ?? "#FBBF24";

  if (!quote) return null;
  const { providerName, providerPhoto, rating, reviews, price, availability, distance } = quote;

  return (
    <Pressable
      onPress={() => onSelect?.(quote)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={`
        mb-3 flex-row items-center gap-3 rounded-2xl border p-3.5
        ${selected ? "border-primary bg-primary/10" : "border-border bg-card"}
        ${className}
      `}
    >
      <ProviderAvatar photo={providerPhoto} name={providerName} size={44} />

      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-sm font-inter-bold text-foreground" numberOfLines={1}>
            {providerName}
          </Text>
          {isBestValue ? (
            <View className="rounded-full bg-success/15 px-1.5 py-0.5">
              <Text className="text-[9px] font-inter-bold uppercase text-success">Best value</Text>
            </View>
          ) : null}
        </View>
        <View className="mt-0.5 flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <Icon name="star" size={12} color={warning} />
            <Text className="text-xs font-inter-medium text-foreground-secondary">
              {rating} ({reviews})
            </Text>
          </View>
          {distance ? (
            <Text className="text-xs font-inter text-foreground-muted">· {distance}</Text>
          ) : null}
        </View>
        {availability ? (
          <Text className="mt-0.5 text-[11px] font-inter text-foreground-muted">{availability}</Text>
        ) : null}
      </View>

      <View className="items-end gap-2">
        <Text className="text-base font-inter-bold text-primary">${Number(price).toFixed(0)}</Text>
        <View
          className={`h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-primary bg-primary" : "border-border bg-transparent"}`}
        >
          {selected ? (
            <Icon name="check" size={12} color={colors?.primaryForeground || "#fff"} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
