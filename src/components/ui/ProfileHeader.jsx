// src/components/ui/ProfileHeader.jsx
import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Avatar from "./Avatar";

/**
 * Reusable Profile Header
 *
 * Props:
 * - name            string
 * - subtitle        string | ReactNode
 * - avatarSize      "sm" | "md" | "lg" | number   (default "lg")
 * - verified        boolean
 * - verifiedLabel   string
 * - onPress         () => void
 * - rightContent    ReactNode
 * - loading         boolean
 * - className       string
 */
export default function ProfileHeader({
  name = "User",
  subtitle,
  avatarSize = "lg",
  verified = false,
  verifiedLabel = "Verified",
  onPress,
  rightContent,
  loading = false,
  className = "",
}) {
  return (
    <View className={`flex-row items-center gap-4 ${className}`}>
      <Avatar
        name={name}
        size={avatarSize}
        onPress={onPress}
        loading={loading}
        className="border-0" // remove border if you prefer cleaner look
      />

      {/* Info */}
      <View className="flex-1">
        <Text
          className="text-lg font-sans-bold text-foreground"
          numberOfLines={1}
        >
          {name}
        </Text>

        {subtitle ? (
          typeof subtitle === "string" ? (
            <Text
              className="mt-0.5 text-sm font-sans text-foreground-muted"
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : (
            subtitle
          )
        ) : null}

        {verified && (
          <View className="mt-1.5 flex-row items-center gap-1 self-start rounded-full bg-success/15 px-2 py-0.5">
            <Icon name="check-decagram" size={12} color="#34D399" />
            <Text className="text-[11px] font-sans-semibold text-success">
              {verifiedLabel}
            </Text>
          </View>
        )}
      </View>

      {rightContent}
    </View>
  );
}
