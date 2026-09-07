// @/screens/main/food/CartScreen.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
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

const FALLBACK_IMAGES = {
  default: require("@assets/images/products/chicken-burger.jpg"),
  chicken: require("@assets/images/products/chicken-burger.jpg"),
  beef: require("@assets/images/products/beef-burger.jpg"),
  cheese: require("@assets/images/products/cheese-burger.jpg"),
  fries: require("@assets/images/products/fries.jpg"),
  fried: require("@assets/images/products/fried-chicken.jpg"),
  pizza: require("@assets/images/products/pepperoni-pizza.jpg"),
};

function resolveImage(item) {
  if (item.image) return item.image;
  const name = (item.name || "").toLowerCase();
  if (name.includes("chicken") && name.includes("burger")) return FALLBACK_IMAGES.chicken;
  if (name.includes("beef")) return FALLBACK_IMAGES.beef;
  if (name.includes("cheese")) return FALLBACK_IMAGES.cheese;
  if (name.includes("fries")) return FALLBACK_IMAGES.fries;
  if (name.includes("fried")) return FALLBACK_IMAGES.fried;
  if (name.includes("pizza")) return FALLBACK_IMAGES.pizza;
  return FALLBACK_IMAGES.default;
}

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const onPrimary = colors?.primaryForeground ?? (isDark ? "#060E1A" : "#FFFFFF");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");

  const cart = useSelector(selectCart);
  const totals = useSelector(selectTotals);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="mb-2 flex-row items-center justify-between px-5 pt-2 pb-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={8}
          className="h-10 w-10 items-center justify-center"
        >
          <Icon name="arrow-left" size={22} color={colors?.foreground} />
        </TouchableOpacity>
        <Text className="text-lg font-inter-bold text-foreground">Your Cart</Text>
        <TouchableOpacity
          onPress={() => dispatch(clearCart())}
          disabled={cart.items.length === 0}
          hitSlop={8}
        >
          <Text
            className="text-[13px] font-inter-semibold"
            style={{ color: cart.items.length ? primary : muted }}
          >
            Clear all
          </Text>
        </TouchableOpacity>
      </View>

      {cart.items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-5">
          <Icon name="cart-outline" size={56} color={muted} style={{ opacity: 0.5 }} />
          <Text className="mt-3 font-inter text-foreground-muted">Your cart is empty</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("FoodTabs")}
            className="mt-4 rounded-full bg-primary px-6 py-3"
          >
            <Text className="font-inter-semibold text-primary-foreground">Browse food</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.items}
            keyExtractor={(item) => `${item.menuItemId}-${item.note || ""}`}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="mb-3 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <View className="h-16 w-16 overflow-hidden rounded-xl">
                  <Image
                    source={resolveImage(item)}
                    style={{ width: 64, height: 64 }}
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-[15px] font-inter-bold text-foreground" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-[13px] font-inter-medium text-foreground-secondary">
                    ${item.price.toFixed(2)}
                  </Text>

                  <View className="mt-2 flex-row items-center gap-3">
                    <TouchableOpacity
                      onPress={() => dispatch(decrementItem(item.menuItemId))}
                      className="h-7 w-7 items-center justify-center rounded-full border border-border"
                    >
                      <Icon name="minus" size={14} color={primary} />
                    </TouchableOpacity>
                    <Text className="text-sm font-inter-bold text-foreground">{item.qty}</Text>
                    <TouchableOpacity
                      onPress={() => dispatch(incrementItem(item.menuItemId))}
                      className="h-7 w-7 items-center justify-center rounded-full bg-primary"
                    >
                      <Icon name="plus" size={14} color={onPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => dispatch(removeItem(item.menuItemId))}
                  hitSlop={10}
                  className="h-8 w-8 items-center justify-center"
                >
                  <Icon name="trash-can-outline" size={18} color={muted} />
                </TouchableOpacity>
              </View>
            )}
          />

          <View
            className="border-t border-border bg-card px-5 pt-4"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
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
              <Text className="text-base font-inter-bold text-foreground">${totals.total.toFixed(2)}</Text>
            </View>

            <Button onPress={() => navigation.navigate("FoodCheckout")}>Done</Button>
          </View>
        </>
      )}
    </View>
  );
}