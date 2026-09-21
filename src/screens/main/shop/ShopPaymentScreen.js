// @/screens/main/shop/ShopPaymentScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import ScreenHeader from "@/components/ui/ScreenHeader";
import AppModal from "@/components/ui/AppModal";
import { useGetPaymentMethodsQuery } from "@/features/payment/paymentApi";
import { selectShopCart, clearShopCart } from "@/features/shop/shopCartSlice";
import { usePlaceShopOrderMutation } from "@/features/shop/shopApi";
import { setCurrentOrder, updateOrderStatus } from "@/features/shop/shopOrderSlice";

const MOCK_METHODS = [
  { id: "1", type: "card", brand: "visa", lastFour: "4242", isDefault: true, label: "Visa" },
  { id: "2", type: "card", brand: "mastercard", lastFour: "1234", isDefault: false, label: "Mastercard" },
];

const SERVICE_FEE = 3.0; // matches auth_server.js SHOP_FEES.serviceFee
const DELIVERY_FEE = 2.0; // matches auth_server.js SHOP_FEES.deliveryFee

export default function ShopPaymentScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const warning = colors?.warning ?? (isDark ? "#FBBF24" : "#D97706");
  const cart = useSelector(selectShopCart);

  const deliveryAddress = route.params?.deliveryAddress || { title: "Home", subtitle: "123 Main Street, Dhaka" };
  const receiverPhone = route.params?.receiverPhone || "";
  const deliveryInstructions = route.params?.deliveryInstructions || "";

  const { data: methods = [], isError } = useGetPaymentMethodsQuery();
  const cardMethods = !isError && methods.length ? methods : MOCK_METHODS;
  const [selected, setSelected] = useState(cardMethods.find((m) => m.isDefault)?.id || cardMethods[0]?.id);
  const [pickerVisible, setPickerVisible] = useState(false);
  const selectedMethod = cardMethods.find((m) => m.id === selected);

  const [placeShopOrder, { isLoading }] = usePlaceShopOrderMutation();
  const [submitting, setSubmitting] = useState(false);

  const estimatedTotal = cart.budgetLimit + SERVICE_FEE + DELIVERY_FEE;

  const requestShopping = async () => {
    setSubmitting(true);
    try {
      const paymentMethod = selectedMethod
        ? { type: "card", label: `${selectedMethod.label} ···· ${selectedMethod.lastFour}` }
        : { type: "card", label: "Card" };

      const orderPayload = {
        storeId: cart.storeId,
        storeName: cart.storeName,
        items: cart.items.map((it) => ({ ...it, estimatedPrice: it.estimatedPrice || null })),
        budgetLimit: cart.budgetLimit,
        substitutionPreference: cart.substitutionPreference,
        paymentMethod,
        deliveryAddress: {
          label: deliveryAddress.title,
          address: deliveryAddress.subtitle || deliveryAddress.title,
          phone: receiverPhone,
          instructions: deliveryInstructions,
        },
        estimatedTotal,
      };

      const order = await placeShopOrder(orderPayload).unwrap();

      dispatch(setCurrentOrder(order));
      dispatch(updateOrderStatus(order.status));
      dispatch(clearShopCart());
      navigation.replace("ShopOrderPlaced", { orderId: order.id, orderNumber: order.orderNumber });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Payment" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/*
          The one thing that makes this different from a normal payment
          screen: it's a HOLD, not a charge. The real amount is unknown
          until the shopper finishes.
        */}
        <View className="mb-4 flex-row items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3.5 py-3">
          <Icon name="information-outline" size={16} color={warning} style={{ marginTop: 1 }} />
          <Text className="flex-1 text-xs font-inter text-foreground-muted leading-4.5">
            A hold of your budget amount will be placed on your card. The final charge will be made after shopping is complete.
          </Text>
        </View>

        <View className="mb-4 rounded-2xl border border-border bg-card p-4">
          <View className="flex-row justify-between mb-2.5">
            <Text className="font-inter text-foreground-muted">Estimated shopping</Text>
            <Text className="font-inter-medium text-foreground">${cart.budgetLimit}</Text>
          </View>
          <View className="flex-row justify-between mb-2.5">
            <Text className="font-inter text-foreground-muted">Service fee</Text>
            <Text className="font-inter-medium text-foreground">${SERVICE_FEE.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-3">
            <Text className="font-inter text-foreground-muted">Delivery fee</Text>
            <Text className="font-inter-medium text-foreground">${DELIVERY_FEE.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between border-t border-border pt-3">
            <Text className="text-[15px] font-inter-bold text-foreground">Estimated total</Text>
            <Text className="text-[15px] font-inter-bold text-foreground">${estimatedTotal.toFixed(2)}</Text>
          </View>
        </View>

        <Text className="mb-2.5 text-[13px] font-inter-semibold text-foreground-secondary">Payment method</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setPickerVisible(true)}
          className="mb-2 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <Icon name="credit-card-outline" size={20} color={primary} />
          <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">
            {selectedMethod ? `${selectedMethod.label} ···· ${selectedMethod.lastFour}` : "Select a card"}
          </Text>
          <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>Change</Text>
        </TouchableOpacity>

        <View className="mt-1 flex-row items-start gap-2">
          <Icon name="lock-outline" size={14} color={muted} style={{ marginTop: 1 }} />
          <Text className="flex-1 text-xs font-inter text-foreground-muted">
            Card will be charged ${cart.budgetLimit} (hold) · Final amount may be different.
          </Text>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={requestShopping} disabled={!selectedMethod || submitting || isLoading}>
          {submitting ? "Placing request…" : "Request Shopping"}
        </Button>
        <Text className="mt-2 text-center text-[11px] font-inter text-foreground-muted">
          Hold placed securely · No charge yet
        </Text>
      </View>

      <AppModal visible={pickerVisible} onClose={() => setPickerVisible(false)} title="Choose payment method" hideActions>
        <View className="gap-2.5">
          {cardMethods.map((m) => {
            const isSelected = selected === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                activeOpacity={0.85}
                onPress={() => {
                  setSelected(m.id);
                  setPickerVisible(false);
                }}
                className={`flex-row items-center gap-3 rounded-2xl border p-4 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <Icon name="credit-card-outline" size={18} color={isSelected ? primary : muted} />
                <Text className={`flex-1 text-[14px] font-inter-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {m.label} ···· {m.lastFour}
                </Text>
                {isSelected && <Icon name="check" size={18} color={primary} />}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              setPickerVisible(false);
              navigation.navigate("PaymentMethods");
            }}
            className="flex-row items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-4"
          >
            <Icon name="plus" size={18} color={primary} />
            <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">Add new card</Text>
          </TouchableOpacity>
        </View>
      </AppModal>
    </View>
  );
}
