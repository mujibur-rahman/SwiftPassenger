// src/screens/main/ActiveRideScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Linking,
  Share,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import { updateRideStatus } from "@/features/ride/rideSlice";
import { useCancelRideMutation } from "@/features/ride/rideApi";

const STATUS_CONFIG = {
  searching: {
    label: "Finding your driver...",
    color: "#FBBF24",
    dot: "bg-warning",
  },
  accepted: { label: "Driver on the way", color: "#34D399", dot: "bg-success" },
  pickup: { label: "Driver has arrived!", color: "#34D399", dot: "bg-success" },
  ongoing: { label: "On your way", color: "#38BDF8", dot: "bg-primary" },
  completed: { label: "Arrived!", color: "#34D399", dot: "bg-success" },
  cancelled: { label: "Ride cancelled", color: "#F87171", dot: "bg-error" },
  no_drivers: { label: "No drivers nearby", color: "#F87171", dot: "bg-error" },
};

export default function ActiveRideScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { rideStatus, driver, driverLocation, currentRide, eta } = useSelector(
    (s) => s.ride,
  );
  const { pickup, destination } = useSelector((s) => s.location);
  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();

  const mapRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
    }).start();

    if (rideStatus === "searching") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [rideStatus]);

  useEffect(() => {
    if (rideStatus === "completed") {
      setTimeout(() => navigation.replace("RideCompleted"), 500);
    }
    if (rideStatus === "cancelled" || rideStatus === "no_drivers") {
      setTimeout(() => navigation.goBack(), 3000);
    }
  }, [rideStatus]);

  const config = STATUS_CONFIG[rideStatus] || STATUS_CONFIG.searching;

  const handleCancel = () => {
    Alert.alert("Cancel Ride", "Are you sure?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            if (currentRide?.id) {
              await cancelRide(currentRide.id).unwrap();
            }
            dispatch(updateRideStatus("cancelled"));
            // optional: clear after a short delay (your screen already navigates back)
            // dispatch(resetRide());
          } catch (err) {
            Alert.alert("Error", err?.data?.message || "Could not cancel ride");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation
        initialRegion={{
          latitude: pickup?.latitude || 37.7749,
          longitude: pickup?.longitude || -122.4194,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {pickup && (
          <Marker coordinate={pickup}>
            <View className="h-9 w-9 items-center justify-center rounded-full bg-success">
              <Icon name="map-marker" size={20} color="#060E1A" />
            </View>
          </Marker>
        )}
        {destination && (
          <Marker coordinate={destination}>
            <View className="h-8 w-8 items-center justify-center rounded-full bg-error">
              <Icon name="flag" size={16} color="#FFF" />
            </View>
          </Marker>
        )}
        {driverLocation && (
          <Marker coordinate={driverLocation}>
            <View className="rounded-full border-2 border-border bg-card p-1">
              <Text className="text-xl">🚗</Text>
            </View>
          </Marker>
        )}
        {driverLocation && pickup && (
          <Polyline
            coordinates={[driverLocation, pickup]}
            strokeColor="#38BDF8"
            strokeWidth={3}
            lineDashPattern={[8, 4]}
          />
        )}
      </MapView>

      {/* Status pill */}
      <View
        className="absolute left-0 right-0 flex-row items-center justify-center"
        style={{ top: insets.top + 8 }}
        pointerEvents="none"
      >
        <View className="flex-row items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2">
          <View className={`h-2 w-2 rounded-full ${config.dot}`} />
          <Text
            className="text-sm font-sans-semibold"
            style={{ color: config.color }}
          >
            {config.label}
          </Text>
        </View>
      </View>

      {/* Bottom panel */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 gap-3.5 rounded-t-3xl border border-border bg-card px-5 pt-5"
        style={{
          paddingBottom: Math.max(insets.bottom, 28),
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* ETA */}
        {(rideStatus === "accepted" || rideStatus === "pickup") && (
          <View className="flex-row items-center gap-2 rounded-xl bg-background-muted px-3 py-3">
            <Icon name="clock-outline" size={16} color="#7DD3FC" />
            <Text className="text-sm font-sans text-foreground-secondary">
              {rideStatus === "pickup"
                ? "Driver is here!"
                : `Arrives in ${eta || "5"} min`}
            </Text>
          </View>
        )}

        {/* Driver card */}
        {driver && (
          <View className="flex-row items-center gap-3 rounded-2xl bg-background-muted p-3.5">
            <Avatar name={driver.name || "D"} size={52} />
            <View className="flex-1">
              <Text className="text-base font-sans-semibold text-foreground">
                {driver.name}
              </Text>
              <Text className="mt-0.5 text-[13px] font-sans text-foreground-muted">
                ⭐ {driver.rating || "4.8"} · {driver.trips || "1,234"} trips
              </Text>
            </View>
            <View className="flex-row gap-2">
              <IconButton
                icon="phone"
                onPress={() => Linking.openURL(`tel:${driver.phone}`)}
              />
              <IconButton icon="message-outline" onPress={openChat} />
            </View>
          </View>
        )}

        <View className="flex-row gap-2.5">
          <View className="flex-1">
            <Button
              variant="secondary"
              leftIcon="share-variant-outline"
              onPress={() => Share.share({ message: "Track my ride!" })}
            >
              Share Trip
            </Button>
          </View>

          {(rideStatus === "searching" || rideStatus === "accepted") && (
            <View className="flex-1">
              <Button
                variant="error"
                onPress={handleCancel}
                loading={isCancelling}
              >
                Cancel
              </Button>
            </View>
          )}
        </View>

        {/* Searching */}
        {rideStatus === "searching" && (
          <Animated.View
            className="items-center rounded-xl bg-background-muted py-3.5"
            style={{ transform: [{ scale: pulseAnim }] }}
          >
            <Text className="text-sm font-sans text-foreground-muted">
              🔍 Searching for nearby drivers...
            </Text>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}
