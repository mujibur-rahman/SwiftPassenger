// @/screens/main/gig/BookingScheduledScreen.js
import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar, Linking, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Badge from "@/components/ui/Badge";
import JobStatusStepper from "@/components/gig/JobStatusStepper";
import {
  selectGig,
  selectSelectedQuote,
  selectGigBookingId,
  updateBookingStatus,
  setBookingFromSocket,
} from "@/features/gig/gigSlice";
import { useGetGigBookingQuery } from "@/features/gig/gigApi";
import { useSocket } from "@/services/SocketContext";

const BOOKING_STEPS = ["confirmed", "on_the_way", "arrived", "started", "completed"];
const BOOKING_STEP_LABELS = {
  confirmed: "Confirmed",
  on_the_way: "On the way",
  arrived: "Arrived",
  started: "Started",
  completed: "Completed",
};

const FALLBACK_PHONE = "+8801700000000";

export default function BookingScheduledScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);
  const bookingId = useSelector(selectGigBookingId);
  const booking = gig.booking;
  const { socket, connected } = useSocket() || {};

  // Live booking status (same source as JobTracking)
  const { data: bookingFromApi } = useGetGigBookingQuery(bookingId, {
    skip: !bookingId,
    pollingInterval: connected ? 0 : 4000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (bookingFromApi?.status && bookingFromApi.status !== gig.bookingStatus) {
      dispatch(updateBookingStatus(bookingFromApi.status));
      if (bookingFromApi.id) {
        dispatch(setBookingFromSocket(bookingFromApi));
      }
    }
  }, [bookingFromApi, gig.bookingStatus, dispatch]);

  useEffect(() => {
    if (!socket?.current || !bookingId) return;

    const handler = (payload) => {
      if (payload?.bookingId == null) return;
      if (String(payload.bookingId) !== String(bookingId)) return;
      if (payload?.status) {
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

  // When completed, can jump to JobCompleted (optional — View Booking still works)
  useEffect(() => {
    if (gig.bookingStatus === "completed") {
      // Stay on this screen; user can open tracking or we auto-advance:
      // navigation.replace("JobCompleted");
    }
  }, [gig.bookingStatus]);

  const currentIndex = Math.max(0, BOOKING_STEPS.indexOf(gig.bookingStatus || "confirmed"));
  const statusLabel = BOOKING_STEP_LABELS[gig.bookingStatus] || "Confirmed";

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
          <Icon
            name="check-circle"
            size={64}
            color={colors?.success || "#34D399"}
          />
          <Text className="mt-2 text-xl font-inter-bold text-success">
            Booking confirmed
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <View className="flex-row items-center justify-between border-b border-border py-2.5">
            <Text className="text-xs font-inter-medium text-foreground-muted">Provider</Text>
            <Text className="text-sm font-inter-semibold text-foreground">
              {booking?.provider || selectedQuote?.providerName}
            </Text>
          </View>
          <View className="flex-row items-center justify-between border-b border-border py-2.5">
            <Text className="text-xs font-inter-medium text-foreground-muted">Date & Time</Text>
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
            <Text
              className="ml-3 flex-1 text-right text-sm font-inter-semibold text-foreground"
              numberOfLines={2}
            >
              {booking?.location || "—"}
            </Text>
          </View>
        </View>

        <Badge
          label={statusLabel}
          variant={gig.bookingStatus === "completed" ? "success" : "primary"}
          shape="pill"
          className="self-center"
        />

        {/* Live stepper — advances with socket / polling */}
        <JobStatusStepper
          steps={BOOKING_STEPS}
          labels={BOOKING_STEP_LABELS}
          currentIndex={currentIndex}
          className="mt-5"
        />

        <Text className="mt-2 text-center text-xs font-inter text-foreground-muted">
          {connected ? "Live updates on" : "Checking status…"} · {statusLabel}
        </Text>

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
