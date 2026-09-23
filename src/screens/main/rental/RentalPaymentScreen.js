import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
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
  selectPaymentMethod,
  setPaymentMethod,
  applyPromo,
  clearPromo,
  setCurrentBooking,
  addBooking,
} from "@/features/rental/rentalSlice";
import { useCreateRentalBookingMutation } from "@/features/rental/rentalApi";
import { PAYMENT_METHODS } from "@/constants/rentalCars";

export default function RentalPaymentScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const car = useSelector(selectSelectedCar);
  const addons = useSelector(selectSelectedAddons);
  const pricing = useSelector(selectRentalPricing);
  const search = useSelector(selectRentalSearch);
  const paymentMethod = useSelector(selectPaymentMethod);

  const [promoInput, setPromoInput] = useState("");
  const [createBooking, { isLoading }] = useCreateRentalBookingMutation();

  const primary = colors?.primary ?? "#38BDF8";
  const muted = colors?.foregroundMuted ?? "#7DD3FC";

  const handlePay = async () => {
    if (!car) {
      Alert.alert("Error", "No car selected");
      return;
    }

    const body = {
      carId: car.id,
      carName: car.name,
      carImage: typeof car.image === "string" ? car.image : (car.remoteImage || null),
      pricePerDay: car.pricePerDay,
      pickupLocation: search.pickupLocation,
      dropoffLocation: search.dropoffLocation || search.pickupLocation,
      pickupDate: search.pickupDate,
      returnDate: search.returnDate,
      pickupTime: search.pickupTime,
      returnTime: search.returnTime,
      addons: Object.keys(addons).filter((k) => addons[k]),
      pricing,
      paymentMethod,
    };

    try {
      const result = await createBooking(body).unwrap();
      dispatch(setCurrentBooking(result));
      dispatch(addBooking(result));
      navigation.replace("RentalConfirmation");
    } catch (err) {
      // Offline / mock fallback
      const fallback = {
        id: `RB${Date.now()}`,
        ...body,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        bookingCode: `SR${Math.floor(100000 + Math.random() * 900000)}`,
      };
      dispatch(setCurrentBooking(fallback));
      dispatch(addBooking(fallback));
      navigation.replace("RentalConfirmation");
    }
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Payment" className="px-5" />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Amount */}
        <View className="mb-6 items-center rounded-2xl border border-border bg-card p-6">
          <Text className="text-sm text-foreground-muted">Amount to pay</Text>
          <Text className="mt-1 text-3xl font-inter-bold" style={{ color: primary }}>
            A$ {pricing.grandTotal.toLocaleString()}
          </Text>
          <Text className="mt-1 text-xs text-foreground-muted">
            {car?.name} · {pricing.days} day{pricing.days > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Promo */}
        <Text className="mb-2 text-sm font-inter-semibold text-foreground-muted">
          Promo code
        </Text>
        <View className="mb-5 flex-row items-center gap-2">
          <TextInput
            className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base text-foreground"
            placeholder="SWIFT10 or RENT20"
            placeholderTextColor={muted}
            autoCapitalize="characters"
            value={promoInput}
            onChangeText={setPromoInput}
          />
          <TouchableOpacity
            onPress={() => dispatch(applyPromo(promoInput))}
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: primary }}
          >
            <Text className="font-inter-semibold text-primary-foreground">
              Apply
            </Text>
          </TouchableOpacity>
        </View>

        {/* Payment methods */}
        <Text className="mb-3 text-base font-inter-bold text-foreground">
          Payment method
        </Text>
        {PAYMENT_METHODS.map((m) => {
          const selected = paymentMethod === m.id;
          return (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.8}
              onPress={() => dispatch(setPaymentMethod(m.id))}
              className={`mb-3 flex-row items-center rounded-xl border p-4 ${selected
                ? "border-primary bg-primary/10"
                : "border-border bg-card"
                }`}
            >
              <Icon
                name={selected ? "radiobox-marked" : "radiobox-blank"}
                size={22}
                color={primary}
              />
              <Icon
                name={m.icon}
                size={22}
                color={colors?.foreground}
                style={{ marginLeft: 12 }}
              />
              <Text className="ml-3 text-base font-inter-semibold text-foreground">
                {m.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        className="border-t border-border bg-card px-4 py-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Button onPress={handlePay} loading={isLoading} disabled={isLoading}>
          {isLoading ? "Processing..." : "Pay & Confirm Booking"}
        </Button>
      </View>
    </View>
  );
}
