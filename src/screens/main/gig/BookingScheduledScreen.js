// @/screens/main/gig/BookingScheduledScreen.js
import React from "react";
import { View, Text, ScrollView, StatusBar, Linking, Alert } from "react-native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Badge from "@/components/ui/Badge";
import { selectGig, selectSelectedQuote } from "@/features/gig/gigSlice";

// Quotes don't carry a phone number yet — same demo-fallback pattern as
// TrackOrderScreen's default rider phone until the provider API is wired up.
const FALLBACK_PHONE = "+8801700000000";

export default function BookingScheduledScreen({ navigation }) {
  const { isDark } = useTheme();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);
  const booking = gig.booking;

  const scheduledLabel = booking?.scheduledAt
    ? new Date(booking.scheduledAt).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Booking Scheduled" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View className="mb-4 items-center">
          <Icon name="check-circle" size={48} color="#34D399" />
          <Text className="mt-2 text-xl font-inter-bold text-foreground">Booking confirmed</Text>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <View className="flex-row items-center justify-between border-b border-border py-2.5">
            <Text className="text-xs font-inter-medium text-foreground-muted">Provider</Text>
            <Text className="text-sm font-inter-semibold text-foreground">
              {booking?.provider || selectedQuote?.providerName}
            </Text>
          </View>
          <View className="flex-row items-center justify-between border-b border-border py-2.5">
            <Text className="text-xs font-inter-medium text-foreground-muted">Date &amp; Time</Text>
            <Text className="text-sm font-inter-semibold text-foreground">{scheduledLabel}</Text>
          </View>
          <View className="flex-row items-center justify-between border-b border-border py-2.5">
            <Text className="text-xs font-inter-medium text-foreground-muted">Price</Text>
            <Text className="text-sm font-inter-semibold text-foreground">
              ${Number(booking?.price ?? selectedQuote?.price ?? 0).toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between py-2.5">
            <Text className="text-xs font-inter-medium text-foreground-muted">Location</Text>
            <Text className="ml-3 flex-1 text-right text-sm font-inter-semibold text-foreground" numberOfLines={2}>
              {booking?.location || "—"}
            </Text>
          </View>
        </View>

        <Badge label="Booking Confirmed" variant="success" shape="pill" className="self-center" />

        <View className="mt-6 flex-row justify-center gap-4">
          <IconButton
            variant="muted"
            icon="message-text-outline"
            onPress={() => Alert.alert("Coming soon", "In-app messaging is coming soon")}
          />
          <IconButton
            variant="muted"
            icon="phone"
            onPress={() => Linking.openURL(`tel:${FALLBACK_PHONE}`)}
          />
        </View>
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={() => navigation.navigate("JobTracking")}>View Booking</Button>
      </View>
    </View>
  );
}
