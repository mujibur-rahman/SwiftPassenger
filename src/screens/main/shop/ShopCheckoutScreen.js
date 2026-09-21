// @/screens/main/shop/ShopCheckoutScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import AppTextInput from "@/components/ui/AppTextInput";
import ScreenHeader from "@/components/ui/ScreenHeader";
import { selectShopCart } from "@/features/shop/shopCartSlice";

// No real saved-address store wired up yet (SavedPlacesScreen keeps its
// own local mock state), so this list is local too — same level as the
// rest of the app's address handling today.
const ADDRESS_OPTIONS = [
  { id: "current", icon: "crosshairs-gps", title: "Current location", subtitle: "Use my current location" },
  { id: "home", icon: "home-outline", title: "Home", subtitle: "Ralph Terrace, 123 Main Street, Hobart" },
  { id: "work", icon: "briefcase-outline", title: "Work", subtitle: "Business Centre, 456 Business Ave, Hobart" },
];

export default function ShopCheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const cart = useSelector(selectShopCart);

  const [selectedAddressId, setSelectedAddressId] = useState("home");
  const [phone, setPhone] = useState("(555) 000-0000");
  const [instructions, setInstructions] = useState("");

  const selectedAddress = ADDRESS_OPTIONS.find((a) => a.id === selectedAddressId);

  const goNext = () => {
    navigation.navigate("ShopReviewOrder", {
      deliveryAddress: selectedAddress,
      receiverPhone: phone,
      deliveryInstructions: instructions,
    });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Where should we deliver?" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {ADDRESS_OPTIONS.map((addr) => {
          const selected = selectedAddressId === addr.id;
          return (
            <TouchableOpacity
              key={addr.id}
              activeOpacity={0.85}
              onPress={() => setSelectedAddressId(addr.id)}
              className={`mb-2.5 flex-row items-center gap-3 rounded-2xl border p-3.5 ${selected ? "border-primary bg-primary/10" : "border-border bg-card"}`}
            >
              <Icon name={addr.icon} size={20} color={selected ? primary : muted} />
              <View className="flex-1">
                <Text className="text-[14px] font-inter-bold text-foreground">{addr.title}</Text>
                <Text className="text-xs font-inter text-foreground-muted" numberOfLines={1}>{addr.subtitle}</Text>
              </View>
              <Icon name={selected ? "radiobox-marked" : "radiobox-blank"} size={20} color={selected ? primary : muted} />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("SavedPlaces")}
          className="mb-2.5 flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
        >
          <Icon name="bookmark-outline" size={20} color={muted} />
          <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">Saved places</Text>
          <Text className="text-xs font-inter text-foreground-muted mr-1">All saved addresses</Text>
          <Icon name="chevron-right" size={18} color={muted} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("SavedPlaces", { addNew: true })}
          className="mb-7 flex-row items-center gap-3 rounded-2xl border border-dashed border-border bg-card p-3.5"
        >
          <Icon name="plus" size={20} color={primary} />
          <Text className="flex-1 text-[14px] font-inter-semibold text-foreground">Add new address</Text>
        </TouchableOpacity>

        <AppTextInput
          label="Receiver phone"
          placeholder="(555) 000-0000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          leftContent="+61"
          containerClassName="mb-4"
        />
        <AppTextInput
          label="Delivery instructions (optional)"
          placeholder="e.g. Gate code, floor, landmark…"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={3}
        />
      </ScrollView>

      <View className="border-t border-border bg-card px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={goNext} disabled={!selectedAddress}>Continue</Button>
      </View>
    </View>
  );
}
