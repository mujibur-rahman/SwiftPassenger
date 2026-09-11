// src/screens/main/HomeScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useTheme } from "@/theme";
import { setCurrentLocation } from "@/features/location/locationSlice";
import { selectCartCount } from "@/features/food/cartSlice";
import { getCurrentLocationSafe } from "@/utils/getCurrentLocationSafe";
import ServiceCard from "@/components/ServiceCard";
import LogoAvatar from "@/components/ui/LogoAvatar";

const JOBS = [
  { id: "1", title: "Ride", icon: "ride" },
  { id: "2", title: "Order Food", icon: "food" },
  { id: "3", title: "Gig jobs", icon: "gig" },
  { id: "4", title: "Parcel delivery", icon: "delivery" },
  { id: "5", title: "Shop for me", icon: "shoppingCart" },
  { id: "6", title: "Marketplace pickup", icon: "card" },
  { id: "7", title: "Car insurance", icon: "store" },
  { id: "8", title: "Car rental", icon: "uploadTruck" },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const cartCount = useSelector(selectCartCount);

  useEffect(() => {
    (async () => {
      const coords = await getCurrentLocationSafe({
        accuracy: Location.Accuracy.Balanced,
      });
      if (coords) {
        dispatch(setCurrentLocation(coords));
      }
      // If null (permission denied / services off / emulator without mock GPS)
      // app continues normally — LocationAutocomplete still works without bias.
    })();
  }, [dispatch]);

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <LogoAvatar size={40} className="mb-1" />

          <View className="mb-3">
            <Text className="text-2xl text-primary font-inter-bold">
              Advertisement will show...
            </Text>
          </View>
        </ScrollView>
      </>

      <View
        className="service-grid mx-4"
        style={{ marginBottom: insets.bottom + 90 }}
      >
        {JOBS.map((job) => (
          <ServiceCard key={job.id} job={job} />
        ))}
      </View>

      {cartCount > 0 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("FoodCheckout")}
          className="absolute right-8 h-14 w-14 items-center justify-center rounded-full bg-primary"
          style={{ bottom: insets.bottom + 100 }}
        >
          <Icon name="cart" size={24} color={isDark ? "#060E1A" : "#FFFFFF"} />
          <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-error">
            <Text className="text-[10px] font-inter-bold text-white">{cartCount}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
