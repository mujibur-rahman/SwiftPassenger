import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StatusBar, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/marketplace/InfoCard";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  selectActivePickupId,
  selectMarketplaceDraft,
  selectMarketplaceEstimate,
  setTrackingStatus,
  resetMarketplacePickup,
} from "@/features/marketplace/marketplacePickupSlice";
import {
  useGetMarketplacePickupQuery,
  useCancelMarketplacePickupMutation,
} from "@/features/marketplace/marketplacePickupApi";
import { useSocket } from "@/services/SocketContext";

export default function MarketplaceSearchingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const pickupId = useSelector(selectActivePickupId);
  const draft = useSelector(selectMarketplaceDraft);
  const estimate = useSelector(selectMarketplaceEstimate);
  const { socket, connected } = useSocket() || {};
  const navigatedRef = useRef(false);
  const [driverReady, setDriverReady] = useState(false);

  const { data: pickup, isError, refetch } = useGetMarketplacePickupQuery(pickupId, {
    skip: !pickupId,
    pollingInterval: 2500,
    refetchOnMountOrArgChange: true,
  });
  const [cancelPickup, { isLoading: cancelling }] = useCancelMarketplacePickupMutation();

  const goToTracking = useCallback(
    (reason) => {
      if (navigatedRef.current) return;
      navigatedRef.current = true;
      setDriverReady(true);
      console.log("[MarketplaceSearching] → Tracking:", reason);
      dispatch(setTrackingStatus("driver_assigned"));
      setTimeout(() => {
        try {
          navigation.replace("MarketplaceTracking");
        } catch {
          try {
            navigation.navigate("MarketplaceTracking");
          } catch {
            navigation.dispatch(
              CommonActions.reset({ index: 0, routes: [{ name: "MarketplaceTracking" }] })
            );
          }
        }
      }, 50);
    },
    [dispatch, navigation]
  );

  useEffect(() => {
    if (pickup?.status === "driver_assigned" || pickup?.driver) {
      goToTracking(`poll status=${pickup.status}`);
    }
  }, [pickup, goToTracking]);

  useEffect(() => {
    if (!socket?.current || !pickupId) return;
    const handler = (payload) => {
      if (payload?.pickupId != null && String(payload.pickupId) !== String(pickupId)) return;
      if (
        payload?.status === "driver_assigned" ||
        payload?.driver ||
        payload?.event === "driver_assigned"
      ) {
        goToTracking(`socket status=${payload?.status}`);
      }
    };
    socket.current.on("marketplace:pickup:driver_assigned", handler);
    socket.current.on("marketplace:pickup:status", handler);
    return () => {
      socket.current?.off("marketplace:pickup:driver_assigned", handler);
      socket.current?.off("marketplace:pickup:status", handler);
    };
  }, [socket, pickupId, goToTracking]);

  const handleCancel = () => {
    Alert.alert("Cancel request?", "Drivers will no longer see this pickup.", [
      { text: "Keep searching", style: "cancel" },
      {
        text: "Cancel request",
        style: "destructive",
        onPress: async () => {
          try {
            if (pickupId) await cancelPickup(pickupId).unwrap();
            dispatch(resetMarketplacePickup());
            navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
          } catch {
            Alert.alert("Couldn’t cancel", "Please try again.");
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
          <Image
            source={DUMMY.searchingCar}
            style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 16 }}
          />
          {!driverReady && (
            <ActivityIndicator size="large" color={colors?.primary || "#38BDF8"} />
          )}
          <Text className="mt-4 text-center text-xl font-inter-bold text-foreground">
            {driverReady ? "Driver found!" : "Looking for a driver…"}
          </Text>
          <Text className="mt-2 text-center text-sm font-inter text-foreground-muted">
            {driverReady
              ? "Opening live tracking…"
              : "This usually takes 1–3 minutes."}
          </Text>
          {driverReady && (
            <Button className="mt-5" onPress={() => { navigatedRef.current = false; goToTracking("manual"); }}>
              Continue to tracking
            </Button>
          )}
        </View>

        <View className="mb-3 gap-2">
          <InfoCard icon="store" label="Pickup" title={draft.sellerName} subtitle={draft.sellerAddress?.address} />
          <InfoCard icon="map-marker" label="Delivery" title={draft.deliveryAddress?.address} />
          {estimate && (
            <InfoCard icon="cash" label="Estimated fare" title={`৳${estimate.fare}`} />
          )}
        </View>

        {isError && (
          <Button variant="ghost" onPress={() => refetch()} className="mb-2">
            Retry status
          </Button>
        )}

        <Button
          variant="outline"
          onPress={handleCancel}
          disabled={cancelling}
          loading={cancelling}
          fullWidth
          className="mb-8"
        >
          Cancel Request
        </Button>
      </View>
    </View>
  );
}
