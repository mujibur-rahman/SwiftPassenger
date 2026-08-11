import React from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import SvgIcon from "./SvgIcon";
import { getName } from "../../utils/helpers";

/**
 * Reusable Avatar
 *
 * Props:
 * - name?: string
 * - size?: "sm" | "md" | "lg" | number
 * - onPress?: () => void
 * - icon?: string
 * - className?: string
 * - textClassName?: string
 * - showIcon?: boolean
 * - loading?: boolean          ← new
 * - activeOpacity?: number
 */
const sizeMap = {
  sm: "w-9 h-9",
  md: "w-11 h-11",
  lg: "w-14 h-14",
};

const textSizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const iconSizeMap = {
  sm: 18,
  md: 22,
  lg: 26,
};

const spinnerSizeMap = {
  sm: "small",
  md: "small",
  lg: "large",
};

export default function Avatar({
  name,
  size = "sm",
  onPress,
  icon = "user",
  className = "",
  textClassName = "",
  showIcon = false,
  loading = false,
  activeOpacity = 0.7,
}) {
  const sizeClass =
    typeof size === "number"
      ? `w-[${size}px] h-[${size}px]`
      : sizeMap[size] || sizeMap.sm;

  const textSize = textSizeMap[size] || textSizeMap.sm;
  const iconSize =
    typeof size === "number" ? Math.round(size * 0.5) : iconSizeMap[size] || 18;

  const spinnerSize =
    typeof size === "number"
      ? size > 44
        ? "large"
        : "small"
      : spinnerSizeMap[size] || "small";

  // ── Content ────────────────────────────────
  let content = null;

  if (loading) {
    content = (
      <ActivityIndicator size={spinnerSize} color="#cba35c" /> // gold
    );
  } else if (!showIcon && name) {
    content = (
      <Text className={`avatar-text ${textSize} ${textClassName}`}>
        {getName(name)}
      </Text>
    );
  } else {
    content = <SvgIcon name={icon} size={iconSize} color="#fff" />;
  }

  const Container = onPress && !loading ? TouchableOpacity : View;

  return (
    <Container
      onPress={loading ? undefined : onPress}
      activeOpacity={activeOpacity}
      disabled={loading}
      className={`
        ${sizeClass}
        rounded-full bg-avatar-bg border border-border
        items-center justify-center
        ${loading ? "opacity-70" : ""}
        ${className}
      `}
    >
      {content}
    </Container>
  );
}
