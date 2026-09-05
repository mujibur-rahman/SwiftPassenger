// @/screens/main/ride/RideCompletedScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import { useSubmitRatingMutation } from "@/features/ride/rideApi";
import { resetRide } from "@/features/ride/rideSlice";
import { clearLocations } from "@/features/location/locationSlice";

const TIP_OPTIONS = [0, 1, 2, 5];

export default function RideCompletedScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const { currentRide, driver } = useSelector((s) => s.ride);
  const { pickupAddress, destinationAddress } = useSelector((s) => s.location);

  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [submitRating, { isLoading }] = useSubmitRatingMutation();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const fare =
    currentRide?.estimatedFare ??
    currentRide?.fare ??
    14.5;

  const pickup =
    currentRide?.pickup?.address || pickupAddress || "Pickup";
  const destination =
    currentRide?.destination?.address ||
    destinationAddress ||
    "Destination";

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rating required", "Please select a star rating");
      return;
    }

    try {
      const rideId = currentRide?.id || currentRide?._id;
      if (rideId) {
        await submitRating({
          rideId,
          rating,
          review: tip > 0 ? `tip:${tip}` : "",
          // if your API supports tip separately:
          // tip,
        }).unwrap();
      }
      setSubmitted(true);
    } catch (err) {
      Alert.alert(
        "Error",
        err?.data?.message || "Could not submit rating. Try again.",
      );
    }
  };

  const handleDone = () => {
    dispatch(resetRide());
    dispatch(clearLocations());
    navigation.reset({
      index: 0,
      routes: [{ name: "Tabs" }],
    });
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#060e1a" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 24,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Check animation */}
        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="mb-6"
        >
          <View className="size-24 rounded-full bg-success items-center justify-center">
            <Icon name="check" size={48} color="#060E1A" />
          </View>
        </Animated.View>

        <Animated.View
          style={{ opacity: fadeAnim }}
          className="w-full items-center gap-4"
        >
          <Text className="text-3xl font-inter-extrabold text-foreground">
            You've arrived!
          </Text>
          <Text className="text-base font-inter text-foreground-muted text-center mb-2">
            Thanks for riding with SwiftRide
          </Text>

          {/* Fare card */}
          <View className="w-full rounded-2xl border border-border bg-card p-5">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-inter text-foreground-muted">
                Total Fare
              </Text>
              <Text className="text-3xl font-inter-extrabold text-primary">
                ৳{Number(fare).toFixed(0)}
              </Text>
            </View>

            <View className="flex-row gap-3 items-start">
              <View className="items-center pt-1">
                <View className="size-2.5 rounded-full bg-primary" />
                <View className="w-0.5 h-5 bg-border my-0.5" />
                <View className="size-2.5 rounded-full bg-success" />
              </View>
              <View className="flex-1 gap-3">
                <View>
                  <Text className="text-xs text-foreground-muted">Pickup</Text>
                  <Text className="text-sm font-inter-medium text-foreground">
                    {pickup}
                  </Text>
                </View>
                <View>
                  <Text className="text-xs text-foreground-muted">Drop-off</Text>
                  <Text className="text-sm font-inter-medium text-foreground">
                    {destination}
                  </Text>
                </View>
              </View>
            </View>

            {driver?.name ? (
              <View className="mt-4 pt-4 border-t border-border flex-row items-center gap-3">
                <View className="size-10 rounded-full bg-primary/20 items-center justify-center">
                  <Text className="text-base font-inter-bold text-primary">
                    {driver.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-inter-semibold text-foreground">
                    {driver.name}
                  </Text>
                  {!!driver.vehicle?.model && (
                    <Text className="text-xs text-foreground-muted">
                      {driver.vehicle.model}
                      {driver.vehicle.plate
                        ? ` · ${driver.vehicle.plate}`
                        : ""}
                    </Text>
                  )}
                </View>
              </View>
            ) : null}
          </View>

          {/* Rating + tip */}
          {!submitted ? (
            <View className="w-full items-center gap-4 mt-2">
              <Text className="text-xl font-inter-bold text-foreground">
                How was your ride?
              </Text>

              <View className="flex-row gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={star <= rating ? "star" : "star-outline"}
                      size={40}
                      color={star <= rating ? "#FBBF24" : "#1e3a5f"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row gap-2.5 w-full">
                {TIP_OPTIONS.map((t) => {
                  const active = tip === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setTip(t)}
                      activeOpacity={0.85}
                      className={`
                        flex-1 h-11 rounded-xl border items-center justify-center
                        ${active
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background-muted"
                        }
                      `}
                    >
                      <Text
                        className={`
                          text-sm font-inter-medium
                          ${active ? "text-primary" : "text-foreground-muted"}
                        `}
                      >
                        {t === 0 ? "No tip" : `৳${t}`}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Button
                variant="primary"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={rating === 0 || isLoading}
                className="w-full"
              >
                Submit Rating
              </Button>
            </View>
          ) : (
            <View className="items-center py-6">
              <Text className="text-xl font-inter-bold text-foreground">
                Thanks for rating!
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleDone}
            activeOpacity={0.85}
            className="w-full h-14 rounded-2xl border border-border items-center justify-center mt-2"
          >
            <Text className="text-base font-inter-medium text-foreground-muted">
              Back to Home
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}
