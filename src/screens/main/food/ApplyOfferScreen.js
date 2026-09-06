// @/screens/main/food/ApplyOfferScreen.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import { useGetOffersQuery } from "@/features/food/foodApi";
import { selectCart, selectSubtotal, setOffer } from "@/features/food/cartSlice";

const OFFER_ICONS = {
  percent: "sale",
  flat: "cash-minus",
  free_delivery: "bike-fast",
};

export default function ApplyOfferScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const subtotal = useSelector(selectSubtotal);

  const { data: offers = [], isLoading } = useGetOffersQuery();
  const [selected, setSelected] = useState(cart.offer?.code ?? null);

  const apply = () => {
    const offer = offers.find((o) => o.code === selected) || null;
    dispatch(setOffer(offer));
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#38BDF8" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background px-5" style={{ paddingTop: insets.top }}>
      <ScreenHeader title="Select Offer" className="pb-3" />

      <FlatList
        data={offers}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item }) => {
          const eligible = subtotal >= (item.minSpend || 0);
          const isSelected = selected === item.code;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!eligible}
              onPress={() => setSelected(isSelected ? null : item.code)}
              className={`mb-3 flex-row items-center gap-3 rounded-2xl border p-4 ${
                isSelected ? "border-primary bg-primary/10" : "border-border bg-card"
              } ${!eligible ? "opacity-50" : ""}`}
            >
              <View className="h-11 w-11 items-center justify-center rounded-xl bg-primary/15">
                <Icon name={OFFER_ICONS[item.type] || "tag-outline"} size={22} color="#38BDF8" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-inter-bold text-foreground">{item.title}</Text>
                <Text className="mt-0.5 text-xs font-inter text-foreground-muted">{item.subtitle}</Text>
                <Text className="mt-1 text-[11px] font-inter-medium text-primary">{item.code}</Text>
              </View>
              <Icon
                name={isSelected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={isSelected ? "#38BDF8" : "#7DD3FC"}
              />
            </TouchableOpacity>
          );
        }}
      />

      <View style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={apply}>Apply</Button>
      </View>
    </View>
  );
}
