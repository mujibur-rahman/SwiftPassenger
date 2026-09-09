// @/screens/main/gig/RateReviewScreen.js
import React, { useState } from "react";
import { View, ScrollView, StatusBar } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@/theme";
import ScreenHeader from "@/components/ui/ScreenHeader";
import Button from "@/components/ui/Button";
import RatingReview from "@/components/gig/RatingReview";
import { submitReview, resetGigJob, selectSelectedQuote } from "@/features/gig/gigSlice";
// import { useSubmitGigReviewMutation } from "@/features/gig/gigApi"; // wire in once backend is ready

export default function RateReviewScreen({ navigation }) {
  const { isDark } = useTheme();
  const dispatch = useDispatch();
  const selectedQuote = useSelector(selectSelectedQuote);
  // const [submitGigReview] = useSubmitGigReviewMutation();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);

  const handleSubmit = () => {
    dispatch(
      submitReview({
        quoteId: selectedQuote?.id,
        rating,
        text,
        tags,
      }),
    );
    // submitGigReview({...}) — enable once /gig/reviews is live
    dispatch(resetGigJob());
    navigation.reset({ index: 0, routes: [{ name: "Tabs" }] });
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
        <Button onPress={handleSubmit} disabled={rating === 0}>
          Submit Review
        </Button>
      </View>
    </View>
  );
}
