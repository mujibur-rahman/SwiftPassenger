// @/screens/main/food/FoodCheckoutScreen.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import ListRow from "@/components/ui/ListRow";
import Button from "@/components/ui/Button";
import { selectCart, makeSelectTotals } from "@/features/food/cartSlice";

const DELIVERY_LABELS = {
  standard: { label: "Standard Delivery", eta: "20-30 min" },
  priority: { label: "Priority Delivery", eta: "15-20 min" },
};

const selectTotals = makeSelectTotals();

export default function FoodCheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const cart = useSelector(selectCart);
  const totals = useSelector(selectTotals);

  const deliveryInfo = DELIVERY_LABELS[cart.deliveryOptionId] || DELIVERY_LABELS.standard;

  if (cart.items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-5" style={{ paddingTop: insets.top }}>
        <ScreenHeader title="Checkout" className="absolute top-0 left-5 right-5" />
        <Icon name="cart-outline" size={48} color={muted} />
        <Text className="mt-3 font-inter text-foreground-muted">Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Checkout" className="pb-3" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 12 }}>
        <ListRow
          icon="map-marker-outline"
          label="Delivery to"
          subtitle="123 Main St, Natore"
          showChevron={false}
          rightContent={
            <TouchableOpacity onPress={() => navigation.navigate("SavedPlaces")}>
              <Text className="text-sm font-inter-semibold text-primary">Change</Text>
            </TouchableOpacity>
          }
          className="mb-3"
        />

        <ListRow
          icon="store-outline"
          label="Order from"
          subtitle={cart.restaurantName}
          showChevron={false}
          className="mb-3"
        />

        <View className="mb-3 rounded-2xl border border-border bg-card p-4">
          {cart.items.map((item) => (
            <View key={`${item.menuItemId}-${item.note}`} className="mb-2 flex-row items-center justify-between">
              <Text className="flex-1 font-inter-medium text-foreground" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="mx-3 font-inter text-foreground-muted">Qty: {item.qty}</Text>
              <Text className="font-inter-bold text-foreground">${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="mt-2 text-sm font-inter-semibold text-primary">Add more items</Text>
          </TouchableOpacity>
        </View>

        <ListRow
          icon="tag-outline"
          label="Apply offer"
          subtitle={cart.offer ? cart.offer.title : "Select or enter code"}
          onPress={() => navigation.navigate("ApplyOffer")}
          className="mb-3"
        />

        <ListRow
          icon="bike-fast"
          label="Delivery option"
          subtitle={`${deliveryInfo.label} · ${deliveryInfo.eta}`}
          onPress={() => navigation.navigate("DeliveryOption")}
          className="mb-3"
        />
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={() => navigation.navigate("FoodPayment")}>Next</Button>
      </View>
    </View>
  );
}
