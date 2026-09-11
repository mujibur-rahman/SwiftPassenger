import React from "react";
import { View, Text } from "react-native";

export default function StepProgress({ current = 1, total = 5, className = "" }) {
  return (
    <View className={`mb-4 flex-row items-center justify-between ${className}`}>
      <Text className="text-xs font-inter-medium text-foreground-muted">
        Step {current} of {total}
      </Text>
      <View className="flex-row items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            className={`h-1.5 rounded-full ${i < current ? "w-4 bg-primary" : "w-1.5 bg-border"}`}
          />
        ))}
      </View>
    </View>
  );
}
