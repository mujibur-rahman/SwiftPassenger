// @/screens/main/gig/RateReviewScreen.js
import React, { useState } from "react";
import { View, StatusBar, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import RateReviewForm from "@/components/shared/RateReviewForm";
import {
  submitReview,
  resetGigJob,
  selectGig,
  selectSelectedQuote,
} from "@/features/gig/gigSlice";
import { useSubmitGigReviewMutation } from "@/features/gig/gigApi";

let resolveProviderPhoto = null;
try {
  // Optional — from Gig_ProviderAvatar_Fix
  resolveProviderPhoto = require("@/utils/providerPhotos").resolveProviderPhoto;
} catch {
  resolveProviderPhoto = null;
}

export default function RateReviewScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);
  const [submitGigReview, { isLoading: isSubmitting }] = useSubmitGigReviewMutation();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const providerName = gig.booking?.provider || selectedQuote?.providerName || "Provider";
  const photo = resolveProviderPhoto
    ? resolveProviderPhoto({
        id: selectedQuote?.id,
        providerName,
        providerPhoto: selectedQuote?.providerPhoto,
      }) || selectedQuote?.providerPhoto
    : selectedQuote?.providerPhoto;

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }
    try {
      const review = await submitGigReview({
        quoteId: selectedQuote?.id,
        bookingId: gig.booking?.id,
        rating,
        text,
        tags,
      }).unwrap();
      dispatch(submitReview(review));
      dispatch(resetGigJob());
      navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
    } catch {
      Alert.alert("Couldn't submit review", "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="px-5 pt-2">
        <ScreenHeader title="Rate & Review" onBack={() => navigation.goBack()} />
      </View>

      <RateReviewForm
        subjectName={providerName}
        subjectPhoto={photo}
        rating={rating}
        onRatingChange={setRating}
        text={text}
        onTextChange={setText}
        tags={tags}
        onTagsChange={setTags}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Submit review"
      />
    </View>
  );
}
