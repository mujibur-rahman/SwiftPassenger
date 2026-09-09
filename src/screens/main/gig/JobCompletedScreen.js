// @/screens/main/gig/JobCompletedScreen.js
import React from "react";
import { View, Text, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { selectGig, selectSelectedQuote } from "@/features/gig/gigSlice";
import { getGigService } from "@/config/gigJobs";

export default function JobCompletedScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);
  const service = getGigService(gig.serviceId);

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Icon name="check-decagram" size={72} color="#34D399" style={{ marginBottom: 20 }} />

      <Text className="mb-2 text-center text-2xl font-inter-bold text-foreground">
        Your {service?.title?.toLowerCase() || "job"} is complete
      </Text>
      <Text className="mb-6 text-center text-sm font-inter text-foreground-muted">
        Thanks for booking through SwiftPassenger.
      </Text>

      <View className="mb-8 w-full rounded-2xl border border-border bg-card p-4">
        <View className="flex-row items-center justify-between border-b border-border py-2.5">
          <Text className="text-xs font-inter-medium text-foreground-muted">Provider</Text>
          <Text className="text-sm font-inter-semibold text-foreground">
            {gig.booking?.provider || selectedQuote?.providerName}
          </Text>
        </View>
        <View className="flex-row items-center justify-between py-2.5">
          <Text className="text-xs font-inter-medium text-foreground-muted">Final Price</Text>
          <Text className="text-sm font-inter-semibold text-foreground">
            ${Number(gig.booking?.price ?? selectedQuote?.price ?? 0).toFixed(2)}
          </Text>
        </View>
      </View>

      <View className="w-full gap-3">
        <Button onPress={() => navigation.navigate("RateReview")}>Rate & Review</Button>
      </View>
    </View>
  );
}
