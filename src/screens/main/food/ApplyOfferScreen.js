// @/screens/main/food/ApplyOfferScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import { useGetOffersQuery } from "@/features/food/foodApi";
import { setOffer, selectCart } from "@/features/food/cartSlice";
import ScreenHeader from "@/components/ui/ScreenHeader";

const MOCK_OFFERS = [
  { id: "1", code: "EATS10", title: "10% OFF", subtitle: "Up to $5 · Min. spend $15", type: "percent", value: 10, maxDiscount: 5, minSpend: 15 },
  { id: "2", code: "FOOD3", title: "$3 OFF", subtitle: "Min. spend $12", type: "flat", value: 3, minSpend: 12 },
  { id: "3", code: "DELIVERY", title: "Free Delivery", subtitle: "Min. spend $10", type: "free_delivery", value: 0, minSpend: 10 },
  { id: "4", code: "EATS15", title: "15% OFF", subtitle: "Min. spend $20", type: "percent", value: 15, maxDiscount: 8, minSpend: 20 },
];

export default function ApplyOfferScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const primary = colors?.primary ?? (isDark ? "#38BDF8" : "#0EA5E9");
  const muted = colors?.foregroundMuted ?? (isDark ? "#7DD3FC" : "#64748B");
  const cart = useSelector(selectCart);

  const { data: apiOffers, isLoading } = useGetOffersQuery();
  const offers = apiOffers?.length ? apiOffers : MOCK_OFFERS;
  const [selected, setSelected] = useState(cart.offer?.code || null);

  const apply = () => {
    const offer = offers.find((o) => o.code === selected || o.id === selected);
    dispatch(setOffer(offer || null));
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2 pb-1">
        <ScreenHeader title="Select Offer" />
      </View>

      {isLoading ? (
        <ActivityIndicator color={primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {offers.map((offer) => {
            const key = offer.code || offer.id;
            const isSelected = selected === key;
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                onPress={() => setSelected(key)}
                className={`mb-3 rounded-2xl border p-4 ${isSelected ? "border-primary bg-primary/10" : "border-border bg-card"}`}
              >
                <View className="flex-row items-start gap-3">
                  <View className={`mt-0.5 h-10 w-10 items-center justify-center rounded-full ${isSelected ? "bg-primary" : "bg-background-muted"}`}>
                    <Icon name="tag" size={18} color={isSelected ? (colors?.primaryForeground || "#fff") : primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-inter-bold text-foreground">{offer.title}</Text>
                    <Text className="mt-0.5 text-xs font-inter text-foreground-muted">
                      {offer.subtitle || (offer.minSpend ? `Min. spend $${offer.minSpend}` : "")}
                    </Text>
                    <View className="mt-2 self-start rounded-md border border-border bg-background-muted px-2 py-1">
                      <Text className="text-[11px] font-inter-semibold text-foreground-secondary">{offer.code}</Text>
                    </View>
                  </View>
                  <Icon name={isSelected ? "radiobox-marked" : "radiobox-blank"} size={22} color={isSelected ? primary : muted} />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View className="border-t border-border px-5 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button onPress={apply} disabled={!selected}>Apply</Button>
      </View>
    </View>
  );
}