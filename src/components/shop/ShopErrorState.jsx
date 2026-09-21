// @/components/shop/ShopErrorState.jsx
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";

/**
 * Reusable error/empty state — used wherever a Shop screen's data fetch
 * fails (store search, active order poll). Matches the "16. Error State"
 * reference in the image: icon circle, title, message, primary retry +
 * secondary go-back.
 */
export default function ShopErrorState({
  icon = "map-marker-alert-outline",
  title = "Something went wrong",
  message = "Please check your connection and try again.",
  retryLabel = "Try again",
  onRetry,
  onGoBack,
}) {
  const { colors, isDark } = useTheme();
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-background-muted">
        <Icon name={icon} size={40} color={muted} />
      </View>
      <Text className="mb-2 text-center text-lg font-inter-bold text-foreground">{title}</Text>
      <Text className="mb-8 text-center text-sm font-inter text-foreground-muted">{message}</Text>
      <View className="w-full gap-3">
        {onRetry && <Button onPress={onRetry}>{retryLabel}</Button>}
        {onGoBack && (
          <Button variant="outline" onPress={onGoBack}>
            Go back
          </Button>
        )}
      </View>
    </View>
  );
}
