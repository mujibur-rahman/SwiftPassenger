// src/screens/main/RideCompletedScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { resetRide } from "../../features/ride/rideSlice";
import { clearLocations } from "../../features/location/locationSlice";
import { useSubmitRatingMutation } from "../../features/ride/rideApi";

export default function RideCompletedScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentRide } = useSelector((s) => s.ride);
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
  }, []);

  const handleSubmitRating = async () => {
    if (!currentRide?.id || rating === 0) return;

    try {
      await submitRating({
        rideId: currentRide.id,
        rating,
        tip,
      }).unwrap();
      setSubmitted(true);
    } catch (e) {
      // silent fail বা toast দেখাতে পারো
      setSubmitted(true);
    }
  };

  const handleDone = () => {
    dispatch(resetRide());
    dispatch(clearLocations());
    navigation.navigate("Tabs");
  };

  const fare = currentRide?.fare ?? 14.5;

  return (
    <View className="flex-1 bg-background">
      <LinearGradient
        colors={["#060E1A", "#0D1B0F", "#060E1A"]}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 pt-20"
          showsVerticalScrollIndicator={false}
        >
          {/* Success Check */}
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className="items-center mb-6"
          >
            <LinearGradient
              colors={["#00D95F", "#00B84F"]}
              className="w-24 h-24 rounded-full items-center justify-center"
            >
              <Icon name="check" size={48} color="#000" />
            </LinearGradient>
          </Animated.View>

          <Animated.View
            style={{ opacity: fadeAnim }}
            className="items-center gap-4"
          >
            <Text className="text-3xl font-sans-extrabold text-foreground text-center">
              You've arrived!
            </Text>
            <Text className="text-base font-sans text-foreground-muted text-center">
              Thanks for riding with SwiftRide
            </Text>

            {/* Fare Card */}
            <View className="w-full bg-card rounded-2xl p-5 border border-border mt-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-sans text-foreground-muted">
                  Total Fare
                </Text>
                <Text className="text-3xl font-sans-extrabold text-success">
                  ${Number(fare).toFixed(2)}
                </Text>
              </View>

              {(pickupAddress || destinationAddress) && (
                <View className="mt-4 pt-4 border-t border-border gap-2">
                  {pickupAddress ? (
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-success" />
                      <Text
                        className="flex-1 text-sm font-sans text-foreground-secondary"
                        numberOfLines={1}
                      >
                        {pickupAddress}
                      </Text>
                    </View>
                  ) : null}
                  {destinationAddress ? (
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-error" />
                      <Text
                        className="flex-1 text-sm font-sans text-foreground-secondary"
                        numberOfLines={1}
                      >
                        {destinationAddress}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>

            {/* Rating Section */}
            {!submitted ? (
              <View className="w-full items-center gap-4 mt-2">
                <Text className="text-xl font-sans-bold text-foreground">
                  How was your ride?
                </Text>

                {/* Stars */}
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
                        color={star <= rating ? "#FFD700" : "#334155"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tips */}
                <View className="flex-row gap-2.5 w-full">
                  {[0, 1, 2, 5].map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setTip(t)}
                      activeOpacity={0.8}
                      className={`flex-1 h-11 rounded-xl border items-center justify-center ${
                        tip === t
                          ? "border-success bg-success/10"
                          : "border-border bg-transparent"
                      }`}
                    >
                      <Text
                        className={`text-sm font-sans-medium ${
                          tip === t ? "text-success" : "text-foreground-muted"
                        }`}
                      >
                        {t === 0 ? "No tip" : `$${t}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                  onPress={handleSubmitRating}
                  disabled={rating === 0 || isLoading}
                  activeOpacity={0.85}
                  className={`w-full rounded-2xl overflow-hidden ${
                    rating === 0 ? "opacity-40" : "opacity-100"
                  }`}
                >
                  <LinearGradient
                    colors={["#00D95F", "#00B84F"]}
                    className="h-14 items-center justify-center"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                      <Text className="text-base font-sans-bold text-black">
                        Submit Rating
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-5">
                <Text className="text-xl font-sans-bold text-foreground">
                  🙏 Thanks for rating!
                </Text>
              </View>
            )}

            {/* Back to Home */}
            <TouchableOpacity
              onPress={handleDone}
              activeOpacity={0.8}
              className="w-full h-14 rounded-2xl border border-border items-center justify-center mt-2"
            >
              <Text className="text-base font-sans-medium text-foreground-muted">
                Back to Home
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
