import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  selectSelectedCar,
  selectSelectedAddons,
  selectRentalPricing,
  selectRentalSearch,
  toggleAddon,
} from "@/features/rental/rentalSlice";
import { RENTAL_ADDONS } from "@/constants/rentalCars";

export default function RentalBookingSummaryScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const car = useSelector(selectSelectedCar);
  const addons = useSelector(selectSelectedAddons);
  const pricing = useSelector(selectRentalPricing);
  const search = useSelector(selectRentalSearch);

  const primary = colors?.primary ?? "#38BDF8";

  if (!car) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-foreground">No car selected</Text>
        <Button onPress={() => navigation.navigate("CarRentalHome")} className="mt-4">
          Go back
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Booking Summary" className="px-5" />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Car summary */}
        <View className="mb-5 rounded-2xl border border-border bg-card p-4">
          <Text className="text-lg font-inter-bold text-foreground">
            {car.name}
          </Text>
          <Text className="mt-1 text-sm text-foreground-muted">
            {search.pickupLocation}
          </Text>
          <Text className="mt-1 text-sm text-foreground-muted">
            {pricing.days} day{pricing.days > 1 ? "s" : ""} · $
            {car.pricePerDay.toLocaleString()}/day
          </Text>
        </View>

        {/* Add-ons */}
        <Text className="mb-3 text-base font-inter-bold text-foreground">
          Add-ons (optional)
        </Text>
        {RENTAL_ADDONS.map((addon) => {
          const selected = !!addons[addon.id];
          return (
            <TouchableOpacity
              key={addon.id}
              activeOpacity={0.8}
              onPress={() => dispatch(toggleAddon(addon.id))}
              className={`mb-3 flex-row items-center rounded-xl border p-4 ${selected
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
                }`}
            >
              <Icon
                name={selected ? "checkbox-marked" : "checkbox-blank-outline"}
                size={24}
                color={primary}
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-inter-semibold text-foreground">
                  {addon.name}
                </Text>
                <Text className="text-xs text-foreground-muted">
                  {addon.description}
                </Text>
              </View>
              <Text className="text-sm font-inter-bold" style={{ color: primary }}>
                ${addon.price}/day
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Price breakdown */}
        <View className="mt-4 rounded-2xl border border-border bg-card p-4">
          <Text className="mb-3 text-base font-inter-bold text-foreground">
            Price breakdown
          </Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-foreground-muted">
              Base ({pricing.days} days)
            </Text>
            <Text className="text-sm text-foreground">
              $ {pricing.baseTotal.toLocaleString()}
            </Text>
          </View>
          {pricing.addonsTotal > 0 && (
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-foreground-muted">Add-ons</Text>
              <Text className="text-sm text-foreground">
                $ {pricing.addonsTotal.toLocaleString()}
              </Text>
            </View>
          )}
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-foreground-muted">Service tax (5%)</Text>
            <Text className="text-sm text-foreground">
              $ {pricing.tax.toLocaleString()}
            </Text>
          </View>
          <View className="mt-2 border-t border-border pt-3 flex-row justify-between">
            <Text className="text-base font-inter-bold text-foreground">
              Total
            </Text>
            <Text className="text-lg font-inter-bold" style={{ color: primary }}>
              $ {pricing.grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="border-t border-border bg-card px-4 py-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Button onPress={() => navigation.navigate("RentalPayment")}>
          Proceed to Payment
        </Button>
      </View>
    </View>
  );
}
