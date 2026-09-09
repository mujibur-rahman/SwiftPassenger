// @/components/gig/JobStatusStepper.jsx
// Generalized version of the step-dot UI inlined in TrackOrderScreen.js.
// Used by JobTrackingScreen (booking statuses) but takes plain steps/labels/
// currentIndex props so it isn't tied to any one status vocabulary.
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function JobStatusStepper({
  steps = [],
  labels = {},
  currentIndex = 0,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const primaryForeground = colors?.primaryForeground || (isDark ? "#060E1A" : "#FFFFFF");
  const widthPct = steps.length > 1 ? `${(currentIndex / (steps.length - 1)) * 100}%` : "0%";

  return (
    <View className={className}>
      <View className="mb-2 flex-row items-center justify-between px-1">
        {steps.map((step, i) => {
          const done = i <= currentIndex;
          const active = i === currentIndex;
          return (
            <View key={step} className="items-center" style={{ width: `${100 / steps.length}%` }}>
              <View
                className={`h-7 w-7 items-center justify-center rounded-full ${done ? "bg-primary" : "border border-border bg-background-muted"}`}
              >
                {done ? (
                  <Icon name="check" size={14} color={primaryForeground} />
                ) : (
                  <Text className="text-[10px] font-inter-bold text-foreground-muted">{i + 1}</Text>
                )}
              </View>
              <Text
                className={`mt-1.5 text-center text-[10px] font-inter-medium ${active ? "text-foreground" : "text-foreground-muted"}`}
                numberOfLines={1}
              >
                {labels[step] || step}
              </Text>
            </View>
          );
        })}
      </View>
      <View className="mx-3 h-1 overflow-hidden rounded-full bg-background-muted">
        <View className="h-full rounded-full bg-primary" style={{ width: widthPct }} />
      </View>
    </View>
  );
}
