// src/screens/main/HomeScreen.js  (Passenger)
import React from "react";
import {
  View,
  Text,
  StatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ServiceCard from "../../components/ServiceCard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProfileHeader from "../../components/ProfileHeader";

const JOBS = [
  { id: "1", title: "Ride", icon: "ride", iconColor: "#cba35c" },
  { id: "2", title: "Food delivery", icon: "food", iconColor: "#cba35c" },
  { id: "3", title: "Gig jobs", icon: "gig", iconColor: "#cba35c" },
  { id: "4", title: "Parcel delivery", icon: "delivery", iconColor: "#cba35c" },
  { id: "5", title: "Shop for me", icon: "shoppingCart", iconColor: "#cba35c" },
  { id: "6", title: "Marketplace pickup", icon: "card", iconColor: "#cba35c" },
  { id: "7", title: "Car insurance", icon: "store", iconColor: "#cba35c" },
  { id: "8", title: "Car rental", icon: "uploadTruck", iconColor: "#cba35c" },
];

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const insets = useSafeAreaInsets();

  return (
    <View className="screen-container" style={{ paddingVertical: insets.top }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ProfileHeader />

      {/* Advertisement placeholder */}
      <View className="flex-1">
        <Text className="text-2xl text-primary font-sans-bold">
          Advertisement will show...
        </Text>
        <Text className="text-2xl font-instrument text-muted">
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
