// @/screens/main/parcel/ParcelSearchingScreen.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StatusBar, ActivityIndicator, Alert } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/marketplace/InfoCard";
import {
  selectActiveParcelId,
  selectParcelDraft,
  selectParcelEstimate,
  setTrackingStatus,
  resetParcelDelivery,
} from "@/features/parcel/parcelDeliverySlice";
import { useGetParcelDeliveryQuery, useCancelParcelDeliveryMutation } from "@/features/parcel/parcelDeliveryApi";
import { useSocket } from "@/services/SocketContext";

const NO_DRIVER_TIMEOUT_MS = 45000;

export default function ParcelSearchingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const parcelId = useSelector(selectActiveParcelId);
  const draft = useSelector(selectParcelDraft);
  const estimate = useSelector(selectParcelEstimate);
  const { socket } = useSocket() || {};
  const navigatedRef = useRef(false);
  const [driverReady, setDriverReady] = useState(false);
  const [noDriverFound, setNoDriverFound] = useState(false);

  const { data: parcel, isError, refetch } = useGetParcelDeliveryQuery(parcelId, {
    skip: !parcelId,
    pollingInterval: 2500,
    refetchOnMountOrArgChange: true,
  });
  const [cancelParcel, { isLoading: cancelling }] = useCancelParcelDeliveryMutation();

  const goToTracking = useCallback(
    (reason) => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      setDriverReady(true);
      console.log("[ParcelSearching] → Tracking:", reason);
      dispatch(setTrackingStatus("driver_assigned"));
      setTimeout(() => {
        try {
          navigation.replace("ParcelTracking");
        } catch {
          navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "ParcelTracking" }] }));
        }
      }, 50);
    },
    [dispatch, navigation]
  );

  useEffect(() => {
    if (parcel?.status === "driver_assigned" || parcel?.driver) {
      goToTracking(`poll status=${parcel.status}`);
    }
  }, [parcel, goToTracking]);

  useEffect(() => {
    if (!socket?.current || !parcelId) return;
    const handler = (payload) => {
      if (payload?.parcelId != null && String(payload.parcelId) !== String(parcelId)) return;
      if (payload?.status === "driver_assigned" || payload?.driver) {
        goToTracking(`socket status=${payload?.status}`);
      }
    };
    socket.current.on("parcel:delivery:driver_assigned", handler);
    socket.current.on("parcel:delivery:status", handler);
    return () => {
      socket.current?.off("parcel:delivery:driver_assigned", handler);
      socket.current?.off("parcel:delivery:status", handler);
    };
  }, [socket, parcelId, goToTracking]);

  // No-driver-found guard — the demo backend always assigns one, but a
  // real backend might not, and the spec explicitly asks this be handled.
  useEffect(() => {
    if (driverReady) return;
    const t = setTimeout(() => setNoDriverFound(true), NO_DRIVER_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [driverReady]);

  const handleCancel = () => {
    Alert.alert("Cancel delivery?", "Drivers will no longer see this request.", [
      { text: "Keep searching", style: "cancel" },
      {
        text: "Cancel delivery",
        style: "destructive",
        onPress: async () => {
          try {
            if (parcelId) await cancelParcel(parcelId).unwrap();
            dispatch(resetParcelDelivery());
            navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
          } catch {
            Alert.alert("Couldn't cancel", "Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Finding Driver" onBack={() => navigation.goBack()} />
      </View>

      <View className="flex-1 px-5">
        <View className="flex-1 items-center justify-center">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary/15">
            <Icon name="truck-fast-outline" size={40} color={colors?.primary ?? "#38BDF8"} />
          </View>
          {!driverReady && !noDriverFound && <ActivityIndicator size="large" color={colors?.primary || "#38BDF8"} />}

          {noDriverFound ? (
            <>
              <Text className="mt-4 text-center text-xl font-inter-bold text-foreground">No drivers found nearby</Text>
              <Text className="mt-2 text-center text-sm font-inter text-foreground-muted">
                Try again, or check back in a few minutes.
              </Text>
              <Button
                className="mt-5"
                onPress={() => {
                  setNoDriverFound(false);
                  refetch();
                }}
              >
                Try again
              </Button>
            </>
          ) : (
            <>
              <Text className="mt-4 text-center text-xl font-inter-bold text-foreground">
                {driverReady ? "Driver found!" : "Looking for a driver…"}
              </Text>
              <Text className="mt-2 text-center text-sm font-inter text-foreground-muted">
                {driverReady ? "Opening live tracking…" : "This usually takes 1–3 minutes."}
              </Text>
            </>
          )}
        </View>

        <View className="mb-3 gap-2">
          <InfoCard icon="map-marker-outline" label="Pickup" title={draft.pickupAddress?.address} />
          <InfoCard icon="home-map-marker" label="Destination" title={draft.deliveryAddress?.address} />
          {estimate && <InfoCard icon="cash" label="Estimated fare" title={`$${estimate.fare}`} />}
        </View>

        {isError && (
          <Button variant="ghost" onPress={() => refetch()} className="mb-2">
            Retry status
          </Button>
        )}

        <Button variant="outline" onPress={handleCancel} disabled={cancelling} loading={cancelling} fullWidth className="mb-8">
          Cancel Delivery
        </Button>
      </View>
    </View>
  );
}
