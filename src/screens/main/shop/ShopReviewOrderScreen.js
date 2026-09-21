// @/screens/main/shop/ShopReviewOrderScreen.js
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { selectShopCart } from "@/features/shop/shopCartSlice";
import ScreenHeader from "@/components/ui/ScreenHeader";

const PREF_LABELS = {
  suggest_similar: "Similar item is okay",
  call_me: "Call me first",
};

function Section({ title, onEdit, children }) {
  return (
    <View className="mb-3 rounded-2xl border border-border bg-card p-4">
      <View className="mb-2.5 flex-row items-center justify-between">
        <Text className="text-[13px] font-inter-semibold text-foreground-secondary">{title}</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <ShopReviewEditLabel />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

function ShopReviewEditLabel() {
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  return <Text className="text-[13px] font-inter-semibold" style={{ color: primary }}>Edit</Text>;
}

export default function ShopReviewOrderScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");

  const cart = useSelector(selectShopCart);
  const deliveryAddress = route.params?.deliveryAddress || { title: "Home", subtitle: "123 Main Street, Dhaka" };
  const receiverPhone = route.params?.receiverPhone || "";
  const deliveryInstructions = route.params?.deliveryInstructions || "";

  const goPayment = () => {
    navigation.navigate("ShopPayment", { deliveryAddress, receiverPhone, deliveryInstructions });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Review your order" />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        <Section title="Store" onEdit={() => navigation.navigate("ShopStoreSearch")}>
          <View className="flex-row items-center gap-3">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary/15">
              <Icon name="storefront-outline" size={18} color={primary} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-inter-bold text-foreground">{cart.storeName || "—"}</Text>
              <Text className="text-xs font-inter text-foreground-muted">
                {cart.storeDistanceKm != null ? `${cart.storeDistanceKm} km · ` : ""}{cart.storeCategory || "Grocery"}
              </Text>
            </View>
          </View>
        </Section>

        <Section title={`Shopping list (${cart.items.length})`} onEdit={() => navigation.navigate("ShopListBuilder")}>
          {cart.items.map((item, idx) => (
            <View key={item.id} className={`flex-row items-center gap-2 ${idx > 0 ? "mt-2" : ""}`}>
              <Icon name="checkbox-blank-circle" size={5} color={primary} />
              <Text className="flex-1 text-[13px] font-inter text-foreground" numberOfLines={1}>
                {item.name} × {item.qty}{item.unit ? ` (${item.unit})` : ""}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Shopping preferences" onEdit={() => navigation.navigate("ShopListBuilder")}>
          <Text className="text-[13px] font-inter text-foreground">
            Substitution: {PREF_LABELS[cart.substitutionPreference] || "Similar item is okay"}
          </Text>
          <Text className="text-[13px] font-inter text-foreground-muted mt-1">Price · Any price</Text>
        </Section>

        <Section title="Budget" onEdit={() => navigation.navigate("ShopListBuilder")}>
          <Text className="text-[14px] font-inter-bold text-foreground">${cart.budgetLimit} (max)</Text>
        </Section>

        <Section title="Delivery address" onEdit={() => navigation.navigate("ShopCheckout")}>
          <Text className="text-[14px] font-inter-bold text-foreground">{deliveryAddress.title}</Text>
          <Text className="text-xs font-inter text-foreground-muted mt-0.5" numberOfLines={1}>{deliveryAddress.subtitle}</Text>
          {!!receiverPhone && <Text className="text-xs font-inter text-foreground-muted mt-1">{receiverPhone}</Text>}
        </Section>

        <View className="mt-2 flex-row items-center justify-between border-t border-border pt-4">
          <Text className="text-base font-inter-bold text-foreground">Estimated total</Text>
          <Text className="text-lg font-inter-bold text-foreground">${cart.budgetLimit + 5}</Text>
        </View>
        <Text className="mt-1 text-xs font-inter text-foreground-muted">
          Includes your ${cart.budgetLimit} shopping budget plus service and delivery fees. You'll only be charged the actual amount once shopping is complete.
        </Text>
      </ScrollView>

      <View className="border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={goPayment} disabled={cart.items.length === 0}>Continue to Payment</Button>
      </View>
    </View>
  );
}
