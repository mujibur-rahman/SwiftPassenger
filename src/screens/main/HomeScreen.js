// src/screens/main/HomeScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Location from "expo-location";
import ServiceCard from "../../components/ServiceCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoAvatar from "../../components/ui/LogoAvatar";
import { setCurrentLocation } from "../../features/location/locationSlice";

const JOBS = [
  { id: "1", title: "Ride", icon: "ride", iconColor: "#38BDF8" },
  { id: "2", title: "Food delivery", icon: "food", iconColor: "#38BDF8" },
  { id: "3", title: "Gig jobs", icon: "gig", iconColor: "#38BDF8" },
  { id: "4", title: "Parcel delivery", icon: "delivery", iconColor: "#38BDF8" },
  { id: "5", title: "Shop for me", icon: "shoppingCart", iconColor: "#38BDF8" },
  { id: "6", title: "Marketplace pickup", icon: "card", iconColor: "#38BDF8" },
  { id: "7", title: "Car insurance", icon: "store", iconColor: "#38BDF8" },
  { id: "8", title: "Car rental", icon: "uploadTruck", iconColor: "#38BDF8" },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        dispatch(
          setCurrentLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy,
          }),
        );
      } catch (e) {
        console.log("Location error:", e);
      }
    })();
  }, [dispatch]);

  return (
    <View className="screen-container" style={{ paddingVertical: insets.top }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <LogoAvatar />

      <View className="flex-1">
        <Text className="text-2xl text-primary font-sans-bold">
          Advertisement will show...
        </Text>
      </View>

      <View
        className="service-grid"
        style={{ marginBottom: insets.bottom + 20 }}
      >
        {JOBS.map((job) => (
          <ServiceCard key={job.id} job={job} />
        ))}
      </View>
    </View>
  );
}
