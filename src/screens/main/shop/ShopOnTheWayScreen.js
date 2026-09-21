// @/screens/main/shop/ShopOnTheWayScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, StatusBar, Linking } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import IconButton from "@/components/ui/IconButton";
import Badge from "@/components/ui/Badge";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import { offsetFromDefault } from "@/constants/defaultLocation";
import { useGetActiveShopOrderQuery } from "@/features/shop/shopApi";
import { hydrateShopOrder } from "@/features/shop/shopOrderSlice";

const STORE_COORD = offsetFromDefault(0.004, 0.003);
const DELIVERY_COORD = offsetFromDefault(-0.003, 0.004);
const SHOPPER_COORD = offsetFromDefault(0.001, 0.0015);

export default function ShopOnTheWayScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const success = colors?.success ?? (isDark ? "#34D399" : "#16A34A");
  const mapRef = useRef(null);

  const { data } = useGetActiveShopOrderQuery(undefined, { pollingInterval: 3000 });
  const order = data?.order;

  useEffect(() => {
    if (order) dispatch(hydrateShopOrder(order));
  }, [order, dispatch]);

  useEffect(() => {
    if (order?.status === "delivered") {
      navigation.replace("ShopDelivered", { orderId: order.id, orderNumber: order.orderNumber });
    }
  }, [order, navigation]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.fitToCoordinates([STORE_COORD, DELIVERY_COORD, SHOPPER_COORD], {
      edgePadding: { top: 80, right: 50, bottom: 260, left: 50 },
      animated: true,
    });
  }, []);

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-inter text-foreground-muted">Loading…</Text>
      </View>
    );
  }

  const shopper = order.shopper;
  const eta = order.eta;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

      <View style={{ height: "58%" }}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          customMapStyle={isDark ? DARK_MAP_STYLE : undefined}
          initialRegion={{ ...SHOPPER_COORD, latitudeDelta: 0.03, longitudeDelta: 0.03 }}
        >
          <Marker coordinate={STORE_COORD} title={order.storeName}>
            <View className="h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-success">
              <Icon name="storefront" size={16} color="#fff" />
            </View>
          </Marker>
          <Marker coordinate={DELIVERY_COORD} title="You">
            <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-foreground">
              <Icon name="home" size={17} color={colors?.background ?? "#fff"} />
            </View>
          </Marker>
          <Marker coordinate={SHOPPER_COORD} title={shopper?.name || "Driver"}>
            <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-primary">
              <Icon name="car" size={19} color={colors?.primaryForeground ?? "#060E1A"} />
            </View>
          </Marker>
          <Polyline coordinates={[SHOPPER_COORD, DELIVERY_COORD]} strokeColor={primary} strokeWidth={4} />
        </MapView>

        <IconButton
          variant="muted"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          className="absolute left-4"
          style={{ top: insets.top + 8 }}
        />
      </View>

      <View className="flex-1 px-5 pt-5">
        <Text className="mb-1.5 text-xl font-inter-bold text-foreground">On the way to you</Text>
        <View className="mb-3 flex-row">
          <Badge label="Shopping completed" variant="success" icon="check" />
        </View>
        <Text className="mb-4 text-[13px] font-inter text-foreground-muted">Your items are on the way.</Text>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <Text className="text-[11px] font-inter-semibold uppercase tracking-wider text-foreground-muted">ETA</Text>
          <Text className="mt-1 text-2xl font-inter-bold text-foreground">{eta?.minutes ?? 12} min</Text>
          {eta?.distanceKm != null && (
            <Text className="mt-0.5 text-xs font-inter text-foreground-muted">({eta.distanceKm} km)</Text>
          )}
        </View>

        {shopper && (
          <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
              <Icon name="account" size={22} color={primary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-bold text-foreground">{shopper.name}</Text>
              <Text className="text-xs font-inter text-foreground-muted">
                ★ {shopper.rating} ({shopper.ratingCount}) · {shopper.vehicle}
              </Text>
            </View>
            <IconButton variant="ghost" icon="phone" onPress={() => shopper.phone && Linking.openURL(`tel:${shopper.phone}`)} />
            <IconButton variant="ghost" icon="message-text-outline" />
          </View>
        )}
      </View>
    </View>
  );
}
