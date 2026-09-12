// @/screens/main/marketplace/MarketplaceTrackingScreen.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
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
import { DEFAULT_LOCATION, DEFAULT_REGION } from "@/constants/defaultLocation";

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
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const pickupId = useSelector(selectActivePickupId);
  const trackingStatus = useSelector(selectMarketplaceTrackingStatus);
  const draft = useSelector(selectMarketplaceDraft);
  const { socket, connected } = useSocket() || {};
  const mapRef = useRef(null);
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
  const driver = pickup?.driver;

  const pickupCoord =
    draft.sellerAddress?.latitude != null
      ? {
        latitude: draft.sellerAddress.latitude,
        longitude: draft.sellerAddress.longitude,
      }
      : pickup?.sellerAddress?.latitude != null
        ? {
          latitude: pickup.sellerAddress.latitude,
          longitude: pickup.sellerAddress.longitude,
        }
        : null;

  const deliveryCoord =
    draft.deliveryAddress?.latitude != null
      ? {
        latitude: draft.deliveryAddress.latitude,
        longitude: draft.deliveryAddress.longitude,
      }
      : pickup?.deliveryAddress?.latitude != null
        ? {
          latitude: pickup.deliveryAddress.latitude,
          longitude: pickup.deliveryAddress.longitude,
        }
        : null;

  // Fit map when coords available
  useEffect(() => {
    if (!mapRef.current) return;
    const points = [pickupCoord, deliveryCoord].filter(Boolean);
    if (points.length >= 2) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 80, right: 40, bottom: 340, left: 40 },
        animated: true,
      });
    } else if (points.length === 1) {
      mapRef.current.animateToRegion(
        { ...points[0], latitudeDelta: 0.04, longitudeDelta: 0.04 },
        400
      );
    }
  }, [
    pickupCoord?.latitude,
    pickupCoord?.longitude,
    deliveryCoord?.latitude,
    deliveryCoord?.longitude,
  ]);

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
      if (
        payload?.pickupId != null &&
        String(payload.pickupId) !== String(pickupId)
      ) {
        return;
      }
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

  const primary = colors?.primary || "#38BDF8";
  const success = colors?.success || "#34D399";
  const title = TITLES[status] || "Pickup in progress";

  const initialRegion = pickupCoord
    ? { ...pickupCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 }
    : deliveryCoord
      ? { ...deliveryCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 }
      : {
        latitude: DEFAULT_LOCATION.latitude,
        longitude: DEFAULT_LOCATION.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
        showsUserLocation={false}
        initialRegion={initialRegion}
      >
        {pickupCoord && (
          <Marker
            coordinate={pickupCoord}
            title="Pickup"
            description={draft.sellerName || "Seller"}
            pinColor={primary}
          />
        )}
        {deliveryCoord && (
          <Marker
            coordinate={deliveryCoord}
            title="Delivery"
            description={draft.deliveryAddress?.address || "You"}
            pinColor={success}
          />
        )}
        {pickupCoord && deliveryCoord && (
          <Polyline
            coordinates={[pickupCoord, deliveryCoord]}
            strokeColor={primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Back */}
      <View className="absolute left-4" style={{ top: insets.top + 10 }}>
        <Button
          icon="arrow-left"
          variant="card"
          size="md"
          fullWidth={false}
          onPress={() => navigation.goBack()}
        />
      </View>

      {/* Bottom sheet */}
      <View
        className="absolute left-0 right-0 rounded-t-3xl border-t border-border bg-card"
        style={{ bottom: 0, maxHeight: "52%", paddingBottom: insets.bottom + 12 }}
      >
        <View className="h-1 w-10 self-center rounded-full bg-border mt-3 mb-2" />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-lg font-inter-bold text-foreground mb-1">{title}</Text>
          <Text className="text-xs text-foreground-muted mb-3">
            {isFetching ? "Updating… " : ""}
            {connected ? "Live" : "Polling"} · {status}
          </Text>

          {isLoading && !pickup ? (
            <ActivityIndicator color={primary} className="my-6" />
          ) : (
            <>
              {driver && (
                <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-background-muted p-3">
                  <Image
                    source={DUMMY.driverAvatar}
                    style={{ width: 48, height: 48, borderRadius: 24 }}
                  />
                  <View className="flex-1">
                    <Text className="text-base font-inter-bold text-foreground">
                      {driver.name || "Driver"}
                    </Text>
                    {driver.vehicle ? (
                      <Text className="text-sm text-foreground-secondary">{driver.vehicle}</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-card border border-border">
                    <Icon name="phone" size={18} color={primary} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Compact progress */}
              <View className="mb-3 flex-row flex-wrap gap-2">
                {STEPS.filter((s) => s !== "completed").map((step, idx) => {
                  const done = stepIndex >= 0 && idx <= stepIndex;
                  return (
                    <View
                      key={step}
                      className={`rounded-full px-2.5 py-1 ${done ? "bg-primary/20" : "bg-background-muted"
                        }`}
                    >
                      <Text
                        className={`text-[10px] font-inter-medium ${done ? "text-primary" : "text-foreground-muted"
                          }`}
                      >
                        {TITLES[step]}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {status === "arrived_seller" && (
                <Button
                  onPress={handleVerify}
                  loading={verifying}
                  disabled={verifying}
                  fullWidth
                  className="mb-2"
                >
                  Confirm Pickup
                </Button>
              )}

              {status === "arrived_customer" && (
                <Button
                  onPress={() => dispatch(setTrackingStatus("delivered"))}
                  fullWidth
                  className="mb-2"
                >
                  Confirm Received
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
