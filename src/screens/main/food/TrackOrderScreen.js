// @/screens/main/food/TrackOrderScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import {
  setCurrentOrder,
  updateOrderStatus,
  setRider,
} from "@/features/food/foodOrderSlice";
import IconButton from "@/components/ui/IconButton";

const STEPS = ["confirmed", "preparing", "on_the_way", "delivered"];
const STEP_LABELS = {
  confirmed: "Confirmed",
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
};

const FALLBACK_FOOD = require("@assets/images/products/chicken-burger.jpg");

export default function TrackOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const warning = colors?.warning ?? "#FBBF24";

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
          items: [{ name: "Chicken Burger", price: 5.99, qty: 1, image: FALLBACK_FOOD }],
          address: "123 Main St, Natore",
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
        })
      );
    }
  }, [order, dispatch, route.params?.orderId]);

  useEffect(() => {
    const idx = STEPS.indexOf(status);
    if (idx >= 0) setStepIndex(idx);
  }, [status]);

  useEffect(() => {
    if (stepIndex >= 2) return;
    const t = setTimeout(() => {
      const next = STEPS[Math.min(stepIndex + 1, STEPS.length - 1)];
      dispatch(updateOrderStatus(next));
    }, 8000);
    return () => clearTimeout(t);
  }, [stepIndex, dispatch]);

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

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={{ height: 280, backgroundColor: isDark ? "#0D1E32" : "#E0F2FE" }}>
        <View className="flex-1 items-center justify-center">
          <Icon name="map" size={64} color={primary} style={{ opacity: 0.4 }} />
          <Text className="mt-2 text-xs font-inter text-foreground-muted">Live map</Text>
        </View>

        <View
          className="absolute left-4 right-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
          style={{ top: insets.top + 4 }}
        >
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
            <Icon name="motorbike" size={22} color={primary} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-inter-bold text-foreground">Arriving in {eta} min</Text>
            <Text className="text-xs font-inter text-foreground-muted">Your rider is on the way</Text>
          </View>
        </View>

        <IconButton
          variant='muted'
          icon="arrow-left" className='absolute left-4 z-10'
          style={{ top: insets.top + 72 }} onPress={() => navigation.navigate("FoodSearch")} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
        className="-mt-6 rounded-t-3xl bg-background"
      >
        <View className="mx-5 mt-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <Icon name="account" size={28} color={primary} />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-inter text-foreground-muted">Rider</Text>
            <Text className="text-[15px] font-inter-bold text-foreground">{displayRider.name}</Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <Icon name="star" size={12} color={warning} />
              <Text className="text-xs font-inter-medium text-foreground-secondary">
                {displayRider.rating} ({((displayRider.ratingCount || 0) / 1000).toFixed(1)}k+)
              </Text>
            </View>
          </View>

          <IconButton
            variant='ghost'
            icon="phone"
            onPress={() => displayRider.phone && Linking.openURL(`tel:${displayRider.phone}`)} />
          <IconButton
            variant='ghost'
            icon="message-text-outline" />
        </View>

        <View className="mx-5 mt-5 mb-2">
          <View className="mb-2 flex-row items-center justify-between px-1">
            {STEPS.map((step, i) => {
              const done = i <= stepIndex;
              const active = i === stepIndex;
              return (
                <View key={step} className="items-center" style={{ width: "22%" }}>
                  <View className={`h-7 w-7 items-center justify-center rounded-full ${done ? "bg-primary" : "border border-border bg-background-muted"}`}>
                    {done ? (
                      <Icon name="check" size={14} color={colors?.primaryForeground || "#fff"} />
                    ) : (
                      <Text className="text-[10px] font-inter-bold text-foreground-muted">{i + 1}</Text>
                    )}
                  </View>
                  <Text className={`mt-1.5 text-center text-[10px] font-inter-medium ${active ? "text-foreground" : "text-foreground-muted"}`} numberOfLines={1}>
                    {STEP_LABELS[step]}
                  </Text>
                </View>
              );
            })}
          </View>
          <View className="mx-3 h-1 overflow-hidden rounded-full bg-background-muted">
            <View className="h-full rounded-full bg-primary" style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }} />
          </View>
        </View>

        <View className="mx-5 mt-4 rounded-2xl border border-border bg-card p-3">
          {items.map((item, idx) => (
            <View key={idx} className={`flex-row items-center gap-3 ${idx > 0 ? "mt-3 border-t border-border pt-3" : ""}`}>
              <View className="h-14 w-14 overflow-hidden rounded-xl">
                <Image source={item.image || FALLBACK_FOOD} style={{ width: 56, height: 56 }} resizeMode="cover" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-inter-bold text-foreground">{item.name}</Text>
                <Text className="text-xs font-inter text-foreground-muted">
                  ${Number(item.price).toFixed(2)} · Qty: {item.qty}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}