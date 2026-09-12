// @/screens/main/marketplace/MarketplaceRateScreen.js
import React, { useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import RateReviewForm from "@/components/shared/RateReviewForm";
import { DUMMY } from "@/components/marketplace/dummyAssets";
import {
  selectActivePickupId,
  resetMarketplacePickup,
} from "@/features/marketplace/marketplacePickupSlice";
import { useRateMarketplacePickupMutation } from "@/features/marketplace/marketplacePickupApi";

const MARKETPLACE_TAGS = [
  "Arrived on time",
  "Careful with item",
  "Good communication",
  "Professional",
  "Fair price",
];

export default function MarketplaceRateScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const pickupId = useSelector(selectActivePickupId);
  const [ratePickup, { isLoading }] = useRateMarketplacePickupMutation();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    try {
      await ratePickup({ id: pickupId, rating, text, tags }).unwrap();
      dispatch(resetMarketplacePickup());
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Couldn't submit rating", "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Rate Pickup" onBack={() => navigation.goBack()} />
      </View>

      <RateReviewForm
        title="How was your experience?"
        subtitle="Rate your driver and the pickup service."
        subjectName="Your driver"
        subjectPhoto={DUMMY.driverAvatar}
        rating={rating}
        onRatingChange={setRating}
        text={text}
        onTextChange={setText}
        tags={tags}
        onTagsChange={setTags}
        tagOptions={MARKETPLACE_TAGS}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Submit"
      />
    </View>
  );
}
