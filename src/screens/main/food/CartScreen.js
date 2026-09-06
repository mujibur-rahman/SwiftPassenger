// @/screens/main/food/CartScreen.js
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  selectCart,
  incrementItem,
  decrementItem,
  removeItem,
  clearCart,
  makeSelectTotals,
} from "@/features/food/cartSlice";

const selectTotals = makeSelectTotals();

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const onPrimary = colors?.primaryForeground ?? (isDark ? "#060E1A" : "#FFFFFF");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const cart = useSelector(selectCart);
  const totals = useSelector(selectTotals);

  const goHome = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] })
    );
  };

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader
        title="Your Cart"
        rightContent={
          cart.items.length > 0 ? (
            <TouchableOpacity onPress={() => dispatch(clearCart())}>
              <Text className="text-sm font-inter-semibold text-error">Clear all</Text>
            </TouchableOpacity>
          ) : null
        }
        className="pb-3"
      />

      {cart.items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Icon name="cart-outline" size={48} color={muted} />
          <Text className="mt-3 font-inter text-foreground-muted">Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.items}
            keyExtractor={(item) => `${item.menuItemId}-${item.note}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <View className="h-14 w-14 items-center justify-center rounded-xl border border-border bg-background-muted">
                  <Icon name="food" size={22} color={primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-inter-bold text-foreground" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-xs font-inter-medium text-primary">
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    onPress={() => dispatch(decrementItem(item.menuItemId))}
                    className="h-8 w-8 items-center justify-center rounded-full border border-border"
                  >
                    <Icon name="minus" size={16} color={primary} />
                  </TouchableOpacity>
                  <Text className="text-sm font-inter-bold text-foreground">{item.qty}</Text>
                  <TouchableOpacity
                    onPress={() => dispatch(incrementItem(item.menuItemId))}
                    className="h-8 w-8 items-center justify-center rounded-full bg-primary"
                  >
                    <Icon name="plus" size={16} color={onPrimary} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => dispatch(removeItem(item.menuItemId))} hitSlop={8}>
                  <Icon name="close" size={18} color={muted} />
                </TouchableOpacity>
              </View>
            )}
          />

          <View className="rounded-2xl border border-border bg-card p-4">
            <View className="mb-2 flex-row justify-between">
              <Text className="font-inter text-foreground-muted">Subtotal</Text>
              <Text className="font-inter-medium text-foreground">${totals.subtotal.toFixed(2)}</Text>
            </View>
            <View className="mb-2 flex-row justify-between">
              <Text className="font-inter text-foreground-muted">Delivery Fee</Text>
              <Text className="font-inter-medium text-foreground">${totals.deliveryFee.toFixed(2)}</Text>
            </View>
            <View className="mb-3 flex-row justify-between border-b border-border pb-3">
              <Text className="font-inter text-foreground-muted">Service Fee</Text>
              <Text className="font-inter-medium text-foreground">${totals.serviceFee.toFixed(2)}</Text>
            </View>
            <View className="mb-4 flex-row justify-between">
              <Text className="text-base font-inter-bold text-foreground">Total</Text>
              <Text className="text-base font-inter-bold text-primary">${totals.total.toFixed(2)}</Text>
            </View>

            <Button onPress={goHome}>Done</Button>
          </View>
        </>
      )}
    </View>
  );
}
