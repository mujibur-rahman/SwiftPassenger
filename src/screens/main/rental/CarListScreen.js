// @/screens/main/rental/CarListScreen.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import CarCard from "@/components/rental/CarCard";
import {
  useGetRentalCarsQuery,
} from "@/features/rental/rentalApi";
import {
  setSelectedCar,
  setFilters,
  selectRentalFilters,
  selectRentalSearch,
} from "@/features/rental/rentalSlice";
import { RENTAL_CATEGORIES, RENTAL_CARS } from "@/constants/rentalCars";

export default function CarListScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const filters = useSelector(selectRentalFilters);
  const search = useSelector(selectRentalSearch);

  const primary = colors?.primary ?? "#38BDF8";

  const queryArgs = {
    category: filters.category,
    transmission: filters.transmission,
    seats: filters.seats || undefined,
    pickupDate: search.pickupDate,
    returnDate: search.returnDate,
  };

  const { data: apiCars, isLoading, isError, refetch } =
    useGetRentalCarsQuery(queryArgs);

  // Fallback to local dummy if API fails / empty
  const cars = useMemo(() => {
    const list = apiCars?.length ? apiCars : RENTAL_CARS;
    return list.filter((c) => {
      if (filters.category !== "all" && c.category !== filters.category)
        return false;
      if (
        filters.transmission !== "all" &&
        c.transmission !== filters.transmission
      )
        return false;
      if (filters.seats > 0 && c.seats < filters.seats) return false;
      return true;
    });
  }, [apiCars, filters]);

  const onSelect = (car) => {
    dispatch(setSelectedCar(car));
    navigation.navigate("CarDetails", { carId: car.id });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <ScreenHeader title="Available Cars" className="px-5" />

      {/* Category chips */}
      <View className="border-b border-border bg-card px-3 py-2">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={RENTAL_CATEGORIES}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            const active = filters.category === item.id;
            return (
              <TouchableOpacity
                onPress={() =>
                  dispatch(setFilters({ category: item.id }))
                }
                className={`mr-2 flex-row items-center rounded-full border px-3 py-1.5 ${active
                  ? "border-primary bg-primary"
                  : "border-border bg-background"
                  }`}
              >
                <Icon
                  name={item.icon}
                  size={14}
                  color={active ? colors?.primaryForeground : primary}
                />
                <Text
                  className={`ml-1 text-xs font-inter-semibold ${active ? "text-primary-foreground" : "text-foreground"
                    }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {isLoading && !apiCars ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={
            <Text className="mb-3 text-sm text-foreground-muted">
              {cars.length} car{cars.length !== 1 ? "s" : ""} found
              {search.pickupLocation
                ? ` · ${search.pickupLocation}`
                : ""}
            </Text>
          }
          ListEmptyComponent={
            <View className="mt-16 items-center">
              <Icon name="car-off" size={48} color={colors?.foregroundMuted} />
              <Text className="mt-3 text-base text-foreground-muted">
                No cars match your filters
              </Text>
              <TouchableOpacity onPress={() => refetch()} className="mt-4">
                <Text style={{ color: primary }}>Retry</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <CarCard
              car={item}
              primary={primary}
              onPress={() => onSelect(item)}
            />
          )}
        />
      )}
    </View>
  );
}
