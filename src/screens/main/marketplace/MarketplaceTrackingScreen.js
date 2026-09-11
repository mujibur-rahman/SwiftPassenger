import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import InfoCard from "@/components/marketplace/InfoCard";
import { DUMMY } from "@/components/marketplace/dummyAssets";
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
      setTimeout(() => {
        try {
          navigation.replace("MarketplaceCompleted");
        } catch {
          navigation.navigate("MarketplaceCompleted");
        }
      }, 50);
    }
  }, [status, navigation]);

  useEffect(() => {
    if (!socket?.current || !pickupId) return;
    const handler = (payload) => {
      if (payload?.pickupId != null && String(payload.pickupId) !== String(pickupId)) return;
      if (payload?.status) dispatch(setTrackingStatus(payload.status));
    };
    socket.current.on("marketplace:pickup:status", handler);
    return () => socket.current?.off("marketplace:pickup:status", handler);
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
          </View>
        ) : (
          <>
            {/* Map / status illustration */}
            <View className="mb-4 overflow-hidden rounded-2xl border border-border">
              <Image
                source={{
                  uri:
                    status === "arrived_seller" || status === "item_picked"
                      ? DUMMY.arrivedStore
                      : status === "arrived_customer" || status === "delivered"
                        ? DUMMY.deliveryHand
                        : DUMMY.mapRoute,
                }}
                style={{ width: "100%", height: 160 }}
                resizeMode="cover"
              />
            </View>

            {/* Hero for key states */}
            {(status === "item_picked" || status === "arrived_seller") && (
              <View className="mb-4 items-center rounded-2xl border border-border bg-card py-6">
                <View
                  className={`mb-2 h-14 w-14 items-center justify-center rounded-full ${
                    status === "item_picked" ? "bg-success/20" : "bg-primary/15"
                  }`}
                >
                  <Icon
                    name={status === "item_picked" ? "check-circle" : "map-marker-check"}
                    size={32}
                    color={
                      status === "item_picked"
                        ? colors?.success || "#34D399"
                        : colors?.primary
                    }
                  />
                </View>
                <Text className="text-lg font-inter-bold text-foreground">
                  {status === "item_picked" ? "Item Picked Up!" : "Driver has arrived"}
                </Text>
                <Text className="mt-1 px-4 text-center text-sm text-foreground-muted">
                  {status === "item_picked"
                    ? "Your driver collected the item from the seller."
                    : "They are at the pickup location."}
                </Text>
              </View>
            )}

            {/* Driver card */}
            {driver && (
              <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
                <Image
                  source={{ uri: DUMMY.driverAvatar }}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                />
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
                <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-background-muted">
                  <Icon name="phone" size={18} color={colors?.primary} />
                </TouchableOpacity>
                <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-background-muted">
                  <Icon name="message-text" size={18} color={colors?.primary} />
                </TouchableOpacity>
              </View>
            )}

            <InfoCard
              imageUri={DUMMY.sellerShop}
              label="Pickup"
              title={draft.sellerName || pickup?.sellerName}
              subtitle={draft.sellerAddress?.address}
              className="mb-3"
            />
            <InfoCard
              icon="map-marker"
              label="Delivery"
              title={draft.deliveryAddress?.address}
              className="mb-4"
            />

            {/* Progress */}
            <View className="mb-5 rounded-2xl border border-border bg-card p-4">
              <Text className="mb-3 text-xs font-inter-medium uppercase text-foreground-muted">
                Progress
              </Text>
              {STEPS.filter((s) => s !== "completed").map((step, idx) => {
                const done = stepIndex >= 0 && idx <= stepIndex;
                return (
                  <View key={step} className="mb-2.5 flex-row items-center gap-3">
                    <View className={`h-2.5 w-2.5 rounded-full ${done ? "bg-primary" : "bg-border"}`} />
                    <Text
                      className={`text-sm font-inter ${
                        done ? "font-inter-semibold text-foreground" : "text-foreground-muted"
                      }`}
                    >
                      {TITLES[step]}
                    </Text>
                  </View>
                );
              })}
            </View>

            {status === "arrived_seller" && (
              <View className="mb-4">
                <Text className="mb-3 text-center text-sm text-foreground-muted">
                  Confirm the item and order details with the seller.
                </Text>
                <Button onPress={handleVerify} loading={verifying} disabled={verifying} fullWidth>
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
              <TouchableOpacity onPress={() => refetch()} className="items-center">
                <Text className="text-sm text-error">Connection problem · Retry</Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-center text-xs text-foreground-muted">
                {isFetching ? "Updating… " : ""}
                {connected ? "Live" : "Polling"} · {status}
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
