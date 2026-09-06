// @/screens/main/food/ReviewOrderScreen.js
import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ListRow from "@/components/ui/ListRow";
import Button from "@/components/ui/Button";
import { usePlaceOrderMutation } from "@/features/food/foodApi";
import { selectCart, makeSelectTotals, clearCart } from "@/features/food/cartSlice";
import { setCurrentOrder, updateOrderStatus } from "@/features/food/foodOrderSlice";

const selectTotals = makeSelectTotals();

export default function ReviewOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const totals = useSelector(selectTotals);
  const { paymentMethod } = route.params;

  const [placeOrder, { isLoading }] = usePlaceOrderMutation();

  const submitOrder = async () => {
    try {
      const order = await placeOrder({
        restaurantId: cart.restaurantId,
        restaurantName: cart.restaurantName,
        items: cart.items,
        offerCode: cart.offer?.code,
        deliveryOptionId: cart.deliveryOptionId,
        deliveryAddress: "123 Main St, Natore",
        paymentMethod: paymentMethod?.label,
        subtotal: totals.subtotal,
        deliveryFee: totals.deliveryFee,
        serviceFee: totals.serviceFee,
        discount: totals.discount,
        total: totals.total,
      }).unwrap();

      dispatch(setCurrentOrder(order));
      dispatch(updateOrderStatus(order.status));
      dispatch(clearCart());

      navigation.replace("OrderPlaced", { orderId: order.id });
    } catch (e) {
      console.log("Place order failed:", JSON.stringify(e, null, 2));
      const message =
        e?.data?.message ||
        (e?.status === "FETCH_ERROR"
          ? "Can't reach the server. Check the BASE_URL in apiSlice.js and that auth-server.js is running with the /food routes."
          : e?.status
          ? `Server responded with ${e.status}.`
          : "Something went wrong placing your order. Please try again.");
      Alert.alert("Order failed", message);
    }
  };

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Review & Pay" className="pb-3" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <ListRow
          icon="map-marker-outline"
          label="Delivery to"
          subtitle="123 Main St, Natore"
          showChevron={false}
          className="mb-3"
        />

        <ListRow
          icon="credit-card-outline"
          label="Payment Method"
          subtitle={paymentMethod?.label}
          onPress={() => navigation.goBack()}
          className="mb-3"
        />

        <View className="mb-3 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-3 text-sm font-inter-semibold text-foreground-secondary">
            Order Summary
          </Text>
          {cart.items.map((item) => (
            <View key={`${item.menuItemId}-${item.note}`} className="mb-2 flex-row items-center justify-between">
              <Text className="flex-1 font-inter-medium text-foreground" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="mx-3 font-inter text-foreground-muted">Qty: {item.qty}</Text>
              <Text className="font-inter-bold text-foreground">${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}

          {cart.offer && (
            <View className="mt-2 flex-row items-center justify-between border-t border-border pt-2">
              <Text className="font-inter text-foreground-muted">
                Apply offer{"\n"}{cart.offer.code}
              </Text>
              <Text className="font-inter-bold text-error">-${totals.discount.toFixed(2)}</Text>
            </View>
          )}

          <View className="mt-2 flex-row items-center justify-between border-t border-border pt-2">
            <Text className="font-inter text-foreground-muted">Delivery Option</Text>
            <Text className="font-inter-medium text-foreground">${totals.deliveryFee.toFixed(2)}</Text>
          </View>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <View className="mb-2 flex-row justify-between">
            <Text className="font-inter text-foreground-muted">Subtotal</Text>
            <Text className="font-inter-medium text-foreground">${totals.subtotal.toFixed(2)}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-inter text-foreground-muted">Service Fee</Text>
            <Text className="font-inter-medium text-foreground">${totals.serviceFee.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between border-t border-border pt-2">
            <Text className="text-base font-inter-bold text-foreground">Total</Text>
            <Text className="text-base font-inter-bold text-primary">${totals.total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={submitOrder} loading={isLoading} leftIcon="check-circle-outline">
          Submit Order
        </Button>
      </View>
    </View>
  );
}
