// src/components/ui/Button.jsx
import React, { useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  Platform,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/theme";

/**
 * Reusable Button — all colors come from theme (colors.js / global.css).
 * Do not hardcode palette values here.
 *
 * Variants: primary | gradient | secondary | dark | error | success |
 *           warning | info | muted | outline | ghost | card | link
 * Props: pill, size, loading, disabled, fullWidth, leftIcon, rightIcon, className
 */

const SIZES = {
  xs: { height: 36, text: "text-xs", px: 14, iconBox: 32, icon: 16 },
  sm: { height: 44, text: "text-sm", px: 18, iconBox: 36, icon: 18 },
  md: { height: 54, text: "text-base", px: 22, iconBox: 44, icon: 22 },
  lg: { height: 60, text: "text-lg", px: 26, iconBox: 48, icon: 24 },
  link: { height: undefined, text: "text-sm", px: 0, iconBox: 32, icon: 18 },
};

export default function Button({
  children,
  onPress,
  variant = "primary",
  size = "md",
  pill = false,
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  iconSize,
  iconColor,
  spinnerColor,
  leftIcon,
  rightIcon,
  activeOpacity = 0.88,
  className = "",
  textClassName = "",
  style,
  ...props
}) {
  const { colors, isDark } = useTheme();

  const primaryHex = colors?.primary;
  const gradientColors =
    colors?.gradient ??
    [colors?.gradientFrom, colors?.gradientVia, colors?.gradientTo].filter(
      Boolean,
    );

  const variants = useMemo(() => {
    const foregroundHex = colors?.foreground;
    const mutedHex = colors?.foregroundMuted;
    const secondaryTextHex = colors?.secondaryForeground;
    const onPrimaryTextHex = colors?.primaryForeground;
    const borderHex = colors?.border;
    const secondaryBg = colors?.secondary;
    const cardBg = colors?.card;
    const mutedBg = colors?.backgroundMuted;
    const errorHex = colors?.error;
    const successHex = colors?.success;
    const warningHex = colors?.warning;
    const infoHex = colors?.info;

    return {
      primary: {
        bg: primaryHex,
        text: onPrimaryTextHex,
        spinner: onPrimaryTextHex,
        icon: onPrimaryTextHex,
        elevated: true,
        shadowColor: primaryHex,
        useGradient: false,
      },
      gradient: {
        bg: "transparent",
        text: "#FFFFFF",
        spinner: "#FFFFFF",
        icon: "#FFFFFF",
        elevated: true,
        shadowColor: colors?.gradientVia ?? primaryHex,
        useGradient: true,
      },
      secondary: {
        bg: secondaryBg,
        text: secondaryTextHex,
        spinner: secondaryTextHex,
        icon: secondaryTextHex,
        elevated: false,
        borderColor: borderHex,
        useGradient: false,
      },
      dark: {
        bg: isDark ? colors?.backgroundSecondary : colors?.foreground,
        text: isDark ? colors?.foreground : colors?.background,
        spinner: isDark ? colors?.foreground : colors?.background,
        icon: isDark ? colors?.foreground : colors?.background,
        elevated: false,
        borderColor: isDark ? borderHex : "transparent",
        useGradient: false,
      },
      error: {
        bg: errorHex,
        text: "#FFFFFF",
        spinner: "#FFFFFF",
        icon: "#FFFFFF",
        elevated: true,
        shadowColor: errorHex,
        useGradient: false,
      },
      success: {
        bg: successHex,
        text: isDark ? colors?.background : "#FFFFFF",
        spinner: isDark ? colors?.background : "#FFFFFF",
        icon: isDark ? colors?.background : "#FFFFFF",
        elevated: true,
        shadowColor: successHex,
        useGradient: false,
      },
      warning: {
        bg: warningHex,
        text: isDark ? colors?.background : "#FFFFFF",
        spinner: isDark ? colors?.background : "#FFFFFF",
        icon: isDark ? colors?.background : "#FFFFFF",
        elevated: false,
        useGradient: false,
      },
      info: {
        bg: infoHex,
        text: "#FFFFFF",
        spinner: "#FFFFFF",
        icon: "#FFFFFF",
        elevated: false,
        useGradient: false,
      },
      muted: {
        bg: mutedBg,
        text: foregroundHex,
        spinner: mutedHex,
        icon: mutedHex,
        elevated: false,
        useGradient: false,
      },
      outline: {
        bg: "transparent",
        text: foregroundHex,
        spinner: foregroundHex,
        icon: primaryHex,
        elevated: false,
        borderColor: borderHex,
        useGradient: false,
      },
      ghost: {
        bg: "transparent",
        text: foregroundHex,
        spinner: foregroundHex,
        icon: primaryHex,
        elevated: false,
        useGradient: false,
      },
      card: {
        bg: cardBg,
        text: foregroundHex,
        spinner: primaryHex,
        icon: primaryHex,
        elevated: false,
        borderColor: borderHex,
        useGradient: false,
      },
      link: {
        bg: "transparent",
        text: primaryHex,
        spinner: primaryHex,
        icon: primaryHex,
        elevated: false,
        useGradient: false,
      },
    };
  }, [colors, isDark, primaryHex]);

  const config = variants[variant] || variants.primary;
  const sizeConfig = SIZES[size] || SIZES.md;
  const isDisabled = disabled || loading;
  const isIconOnly = !!icon && children == null;
  const isLink = variant === "link" || size === "link";

  const borderRadius =
    pill || variant === "gradient" || variant === "dark"
      ? 999
      : size === "xs" || size === "sm"
        ? 12
        : 16;

  const isPlainText =
    typeof children === "string" ||
    typeof children === "number" ||
    (Array.isArray(children) &&
      children.every((c) => typeof c === "string" || typeof c === "number"));

  const renderIcon = (nameOrNode, fallbackSize) => {
    if (!nameOrNode) return null;
    if (typeof nameOrNode === "string") {
      return (
        <Icon
          name={nameOrNode}
          size={iconSize ?? fallbackSize}
          color={iconColor ?? config.icon}
        />
      );
    }
    return nameOrNode;
  };

  const elevationStyle =
    config.elevated && !isDisabled
      ? Platform.select({
        ios: {
          shadowColor: config.shadowColor || primaryHex,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: isDark ? 0.4 : 0.3,
          shadowRadius: 16,
        },
        android: { elevation: 8 },
      })
      : undefined;

  const content = loading ? (
    <ActivityIndicator color={spinnerColor ?? config.spinner} />
  ) : isIconOnly ? (
    renderIcon(icon, sizeConfig.icon)
  ) : (
    <View className="flex-row items-center gap-2">
      {renderIcon(leftIcon, sizeConfig.icon - 2)}
      {isPlainText ? (
        <Text
          className={`${sizeConfig.text} font-inter-bold tracking-[0.3px] ${textClassName}`}
          style={{ color: config.text }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
      {renderIcon(rightIcon, sizeConfig.icon - 2)}
    </View>
  );

  const baseSizeStyle = {
    height: isIconOnly ? sizeConfig.iconBox : sizeConfig.height,
    width: isIconOnly
      ? sizeConfig.iconBox
      : fullWidth && !isLink
        ? "100%"
        : undefined,
    paddingHorizontal: isIconOnly || isLink ? 0 : sizeConfig.px,
    borderRadius,
    alignItems: "center",
    justifyContent: "center",
    opacity: isDisabled ? 0.55 : 1,
    alignSelf:
      fullWidth && !isLink && !isIconOnly ? "stretch" : "flex-start",
    borderWidth: config.borderColor ? 1.5 : 0,
    borderColor: config.borderColor || "transparent",
    backgroundColor: config.useGradient ? "transparent" : config.bg,
    overflow: "hidden",
  };

  if (config.useGradient) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={activeOpacity}
        className={className}
        style={[elevationStyle, { borderRadius }, style]}
        {...props}
      >
        <LinearGradient
          colors={
            gradientColors.length >= 2
              ? gradientColors
              : [primaryHex, primaryHex]
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[baseSizeStyle, { backgroundColor: undefined }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
      className={className}
      style={[baseSizeStyle, elevationStyle, style]}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}

// Usage examples:
//
// Primary CTA:
// <Button onPress={handleSave}>Save Changes</Button>
//
// Muted Button:
// <Button variant="muted" size="sm" onPress={testModelDownload}>Test FL Download</Button>
//
// Info Button:
// <Button variant="info" size="sm" onPress={testInference}>Test Inference</Button>
//
// With left icon:
// <Button variant="secondary" leftIcon="share-variant-outline" onPress={onShare}>Share Trip</Button>
//
// Error / Cancel:
// <Button variant="error" onPress={handleCancel} loading={isCancelling}>Cancel</Button>
//
// Icon-only button:
// <Button icon="phone" variant="outline" size="sm" fullWidth={false} onPress={() => Linking.openURL(`tel:${phone}`)} />
