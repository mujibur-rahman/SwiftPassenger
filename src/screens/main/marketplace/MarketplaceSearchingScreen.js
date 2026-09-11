// @/screens/main/marketplace/MarketplaceSearchingScreen.js
import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, StatusBar, ActivityIndicator, Alert } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  selectActivePickupId,
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

      // Defer navigation so it never runs mid-render / mid-socket-handler
      const timer = setTimeout(() => {
        try {
          // Preferred: replace Searching with Tracking
          navigation.replace("MarketplaceTracking");
        } catch (e1) {
          console.warn("[MarketplaceSearching] replace failed:", e1?.message || e1);
          try {
            navigation.navigate("MarketplaceTracking");
          } catch (e2) {
            console.warn("[MarketplaceSearching] navigate failed:", e2?.message || e2);
            // Last resort: reset stack to Tracking
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "MarketplaceTracking" }],
              })
            );
          }
        }
      }, 50);

      return () => clearTimeout(timer);
    },
    [dispatch, navigation]
  );

  // Polling
  useEffect(() => {
    if (!pickup) return;
    if (pickup.status === "driver_assigned" || pickup.driver) {
      goToTracking(`poll status=${pickup.status}`);
    }
  }, [pickup, goToTracking]);

  // Socket
  useEffect(() => {
    if (!socket?.current || !pickupId) return;

    const handler = (payload) => {
      console.log(
        "[MarketplaceSearching] socket event",
        payload?.status,
        payload?.pickupId
      );
      if (
        payload?.pickupId != null &&
        String(payload.pickupId) !== String(pickupId)
      ) {
        return;
      }
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

  const handleManualContinue = () => {
    navigatedRef.current = false; // allow retry
    goToTracking("manual button");
  };

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

      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-primary/15">
          <Icon
            name={driverReady ? "check-circle" : "car"}
            size={40}
            color={colors?.primary || "#38BDF8"}
          />
        </View>

        {!driverReady && (
          <ActivityIndicator size="large" color={colors?.primary || "#38BDF8"} />
        )}

        <Text className="mt-5 text-center text-xl font-inter-bold text-foreground">
          {driverReady ? "Driver found!" : "Looking for a driver…"}
        </Text>
        <Text className="mt-2 text-center text-sm font-inter text-foreground-muted">
          {driverReady
            ? "Opening live tracking…"
            : "This usually takes a few seconds in demo mode."}
          {"\n"}
          {connected ? "Live connection on" : "Using network polling"}
          {pickupId ? ` · #${pickupId}` : " · no id"}
        </Text>

        {/* Safety net — if auto-navigation fails, user can continue */}
        {driverReady && (
          <Button className="mt-6" onPress={handleManualContinue} fullWidth>
            Continue to tracking
          </Button>
        )}

        {isError && (
          <Button variant="ghost" className="mt-4" onPress={() => refetch()}>
            Retry status check
          </Button>
        )}

        {!pickupId && (
          <Text className="mt-4 text-center text-sm text-error">
            No pickup id found. Go back and confirm again.
          </Text>
        )}
      </View>

      <View className="px-5 pb-10">
        <Button
          variant="outline"
          onPress={handleCancel}
          disabled={cancelling}
          loading={cancelling}
          fullWidth
        >
          Cancel Request
        </Button>
      </View>
    </View>
  );
}
