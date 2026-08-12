// src/screens/main/RideBookingScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setPickup,
  setDestination,
} from "../../features/location/locationSlice";
import {
  useRequestRideMutation,
  useGetFareEstimateMutation,
} from "../../features/ride/rideApi";
import {
  setCurrentRide,
  setFareEstimate,
  updateRideStatus,
} from "../../features/ride/rideSlice";
import { DARK_MAP_STYLE } from "../../utils/mapStyles";
import { useSocket } from "../../services/SocketContext";

const RIDE_TYPES = [
  { id: "economy", name: "SwiftX", icon: "🚗", multiplier: 1.0 },
  { id: "comfort", name: "Comfort", icon: "🚙", multiplier: 1.4 },
  { id: "xl", name: "XL", icon: "🚐", multiplier: 1.8 },
  { id: "premium", name: "Black", icon: "🏎️", multiplier: 2.5 },
];

export default function RideBookingScreen({ navigation }) {
  const dispatch = useDispatch();
  const { connect } = useSocket();

  const {
    currentLocation,
    pickup,
    destination,
    pickupAddress,
    destinationAddress,
  } = useSelector((s) => s.location);
  const { fareEstimate } = useSelector((s) => s.ride);

  const [requestRide, { isLoading: isBooking }] = useRequestRideMutation();
  const [getFareEstimate, { isLoading: isEstimating }] =
    useGetFareEstimateMutation();

  const [selectedRide, setSelectedRide] = useState("economy");
  const [destInput, setDestInput] = useState(destinationAddress || "");
  const [pickupInput, setPickupInput] = useState(
    pickupAddress || "Current Location",
  );
  const [stage, setStage] = useState("search"); // search | confirm
  const [routeCoords, setRouteCoords] = useState([]);

  const mapRef = useRef(null);
  const sheetAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // Auto set pickup from current location
  useEffect(() => {
    if (currentLocation && !pickup) {
      dispatch(
        setPickup({
          coords: {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
          address: "Current Location",
        }),
      );
    }
  }, [currentLocation]);

  const handleDestinationSelect = async () => {
    if (!destInput.trim()) return;

    // TODO: Replace with real geocoding / Google Places
    const mockDest = {
      latitude: 37.7849,
      longitude: -122.4094,
    };

    dispatch(setDestination({ coords: mockDest, address: destInput }));

    const origin = pickup || currentLocation;
    if (origin) {
      try {
        const result = await getFareEstimate({
          origin,
          destination: mockDest,
        }).unwrap();

        dispatch(setFareEstimate(result));
        setRouteCoords([origin, mockDest]);

        // Fit map to route
        mapRef.current?.fitToCoordinates([origin, mockDest], {
          edgePadding: { top: 100, right: 50, bottom: 320, left: 50 },
          animated: true,
        });
      } catch (e) {
        // fallback price already handled by UI
      }
    }

    setStage("confirm");
  };

  const handleBookRide = async () => {
    if (!pickup || !destination) {
      Alert.alert("Error", "Please set pickup and destination");
      return;
    }

    try {
      await connect(); // ensure socket connected before booking

      const res = await requestRide({
        pickup,
        destination,
        pickupAddress: pickupInput,
        destinationAddress: destInput,
        rideType: selectedRide,
      }).unwrap();

      dispatch(setCurrentRide(res.ride || res));
      dispatch(updateRideStatus("searching"));
      navigation.navigate("ActiveRide");
    } catch (err) {
      Alert.alert("Booking failed", err?.data?.message || "Please try again");
    }
  };

  const selected = RIDE_TYPES.find((r) => r.id === selectedRide);
  const basePrice = fareEstimate?.price ?? 12.5;

  return (
    <View className="flex-1 bg-background">
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        className="flex-1"
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation
        initialRegion={{
          latitude: currentLocation?.latitude || 37.7749,
          longitude: currentLocation?.longitude || -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pickup && <Marker coordinate={pickup} pinColor="#00D95F" />}
        {destination && <Marker coordinate={destination} pinColor="#FF4444" />}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#00D95F"
            strokeWidth={3}
          />
        )}
      </MapView>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        className="absolute top-12 left-5 w-11 h-11 rounded-full bg-black/70 items-center justify-center"
      >
        <Icon name="arrow-left" size={22} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        style={{ opacity: sheetAnim }}
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl px-5 pt-5 pb-10"
      >
        {stage === "search" ? (
          <View className="gap-4">
            {/* Location inputs */}
            <View className="flex-row gap-3 items-center">
              {/* Dots */}
              <View className="items-center py-2 gap-1">
                <View className="w-3 h-3 rounded-full bg-success" />
                <View className="w-0.5 flex-1 min-h-5 bg-border" />
                <View className="w-3 h-3 rounded-full bg-error" />
              </View>

              {/* Inputs */}
              <View className="flex-1 gap-1">
                <TextInput
                  className="bg-background-muted rounded-xl px-3.5 h-12 text-foreground text-[15px] font-sans"
                  value={pickupInput}
                  onChangeText={setPickupInput}
                  placeholderTextColor="#64748B"
                  selectionColor="#38BDF8"
                />
                <TextInput
                  className="bg-background-muted rounded-xl px-3.5 h-12 text-foreground text-[15px] font-sans"
                  placeholder="Where are you going?"
                  placeholderTextColor="#64748B"
                  value={destInput}
                  onChangeText={setDestInput}
                  onSubmitEditing={handleDestinationSelect}
                  returnKeyType="search"
                  autoFocus
                  selectionColor="#38BDF8"
                />
              </View>
            </View>

            {/* Search button */}
            <TouchableOpacity
              onPress={handleDestinationSelect}
              activeOpacity={0.85}
              className="rounded-2xl overflow-hidden"
            >
              <LinearGradient
                colors={["#00D95F", "#00B84F"]}
                className="h-13 items-center justify-center"
              >
                {isEstimating ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text className="text-base font-sans-bold text-black">
                    Search
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {/* Ride types */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-5 px-5"
            >
              {RIDE_TYPES.map((ride) => {
                const isActive = selectedRide === ride.id;
                return (
                  <TouchableOpacity
                    key={ride.id}
                    onPress={() => setSelectedRide(ride.id)}
                    activeOpacity={0.8}
                    className={`w-[100px] rounded-2xl p-3.5 items-center mr-2.5 border-2 ${
                      isActive
                        ? "border-success bg-success/10"
                        : "border-transparent bg-background-muted"
                    }`}
                  >
                    <Text className="text-2xl mb-1.5">{ride.icon}</Text>
                    <Text className="text-foreground text-[13px] font-sans-semibold">
                      {ride.name}
                    </Text>
                    <Text className="text-success text-sm font-sans-bold mt-1">
                      ${(basePrice * ride.multiplier).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Book button */}
            <TouchableOpacity
              onPress={handleBookRide}
              disabled={isBooking}
              activeOpacity={0.85}
              className={`rounded-2xl overflow-hidden ${isBooking ? "opacity-70" : ""}`}
            >
              <LinearGradient
                colors={["#00D95F", "#00B84F"]}
                className="h-14.5 items-center justify-center px-5"
              >
                {isBooking ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <View className="flex-row justify-between w-full">
                    <Text className="text-[17px] font-sans-bold text-black">
                      Book {selected?.name}
                    </Text>
                    <Text className="text-[17px] font-sans-bold text-black">
                      ${(basePrice * (selected?.multiplier || 1)).toFixed(2)}
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
