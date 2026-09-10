// @/screens/main/gig/JobTrackingScreen.js
import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import JobStatusStepper from "@/components/gig/JobStatusStepper";
import { ProviderAvatar } from "@/components/gig/QuoteCard";
import {
  selectGig,
  selectSelectedQuote,
  updateBookingStatus,
  setBookingFromSocket,
  selectGigBookingId,
} from "@/features/gig/gigSlice";
import { useGetGigBookingQuery } from "@/features/gig/gigApi";
import { useSocket } from "@/services/SocketContext";

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
  const bookingId = useSelector(selectGigBookingId);
  const { socket } = useSocket() || {};

  // Polling fallback
  const { data: bookingFromApi } = useGetGigBookingQuery(bookingId, {
    skip: !bookingId,
    pollingInterval: 4000,
    refetchOnMountOrArgChange: true,
  });

  // Sync from polling
  useEffect(() => {
    if (bookingFromApi?.status && bookingFromApi.status !== gig.bookingStatus) {
      dispatch(updateBookingStatus(bookingFromApi.status));
      if (bookingFromApi.id) {
        dispatch(setBookingFromSocket(bookingFromApi));
      }
    }
  }, [bookingFromApi, gig.bookingStatus, dispatch]);

  // Socket real-time
  useEffect(() => {
    if (!socket?.current || !bookingId) return;

    const handler = (payload) => {
      if (payload?.bookingId === bookingId && payload?.status) {
        dispatch(updateBookingStatus(payload.status));
        if (payload.booking) {
          dispatch(setBookingFromSocket(payload.booking));
        }
      }
    };

    socket.current.on("gig:booking_status", handler);
    return () => {
      socket.current?.off("gig:booking_status", handler);
    };
  }, [socket, bookingId, dispatch]);

  const currentIndex = Math.max(0, STEPS.indexOf(gig.bookingStatus));

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

        <View className="mt-4 items-center">
          {currentIndex < STEPS.length - 1 && (
            <ActivityIndicator size="small" color="#7DD3FC" style={{ marginBottom: 8 }} />
          )}
          <Text className="text-center text-sm font-inter text-foreground-muted">
            {STEP_LABELS[STEPS[currentIndex]]} — status updates automatically via live connection.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
