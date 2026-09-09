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
import ScreenHeader from "@/components/ui/ScreenHeader";
import EmptyCart from "@/components/food/EmptyCart";
import IconButton from "@/components/ui/IconButton";

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
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader
          title="Your Cart"
          onBack={() => navigation.goBack()}
          rightContent={
            <TouchableOpacity
              onPress={() => dispatch(clearCart())}
              disabled={cart.items.length === 0}
              hitSlop={8}
            >
              <Text
                className="text-sm font-inter-semibold"
                style={{ color: cart.items.length ? primary : muted }}
              >
                Clear all
              </Text>
            </TouchableOpacity>
          }
        />
      </View>


      {cart.items.length === 0 ? (
        <EmptyCart navigation={navigation} />
      ) : (
        <>
          <FlatList
            data={cart.items}
            keyExtractor={(item) => `${item.menuItemId}-${item.note || ""}`}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="mb-3 flex-row items-center gap-4 rounded-2xl border border-border bg-card p-3">
                <View className="h-16 w-16 overflow-hidden rounded-xl">
                  <Image
                    source={resolveImage(item)}
                    style={{ width: 64, height: 64 }}
                    resizeMode="cover"
                  />
                </View>

                <View className="flex-1">
                  <Text className="text-base font-inter-bold text-foreground" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="mt-0.5 text-[13px] font-inter-medium text-foreground-secondary">
                    ${item.price.toFixed(2)}
                  </Text>

                  <View className="flex-row items-center gap-4 mt-2">
                    <IconButton
                      icon="minus"
                      size={24}
                      onPress={() => dispatch(decrementItem(item.menuItemId))}
                      variant="muted"
                    />
                    <Text className="text-base font-inter-bold text-foreground">{item.qty}</Text>
                    <IconButton
                      icon="plus"
                      size={24}
                      onPress={() => dispatch(incrementItem(item.menuItemId))}
                    />
                  </View>
                </View>

                <IconButton
                  icon="trash-can-outline"
                  color={muted}
                  onPress={() => dispatch(removeItem(item.menuItemId))}
                />
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