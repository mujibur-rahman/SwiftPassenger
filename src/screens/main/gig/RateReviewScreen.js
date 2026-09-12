// @/screens/main/gig/RateReviewScreen.js
import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import RatingReview from "@/components/gig/RatingReview";
import { ProviderAvatar } from "@/components/gig/QuoteCard";
import { submitReview, resetGigJob, selectGig, selectSelectedQuote } from "@/features/gig/gigSlice";
import { useSubmitGigReviewMutation } from "@/features/gig/gigApi";

export default function RateReviewScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const gig = useSelector(selectGig);
  const selectedQuote = useSelector(selectSelectedQuote);
  const [submitGigReview, { isLoading: isSubmitting }] = useSubmitGigReviewMutation();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const handleSubmit = async () => {
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
    } catch (err) {
      Alert.alert("Couldn't submit review", "Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-5 pt-2">
        <ScreenHeader title="Rate & Review" onBack={() => navigation.goBack()} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <View className="mb-5 items-center">
          <View className="mb-2">
            <ProviderAvatar
              photo={selectedQuote?.providerPhoto}
              name={gig.booking?.provider || selectedQuote?.providerName}
              id={selectedQuote?.id}
              size={64}
            />
          </View>
          <Text className="text-base font-inter-bold text-foreground">
            {gig.booking?.provider || selectedQuote?.providerName}
          </Text>
        </View>

        <RatingReview
          rating={rating}
          onRatingChange={setRating}
          text={text}
          onTextChange={setText}
          tags={tags}
          onTagsChange={setTags}
        />
      </ScrollView>

      <View className="px-5 pb-5">
        <Button onPress={handleSubmit} disabled={rating === 0} loading={isSubmitting}>
          Submit Review
        </Button>
      </View>
    </View>
  );
}
