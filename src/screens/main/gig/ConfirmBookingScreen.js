// @/screens/main/gig/ConfirmBookingScreen.js
import React from "react";
import { View, TouchableOpacity, TouchableWithoutFeedback, Alert, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import Button from "@/components/ui/Button";
import BookingSummaryCard from "@/components/gig/BookingSummaryCard";
import { confirmBooking, selectGig, selectSelectedQuote } from "@/features/gig/gigSlice";
import { useConfirmGigBookingMutation } from "@/features/gig/gigApi";

export default function ConfirmBookingScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);
  const [confirmGigBooking, { isLoading }] = useConfirmGigBookingMutation();

  const handleConfirm = async () => {
    if (!selectedQuote) return;

    try {
      const booking = await confirmGigBooking({
        jobId: gig.job?.id,
        quoteId: selectedQuote.id,
        provider: selectedQuote.providerName,
        price: selectedQuote.price,
        location: gig.contact?.address || null,
      }).unwrap();

      dispatch(confirmBooking(booking));
      navigation.replace("BookingScheduled");
    } catch (err) {
      console.warn("Confirm booking error:", err);
      Alert.alert("Booking failed", "Please check your connection and try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: "rgba(6,14,26,0.6)" }}
      >
        <TouchableWithoutFeedback>
          <View className={`w-full max-w-md rounded-3xl p-5 ${isDark ? "bg-card" : "bg-background"}`}>
            <View className="mb-3 flex-row justify-end">
              <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
                <Icon name="close" size={20} color="#7DD3FC" />
              </TouchableOpacity>
            </View>

            <BookingSummaryCard
              serviceId={gig.serviceId}
              answers={gig.answers}
              provider={selectedQuote?.providerName}
              price={selectedQuote?.price}
              className="mb-5 border-0 p-0"
            />

            <Button onPress={handleConfirm} disabled={!selectedQuote || isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                "Confirm Booking"
              )}
            </Button>
            <Button variant="outline" className="mt-2" onPress={() => navigation.goBack()} disabled={isLoading}>
              Cancel
            </Button>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}
