// @/screens/main/gig/JobTrackingScreen.js
import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import JobStatusStepper from "@/components/gig/JobStatusStepper";
import { ProviderAvatar } from "@/components/gig/QuoteCard";
import { selectGig, selectSelectedQuote, updateBookingStatus } from "@/features/gig/gigSlice";

const STEPS = ["confirmed", "on_the_way", "arrived", "started", "completed"];
const STEP_LABELS = {
  confirmed: "Confirmed",
  on_the_way: "On the way",
  arrived: "Arrived",
  started: "Started",
  completed: "Completed",
};

export default function JobTrackingScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);

  const currentIndex = Math.max(0, STEPS.indexOf(gig.bookingStatus));

  // Simulate the provider progressing through the job, same pattern as
  // TrackOrderScreen's setTimeout status-advance.
  useEffect(() => {
    if (currentIndex >= STEPS.length - 1) return;
    const timer = setTimeout(() => {
      dispatch(updateBookingStatus(STEPS[currentIndex + 1]));
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentIndex, dispatch]);

  useEffect(() => {
    if (gig.bookingStatus === "completed") {
      navigation.replace("JobCompleted");
    }
  }, [gig.bookingStatus, navigation]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Job In Progress" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View className="mb-6 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <ProviderAvatar
            photo={selectedQuote?.providerPhoto}
            name={gig.booking?.provider || selectedQuote?.providerName}
            size={48}
          />
          <View className="flex-1">
            <Text className="text-xs font-inter-medium text-foreground-muted">Provider</Text>
            <Text className="text-base font-inter-bold text-foreground">
              {gig.booking?.provider || selectedQuote?.providerName}
            </Text>
            {gig.booking?.location ? (
              <Text className="mt-0.5 text-xs font-inter text-foreground-muted" numberOfLines={1}>
                {gig.booking.location}
              </Text>
            ) : null}
          </View>
        </View>

        <JobStatusStepper steps={STEPS} labels={STEP_LABELS} currentIndex={currentIndex} className="mb-2" />

        <Text className="mt-4 text-center text-sm font-inter text-foreground-muted">
          {STEP_LABELS[STEPS[currentIndex]]} — we'll update this automatically as the job progresses.
        </Text>
      </ScrollView>
    </View>
  );
}
