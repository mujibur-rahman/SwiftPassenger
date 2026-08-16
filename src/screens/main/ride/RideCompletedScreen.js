// src/screens/main/RideBookingScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  StatusBar,
  Keyboard,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

import Button from "@/components/ui/Button";
import { useSocket } from "@/services/SocketContext";
import {
  useGetFareEstimateMutation,
  useRequestRideMutation,
} from "@/features/ride/rideApi";
import {
  setPickup,
  setDestination,
  setCurrentLocation,
} from "@/features/location/locationSlice";
import {
  setCurrentRide,
  setFareEstimate,
  updateRideStatus,
} from "@/features/ride/rideSlice";

const RIDE_TYPES = [
  { id: "economy", name: "SwiftX", icon: "car", multiplier: 1.0 },
  { id: "comfort", name: "Comfort", icon: "car-side", multiplier: 1.4 },
  { id: "xl", name: "XL", icon: "van-passenger", multiplier: 1.8 },
  { id: "premium", name: "Black", icon: "car-sports", multiplier: 2.5 },
];

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#0d1e32" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7dd3fc" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#060e1a" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e3a5f" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#162a44" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#060e1a" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#162a44" }],
  },
];

export default function RideBookingScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const { emit, connected } = useSocket();

  const {
    currentLocation,
    pickup,
    destination,
    pickupAddress,
    destinationAddress,
  } = useSelector((s) => s.location);
  const { fareEstimate } = useSelector((s) => s.ride);

  const [getFareEstimate, { isLoading: estimating }] =
    useGetFareEstimateMutation();
  const [requestRide, { isLoading: requesting }] = useRequestRideMutation();

  const [selectedRide, setSelectedRide] = useState("economy");
  const [pickupInput, setPickupInput] = useState(
    pickupAddress || "Current Location",
  );
  const [destInput, setDestInput] = useState(destinationAddress || "");
  const [stage, setStage] = useState("search"); // search | confirm
  const [routeCoords, setRouteCoords] = useState([]);

  const sheetAnim = useRef(new Animated.Value(0)).current;

  // Fade-in bottom sheet
  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 380,
      useNativeDriver: true,
    }).start();
  }, []);

  // Get current location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        dispatch(setCurrentLocation(coords));

        if (!pickup) {
          const [addr] = await Location.reverseGeocodeAsync(coords);
          const address = addr
            ? `${addr.name || ""} ${addr.street || ""}, ${addr.city || ""}`.trim()
            : "Current Location";
          dispatch(setPickup({ coords, address }));
          setPickupInput(address);
        }

        mapRef.current?.animateToRegion(
          {
            ...coords,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          },
          500,
        );
      } catch (e) {
        console.log("Location error:", e);
      }
    })();
  }, [dispatch]);

  // Fit route when both points exist
  useEffect(() => {
    if (pickup && destination && mapRef.current) {
      mapRef.current.fitToCoordinates([pickup, destination], {
        edgePadding: { top: 100, right: 50, bottom: 320, left: 50 },
        animated: true,
      });
    }
  }, [pickup, destination]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!destInput.trim()) {
      Alert.alert("Destination required", "Please enter where you want to go");
      return;
    }

    // For now we keep a mock destination (you can later wire Google Places / Mapbox)
    // Replace this block with real geocoding when ready
    const mockDest = {
      latitude: (pickup?.latitude || 23.8103) + 0.018,
      longitude: (pickup?.longitude || 90.4125) + 0.012,
    };

    dispatch(setDestination({ coords: mockDest, address: destInput }));

    if (pickup) {
      try {
        const result = await getFareEstimate({
          origin: pickup,
          destination: mockDest,
        }).unwrap();
        dispatch(setFareEstimate(result));
      } catch (err) {
        // still allow booking with fallback price
        console.log("Fare estimate error:", err);
      }

      setRouteCoords([pickup, mockDest]);
    }

    setStage("confirm");
  };

  const handleBookRide = async () => {
    if (!pickup || !destination) {
      Alert.alert("Error", "Please set pickup and destination");
      return;
    }

    try {
      const selected = RIDE_TYPES.find((r) => r.id === selectedRide);
      const base = fareEstimate?.fare || fareEstimate?.price || 150;
      const finalFare = Math.round(base * (selected?.multiplier || 1));

      const payload = {
        pickup: {
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          address: pickupInput,
        },
        destination: {
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destInput,
        },
        rideType: selectedRide,
        estimatedFare: finalFare,
      };

      const ride = await requestRide(payload).unwrap();

      dispatch(setCurrentRide(ride));
      dispatch(updateRideStatus("searching"));

      if (connected) {
        emit("ride:request", {
          rideId: ride.id || ride._id,
          ...payload,
        });
      }

      navigation.replace("ActiveRide");
    } catch (err) {
      Alert.alert(
        "Request failed",
        err?.data?.message || "Could not request ride. Try again.",
      );
    }
  };

  const selected = RIDE_TYPES.find((r) => r.id === selectedRide);
  const basePrice = fareEstimate?.fare || fareEstimate?.price || 150;

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={{
          latitude: currentLocation?.latitude || 23.8103,
          longitude: currentLocation?.longitude || 90.4125,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pickup && (
          <Marker coordinate={pickup} pinColor="#38BDF8" title="Pickup" />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            pinColor="#34D399"
            title="Destination"
          />
        )}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#38BDF8"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        activeOpacity={0.85}
        className="absolute left-4 size-11 rounded-2xl bg-card/90 border border-border items-center justify-center"
        style={{ top: insets.top + 10 }}
      >
        <Icon name="arrow-left" size={22} color="#BAE6FD" />
      </TouchableOpacity>

      {/* Bottom panel */}
      <Animated.View
        style={{
          opacity: sheetAnim,
          paddingBottom: insets.bottom + 16,
        }}
        className="absolute left-0 right-0 bottom-0 bg-card border-t border-border rounded-t-[28px] px-5 pt-4"
      >
        {/* Handle */}
        <View className="w-10 h-1 rounded-full bg-border self-center mb-4" />

        {stage === "search" ? (
          <View className="gap-4">
            {/* Location inputs with dots */}
            <View className="flex-row gap-3 items-center">
              <View className="items-center py-2 gap-1">
                <View className="size-3 rounded-full bg-primary" />
                <View className="w-0.5 flex-1 min-h-5 bg-border" />
                <View className="size-3 rounded-full bg-success" />
              </View>

              <View className="flex-1 gap-2">
                <TextInput
                  className="h-12 bg-input border border-border rounded-xl px-3.5 text-base font-sans text-foreground"
                  value={pickupInput}
                  onChangeText={setPickupInput}
                  placeholder="Pickup location"
                  placeholderTextColor="#7DD3FC"
                  selectionColor="#38BDF8"
                />
                <TextInput
                  className="h-12 bg-input border border-border rounded-xl px-3.5 text-base font-sans text-foreground"
                  value={destInput}
                  onChangeText={setDestInput}
                  placeholder="Where are you going?"
                  placeholderTextColor="#7DD3FC"
                  selectionColor="#38BDF8"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                  autoFocus
                />
              </View>
            </View>

            <Button
              variant="primary"
              onPress={handleSearch}
              loading={estimating}
              disabled={estimating}
            >
              Search
            </Button>
          </View>
        ) : (
          <View className="gap-4">
            {/* Ride types */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-5 px-5"
              contentContainerStyle={{ gap: 10 }}
            >
              {RIDE_TYPES.map((ride) => {
                const active = selectedRide === ride.id;
                const price = Math.round(basePrice * ride.multiplier);
                return (
                  <TouchableOpacity
                    key={ride.id}
                    onPress={() => setSelectedRide(ride.id)}
                    activeOpacity={0.85}
                    className={`
                      w-25.5 rounded-2xl p-3.5 items-center border-2
                      ${
                        active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background-muted"
                      }
                    `}
                  >
                    <Icon
                      name={ride.icon}
                      size={26}
                      color={active ? "#38BDF8" : "#7DD3FC"}
                    />
                    <Text className="mt-2 text-sm font-sans-semibold text-foreground">
                      {ride.name}
                    </Text>
                    <Text
                      className={`
                        mt-1 text-sm font-sans-bold
                        ${active ? "text-primary" : "text-foreground-muted"}
                      `}
                    >
                      ৳{price}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Book button */}
            <Button
              variant="primary"
              onPress={handleBookRide}
              loading={requesting}
              disabled={requesting}
            >
              <View className="flex-row items-center justify-between w-full px-1">
                <Text className="text-base font-sans-bold text-primary-foreground">
                  Book {selected?.name}
                </Text>
                <Text className="text-base font-sans-bold text-primary-foreground">
                  ৳{Math.round(basePrice * (selected?.multiplier || 1))}
                </Text>
              </View>
            </Button>

            {/* Edit destination */}
            <TouchableOpacity
              onPress={() => setStage("search")}
              className="items-center py-1"
            >
              <Text className="text-sm font-sans-medium text-foreground-muted">
                Edit destination
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
