// @/screens/main/gig/JobPostedScreen.js
import React from "react";
import { View, Text, Image, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { getGigService } from "@/config/gigJobs";
import { selectGig } from "@/features/gig/gigSlice";

function humanizeId(id = "") {
  const withSpaces = id.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

export default function JobPostedScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const gig = useSelector(selectGig);
  const service = getGigService(gig.serviceId);

  const detailLines = (service?.questions || [])
    .map((q) => {
      const option = q.options.find((o) => o.id === gig.answers[q.id]);
      return option?.label;
    })
    .filter(Boolean);

  return (
    <View
      className="flex-1 items-center justify-center bg-background px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <Image
        source={require("@assets/images/illustrations/order-success.png")}
        style={{ width: 220, height: 220, marginBottom: 24 }}
        resizeMode="contain"
      />

      <Text className="mb-2 text-center text-2xl font-inter-bold text-foreground">
        Your job is live!
      </Text>
      <Text className="mb-6 text-center text-[14px] font-inter text-foreground-muted">
        Your {service?.title?.toLowerCase()} job has been posted and is now available to suitable
        service providers.
      </Text>

      <View className="mb-8 w-full rounded-2xl border border-border bg-card p-4">
        <View className="mb-2 flex-row items-center gap-3">
          {service?.thumbnail ? (
            <Image
              source={service.thumbnail}
              style={{ width: 40, height: 40, borderRadius: 10 }}
              resizeMode="cover"
            />
          ) : null}
          <Text className="text-xs font-inter-semibold uppercase tracking-wide text-foreground-muted">
            Job Status: Posted
          </Text>
        </View>
        {detailLines.map((line) => (
          <Text key={line} className="text-sm font-inter text-foreground-secondary">
            {line}
          </Text>
        ))}
      </View>

      <View className="w-full gap-3">
        <Button onPress={() => navigation.navigate("WaitingForQuotes")}>View Job</Button>
      </View>
    </View>
  );
}
