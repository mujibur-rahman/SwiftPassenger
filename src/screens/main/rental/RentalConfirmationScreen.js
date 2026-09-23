import React from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Share,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { formatDate } from "@/utils/helpers";
import Button from "@/components/ui/Button";
import Row from "@/components/rental/Row";
import {
  selectCurrentBooking,
  clearRentalDraft,
} from "@/features/rental/rentalSlice";

export default function RentalConfirmationScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const booking = useSelector(selectCurrentBooking);

  const primary = colors?.primary ?? "#38BDF8";
  const success = colors?.success ?? "#34D399";

  const code = booking?.bookingCode || booking?.id || "—";

  const handleDone = () => {
    dispatch(clearRentalDraft());
    navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My SwiftRide car rental booking: ${code}\nCar: ${booking?.carName}\nPickup: ${booking?.pickupLocation}`,
      });
    } catch (_) { }
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 16 }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        contentContainerStyle={{ padding: 24, alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="mb-6 h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: success + "33" }}
        >
          <Icon name="check-circle" size={48} color={success} />
        </View>

        <Text className="text-2xl font-inter-bold text-foreground text-center">
          Booking Confirmed!
        </Text>
        <Text className="mt-2 text-sm text-foreground-muted text-center">
          Your car is reserved. Show this code at pickup.
        </Text>

        <View className="mt-8 w-full rounded-2xl border border-border bg-card p-5">
          <Text className="text-center text-xs text-foreground-muted">
            Booking code
          </Text>
          <Text
            className="mt-1 text-center text-3xl font-inter-bold tracking-widest"
            style={{ color: primary }}
          >
            {code}
          </Text>

          <View className="mt-5 border-t border-border pt-4">
            <Row label="Car" value={booking?.carName} />
            <Row label="Pickup" value={booking?.pickupLocation} />
            <Row
              label="Dates"
              value={`${formatDate(booking?.pickupDate)} → ${formatDate(booking?.returnDate)}`}
            />
            <Row
              label="Total paid"
              value={`A$ ${(booking?.pricing?.grandTotal || 0).toLocaleString()}`}
            />
            <Row label="Payment" value={booking?.paymentMethod?.toUpperCase()} />
          </View>
        </View>

        <View className="mt-8 w-full gap-3">
          <Button onPress={handleShare} variant="secondary">
            Share booking
          </Button>
          <Button
            onPress={() => navigation.navigate("MyRentals")}
            variant="outline"
          >
            View my rentals
          </Button>
          <Button onPress={handleDone}>Back to Home</Button>
        </View>
      </ScrollView>
    </View>
  );
}