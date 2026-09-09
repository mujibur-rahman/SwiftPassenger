// @/screens/main/gig/WaitingForQuotesScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { receiveQuotes, setWaitingForQuotes, selectGig } from "@/features/gig/gigSlice";

// Demo/mock quotes — same role as TrackOrderScreen's setTimeout status-advance:
// stands in until /gig/jobs/:id/quotes is live (see gigApi.getQuotes).
const MOCK_QUOTES = [
  {
    id: "q1",
    providerName: "John's Gardening",
    providerPhoto: null,
    rating: 4.9,
    reviews: 127,
    price: 55,
    availability: "Available today · 2:00 PM",
    distance: "1.2 km away",
    message: "Happy to help, I mow this street every week!",
    services: ["Lawn mowing", "Edging", "Garden clean-up"],
  },
  {
    id: "q2",
    providerName: "GreenCut Services",
    providerPhoto: null,
    rating: 4.7,
    reviews: 84,
    price: 48,
    availability: "Available tomorrow · 9:00 AM",
    distance: "2.8 km away",
    message: "Can do a same-week booking, fully insured.",
    services: ["Lawn mowing", "Hedge trimming"],
  },
  {
    id: "q3",
    providerName: "Sarah M. Lawn Care",
    providerPhoto: null,
    rating: 5.0,
    reviews: 46,
    price: 62,
    availability: "Available today · 4:30 PM",
    distance: "0.6 km away",
    message: "Quick turnaround, clippings taken away included.",
    services: ["Lawn mowing", "Clippings removal", "Weeding"],
  },
];

export default function WaitingForQuotesScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);

  useEffect(() => {
    dispatch(setWaitingForQuotes());
  }, [dispatch]);

  useEffect(() => {
    if (gig.quotes.length > 0) return;
    const timer = setTimeout(() => {
      dispatch(receiveQuotes(MOCK_QUOTES));
    }, 4000 + Math.random() * 2000); // staggered ~4-6s, mirrors TrackOrderScreen's demo delay
    return () => clearTimeout(timer);
  }, [gig.quotes.length, dispatch]);

  useEffect(() => {
    if (gig.quotes.length > 0) {
      navigation.replace("QuotesReceived");
    }
  }, [gig.quotes.length, navigation]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Waiting for Quotes" onBack={() => navigation.goBack()} />
      </View>

      <View className="flex-1 items-center justify-center px-8">
        <ActivityIndicator size="large" color={primary} style={{ marginBottom: 20 }} />
        <Text className="mb-2 text-center text-xl font-inter-bold text-foreground">
          Finding the right provider
        </Text>
        <Text className="mb-6 text-center text-sm font-inter text-foreground-muted">
          Your job is live. We're waiting for service providers to send you their quotes.
        </Text>

        <View className="rounded-2xl border border-border bg-card px-5 py-3">
          <Text className="text-sm font-inter-semibold text-foreground">
            Quotes received: {gig.quotes.length}
          </Text>
        </View>
      </View>
    </View>
  );
}
