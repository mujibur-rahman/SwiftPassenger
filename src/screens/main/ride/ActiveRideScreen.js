// @/screens/main/ride/ActiveRideScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import {
  updateRideStatus,
  setCurrentRide,
  setDriver,
  updateDriverLocation,
  resetRide,
} from "@/features/ride/rideSlice";
import {
  useCancelRideMutation,
  useGetActiveRideQuery,
} from "@/features/ride/rideApi";
import { DEFAULT_LOCATION, DEFAULT_REGION } from "@/constants/defaultLocation";

const STATUS_CONFIG = {
  searching: {
    label: "Finding your driver...",
    color: "#FBBF24",
  },
  accepted: {
    label: "Driver on the way",
    color: "#34D399",
  },
  pickup: {
    label: "Driver has arrived!",
    color: "#34D399",
  },
  ongoing: {
    label: "On your way",
    color: "#38BDF8",
  },
  completed: {
    label: "Arrived!",
    color: "#34D399",
  },
  cancelled: {
    label: "Ride cancelled",
    color: "#F87171",
  },
};

export default function ActiveRideScreen({ navigation }) {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { rideStatus, driver, driverLocation, currentRide } = useSelector(
    (s) => s.ride
  );
  const { pickup, destination } = useSelector((s) => s.location);

  const [cancelRide, { isLoading: isCancelling }] = useCancelRideMutation();

  // Poll while ride is active (not completed/cancelled)
  const shouldPoll = ["searching", "accepted", "pickup", "ongoing"].includes(
    rideStatus
  );

  const { data: activeData } = useGetActiveRideQuery(undefined, {
    pollingInterval: shouldPoll ? 2000 : 0,
    skip: !currentRide?.id,
  });

  // Sync server → Redux
  useEffect(() => {
    if (!activeData?.ride) return;

    dispatch(setCurrentRide(activeData.ride));
    dispatch(updateRideStatus(activeData.ride.status));

    if (activeData.driver || activeData.ride.driver) {
      const d = activeData.driver || activeData.ride.driver;
      dispatch(setDriver(d));
      if (d.location) {
        dispatch(updateDriverLocation(d.location));
      }
    }
  }, [activeData, dispatch]);

  // Trip finished → completed screen
  useEffect(() => {
    if (rideStatus === "completed") {
      navigation.replace("RideCompleted");
    }
  }, [rideStatus, navigation]);

  const mapRef = useRef(null);
  const cfg = STATUS_CONFIG[rideStatus] || STATUS_CONFIG.searching;

  const handleCancel = () => {
    Alert.alert("Cancel ride?", "Are you sure?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          try {
            const id = currentRide?.id;
            if (id) await cancelRide(id).unwrap();
            dispatch(resetRide());
            navigation.navigate("Tabs"); // or Home
          } catch (e) {
            Alert.alert("Error", e?.data?.message || "Could not cancel");
          }
        },
      },
    ]);
  };

  const callDriver = () => {
    if (driver?.phone) Linking.openURL(`tel:${driver.phone}`);
  };

  const origin = currentRide?.pickup || pickup;
  const dest = currentRide?.destination || destination;
  const driverCoord = driverLocation || driver?.location;

  return (
    <View className="flex-1 bg-background">
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={{
          latitude: origin?.latitude || DEFAULT_LOCATION.latitude,
          longitude: origin?.longitude || DEFAULT_LOCATION.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {origin && (
          <Marker coordinate={origin} title="Pickup" pinColor="#34D399" />
        )}
        {dest && (
          <Marker coordinate={dest} title="Destination" pinColor="#38BDF8" />
        )}
        {driverCoord && (
          <Marker coordinate={driverCoord} title={driver?.name || "Driver"}>
            <View className="h-10 w-10 rounded-full bg-primary items-center justify-center border-2 border-white">
              <Icon name="car" size={20} color="#060E1A" />
            </View>
          </Marker>
        )}
        {origin && dest && (
          <Polyline
            coordinates={[origin, dest]}
            strokeColor="#38BDF8"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Status card */}
      <View
        className="absolute left-0 right-0 bg-card border-t border-border rounded-t-3xl px-5 pt-3 pb-6"
        style={{ bottom: 0, paddingBottom: insets.bottom + 16 }}
      >
        <View className="h-1 w-10 self-center rounded-full bg-foreground-muted/40 mb-3" />

        <Text className="text-lg font-inter-bold text-foreground mb-1">
          {cfg.label}
        </Text>

        {rideStatus === "searching" && (
          <Text className="text-sm text-foreground-muted mb-4">
            Looking for nearby drivers…
          </Text>
        )}

        {driver && rideStatus !== "searching" && (
          <View className="flex-row items-center gap-3 mb-4 mt-2">
            <Avatar name={driver.name} size={48} />
            <View className="flex-1">
              <Text className="text-base font-inter-semibold text-foreground">
                {driver.name}
              </Text>
              <Text className="text-sm text-foreground-muted">
                {driver.vehicle?.model} · {driver.vehicle?.plate}
              </Text>
              <Text className="text-xs text-warning">
                ★ {driver.rating ?? "5.0"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={callDriver}
              className="h-11 w-11 rounded-full bg-success/20 items-center justify-center"
            >
              <Icon name="phone" size={22} color="#34D399" />
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-sm text-foreground-muted mb-3">
          Fare est. ${currentRide?.estimatedFare ?? "—"}
        </Text>

        {["searching", "accepted", "pickup"].includes(rideStatus) && (
          <Button
            title={isCancelling ? "Cancelling…" : "Cancel ride"}
            variant="outline"
            onPress={handleCancel}
            disabled={isCancelling}
          />
        )}
      </View>
    </View>
  );
}
