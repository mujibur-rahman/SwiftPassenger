// @/screens/main/gig/WaitingForQuotesScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, StatusBar, ActivityIndicator } from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import {
  receiveQuotes,
  setWaitingForQuotes,
  selectGig,
  selectGigJobId,
} from "@/features/gig/gigSlice";
import { useGetQuotesQuery } from "@/features/gig/gigApi";
import { useSocket } from "@/services/SocketContext";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import { DEFAULT_LOCATION } from "@/constants/defaultLocation";

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
  const { isDark, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const jobId = useSelector(selectGigJobId);
  const currentLocation = useSelector((s) => s.location?.currentLocation);
  const { socket, connected } = useSocket() || {};
  const mapRef = useRef(null);

  const contact = gig.contact || gig.job?.contact;
  const jobCoord =
    contact?.latitude != null && contact?.longitude != null
      ? { latitude: contact.latitude, longitude: contact.longitude }
      : currentLocation?.latitude != null
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }
        : {
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
          };

  const primary = colors?.primary || "#38BDF8";

  const { data: apiQuotes, isFetching, isError, refetch } = useGetQuotesQuery(jobId, {
    skip: !jobId,
    pollingInterval: connected ? 0 : 3000,
    refetchOnMountOrArgChange: !connected,
  });

  useEffect(() => {
    dispatch(setWaitingForQuotes());
  }, [dispatch]);

  useEffect(() => {
    if (apiQuotes && apiQuotes.length > 0 && gig.quotes.length === 0) {
      dispatch(receiveQuotes(enrichQuotes(apiQuotes)));
    }
  }, [apiQuotes, gig.quotes.length, dispatch]);

  useEffect(() => {
    if (!socket?.current || !jobId) return;
    const handler = (payload) => {
      if (payload?.jobId === jobId && payload?.quotes?.length > 0) {
        dispatch(receiveQuotes(enrichQuotes(payload.quotes)));
      }
    };
    socket.current.on("gig:quotes_ready", handler);
    return () => socket.current?.off("gig:quotes_ready", handler);
  }, [socket, jobId, dispatch]);

  useEffect(() => {
    if (gig.quotes.length > 0) {
      navigation.replace("QuotesReceived");
    }
  }, [gig.quotes.length, navigation]);

  useEffect(() => {
    mapRef.current?.animateToRegion(
      { ...jobCoord, latitudeDelta: 0.04, longitudeDelta: 0.04 },
      400
    );
  }, [jobCoord.latitude, jobCoord.longitude]);

  const addressLabel =
    contact?.address ||
    [contact?.suburb, contact?.postcode].filter(Boolean).join(" ") ||
    DEFAULT_LOCATION.address;

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
          showsUserLocation
          showsMyLocationButton={false}
          initialRegion={{
            ...jobCoord,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        >
          <Marker
            coordinate={jobCoord}
            title="Job location"
            description={addressLabel}
            pinColor={primary}
          />
          <Circle
            center={jobCoord}
            radius={1200}
            strokeColor={primary}
            strokeWidth={1.5}
            fillColor={isDark ? "rgba(56,189,248,0.12)" : "rgba(14,165,233,0.12)"}
          />
        </MapView>

        <View className="absolute left-0 right-0 px-4" style={{ top: insets.top + 4 }}>
          <View className="rounded-2xl border border-border bg-card/95 px-2 py-1">
            <ScreenHeader title="Waiting for Quotes" onBack={() => navigation.goBack()} />
          </View>
        </View>

        <View
          className="absolute left-0 right-0 rounded-t-3xl border-t border-border bg-card px-5 pt-4"
          style={{ bottom: 0, paddingBottom: insets.bottom + 20 }}
        >
          <View className="mb-3 h-1 w-10 self-center rounded-full bg-border" />
          <View className="mb-3 flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <Icon name="account-search" size={24} color={primary} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-inter-bold text-foreground">
                Finding the right provider
              </Text>
              <Text className="mt-0.5 text-sm font-inter text-foreground-muted" numberOfLines={2}>
                Searching near {addressLabel}
              </Text>
            </View>
          </View>

          <Text className="mb-4 text-sm font-inter leading-5 text-foreground-secondary">
            Your job is live. Nearby service providers can send quotes — usually within minutes.
          </Text>

          <View className="items-center rounded-2xl border border-border bg-background-muted px-5 py-3">
            {(isFetching || gig.quotes.length === 0) && !isError ? (
              <ActivityIndicator size="small" color={primary} style={{ marginBottom: 8 }} />
            ) : null}
            {isError ? (
              <>
                <Text className="mb-2 text-center text-sm font-inter text-error">
                  Couldn't reach the server
                </Text>
                <Text className="text-sm font-inter-semibold text-primary" onPress={() => refetch()}>
                  Tap to retry
                </Text>
              </>
            ) : (
              <Text className="text-sm font-inter-semibold text-foreground">
                Quotes received: {gig.quotes.length}
                {connected ? " · Live" : ""}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
