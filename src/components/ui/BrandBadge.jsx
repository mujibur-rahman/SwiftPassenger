// src/components/ui/BrandBadge.jsx
import React from "react";
import { View, Text } from "react-native";
import {
  useFonts,
  InstrumentSerif_400Regular_Italic,
} from "@expo-google-fonts/instrument-serif";

/**
 * Circular brand mark
 *
 * Props:
 * - text?: string
 * - size?: number
 * - fontSize?: number
 * - className?: string
 * - textClassName?: string
 */
export default function BrandBadge({
  text = "ZyroApp",
  size = 90,
  fontSize = 26,
  className = "",
  textClassName = "",
}) {
  const [fontsLoaded] = useFonts({
    InstrumentSerif: InstrumentSerif_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="border border-border bg-card"
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={`items-center justify-center border border-border bg-card ${className}`}
    >
      <Text
        style={{ fontSize, fontFamily: "InstrumentSerif" }}
        className={`font-semibold text-primary ${textClassName}`}
      >
        {text}
      </Text>
    </View>
  );
}
