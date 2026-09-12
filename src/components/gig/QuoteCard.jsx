// @/components/gig/QuoteCard.jsx
import React from "react";
import { View, Text, Image } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { resolveProviderPhoto } from "@/utils/providerPhotos";

/**
 * Shows local/remote profile image when available; otherwise name initials via Avatar.
 *
 * photo: require() number | { uri } | string URL | null
 * name: provider display name (fallback)
 * id: optional quote/provider id for local asset lookup
 */
export function ProviderAvatar({ photo, name, id, size = 48 }) {
  const resolved =
    photo != null
      ? typeof photo === "string" && photo.startsWith("http")
        ? { uri: photo }
        : photo
      : resolveProviderPhoto({ id, providerName: name, name });

  if (resolved) {
    return (
      <Image
        source={resolved}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    );
  }

  // No image in assets / no photo → name initials (existing behaviour)
  return <Avatar name={name} size={size} />;
}

export default function QuoteCard({
  quote,
  onViewProfile,
  onViewQuote,
  className = "",
}) {
  const { colors, isDark } = useTheme();
  const warning = colors?.warning ?? "#FBBF24";
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  if (!quote) return null;
  const {
    id,
    providerName,
    providerPhoto,
    rating,
    reviews,
    price,
    availability,
    distance,
    message,
  } = quote;

  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className}`}>
      <View className="flex-row items-center gap-3">
        <ProviderAvatar
          photo={providerPhoto}
          name={providerName}
          id={id}
          size={48}
        />
        <View className="flex-1">
          <Text className="text-base font-inter-bold text-foreground" numberOfLines={1}>
            {providerName}
          </Text>
          <View className="mt-0.5 flex-row items-center gap-1">
            <Icon name="star" size={13} color={warning} />
            <Text className="text-xs font-inter-medium text-foreground-secondary">
              {rating} · {reviews} reviews
            </Text>
          </View>
        </View>
        <Text className="text-lg font-inter-bold text-primary">
          ${Number(price).toFixed(0)}
        </Text>
      </View>

      <View className="mt-3 flex-row items-center gap-3">
        {availability ? (
          <View className="flex-row items-center gap-1">
            <Icon name="clock-outline" size={13} color={primary} />
            <Text className="text-xs font-inter text-foreground-muted">{availability}</Text>
          </View>
        ) : null}
        {distance ? (
          <View className="flex-row items-center gap-1">
            <Icon name="map-marker-outline" size={13} color={primary} />
            <Text className="text-xs font-inter text-foreground-muted">{distance}</Text>
          </View>
        ) : null}
      </View>

      {message ? (
        <Text className="mt-3 text-sm font-inter text-foreground-secondary" numberOfLines={2}>
          {message}
        </Text>
      ) : null}

      <View className="mt-3 flex-row gap-2">
        {onViewProfile ? (
          <Button variant="outline" size="sm" className="flex-1" onPress={onViewProfile}>
            Profile
          </Button>
        ) : null}
        {onViewQuote ? (
          <Button size="sm" className="flex-1" onPress={onViewQuote}>
            Compare quote
          </Button>
        ) : null}
      </View>
    </View>
  );
}
