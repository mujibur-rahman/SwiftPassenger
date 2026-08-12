import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";

/**
 * Theme-aware Button
 * Variants: primary | secondary | error | success | warning | outline | ghost | link
 * Sizes:    sm | md | lg
 */
const VARIANTS = {
  primary: {
    container: "bg-primary",
    text: "text-primary-foreground",
    spinner: "#060E1A",
  },
  secondary: {
    container: "bg-secondary",
    text: "text-secondary-foreground",
    spinner: "#BAE6FD",
  },
  error: {
    container: "bg-error",
    text: "text-white",
    spinner: "#fff",
  },
  success: {
    container: "bg-success",
    text: "text-primary-foreground",
    spinner: "#060E1A",
  },
  warning: {
    container: "bg-warning",
    text: "text-primary-foreground",
    spinner: "#060E1A",
  },
  outline: {
    container: "bg-transparent border border-border",
    text: "text-foreground",
    spinner: "#F0F9FF",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-foreground",
    spinner: "#F0F9FF",
  },
  link: {
    container: "bg-transparent",
    text: "text-primary",
    spinner: "#38BDF8",
  },
};

const SIZES = {
  sm: {
    height: "h-10",
    text: "text-sm",
    px: "px-4",
    rounded: "rounded-xl",
  },
  md: {
    height: "h-14",
    text: "text-base",
    px: "px-5",
    rounded: "rounded-2xl",
  },
  lg: {
    height: "h-16",
    text: "text-lg",
    px: "px-6",
    rounded: "rounded-2xl",
  },
};

export default function Button({
  children = "Button",
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  className = "",
  textClassName = "",
  ...props
}) {
  const config = VARIANTS[variant] || VARIANTS.primary;
  const sizeConfig = SIZES[size] || SIZES.md;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      className={`
        ${sizeConfig.height}
        ${sizeConfig.rounded}
        ${sizeConfig.px}
        ${config.container}
        ${fullWidth ? "w-full" : "self-start"}
        items-center justify-center flex-row
        ${isDisabled ? "opacity-60" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={config.spinner} />
      ) : (
        <View className="flex-row items-center gap-2">
          {leftIcon}
          <Text
            className={`
              ${sizeConfig.text}
              font-sans-bold
              tracking-[0.3px]
              ${config.text}
              ${textClassName}
            `}
          >
            {children}
          </Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
}
