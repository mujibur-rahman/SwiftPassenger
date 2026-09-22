import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
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
  useGetMyRentalBookingsQuery,
  useCancelRentalBookingMutation,
} from "@/features/rental/rentalApi";
import {
  selectMyBookings,
  setMyBookings,
} from "@/features/rental/rentalSlice";

export default function MyRentalsScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const localBookings = useSelector(selectMyBookings);

  const { data: apiBookings, isLoading, refetch } =
    useGetMyRentalBookingsQuery();
  const [cancelBooking] = useCancelRentalBookingMutation();

  useEffect(() => {
    if (apiBookings?.length) {
      dispatch(setMyBookings(apiBookings));
    }
  }, [apiBookings, dispatch]);

  const bookings = apiBookings?.length ? apiBookings : localBookings;
  const primary = colors?.primary ?? "#38BDF8";

  const onCancel = async (id) => {
    try {
      await cancelBooking(id).unwrap();
      refetch();
    } catch (_) {
      // local update already handled by invalidatesTags on success
    }
  };

  const renderItem = ({ item }) => (
    <View className="mb-4 overflow-hidden rounded-2xl border border-border bg-card">
      <View className="flex-row p-3">
        {item.carImage ? (
          <Image
            source={{ uri: item.carImage }}
            className="h-20 w-24 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="h-20 w-24 items-center justify-center rounded-xl bg-background-muted">
            <Icon name="car" size={28} color={primary} />
          </View>
        )}
        <View className="ml-3 flex-1 justify-center">
          <Text className="text-base font-inter-bold text-foreground">
            {item.carName || "Car"}
          </Text>
          <Text className="mt-0.5 text-xs text-foreground-muted">
            {item.bookingCode || item.id}
          </Text>
          <Text className="mt-1 text-xs text-foreground-muted">
            {formatDate(item.pickupDate)} → {formatDate(item.returnDate)}
          </Text>
          <View className="mt-1 flex-row items-center">
            <View
              className={`rounded-full px-2 py-0.5 ${item.status === "cancelled"
                ? "bg-error/20"
                : "bg-success/20"
                }`}
            >
              <Text
                className="text-[10px] font-inter-semibold uppercase"
                style={{
                  color:
                    item.status === "cancelled"
                      ? colors?.error
                      : colors?.success,
                }}
              >
                {item.status || "confirmed"}
              </Text>
            </View>
            <Text className="ml-2 text-sm font-inter-bold" style={{ color: primary }}>
              $ {(item.pricing?.grandTotal || 0).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      {item.status !== "cancelled" && (
        <TouchableOpacity
          onPress={() => onCancel(item.id)}
          className="border-t border-border py-2.5 items-center"
        >
          <Text className="text-sm text-error">Cancel booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="My Rentals" className="px-5" />

      {isLoading && !bookings?.length ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="mt-20 items-center">
              <Icon name="car-off" size={48} color={colors?.foregroundMuted} />
              <Text className="mt-3 text-base text-foreground-muted">
                No rentals yet
              </Text>
              <Button
                onPress={() => navigation.navigate("CarRentalHome")}
                className="mt-5"
                style={{ width: 200 }}
              >
                Rent a car
              </Button>
            </View>
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
