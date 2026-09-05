// src/screens/main/HomeScreen.js
import React, { useEffect } from "react";
import { View, Text, StatusBar, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from '@/theme';
import { setCurrentLocation } from "@/features/location/locationSlice";
import ServiceCard from "@/components/ServiceCard";
import LogoAvatar from "@/components/ui/LogoAvatar";

const JOBS = [
  { id: '1', title: 'Ride', icon: 'ride' },
  { id: '2', title: 'Food delivery', icon: 'food' },
  { id: '3', title: 'Gig jobs', icon: 'gig' },
  { id: '4', title: 'Parcel delivery', icon: 'delivery' },
  { id: '5', title: 'Shop for me', icon: 'shoppingCart' },
  { id: '6', title: 'Marketplace pickup', icon: 'card' },
  { id: '7', title: 'Car insurance', icon: 'store' },
  { id: '8', title: 'Car rental', icon: 'uploadTruck' },
];

export default function HomeScreen() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

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
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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
    </View>
  );
}
