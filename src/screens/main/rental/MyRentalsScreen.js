import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import RenderItem from "@/components/rental/RenderItem";
import {
  useGetMyRentalBookingsQuery,
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

  const { data: apiBookings, isLoading } =
    useGetMyRentalBookingsQuery();

  useEffect(() => {
    if (apiBookings?.length) {
      dispatch(setMyBookings(apiBookings));
    }
  }, [apiBookings, dispatch]);

  const bookings = apiBookings?.length ? apiBookings : localBookings;
  const primary = colors?.primary ?? "#38BDF8";

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
          renderItem={({ item }) => (
            <RenderItem key={item.id} item={item} />
          )}
        />
      )}
    </View>
  );
}
