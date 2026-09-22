// @/screens/main/parcel/ParcelTrackingScreen.js
//
// Consolidates "Driver Assigned" → "Driver Arrived at Destination" into
// ONE screen, same as MarketplaceTrackingScreen.js does — a STEPS/TITLES
// map drives the UI off parcel.status instead of six near-duplicate
// screens. See architecture analysis for why this deviates from the
// original screen-by-screen brief.
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import {
  selectActiveParcelId,
  setTrackingStatus,
  selectParcelTrackingStatus,
  selectParcelDraft,
} from "@/features/parcel/parcelDeliverySlice";
import { useGetParcelDeliveryQuery, useVerifyParcelPickupMutation } from "@/features/parcel/parcelDeliveryApi";
import { useSocket } from "@/services/SocketContext";
import { DEFAULT_LOCATION } from "@/constants/defaultLocation";

const STEPS = [
  "driver_assigned",
  "driver_to_pickup",
  "arrived_pickup",
  "parcel_picked",
  "on_the_way",
  "near_destination",
  "arrived_destination",
  "delivered",
  "completed",
];

const TITLES = {
  driver_assigned: "Driver Assigned",
  driver_to_pickup: "Driver On the Way to Pickup",
  arrived_pickup: "Driver Has Arrived",
  parcel_picked: "Parcel Picked Up!",
  on_the_way: "On the Way to Destination",
  near_destination: "Almost There",
  arrived_destination: "Driver Arrived at Destination",
  delivered: "Delivered",
  completed: "Completed",
};

export default function ParcelTrackingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const parcelId = useSelector(selectActiveParcelId);
  const trackingStatus = useSelector(selectParcelTrackingStatus);
  const draft = useSelector(selectParcelDraft);
  const { socket, connected } = useSocket() || {};
  const mapRef = useRef(null);
  const completedNavRef = useRef(false);

  const {
    data: parcel,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetParcelDeliveryQuery(parcelId, {
    skip: !parcelId,
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });

  const [verifyPickup, { isLoading: verifying }] = useVerifyParcelPickupMutation();

  const status = parcel?.status || trackingStatus || "driver_assigned";
  const stepIndex = STEPS.indexOf(status);
  const driver = parcel?.driver;

  const pickupCoord = draft.pickupAddress?.latitude != null
    ? { latitude: draft.pickupAddress.latitude, longitude: draft.pickupAddress.longitude }
    : parcel?.pickupAddress?.latitude != null
      ? { latitude: parcel.pickupAddress.latitude, longitude: parcel.pickupAddress.longitude }
      : null;

  const deliveryCoord = draft.deliveryAddress?.latitude != null
    ? { latitude: draft.deliveryAddress.latitude, longitude: draft.deliveryAddress.longitude }
    : parcel?.deliveryAddress?.latitude != null
      ? { latitude: parcel.deliveryAddress.latitude, longitude: parcel.deliveryAddress.longitude }
      : null;

  useEffect(() => {
    if (!mapRef.current) return;
    const points = [pickupCoord, deliveryCoord].filter(Boolean);
    if (points.length >= 2) {
      mapRef.current.fitToCoordinates(points, { edgePadding: { top: 80, right: 40, bottom: 340, left: 40 }, animated: true });
    } else if (points.length === 1) {
      mapRef.current.animateToRegion({ ...points[0], latitudeDelta: 0.04, longitudeDelta: 0.04 }, 400);
    }
  }, [pickupCoord?.latitude, pickupCoord?.longitude, deliveryCoord?.latitude, deliveryCoord?.longitude]);

  useEffect(() => {
    if (parcel?.status) dispatch(setTrackingStatus(parcel.status));
  }, [parcel?.status, dispatch]);

  useEffect(() => {
    if (completedNavRef.current) return;
    if (status === "delivered" || status === "completed") {
      completedNavRef.current = true;
      setTimeout(() => {
        try {
          navigation.replace("ParcelDelivered");
        } catch {
          navigation.navigate("ParcelDelivered");
        }
      }, 50);
    }
  }, [status, navigation]);

  useEffect(() => {
    if (!socket?.current || !parcelId) return;
    const handler = (payload) => {
      if (payload?.parcelId != null && String(payload.parcelId) !== String(parcelId)) return;
      if (payload?.status) dispatch(setTrackingStatus(payload.status));
    };
    socket.current.on("parcel:delivery:status", handler);
    return () => socket.current?.off("parcel:delivery:status", handler);
  }, [socket, parcelId, dispatch]);

  const handleVerify = async () => {
    try {
      await verifyPickup({ id: parcelId }).unwrap();
      dispatch(setTrackingStatus("parcel_picked"));
    } catch {
      Alert.alert("Verification failed", "Please try again.");
    }
  };

  if (!parcelId) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-center text-foreground-muted">No active delivery found.</Text>
        <Button className="mt-4" onPress={() => navigation.navigate("ParcelDeliveryHome")}>
          Send a parcel
        </Button>
      </View>
    );
  }

  const primary = colors?.primary || "#38BDF8";
  const success = colors?.success || "#34D399";
  const title = TITLES[status] || "Delivery in progress";

  const initialRegion = pickupCoord
    ? { ...pickupCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : deliveryCoord
      ? { ...deliveryCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 }
      : { latitude: DEFAULT_LOCATION.latitude, longitude: DEFAULT_LOCATION.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <MapView ref={mapRef} provider={PROVIDER_GOOGLE} style={{ flex: 1 }} customMapStyle={isDark ? DARK_MAP_STYLE : undefined} showsUserLocation={false} initialRegion={initialRegion}>
        {pickupCoord && <Marker coordinate={pickupCoord} title="Pickup" description={draft.senderName || "Sender"} pinColor={primary} />}
        {deliveryCoord && <Marker coordinate={deliveryCoord} title="Delivery" description={draft.receiverName || "Receiver"} pinColor={success} />}
        {pickupCoord && deliveryCoord && <Polyline coordinates={[pickupCoord, deliveryCoord]} strokeColor={primary} strokeWidth={4} />}
      </MapView>

      <View className="absolute left-4" style={{ top: insets.top + 10 }}>
        <Button icon="arrow-left" variant="card" size="md" fullWidth={false} onPress={() => navigation.goBack()} />
      </View>

      <View className="absolute left-0 right-0 rounded-t-3xl border-t border-border bg-card" style={{ bottom: 0, maxHeight: "55%", paddingBottom: insets.bottom + 12 }}>
        <View className="h-1 w-10 self-center rounded-full bg-border mt-3 mb-2" />
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
          <Text className="text-lg font-inter-bold text-foreground mb-1">{title}</Text>
          <Text className="text-xs text-foreground-muted mb-3">
            {isFetching ? "Updating… " : ""}
            {connected ? "Live" : "Polling"} · {status}
          </Text>

          {isLoading && !parcel ? (
            <ActivityIndicator color={primary} className="my-6" />
          ) : (
            <>
              {driver && (
                <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-background-muted p-3">
                  <Avatar name={driver.name || "Driver"} size={48} />
                  <View className="flex-1">
                    <Text className="text-base font-inter-bold text-foreground">{driver.name || "Driver"}</Text>
                    {driver.rating ? (
                      <Text className="text-sm text-foreground-secondary">
                        ★ {driver.rating} ({driver.ratingCount ?? 0}) · {driver.vehicle}
                      </Text>
                    ) : driver.vehicle ? (
                      <Text className="text-sm text-foreground-secondary">{driver.vehicle}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-card border border-border">
                    <Icon name="phone" size={18} color={primary} />
                  </TouchableOpacity>
                </View>
              )}

              <View className="mb-3 flex-row flex-wrap gap-2">
                {STEPS.filter((s) => s !== "completed").map((step, idx) => {
                  const done = stepIndex >= 0 && idx <= stepIndex;
                  return (
                    <View key={step} className={`rounded-full px-2.5 py-1 ${done ? "bg-primary/20" : "bg-background-muted"}`}>
                      <Text className={`text-[10px] font-inter-medium ${done ? "text-primary" : "text-foreground-muted"}`}>{TITLES[step]}</Text>
                    </View>
                  );
                })}
              </View>

              {status === "arrived_pickup" && (
                <Button onPress={handleVerify} loading={verifying} disabled={verifying} fullWidth className="mb-2">
                  Hand Over Parcel
                </Button>
              )}

              {isError && (
                <TouchableOpacity onPress={() => refetch()}>
                  <Text className="text-center text-sm text-error">Connection problem · Retry</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
