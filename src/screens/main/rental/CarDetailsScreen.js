import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import {
  selectSelectedCar,
  selectRentalPricing,
  selectRentalSearch,
} from "@/features/rental/rentalSlice";
import { RENTAL_CARS, withLocalImages } from "@/constants/rentalCars";
import { useGetRentalCarByIdQuery } from "@/features/rental/rentalApi";
import { resolveCarImageSource } from "@/components/rental/CarCard";

const { width } = Dimensions.get("window");
const CURRENCY = "A$";

export default function CarDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const selected = useSelector(selectSelectedCar);
  const pricing = useSelector(selectRentalPricing);
  const search = useSelector(selectRentalSearch);

  const carId = route.params?.carId || selected?.id;
  const { data: apiCar } = useGetRentalCarByIdQuery(carId, {
    skip: !carId,
  });

  const car = useMemo(() => {
    const raw =
      apiCar ||
      selected ||
      RENTAL_CARS.find((c) => c.id === carId) ||
      RENTAL_CARS[0];
    return withLocalImages(raw);
  }, [apiCar, selected, carId]);

  const primary = colors?.primary ?? "#38BDF8";
  // Prefer large local image for details hero
  const heroSource =
    resolveCarImageSource(car?.images?.[0]) ||
    resolveCarImageSource(car?.image);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Car Details" className="px-5" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={heroSource}
          style={{ width, height: 240, backgroundColor: "#e5e7eb" }}
          resizeMode="cover"
        />

        <View className="p-5">
          <Text className="text-2xl font-inter-bold text-foreground">
            {car.name}
          </Text>
          <Text className="mt-1 text-sm text-foreground-muted">
            ★ {car.rating} ({car.reviewCount} reviews) · {car.year} ·{" "}
            {car.category}
          </Text>

          {/* Specs */}
          <View className="mt-5 flex-row rounded-2xl border border-border bg-card p-4">
            {[
              { label: "Seats", value: car.seats, icon: "account-group" },
              {
                label: "Gear",
                value: car.transmission,
                icon: "car-shift-pattern",
              },
              { label: "Fuel", value: car.fuel, icon: "gas-station" },
            ].map((s) => (
              <View key={s.label} className="flex-1 items-center">
                <Icon name={s.icon} size={22} color={primary} />
                <Text className="mt-1 text-sm font-inter-bold text-foreground">
                  {s.value}
                </Text>
                <Text className="text-xs text-foreground-muted">{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Features */}
          <Text className="mt-6 text-lg font-inter-bold text-foreground">
            Features
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            {(car.features || []).map((f) => (
              <View
                key={f}
                className="flex-row items-center rounded-full border border-border bg-card px-3 py-1.5"
              >
                <Icon name="check-circle" size={14} color={primary} />
                <Text className="ml-1.5 text-xs text-foreground">{f}</Text>
              </View>
            ))}
          </View>

          {/* Trip summary */}
          <Text className="mt-6 text-lg font-inter-bold text-foreground">
            Your trip
          </Text>
          <View className="mt-2 rounded-2xl border border-border bg-card p-4">
            <Text className="text-sm text-foreground-muted">
              Pickup: {search.pickupLocation || "—"}
            </Text>
            <Text className="mt-1 text-sm text-foreground-muted">
              {pricing.days} day{pricing.days > 1 ? "s" : ""} · {CURRENCY}
              {Number(car.pricePerDay || 0).toLocaleString()}/day
            </Text>
            <Text
              className="mt-2 text-lg font-inter-bold"
              style={{ color: primary }}
            >
              {CURRENCY} {Number(pricing.baseTotal || 0).toLocaleString()} base
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom */}
      <View
        className="flex-row items-center justify-center border-t border-border bg-card px-4 py-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="mr-4">
          <Text className="text-xs text-foreground-muted">Total (base)</Text>
          <Text className="text-xl font-inter-bold" style={{ color: primary }}>
            {CURRENCY} {Number(pricing.baseTotal || 0).toLocaleString()}
          </Text>
        </View>
        <Button fullWidth={false} onPress={() => navigation.navigate("RentalBookingSummary")}>
          Continue
        </Button>
      </View>
    </View>
  );
}
