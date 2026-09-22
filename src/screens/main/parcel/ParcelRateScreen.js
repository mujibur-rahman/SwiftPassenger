// @/screens/main/parcel/ParcelRateScreen.js
import React, { useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import RateReviewForm from "@/components/shared/RateReviewForm";
import { selectActiveParcelId, setTrackingStatus } from "@/features/parcel/parcelDeliverySlice";
import { useRateParcelDeliveryMutation } from "@/features/parcel/parcelDeliveryApi";

const PARCEL_TAGS = [
  "On time",
  "Good communication",
  "Careful with parcel",
  "Professional",
  "Friendly",
  "Safe delivery",
];

export default function ParcelRateScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isDark } = useTheme();
  const parcelId = useSelector(selectActiveParcelId);
  const [rateDelivery, { isLoading }] = useRateParcelDeliveryMutation();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    try {
      await rateDelivery({ id: parcelId, rating, text, tags }).unwrap();
      dispatch(setTrackingStatus("completed"));
      navigation.replace("ParcelComplete");
    } catch (err) {
      Alert.alert("Couldn't submit rating", err?.data?.message || "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Rate Delivery" onBack={() => navigation.goBack()} />
      </View>

      <RateReviewForm
        title="How was your delivery?"
        subtitle="Rate your driver and the delivery service."
        subjectName="Your driver"
        subjectPhoto={null}
        rating={rating}
        onRatingChange={setRating}
        text={text}
        onTextChange={setText}
        tags={tags}
        onTagsChange={setTags}
        tagOptions={PARCEL_TAGS}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        submitLabel="Submit"
      />
    </View>
  );
}
