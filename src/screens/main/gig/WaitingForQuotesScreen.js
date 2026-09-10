// @/screens/main/gig/WaitingForQuotesScreen.js
import React, { useEffect } from "react";
import { View, Text, Image, StatusBar, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  receiveQuotes,
  setWaitingForQuotes,
  selectGig,
  selectGigJobId,
} from "@/features/gig/gigSlice";
import { useGetQuotesQuery } from "@/features/gig/gigApi";
import { useSocket } from "@/services/SocketContext"; // or relative path if needed

// Map server quote ids to local avatar assets (server doesn't send photos)
const PROVIDER_PHOTOS = {
  q1: require("@assets/images/gigs/lawn_mowing/providers/avatar-john.png"),
  q2: require("@assets/images/gigs/lawn_mowing/providers/avatar-mike.png"),
  q3: require("@assets/images/gigs/lawn_mowing/providers/avatar-greenleaf.png"),
};

function enrichQuotes(quotes = []) {
  return quotes.map((q) => ({
    ...q,
    providerPhoto: q.providerPhoto || PROVIDER_PHOTOS[q.id] || null,
  }));
}

export default function WaitingForQuotesScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const jobId = useSelector(selectGigJobId);
  const { socket } = useSocket() || {};

  // Real API polling (fallback + primary)
  const { data: apiQuotes, isFetching } = useGetQuotesQuery(jobId, {
    skip: !jobId,
    pollingInterval: 2500,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    dispatch(setWaitingForQuotes());
  }, [dispatch]);

  // When polling returns quotes
  useEffect(() => {
    if (apiQuotes && apiQuotes.length > 0 && gig.quotes.length === 0) {
      const enriched = enrichQuotes(apiQuotes);
      dispatch(receiveQuotes(enriched));
    }
  }, [apiQuotes, gig.quotes.length, dispatch]);

  // Socket real-time (preferred)
  useEffect(() => {
    if (!socket?.current || !jobId) return;

    const handler = (payload) => {
      if (payload?.jobId === jobId && payload?.quotes?.length > 0) {
        const enriched = enrichQuotes(payload.quotes);
        dispatch(receiveQuotes(enriched));
      }
    };

    socket.current.on("gig:quotes_ready", handler);
    return () => {
      socket.current?.off("gig:quotes_ready", handler);
    };
  }, [socket, jobId, dispatch]);

  // Navigate when we have quotes
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
        <Image
          source={require("@assets/images/gigs/lawn_mowing/status/waiting-quotes.png")}
          style={{ width: 180, height: 180, marginBottom: 12 }}
          resizeMode="contain"
        />
        <Text className="mb-2 text-center text-xl font-inter-bold text-foreground">
          Finding the right provider
        </Text>
        <Text className="mb-6 text-center text-sm font-inter text-foreground-muted">
          Your job is live. We're waiting for service providers to send you their quotes.
        </Text>

        <View className="rounded-2xl border border-border bg-card px-5 py-3 items-center">
          {isFetching || gig.quotes.length === 0 ? (
            <ActivityIndicator size="small" color="#7DD3FC" style={{ marginBottom: 8 }} />
          ) : null}
          <Text className="text-sm font-inter-semibold text-foreground">
            Quotes received: {gig.quotes.length}
          </Text>
        </View>
      </View>
    </View>
  );
}
