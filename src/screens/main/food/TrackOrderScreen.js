// @/screens/main/food/TrackOrderScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  Linking,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import IconButton from "@/components/ui/IconButton";
import Button from "@/components/ui/Button";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import {
  DEFAULT_LOCATION,
  offsetFromDefault,
} from "@/constants/defaultLocation";
import {
  setCurrentOrder,
  updateOrderStatus,
  setRider,
} from "@/features/food/foodOrderSlice";

const STEPS = ["confirmed", "preparing", "on_the_way", "delivered"];
const STEP_LABELS = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
};

const FALLBACK_FOOD = require("@assets/images/products/chicken-burger.jpg");

const RESTAURANT_COORD = offsetFromDefault(0.004, 0.003);
const DELIVERY_COORD = offsetFromDefault(-0.003, 0.004);
const RIDER_COORD = offsetFromDefault(0.001, 0.002);

export default function TrackOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const success = colors?.success ?? "#34D399";
  const warning = colors?.warning ?? "#FBBF24";
  const mapRef = useRef(null);

  const order = useSelector((s) => s.foodOrder?.currentOrder);
  const status = useSelector((s) => s.foodOrder?.orderStatus) || "confirmed";
  const rider = useSelector((s) => s.foodOrder?.rider);

  const [stepIndex, setStepIndex] = useState(Math.max(0, STEPS.indexOf(status)));

  useEffect(() => {
    if (!order) {
      dispatch(
        setCurrentOrder({
          id: route.params?.orderId || "ORD-DEMO",
          restaurantName: "Burger King",
          items: [
            {
              name: "Chicken Burger",
              price: 5.99,
              qty: 1,
              image: FALLBACK_FOOD,
            },
          ],
          address: DEFAULT_LOCATION.address,
          restaurantLocation: RESTAURANT_COORD,
          deliveryLocation: DELIVERY_COORD,
        })
      );
      dispatch(updateOrderStatus("preparing"));
      dispatch(
        setRider({
          name: "Rahim Ahmed",
          rating: 4.8,
          ratingCount: 1200,
          phone: "+8801700000000",
          etaMinutes: 12,
          location: RIDER_COORD,
        })
      );
    }
  }, [order, dispatch, route.params?.orderId]);

  useEffect(() => {
    const idx = STEPS.indexOf(status);
    if (idx >= 0) setStepIndex(idx);
  }, [status]);

  // Auto-advance through all steps including delivered
  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) return; // stop at delivered
    const t = setTimeout(() => {
      const next = STEPS[Math.min(stepIndex + 1, STEPS.length - 1)];
      dispatch(updateOrderStatus(next));
    }, 6000);
    return () => clearTimeout(t);
  }, [stepIndex, dispatch]);

  // Fit map
  useEffect(() => {
    if (!mapRef.current) return;
    const restaurant = order?.restaurantLocation || RESTAURANT_COORD;
    const delivery = order?.deliveryLocation || DELIVERY_COORD;
    const riderLoc = rider?.location || RIDER_COORD;
    const points = [restaurant, delivery];
    if (status === "on_the_way" || status === "delivered" || stepIndex >= 2) {
      points.push(riderLoc);
    }
    mapRef.current.fitToCoordinates(points, {
      edgePadding: { top: 80, right: 40, bottom: 40, left: 40 },
      animated: true,
    });
  }, [order, rider, status, stepIndex]);

  const eta = rider?.etaMinutes ?? 12;
  const displayRider = rider || {
    name: "Rahim Ahmed",
    rating: 4.8,
    ratingCount: 1200,
    phone: "+8801700000000",
  };

  const items = order?.items || [
    { name: "Chicken Burger", price: 5.99, qty: 1, image: FALLBACK_FOOD },
  ];

  const restaurantCoord = order?.restaurantLocation || RESTAURANT_COORD;
  const deliveryCoord = order?.deliveryLocation || DELIVERY_COORD;
  const riderCoord = rider?.location || RIDER_COORD;
  const isDelivered = status === "delivered" || stepIndex >= 3;

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />

      {/* Map */}
      <View style={{ height: 280 }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
          initialRegion={{
            ...restaurantCoord,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
        >
          <Marker
            coordinate={restaurantCoord}
            title={order?.restaurantName || "Restaurant"}
            pinColor={warning}
          />
          <Marker
            coordinate={deliveryCoord}
            title="Delivery"
            description={order?.address || DEFAULT_LOCATION.address}
            pinColor={success}
          />
          {(status === "on_the_way" || isDelivered) && (
            <Marker coordinate={riderCoord} title={displayRider.name || "Rider"}>
              <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary">
                <Icon
                  name="motorbike"
                  size={20}
                  color={colors?.primaryForeground || "#060E1A"}
                />
              </View>
            </Marker>
          )}
          <Polyline
            coordinates={[restaurantCoord, deliveryCoord]}
            strokeColor={primary}
            strokeWidth={4}
          />
        </MapView>

        <View
          className="absolute left-4 right-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card/50 p-3"
          style={{ top: insets.top + 4 }}
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
            <Icon
              name={isDelivered ? "check-circle" : "motorbike"}
              size={22}
              color={primary}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-inter-bold text-foreground">
              {isDelivered ? "Order delivered!" : `Arriving in ${eta} min`}
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">
              {isDelivered
                ? "Enjoy your meal"
                : "Your rider is on the way"}
            </Text>
          </View>
        </View>

        <IconButton
          variant="muted"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          className="absolute left-4"
          style={{ top: insets.top + 72 }}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="mx-5 mt-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/15">
            <Icon name="account" size={24} color={primary} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-inter-bold text-foreground">
              {displayRider.name}
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">
              ★ {displayRider.rating} ({displayRider.ratingCount})
            </Text>
          </View>
          <IconButton
            variant="ghost"
            icon="phone"
            onPress={() =>
              displayRider.phone && Linking.openURL(`tel:${displayRider.phone}`)
            }
          />
          <IconButton variant="ghost" icon="message-text-outline" />
        </View>

        <View className="mx-5 mt-5 mb-2">
          <View className="mb-2 flex-row items-center justify-between px-1">
            {STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <View key={step} className="items-center" style={{ width: "22%" }}>
                  <View
                    className={`h-7 w-7 items-center justify-center rounded-full ${done
                      ? "bg-primary"
                      : "border border-border bg-background-muted"
                      }`}
                  >
                    {done ? (
                      <Icon
                        name="check"
                        size={14}
                        color={colors?.primaryForeground || "#fff"}
                      />
                    ) : (
                      <Text className="text-[10px] font-inter-bold text-foreground-muted">
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  <Text
                    className={`mt-1.5 text-center text-[10px] font-inter-medium ${active ? "text-foreground" : "text-foreground-muted"
                      }`}
                    numberOfLines={1}
                  >
                    {STEP_LABELS[step]}
                  </Text>
                </View>
              );
            })}
          </View>
          <View className="mx-3 h-1 overflow-hidden rounded-full bg-background-muted">
            <View
              className="h-full rounded-full bg-primary"
              style={{
                width: `${(stepIndex / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </View>
        </View>

        <View className="mx-5 mt-4 rounded-2xl border border-border bg-card p-3">
          {items.map((item, idx) => (
            <View
              key={idx}
              className={`flex-row items-center gap-3 ${idx > 0 ? "mt-3 border-t border-border pt-3" : ""
                }`}
            >
              <View className="h-14 w-14 overflow-hidden rounded-xl">
                <Image
                  source={item.image || FALLBACK_FOOD}
                  style={{ width: 56, height: 56 }}
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-inter-bold text-foreground">
                  {item.name}
                </Text>
                <Text className="text-xs font-inter text-foreground-muted">
                  ${Number(item.price).toFixed(2)} · Qty: {item.qty}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Next actions */}
        <View className="mx-5 mt-5 gap-3">
          {!isDelivered && (
            <Button
              variant="outline"
              fullWidth
              onPress={() => dispatch(updateOrderStatus("delivered"))}
            >
              Mark as delivered (demo)
            </Button>
          )}
          {isDelivered && (
            <>
              <Button
                fullWidth
                onPress={() =>
                  navigation.navigate("RateFoodOrder", {
                    orderId: order?.id,
                    restaurantName: order?.restaurantName,
                  })
                }
              >
                Rate & Review
              </Button>
              <Button
                variant="outline"
                fullWidth
                onPress={() => navigation.navigate("FoodOrders")}
              >
                View my orders
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
