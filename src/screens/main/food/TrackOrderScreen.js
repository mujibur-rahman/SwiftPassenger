// @/screens/main/food/TrackOrderScreen.js
import React, { useEffect } from "react";
import { View, Text, Linking } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Avatar from "@/components/ui/Avatar";
import IconButton from "@/components/ui/IconButton";
import { DARK_MAP_STYLE } from "@/utils/mapStyles";
import { useGetActiveOrderQuery } from "@/features/food/foodApi";
import { setCurrentOrder, updateOrderStatus, setRider } from "@/features/food/foodOrderSlice";

const STEPS = ["confirmed", "preparing", "on_the_way", "delivered"];
const STEP_LABELS = { confirmed: "Confirmed", preparing: "Preparing", on_the_way: "On the way", delivered: "Delivered" };

const STATUS_MESSAGE = {
  confirmed: "Restaurant is reviewing your order",
  preparing: "Your food is being prepared",
  on_the_way: "Rider is on the way",
  delivered: "Order delivered!",
};

export default function TrackOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { currentOrder, orderStatus, rider } = useSelector((s) => s.foodOrder);

  const shouldPoll = ["confirmed", "preparing", "on_the_way"].includes(orderStatus);

  const { data } = useGetActiveOrderQuery(undefined, {
    pollingInterval: shouldPoll ? 2000 : 0,
    skip: !route.params?.orderId,
  });

  useEffect(() => {
    if (!data?.order) return;
    dispatch(setCurrentOrder(data.order));
    dispatch(updateOrderStatus(data.order.status));
    if (data.order.rider) dispatch(setRider(data.order.rider));
  }, [data, dispatch]);

  const currentStepIndex = STEPS.indexOf(orderStatus);
  const order = currentOrder || data?.order;

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Track Order" className="px-5 pb-3" />

      <View className="h-56 w-full">
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          customMapStyle={DARK_MAP_STYLE}
          initialRegion={{
            latitude: rider?.location?.latitude || 23.8103,
            longitude: rider?.location?.longitude || 90.4125,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {rider?.location && (
            <Marker coordinate={rider.location} title={rider.name}>
              <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Icon name="bike-fast" size={18} color="#060E1A" />
              </View>
            </Marker>
          )}
        </MapView>
      </View>

      <View className="px-5 pt-4">
        {rider && (
          <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <Icon name="clock-fast" size={20} color="#38BDF8" />
            <Text className="flex-1 font-inter-semibold text-foreground">
              Arriving in {rider.etaMinutes ?? 12} min
            </Text>
            <Text className="text-xs font-inter text-foreground-muted">
              {STATUS_MESSAGE[orderStatus]}
            </Text>
          </View>
        )}

        {rider && (
          <View className="mb-4 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <Avatar name={rider.name} size="md" />
            <View className="flex-1">
              <Text className="font-inter-bold text-foreground">{rider.name}</Text>
              <View className="mt-0.5 flex-row items-center gap-1">
                <Icon name="star" size={12} color="#FBBF24" />
                <Text className="text-xs font-inter-medium text-foreground-secondary">
                  {rider.rating} ({(rider.ratingCount / 1000).toFixed(1)}k+)
                </Text>
              </View>
            </View>
            <IconButton icon="phone" variant="outline" onPress={() => Linking.openURL(`tel:${rider.phone}`)} />
            <IconButton icon="message-text-outline" variant="outline" />
          </View>
        )}

        <View className="mb-4 flex-row items-center justify-between rounded-2xl border border-border bg-card p-4">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <View className="items-center" style={{ width: 64 }}>
                <Icon
                  name={i <= currentStepIndex ? "check-circle" : "circle-outline"}
                  size={20}
                  color={i <= currentStepIndex ? "#34D399" : "#7DD3FC"}
                />
                <Text
                  className={`mt-1 text-center text-[10px] font-inter-medium ${i <= currentStepIndex ? "text-foreground" : "text-foreground-muted"
                    }`}
                >
                  {STEP_LABELS[step]}
                </Text>
              </View>
              {i < STEPS.length - 1 && (
                <View
                  className="-mt-3.5 h-0.5 flex-1"
                  style={{ backgroundColor: i < currentStepIndex ? "#34D399" : "#1E3A5F" }}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {order?.items?.length > 0 && (
          <View className="rounded-2xl border border-border bg-card p-4">
            {order.items.map((item) => (
              <View key={`${item.menuItemId}-${item.note}`} className="mb-1 flex-row justify-between">
                <Text className="flex-1 font-inter-medium text-foreground" numberOfLines={1}>
                  {item.name}
                </Text>
                <Text className="font-inter text-foreground-muted">
                  ${item.price.toFixed(2)} · Qty: {item.qty}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
