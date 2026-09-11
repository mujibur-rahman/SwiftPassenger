// @/screens/main/marketplace/MarketplaceTrackingScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import InfoCard from "@/components/marketplace/InfoCard";
import {
  selectActivePickupId,
  setTrackingStatus,
  selectMarketplaceTrackingStatus,
  selectMarketplaceDraft,
} from "@/features/marketplace/marketplacePickupSlice";
import {
  useGetMarketplacePickupQuery,
  useVerifyMarketplacePickupMutation,
} from "@/features/marketplace/marketplacePickupApi";
import { useSocket } from "@/services/SocketContext";

const STEPS = [
  "driver_assigned",
  "driver_to_seller",
  "arrived_seller",
  "item_picked",
  "on_the_way",
  "arrived_customer",
  "delivered",
  "completed",
];

const TITLES = {
  driver_assigned: "Driver Assigned",
  driver_to_seller: "On the Way to Seller",
  arrived_seller: "Driver Arrived",
  item_picked: "Item Picked Up!",
  on_the_way: "On the Way to You",
  arrived_customer: "Arrived at Your Location",
  delivered: "Delivered",
  completed: "Completed",
  searching: "Finding a driver",
};

export default function MarketplaceTrackingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const pickupId = useSelector(selectActivePickupId);
  const trackingStatus = useSelector(selectMarketplaceTrackingStatus);
  const draft = useSelector(selectMarketplaceDraft);
  const { socket, connected } = useSocket() || {};
  const completedNavRef = useRef(false);

  // Always poll during tracking (socket can miss events)
  const {
    data: pickup,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMarketplacePickupQuery(pickupId, {
    skip: !pickupId,
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });

  const [verifyPickup, { isLoading: verifying }] = useVerifyMarketplacePickupMutation();

  const status = pickup?.status || trackingStatus || "driver_assigned";
  const stepIndex = STEPS.indexOf(status);

  useEffect(() => {
    if (pickup?.status) dispatch(setTrackingStatus(pickup.status));
  }, [pickup?.status, dispatch]);

  useEffect(() => {
    if (completedNavRef.current) return;
    if (status === "completed" || status === "delivered") {
      completedNavRef.current = true;
      const t = setTimeout(() => {
        try {
          navigation.replace("MarketplaceCompleted");
        } catch {
          navigation.navigate("MarketplaceCompleted");
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [status, navigation]);

  useEffect(() => {
    if (!socket?.current || !pickupId) return;
    const handler = (payload) => {
      if (
        payload?.pickupId != null &&
        String(payload.pickupId) !== String(pickupId)
      ) {
        return;
      }
      if (payload?.status) dispatch(setTrackingStatus(payload.status));
    };
    socket.current.on("marketplace:pickup:status", handler);
    socket.current.on("marketplace:pickup:driver_assigned", handler);
    return () => {
      socket.current?.off("marketplace:pickup:status", handler);
      socket.current?.off("marketplace:pickup:driver_assigned", handler);
    };
  }, [socket, pickupId, dispatch]);

  const handleVerify = async () => {
    try {
      await verifyPickup({ id: pickupId }).unwrap();
      dispatch(setTrackingStatus("item_picked"));
    } catch {
      Alert.alert("Verification failed", "Please try again.");
    }
  };

  if (!pickupId) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <Text className="text-center text-foreground-muted">No active pickup found.</Text>
        <Button className="mt-4" onPress={() => navigation.navigate("MarketplacePickup")}>
          Start a pickup
        </Button>
      </View>
    );
  }

  const driver = pickup?.driver;
  const title = TITLES[status] || "Pickup in progress";

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title={title} onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {isLoading && !pickup ? (
          <View className="items-center py-16">
            <ActivityIndicator size="large" color={colors?.primary} />
            <Text className="mt-3 text-sm text-foreground-muted">Loading pickup…</Text>
          </View>
        ) : (
          <>
            {(status === "item_picked" || status === "arrived_seller") && (
              <View className="mb-5 items-center rounded-3xl border border-border bg-card py-8">
                <View
                  className={`mb-3 h-16 w-16 items-center justify-center rounded-full ${
                    status === "item_picked" ? "bg-success/20" : "bg-primary/15"
                  }`}
                >
                  <Icon
                    name={status === "item_picked" ? "check-circle" : "map-marker-check"}
                    size={36}
                    color={
                      status === "item_picked"
                        ? colors?.success || "#34D399"
                        : colors?.primary || "#38BDF8"
                    }
                  />
                </View>
                <Text className="text-lg font-inter-bold text-foreground">
                  {status === "item_picked"
                    ? "Item Picked Up!"
                    : "Your driver has arrived"}
                </Text>
                <Text className="mt-1 px-6 text-center text-sm text-foreground-muted">
                  {status === "item_picked"
                    ? "Your driver has collected the item from the seller."
                    : "They are at the pickup location."}
                </Text>
              </View>
            )}

            {driver && (
              <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <Avatar name={driver.name || "Driver"} size="md" />
                <View className="flex-1">
                  <Text className="text-base font-inter-bold text-foreground">
                    {driver.name || "Driver"}
                  </Text>
                  {driver.vehicle ? (
                    <Text className="mt-0.5 text-sm text-foreground-secondary">
                      {driver.vehicle}
                    </Text>
                  ) : null}
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-background-muted">
                    <Icon name="phone" size={18} color={colors?.primary || "#38BDF8"} />
                  </TouchableOpacity>
                  <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-background-muted">
                    <Icon name="message-text" size={18} color={colors?.primary || "#38BDF8"} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <InfoCard
              icon="store"
              label="Pickup"
              title={draft.sellerName || pickup?.sellerName || "Seller"}
              subtitle={
                draft.sellerAddress?.address ||
                pickup?.sellerAddress?.address ||
                ""
              }
              className="mb-3"
            />
            <InfoCard
              icon="map-marker"
              label="Delivery"
              title={
                draft.deliveryAddress?.address ||
                pickup?.deliveryAddress?.address ||
                "—"
              }
              className="mb-5"
            />

            <View className="mb-5 rounded-2xl border border-border bg-card p-4">
              <Text className="mb-3 text-xs font-inter-medium uppercase text-foreground-muted">
                Progress
              </Text>
              {STEPS.filter((s) => s !== "completed").map((step, idx) => {
                const done = stepIndex >= 0 && idx <= stepIndex;
                return (
                  <View key={step} className="mb-2.5 flex-row items-center gap-3">
                    <View
                      className={`h-2.5 w-2.5 rounded-full ${
                        done ? "bg-primary" : "bg-border"
                      }`}
                    />
                    <Text
                      className={`text-sm font-inter ${
                        done
                          ? "font-inter-semibold text-foreground"
                          : "text-foreground-muted"
                      }`}
                    >
                      {TITLES[step] || step}
                    </Text>
                  </View>
                );
              })}
            </View>

            {status === "arrived_seller" && (
              <View className="mb-4">
                <Text className="mb-3 text-center text-sm text-foreground-muted">
                  Please confirm the item and order details with the seller.
                </Text>
                <Button
                  onPress={handleVerify}
                  loading={verifying}
                  disabled={verifying}
                  fullWidth
                >
                  Confirm Pickup
                </Button>
              </View>
            )}

            {status === "arrived_customer" && (
              <Button
                className="mb-4"
                onPress={() => dispatch(setTrackingStatus("delivered"))}
                fullWidth
              >
                Confirm Received
              </Button>
            )}

            {isError ? (
              <View className="items-center">
                <Text className="mb-2 text-sm text-error">Connection problem</Text>
                <TouchableOpacity onPress={() => refetch()}>
                  <Text className="text-sm font-inter-semibold text-primary">Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text className="text-center text-xs text-foreground-muted">
                {isFetching ? "Updating… " : ""}
                {connected ? "Live updates on" : "Checking for updates…"}
                {" · "}
                {status}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
