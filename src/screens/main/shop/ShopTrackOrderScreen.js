// @/screens/main/shop/ShopTrackOrderScreen.js
//
// This screen owns the "assigned → to_store → shopping → checkout" stretch
// only — no map here (that's ShopOnTheWayScreen, once status reaches
// "delivering"). What food/marketplace tracking screens never need: a
// per-item checklist AND a decision point (substitute approve/reject) that
// pauses the server's own progression until the customer responds.
import React, { useEffect } from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ShopStepper from "@/components/shop/ShopStepper";
import ShopErrorState from "@/components/shop/ShopErrorState";
import { useGetActiveShopOrderQuery, useRespondToSubstituteMutation } from "@/features/shop/shopApi";
import { hydrateShopOrder } from "@/features/shop/shopOrderSlice";

const ITEM_ICON = { pending: "timer-sand", found: "check-circle", substituted: "swap-horizontal-circle", skipped: "close-circle-outline" };

function itemBadge(status) {
  if (status === "found") return { label: "Found", variant: "success" };
  if (status === "substituted") return { label: "Substituted", variant: "info" };
  if (status === "skipped") return { label: "Refunded", variant: "muted" };
  return { label: "Searching…", variant: "warning" };
}

export default function ShopTrackOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const warning = colors?.warning ?? (isDark ? "#FBBF24" : "#D97706");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const { data, isLoading, isError, refetch } = useGetActiveShopOrderQuery(undefined, {
    pollingInterval: 2500,
  });
  const order = data?.order;
  const [respondToSubstitute, { isLoading: responding }] = useRespondToSubstituteMutation();

  useEffect(() => {
    if (order) dispatch(hydrateShopOrder(order));
  }, [order, dispatch]);

  // Once the shopper finishes checkout, this screen's job is done — hand
  // off to the interim purchased summary (image step 10). Track Order
  // never itself shows the delivery leg.
  useEffect(() => {
    if (order && ["purchased", "delivering", "delivered"].includes(order.status)) {
      navigation.replace("ShopPurchased", { orderId: order.id, orderNumber: order.orderNumber });
    }
  }, [order, navigation]);

  if (isError) {
    return (
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="px-5 pt-2">
          <ScreenHeader title="Track order" />
        </View>
        <ShopErrorState
          title="Couldn't load your order"
          message="Please check your connection and try again."
          onRetry={refetch}
          onGoBack={() => navigation.goBack()}
        />
      </View>
    );
  }

  if (isLoading || !order) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-inter text-foreground-muted">Loading your order…</Text>
      </View>
    );
  }

  const items = order.items || [];
  const foundCount = items.filter((i) => i.status !== "pending").length;
  const pct = items.length ? foundCount / items.length : 0;
  const pendingSubstitute = order.pendingSubstitute;

  const headerTitle = pendingSubstitute ? "Your approval is needed" : "Tracking your order";
  const headerSubtitle = pendingSubstitute
    ? "A substitute needs your approval before we continue."
    : order.status === "shopping"
      ? "Your shopper is finding your items."
      : "Your shopping request is on its way to being complete.";

  const respond = (approved) => {
    if (!pendingSubstitute || responding) return;
    respondToSubstitute({ orderId: order.id, itemId: pendingSubstitute.itemId, approved })
      .unwrap()
      .catch(() => {});
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title={headerTitle} onBack={() => navigation.goBack()} />
        <Text className="mb-3 text-xs font-inter text-foreground-muted">{headerSubtitle}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}>
        <View className="mb-5 rounded-2xl border border-border bg-card p-4">
          <ShopStepper status={order.status} />
        </View>

        <Text className="mb-1 text-[15px] font-inter-bold text-foreground">Shopping progress</Text>
        <Text className="mb-2 text-xs font-inter text-foreground-muted">
          {foundCount} of {items.length} items found
        </Text>
        <View className="mb-4 h-1.5 overflow-hidden rounded-full bg-background-muted">
          <View className="h-full rounded-full bg-primary" style={{ width: `${pct * 100}%` }} />
        </View>

        <View className="gap-2.5">
          {items.map((item) => {
            const badge = itemBadge(item.status);
            return (
              <View key={item.id} className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-background-muted">
                  <Icon name={ITEM_ICON[item.status] || "timer-sand"} size={18} color={item.status === "found" || item.status === "substituted" ? colors?.success ?? "#16A34A" : muted} />
                </View>
                <Text className="flex-1 text-[14px] font-inter-semibold text-foreground" numberOfLines={1}>
                  {item.substitutedWith?.name || item.name} × {item.qty}
                </Text>
                <Badge label={badge.label} variant={badge.variant} size="sm" />
              </View>
            );
          })}
        </View>

        {pendingSubstitute && (
          <View className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-4">
            <View className="mb-3 flex-row items-start gap-2">
              <Icon name="alert-outline" size={18} color={warning} style={{ marginTop: 1 }} />
              <View className="flex-1">
                <Text className="text-[13px] font-inter-bold text-foreground">Substitution needed</Text>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
                  Driver found a different brand of {pendingSubstitute.itemName} for ${Number(pendingSubstitute.suggestedPrice).toFixed(2)} (original ${Number(pendingSubstitute.originalPrice).toFixed(2)})
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Button size="sm" onPress={() => respond(true)} disabled={responding}>
                  Approve
                </Button>
              </View>
              <View className="flex-1">
                <Button size="sm" variant="outline" onPress={() => respond(false)} disabled={responding}>
                  Reject
                </Button>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
